#!/usr/bin/env python3
"""
Sony India Camera Product Scraper v4.0
=======================================
Extracts complete camera product data from Sony India's official website.

Key Design:
- Uses Selenium EXCLUSIVELY (Sony blocks requests library with 403)
- Starts from homepage, navigates mega-menu dynamically
- Collects gallery URLs, extracts product listings
- For each product, fetches detail page + /specifications sub-page
- Outputs clean JSON matching the target schema
"""

import json
import logging
import os
import re
import sys
import time
from collections import OrderedDict
from urllib.parse import urljoin, urlparse

from selenium import webdriver
from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
    WebDriverException,
)
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# ─── Configuration ───────────────────────────────────────────────────────────

BASE_URL = "https://www.sony.co.in"
HOMEPAGE = f"{BASE_URL}/"
PAGE_LOAD_WAIT = 15
SCROLL_PAUSE = 1.5

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "sony_cameras_data.json")

# Categories to skip in mega-menu
SKIP_L2 = {"camera accessories", "lenses"}

# Allowed URL path segments for camera products
CAMERA_PATH_SEGMENTS = [
    "interchangeable-lens-cameras",
    "compact-cameras",
    "cyber-shot-compact-cameras",
    "vlog-cameras",
    "cinema-line",
    "handycam-camcorders",
    "handycam",
    "camcorders",
]

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)

# ─── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("SonyScraper")


# ═══════════════════════════════════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════════════════════════════════


def clean(text: str) -> str:
    """Strip and normalize whitespace."""
    if not text:
        return ""
    return re.sub(r"\s+", " ", text.strip())


def make_abs(url: str) -> str:
    if not url:
        return ""
    return url if url.startswith("http") else urljoin(BASE_URL, url)


def canon_url(url: str) -> str:
    """Canonical product URL: strip query params."""
    p = urlparse(url)
    return f"{p.scheme}://{p.netloc}{p.path}".rstrip("/")


def is_camera_product_url(url: str) -> bool:
    """Check if a URL points to a camera product page."""
    path = urlparse(url).path.lower()
    # Must be under /electronics/ and contain a camera segment
    if "/electronics/" not in path:
        return False
    if not any(seg in path for seg in CAMERA_PATH_SEGMENTS):
        return False
    # Must have at least 3 path parts: /electronics/{category}/{model}
    parts = [p for p in path.split("/") if p]
    if len(parts) < 3:
        return False
    # Skip non-product pages
    skip = ["/specifications", "/buy", "/gallery", "/accessories"]
    if any(s in path for s in skip):
        return False
    return True


def extract_price(text: str):
    """Extract numeric price from 'Rs.2,70,990' style text."""
    if not text:
        return None
    m = re.search(r"Rs\.?\s*([\d,]+)", text)
    if m:
        try:
            return int(m.group(1).replace(",", ""))
        except ValueError:
            return None
    return None


def extract_model(name: str, code: str = "") -> str:
    """Extract clean model name like 'A7 V', 'FX3', 'ZV-E10 II'."""
    patterns = [
        r"(α\d+[A-Z]?\s*(?:III|II|IV|V|VI)?)",
        r"(a\d+[A-Z]?\s*(?:III|II|IV|V|VI)?)",
        r"(A\d+[A-Z]?\s*(?:III|II|IV|V|VI)?)",
        r"(ZV-[A-Z0-9]+(?:\s*(?:II|III))?)",
        r"(FX\d+[A-Z]?)",
        r"(RX\d+[A-Z]?\s*(?:III|II|IV|V|VI|VII)?)",
        r"(DSC-[A-Z0-9]+)",
    ]
    for pat in patterns:
        m = re.search(pat, name, re.IGNORECASE)
        if m:
            return m.group(1).strip()
    if code:
        m = re.match(r"(ILCE-\w+|ILME-\w+|ZV-\w+|FX\w+|DSC-\w+|HDR-\w+|FDR-\w+)", code.upper())
        if m:
            return m.group(1)
    return code or ""


# ═══════════════════════════════════════════════════════════════════════════════
# SELENIUM DRIVER
# ═══════════════════════════════════════════════════════════════════════════════


def create_driver() -> webdriver.Chrome:
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--window-size=1920,1080")
    opts.add_argument(f"user-agent={USER_AGENT}")
    opts.add_argument("--disable-blink-features=AutomationControlled")
    opts.add_experimental_option("excludeSwitches", ["enable-automation"])
    opts.add_experimental_option("useAutomationExtension", False)

    try:
        svc = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=svc, options=opts)
    except Exception:
        driver = webdriver.Chrome(options=opts)

    driver.execute_cdp_cmd(
        "Page.addScriptToEvaluateOnNewDocument",
        {"source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"},
    )
    driver.implicitly_wait(5)
    return driver


