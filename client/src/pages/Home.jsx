import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';

/* ── Reusable hook: fires once when element enters viewport ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

const Home = () => {
  const navigate = useNavigate();

  const {
    data: featuredData,
    isLoading: featuredLoading,
    isError: featuredError,
  } = useQuery({
    queryKey: ['featured'],
    queryFn: () => api.get('/products/featured').then((r) => r.data.products || r.data),
  });

  const [ref1, inView1] = useInView(0.1);
  const [ref2, inView2] = useInView(0.2);
  const [ref3, inView3] = useInView(0.2);
  const [ref4, inView4] = useInView(0.2);

  const imgAnim = (active) => ({
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
    transform: active ? 'scale(1)' : 'scale(1.08)',
    transition: active ? 'transform 8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
  });

  return (
    <div>
      {/* ===== SECTION 1 — Landscape Hero (IMAGE 1) ===== */}
      <section ref={ref1} style={{ width: '100%', height: '95vh', overflow: 'hidden', position: 'relative' }}>
        <img
          src="/Image1.webp"
          alt="Sony Alpha landscape hero"
          style={imgAnim(inView1)}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.92) 100%)',
          }}
        />
        {/* Text block */}
        <div style={{ position: 'absolute', bottom: '52px', left: '52px', zIndex: 2, maxWidth: '700px' }}>
          {/* Decorative line */}
          <div style={{ width: 40, height: '0.5px', background: 'rgba(255,255,255,0.45)', marginBottom: 16 }} />
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
              marginBottom: '16px',
            }}
          >
            SONY ALPHA — 2024
          </p>
          {/* Headline */}
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '108px',
              color: '#fff',
              fontWeight: 300,
              fontStyle: 'italic',
              letterSpacing: '-2px',
              lineHeight: 1,
              display: 'block',
            }}
          >
            See through
          </span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '108px',
              color: '#fff',
              fontWeight: 300,
              fontStyle: 'italic',
              letterSpacing: '-2px',
              lineHeight: 1,
              display: 'block',
            }}
          >
            every moment.
          </span>
          {/* Caption */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              color: 'rgba(255,255,255,0.75)',
              fontStyle: 'italic',
              marginTop: '12px',
            }}
          >
            —  Shot by the Sony Alpha A7 IV
          </p>
          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
            <button
              onClick={() => navigate('/products')}
              style={{
                background: '#fff',
                color: '#000',
                border: 'none',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                padding: '14px 36px',
                cursor: 'pointer',
              }}
            >
              EXPLORE CAMERAS
            </button>
            <button
              onClick={() => navigate('/compare')}
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.45)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                padding: '13px 30px',
                cursor: 'pointer',
              }}
            >
              COMPARE MODELS
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2 — Portrait (IMAGE 2) ===== */}
      <section ref={ref2} style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <img
          src="/Image2.jpeg"
          alt="Sony Alpha portrait"
          style={{ ...imgAnim(inView2), objectPosition: 'top center' }}
        />
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        {/* Text block */}
        <div style={{ position: 'absolute', bottom: '40px', left: '52px', zIndex: 2 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '6px',
            }}
          >
            SHOT BY THE
          </p>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '44px',
              color: '#fff',
              fontWeight: 300,
              fontStyle: 'italic',
            }}
          >
            Sony Alpha A7R V
          </span>
        </div>
      </section>

      {/* ===== SECTION 3 — Featured Cameras ===== */}
      <section style={{ width: '100%', background: '#fff', padding: '64px 40px' }}>
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '36px',
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '40px',
              color: '#000',
              fontWeight: 500,
            }}
          >
            Featured Cameras
          </span>
          <span
            onClick={() => navigate('/products')}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#7F7F7F',
              cursor: 'pointer',
            }}
          >
            VIEW ALL →
          </span>
        </div>

        {/* Loading skeleton */}
        {featuredLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#E5E5E5' }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse" style={{ height: '380px', background: '#F5F5F5' }} />
            ))}
          </div>
        )}

        {/* Error state */}
        {featuredError && (
          <p style={{ color: '#7F7F7F', fontSize: 12, textAlign: 'center' }}>Could not load products.</p>
        )}

        {/* Products grid */}
        {!featuredLoading && !featuredError && featuredData && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#FFFFFF' }}>
              {featuredData?.slice(0, 6).map((p) => (
                <FeaturedCard key={p._id} product={p} navigate={navigate} />
              ))}
            </div>
            {/* View All button */}
            <div
              onClick={() => navigate('/products')}
              style={{
                display: 'block',
                width: '100%',
                marginTop: '1px',
                background: '#000',
                color: '#fff',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              VIEW ALL CAMERAS →
            </div>
          </>
        )}
      </section>

      {/* ===== SECTION 4 — Wildlife (IMAGE 3) ===== */}
      <section ref={ref3} style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <img
          src="/Image3.jpeg"
          alt="Wildlife photography"
          style={imgAnim(inView3)}
        />
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }} />
        {/* Text block */}
        <div style={{ position: 'absolute', bottom: '44px', left: '52px', zIndex: 2 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              color: 'rgba(255,255,255,0.65)',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '8px',
            }}
          >
            CAPTURE THE WILD
          </p>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '48px',
              color: '#fff',
              fontWeight: 300,
              fontStyle: 'italic',
              display: 'block',
            }}
          >
            Nature, untamed.
          </span>
          <button
            onClick={() => navigate('/category/interchangeable-lens-cameras')}
            style={{
              background: 'transparent',
              border: '0.5px solid rgba(255,255,255,0.6)',
              color: '#fff',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '10px 24px',
              marginTop: '20px',
              display: 'inline-block',
              cursor: 'pointer',
            }}
          >
            SHOP INTERCHANGEABLE-LENS →
          </button>
        </div>
      </section>

      {/* ===== SECTION 5 — Action/Sports (IMAGE 4) ===== */}
      <section ref={ref4} style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <img
          src="/Image4.jpeg"
          alt="Action sports photography"
          style={{ ...imgAnim(inView4), objectPosition: 'center' }}
        />
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        {/* Text block — right-aligned */}
        <div style={{ position: 'absolute', bottom: '44px', right: '52px', zIndex: 2, textAlign: 'right' }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              color: 'rgba(255,255,255,0.65)',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '8px',
            }}
          >
            FREEZE THE MOMENT
          </p>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '48px',
              color: '#fff',
              fontWeight: 300,
              fontStyle: 'italic',
              display: 'block',
            }}
          >
            Speed. Precision.
          </span>
          <button
            onClick={() => navigate('/category/cinema-line-cameras')}
            style={{
              background: 'transparent',
              border: '0.5px solid rgba(255,255,255,0.6)',
              color: '#fff',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '10px 24px',
              marginTop: '20px',
              display: 'inline-block',
              cursor: 'pointer',
            }}
          >
            EXPLORE CINEMA LINE →
          </button>
        </div>
      </section>
    </div>

  );
};

/* ——— Inline Featured Card ——— */
const FeaturedCard = ({ product: p, navigate }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: hovered ? '#FAFAFA' : '#fff',
        padding: 20,
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onClick={() => navigate(`/products/${p.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ height: 200, background: '#F5F5F5', marginBottom: 14, overflow: 'hidden' }}>
        {p.images?.[0] && (
          <img
            src={p.images[0]}
            alt={p.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '9px',
          color: '#7F7F7F',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '5px',
        }}
      >
        {p.category?.name}
      </p>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '15px',
          color: '#000',
          fontWeight: 500,
          marginBottom: '8px',
        }}
      >
        {p.name}
      </p>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '15px',
          fontWeight: 600,
          color: '#000',
        }}
      >
        {formatPrice(p.price)}
      </p>
    </div>
  );
};

export default Home;