def selenium_get(driver, url, wait_secs=3):
    """Load a URL via Selenium with retry."""
    for attempt in range(3):
        try:
            driver.get(url)
            WebDriverWait(driver, PAGE_LOAD_WAIT).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            time.sleep(wait_secs)
            return driver.page_source
        except Exception as e:
            logger.warning(f"  Selenium load failed ({attempt+1}/3): {url} — {e}")
            time.sleep(2)
    return ""


def scroll_page(driver, max_scrolls=15):
    """Scroll to bottom to trigger lazy loading."""
    last = driver.execute_script("return document.body.scrollHeight")
    for _ in range(max_scrolls):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(SCROLL_PAUSE)
        now = driver.execute_script("return document.body.scrollHeight")
        if now == last:
            break
        last = now


# ═══════════════════════════════════════════════════════════════════════════════
# STEP 1: EXTRACT CATEGORIES FROM NAVBAR
# ═══════════════════════════════════════════════════════════════════════════════


def extract_categories(driver) -> list[dict]:
    """Open homepage, interact with Cameras mega-menu, extract gallery URLs."""
    logger.info("═══ STEP 1: Extracting categories from homepage navbar ═══")

    driver.get(HOMEPAGE)
    time.sleep(4)

    # Click "Cameras" in navbar
    cam_el = None
    for sel in [
        "span[aria-label='Cameras']",
    ]:
        try:
            cam_el = driver.find_element(By.CSS_SELECTOR, sel)
            if cam_el.is_displayed():
                break
        except Exception:
            continue

    if not cam_el:
        for xp in ["//span[text()='Cameras']", "//span[@aria-label='Cameras']"]:
            try:
                cam_el = driver.find_element(By.XPATH, xp)
                if cam_el.is_displayed():
                    break
            except Exception:
                continue

    if not cam_el:
        logger.warning("Could not find Cameras menu, using fallback categories")
        return _fallback()

    logger.info("  Found 'Cameras' menu item, clicking...")
    try:
        ActionChains(driver).move_to_element(cam_el).click().perform()
    except Exception:
        cam_el.click()
    time.sleep(2)

    # Now extract all links from the mega-menu/page
    # The mega-menu is open. Parse the page source for camera links.
    soup = BeautifulSoup(driver.page_source, "lxml")
    
    # Collect all camera gallery-relevant links from the mega-menu DOM
    categories = []
    seen = set()
    
    # Known gallery URL patterns from the mega-menu
    gallery_patterns = [
        (r"/interchangeable-lens-cameras(?:/gallery)?$", "Interchangeable-lens Cameras"),
        (r"/compact-cameras(?:/gallery)?$", "Compact Cameras"),
        (r"/vlog-cameras(?:/gallery)?$", "Vlog Cameras"),
        (r"/electronics/cinema-line$", "Cinema Line Cameras"),
        (r"/handycam(?:/gallery)?$", "Handycam Camcorders"),
    ]
    
    for a in soup.find_all("a", href=True):
        href = a["href"]
        abs_href = make_abs(href)
        for pattern, default_name in gallery_patterns:
            if re.search(pattern, abs_href) and abs_href not in seen:
                seen.add(abs_href)
                name = clean(a.get_text()) or default_name
                categories.append({"name": name, "url": abs_href})
    
    # Ensure we have the main gallery pages
    must_have = {
        "Interchangeable-lens Cameras": f"{BASE_URL}/interchangeable-lens-cameras/gallery",
        "Compact Cameras": f"{BASE_URL}/compact-cameras/gallery",
        "Vlog Cameras": f"{BASE_URL}/vlog-cameras/gallery",
        "Cinema Line Cameras": f"{BASE_URL}/electronics/cinema-line",
        "Handycam Camcorders": f"{BASE_URL}/handycam/gallery",
    }
    existing_urls = {c["url"] for c in categories}
    for name, url in must_have.items():
        if url not in existing_urls:
            categories.append({"name": name, "url": url})

    if not categories:
        return _fallback()

    logger.info(f"  Extracted {len(categories)} camera category URLs:")
    for c in categories:
        logger.info(f"    📂 {c['name']} → {c['url']}")

    return categories


def _fallback():
    logger.warning("  Using fallback categories")
    return [
        {"name": "Interchangeable-lens Cameras", "url": f"{BASE_URL}/interchangeable-lens-cameras/gallery"},
        {"name": "Compact Cameras", "url": f"{BASE_URL}/compact-cameras/gallery"},
        {"name": "Vlog Cameras", "url": f"{BASE_URL}/vlog-cameras/gallery"},
        {"name": "Cinema Line Cameras", "url": f"{BASE_URL}/electronics/cinema-line"},
        {"name": "Handycam Camcorders", "url": f"{BASE_URL}/handycam/gallery"},
    ]


# ═══════════════════════════════════════════════════════════════════════════════
# STEP 2: EXTRACT ALL PRODUCT URLS FROM GALLERIES
# ═══════════════════════════════════════════════════════════════════════════════


def extract_product_urls(categories, driver) -> list[dict]:
    """Load each gallery page via Selenium and extract product links."""
    logger.info("\n═══ STEP 2: Extracting product URLs from gallery pages ═══")

    all_products = []
    seen = set()

    for cat in categories:
        url = cat["url"]
        name = cat["name"]
        logger.info(f"\n  ── [{name}] → {url}")

        html = selenium_get(driver, url, wait_secs=3)
        if not html:
            continue

        # Scroll to load all products
        scroll_page(driver, max_scrolls=15)
        html = driver.page_source

        products = _parse_product_links(html, name)

        new_count = 0
        for p in products:
            cu = canon_url(p["url"])
            if cu not in seen:
                seen.add(cu)
                p["url"] = cu
                all_products.append(p)
                new_count += 1

        logger.info(f"  ✓ {name}: {len(products)} found, {new_count} new → {len(all_products)} total")

    return all_products


def _parse_product_links(html: str, category: str) -> list[dict]:
    """Parse gallery HTML for product links."""
    soup = BeautifulSoup(html, "lxml")
    products = []
    seen = set()

    for a in soup.find_all("a", href=True):
        href = a["href"]
        abs_url = make_abs(href)

        if not is_camera_product_url(abs_url):
            continue

        cu = canon_url(abs_url)
        if cu in seen:
            continue
        seen.add(cu)

        # Extract name from the product card context
        name = ""
        model_code = ""
        price = None

        # Card container: walk up DOM
        card = a
        for _ in range(8):
            parent = card.parent
            if parent is None or parent.name in ("body", "html"):
                break
            classes = " ".join(parent.get("class", []))
            if any(kw in classes.lower() for kw in ("product", "tile", "card", "item")):
                card = parent
                break
            if len(parent.find_all("a", href=True)) >= 2:
                card = parent
                break
            card = parent

        # Name
        name = clean(a.get("title", "")) or clean(a.get_text())
        if name.lower() in ("learn more", "buy", ""):
            h = card.find(["h2", "h3", "h4"])
            if h:
                name = clean(h.get_text())

        if name.lower() in ("learn more", "buy", ""):
            name = cu.split("/")[-1].replace("-", " ").title()

        # Model code
        card_text = card.get_text()
        mc = re.search(
            r"\b(ILCE-[\w]+|ILME-[\w]+|ZV-[\w]+|FX\d+[\w]*|DSC-[\w]+|HDR-[\w]+|FDR-[\w]+)\b",
            card_text,
        )
        if mc:
            model_code = mc.group(1)

        # Price
        pm = re.search(r"(?:MRP\s*)?Rs\.?\s*([\d,]+)", card_text)
        if pm:
            price = extract_price(f"Rs.{pm.group(1)}")

        products.append({
            "name": name,
            "model_code": model_code,
            "category": category,
            "price": price,
            "url": cu,
        })

    return products


# ═══════════════════════════════════════════════════════════════════════════════
# STEP 3: EXTRACT FULL PRODUCT DETAILS + SPECIFICATIONS
# ═══════════════════════════════════════════════════════════════════════════════


def extract_details(product: dict, driver) -> dict:
    """Fetch product detail page + /specifications via Selenium."""
    url = product["url"]

    result = {
        "name": product.get("name", ""),
        "model": "",
        "category": product.get("category", ""),
        "price": product.get("price"),
        "description": "",
        "features": [],
        "specifications": {},
        "images": [],
        "url": url,
    }

    # ── Product detail page ──
    html = selenium_get(driver, url, wait_secs=2)
    if html:
        _parse_pdp(html, result)

    # ── Specifications page ──
    specs_url = url.rstrip("/") + "/specifications"
    specs_html = selenium_get(driver, specs_url, wait_secs=2)
    if specs_html:
        _parse_specs(specs_html, result)

    # ── Finalize ──
    result["name"] = clean(result["name"])
    result["model"] = extract_model(result["name"], result.get("model", ""))
    result["description"] = clean(result["description"])
    result["features"] = list(dict.fromkeys(clean(f) for f in result["features"] if clean(f)))
    result["images"] = list(dict.fromkeys(i for i in result["images"] if i and i.startswith("http")))

    if result["price"] == 0:
        result["price"] = None

    return result


def _parse_pdp(html: str, result: dict):
    """Parse product detail page HTML."""
    soup = BeautifulSoup(html, "lxml")

    # Name
    h1 = soup.find("h1")
    if h1:
        n = clean(h1.get_text())
        if n and len(n) > 3:
            result["name"] = n

    # Model code
    text = soup.get_text()
    mc = re.search(r"\b(ILCE-[\w]+|ILME-[\w]+|ZV-[\w]+|FX\d+[\w]*|DSC-[\w]+|HDR-[\w]+|FDR-[\w]+)\b", text)
    if mc:
        result["model"] = mc.group(1)

    # Price
    if not result["price"]:
        pm = re.search(r"Rs\.?\s*([\d,]+)", text)
        if pm:
            result["price"] = extract_price(f"Rs.{pm.group(1)}")

    # Description from meta
    for sel in ["meta[name='description']", "meta[property='og:description']"]:
        el = soup.select_one(sel)
        if el:
            d = el.get("content", "")
            if d and "Look what I found" not in d and len(d) > 20:
                result["description"] = d
                break

    if not result["description"] or "Look what I found" in result.get("description", ""):
        for h3 in soup.find_all("h3"):
            t = clean(h3.get_text())
            if t and len(t) > 30:
                result["description"] = t
                break

    # Features (h3 headings as feature highlights)
    features = []
    for h3 in soup.find_all("h3"):
        t = clean(h3.get_text())
        if t and 15 < len(t) < 200:
            features.append(t)
    if features:
        result["features"] = features

    # Images
    images = set()
    og = soup.select_one("meta[property='og:image']")
    if og and og.get("content"):
        images.add(make_abs(og["content"]))

    bad_keywords = ["footer", "sns-", "grouplink", "icon", "logo", "social"]
    for img in soup.select("picture img, [class*='carousel'] img, [class*='product'] img"):
        for attr in ("src", "data-src"):
            s = img.get(attr, "")
            if s and ("sony" in s.lower() or s.startswith("/")):
                if not any(kw in s.lower() for kw in bad_keywords):
                    images.add(make_abs(s))
        srcset = img.get("srcset", "")
        for part in srcset.split(","):
            u = part.strip().split(" ")[0]
            if u and not any(kw in u.lower() for kw in bad_keywords):
                images.add(make_abs(u))

    result["images"] = list(images)


def _parse_specs(html: str, result: dict):
    """Parse /specifications page HTML."""
    soup = BeautifulSoup(html, "lxml")

    # Price from specs
    if not result["price"]:
        m = re.search(r"Rs\.?\s*([\d,]+)", soup.get_text())
        if m:
            result["price"] = extract_price(f"Rs.{m.group(1)}")

    # Parse structured specs
    specs = _extract_spec_pairs(soup)
    if specs:
        result["specifications"] = specs

    # Features from h3s if not already rich
    if not result["features"] or len(result["features"]) < 3:
        features = []
        for h3 in soup.find_all("h3"):
            t = clean(h3.get_text())
            if t and 15 < len(t) < 200:
                features.append(t)
        if features:
            result["features"] = features

    # Better description
    if not result["description"] or "Look what I found" in result.get("description", ""):
        for h3 in soup.find_all("h3"):
            t = clean(h3.get_text())
            if t and len(t) > 30:
                result["description"] = t
                break


def _extract_spec_pairs(soup) -> dict:
    """
    Extract structured specs from Sony's specifications page.
    Format: Section headers followed by KEY / - value pairs.
    """
    SECTIONS = {
        "General", "Camera Section", "Image Sensor",
        "Recording (still images)", "Recording (movie)",
        "Recording System (movie)", "Movie Functions",
        "Recording System", "Focus System", "Exposure Control",
        "Viewfinder", "LCD Screen", "Other Features",
        "Shutter", "Image stabilisation", "Flash",
        "Drive", "Playback", "Accessibility",
        "Interface", "USB Streaming", "Audio",
        "Lens Compensation", "Power", "Size and Weight",
        "Operating temparature", "Supplied Accessory",
    }

    text = soup.get_text()
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    specs = OrderedDict()
    section = "General"

    # Find start of specs
    start = 0
    for i, line in enumerate(lines):
        if line in ("Specifications", "SPECIFICATIONS AND FEATURES"):
            start = i + 1
            break

    i = start
    while i < len(lines):
        line = lines[i]

        # Skip price section
        if line == "Price":
            i += 1
            while i < len(lines) and lines[i] not in SECTIONS:
                if lines[i].startswith("- "):
                    i += 1
                    continue
                # Check if next line is a "- " value
                if i + 1 < len(lines) and lines[i + 1].startswith("- "):
                    i += 2
                    continue
                break
            continue

        # Section header
        if line in SECTIONS:
            section = line
            if section not in specs:
                specs[section] = OrderedDict()
            i += 1
            continue

        # Key-value pair: KEY followed by "- value"
        if i + 1 < len(lines) and lines[i + 1].startswith("- "):
            key = clean(line).rstrip(":")
            val = clean(lines[i + 1][2:])
            if key and val:
                if section not in specs:
                    specs[section] = OrderedDict()
                specs[section][key] = val
            i += 2
            continue

        i += 1

    # Remove empty sections
    return {k: dict(v) for k, v in specs.items() if v}


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════


def main():
    logger.info("╔════════════════════════════════════════════════╗")
    logger.info("║   Sony India Camera Scraper v4.0 (Selenium)   ║")
    logger.info("╚════════════════════════════════════════════════╝")

    driver = None
    try:
        logger.info("Initializing Chrome WebDriver...")
        driver = create_driver()
        logger.info("WebDriver ready ✓\n")

        # STEP 1
        categories = extract_categories(driver)

        # STEP 2
        products = extract_product_urls(categories, driver)
        logger.info(f"\n📦 Total unique products: {len(products)}")

        if not products:
            logger.error("No products found!")
            return

        # STEP 3
        logger.info("\n═══ STEP 3: Extracting full product details + specs ═══\n")

        final = []
        total = len(products)
        for i, p in enumerate(products, 1):
            logger.info(f"  [{i}/{total}] {p.get('name', p['url'])}")
            try:
                d = extract_details(p, driver)
                final.append(d)
            except Exception as e:
                logger.error(f"    ✗ Error: {e}")
                final.append({
                    "name": p.get("name", ""),
                    "model": extract_model(p.get("name", ""), p.get("model_code", "")),
                    "category": p.get("category", ""),
                    "price": p.get("price"),
                    "description": "",
                    "features": [],
                    "specifications": {},
                    "images": [],
                    "url": p["url"],
                })
            time.sleep(0.3)

        # Deduplicate
        seen = set()
        cleaned = []
        for p in final:
            if p["url"] not in seen:
                seen.add(p["url"])
                cleaned.append(p)

        # Save
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(cleaned, f, indent=2, ensure_ascii=False)

        logger.info(f"\n✅ Saved {len(cleaned)} products → {OUTPUT_FILE}")
        _summary(cleaned)

    except KeyboardInterrupt:
        logger.info("\n⚠ Interrupted")
    except Exception as e:
        logger.error(f"Fatal: {e}", exc_info=True)
    finally:
        if driver:
            try:
                driver.quit()
            except Exception:
                pass
            logger.info("WebDriver closed.")


def _summary(products):
    from collections import Counter
    logger.info("\n" + "═" * 55)
    logger.info("SCRAPING SUMMARY")
    logger.info("═" * 55)
    logger.info(f"Total products: {len(products)}")
    for cat, n in Counter(p["category"] for p in products).most_common():
        logger.info(f"  📂 {cat}: {n}")
    ws = sum(1 for p in products if p["specifications"])
    wp = sum(1 for p in products if p["price"])
    wi = sum(1 for p in products if p["images"])
    wf = sum(1 for p in products if p["features"])
    wd = sum(1 for p in products if p["description"])
    logger.info(f"\nCompleteness:")
    logger.info(f"  Specs:   {ws}/{len(products)}")
    logger.info(f"  Price:   {wp}/{len(products)}")
    logger.info(f"  Images:  {wi}/{len(products)}")
    logger.info(f"  Features:{wf}/{len(products)}")
    logger.info(f"  Desc:    {wd}/{len(products)}")
    logger.info("═" * 55)


if __name__ == "__main__":
    main()
