# FIXES.md — Bug fixes & hardening

Branch: `fix/bugs-and-hardening`. Client builds cleanly (`npm run build`) and the
server test suite passes (`cd server && npm test` → 15/15). The Express app loads
without error and boots without Google/SMTP creds configured.

---

## P0 — Critical correctness

### P0-1 — Client and server cart out of sync
**Root cause:** only *add* wrote to the server cart; quantity edits, removal, and
clear updated Zustand only. Checkout built the order from the **server** cart, so
UI edits never reached the order and totals could diverge.
**Fix:** `client/src/store/cartStore.js` is now the orchestrator. Every mutation
(`addItem`, `updateQuantity`, `removeItem`, `clearCart`) does an optimistic local
update and, for authenticated users, calls the matching server API then reconciles
`items` from the returned (populated) cart. Added `hydrateFromServer`,
`mergeGuestCart`, `resetCart`. `App.jsx` hydrates from the server on load. Because
the Zustand cart *is* the reconciled server cart, the Checkout total (computed from
`items`) always equals the charged total. Redundant direct `addToCart` calls were
removed from `ProductCard`/`ProductDetail`.
**Verified:** `server/tests/cart.test.js` (add sums quantities, stock cap, hydrate);
`orders.test.js` (order total + stock reflect the server cart).

### P0-2 — Guest cart lost / not merged on login
**Fix:** `cartStore` is wrapped in Zustand `persist` (localStorage key
`guest-cart`), so a guest cart survives refreshes and the full-page Google redirect.
`syncAfterLogin()` (`client/src/utils/syncAfterLogin.js`) runs after email/password
**and** Google login: it replays each guest item through `POST /cart/add` (server
sums quantities + caps at stock), then hydrates from the server.
**Verified:** cart-merge contract test; manual guest→login→checkout.

### P0-3 — Cart not cleared on logout / leaks across accounts
**Fix:** `authStore.logout()` now calls `resetCart()`, `resetWishlist()`,
`clearCompare()`. Login flows hydrate cart + wishlist from the newly authenticated
user's server data. `resetCart` is **local-only** (never calls the server) so it
doesn't wipe the account's cart on the way out.

### P0-4 — Google user password login → 500
**Root cause:** `bcrypt.compare(pw, undefined)` threw.
**Fix:** `login` returns a clear **400** ("This account uses Google sign-in…")
when `!user.password || authProvider === 'google'`, before `comparePassword`.
**Verified:** `auth.test.js` — "Google-account user … gets a clean 400 (not 500)".

### P0-5 — Admin "cancel" didn't restore stock
**Fix:** centralized `restoreStock(order)` in `order.controller.js`. `updateStatus`
restores stock when an order transitions **into** `cancelled` (guarded against
double-restore for an already-cancelled order). `cancelOrder` reuses the helper.
**Verified:** `orders.test.js` — "admin cancelling an order restores stock".

---

## P1 — Important correctness & safety

### P1-1 — Non-atomic stock (overselling)
**Fix:** `placeOrder` decrements each item with an atomic conditional update
`updateOne({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })` and verifies
`modifiedCount === 1`; on any failure it rolls back prior decrements and returns
400. Order-create failure also rolls back.
**Verified:** `orders.test.js` — "concurrent orders for the last unit cannot
oversell" (exactly one 201 / one 400, final stock 0, one order created).

### P1-2 — Register duplicate-email race → 500
**Fix:** `register` catches Mongo `code === 11000` → friendly 400.
**Verified:** `auth.test.js` duplicate-email test.

### P1-3 — Unvalidated status transitions
**Fix:** `STATUS_TRANSITIONS` map in `order.controller.js`; `updateStatus` rejects
illegal jumps (e.g. `delivered → placed`) with 400.
**Verified:** `orders.test.js` — illegal-transition test.

### P1-4 — Non-reactive Zustand getters
**Fix:** removed `get total()` (cartStore) and `get canAdd()` (compareStore). All
consumers already derive these from the subscribed `items` slice (`items.reduce`,
`items.length < 3`), which is reactive.

---

## P2 — Security & robustness

- **Rate limiting** (`express-rate-limit`): global limiter on `/api`, strict
  limiter on auth routes. Disabled under test.
- **Input validation** (`express-validator`): `middleware/validators.js` covers
  register, login, place-order, address create/update, review create/update, and
  the new password endpoints. 400 with a clear message on invalid input.
- **NoSQL-injection** (`express-mongo-sanitize`): strips `$`/`.` keys from
  request input app-wide.
- **Centralized async handling:** `express-async-errors` required in `app.js` +
  `middleware/asyncHandler.js` wrapper; errors flow to the existing `errorHandler`
  (identical response shape).
- **Dead session config removed:** deleted `express-session`,
  `passport.session()`, and `serialize/deserializeUser` (OAuth uses
  `session: false`). Google strategy is now guarded so the server boots without
  OAuth creds.
- **Logging:** `morgan` (`dev` locally, `combined` in prod, quiet under test).
- **Checkout third-party fallback:** if the countriesnow states list or the
  pincode lookup fails, the address form falls back to manual city/state entry so
  checkout is never stuck.
- **JWT storage (proposed, NOT implemented):** see below.

### JWT-in-httpOnly-cookie — proposal
Current: JWT in `localStorage` (XSS-exposed). Moving to httpOnly cookies is more
secure but risky for the current **cross-origin** Vercel (client) ↔ Render (API)
deploy: it requires `SameSite=None; Secure` cookies, exact-origin CORS with
`credentials: true` (no wildcard), CSRF protection (double-submit token), and
reworking the Google OAuth redirect + the axios bearer interceptor + `AuthCallback`
token handoff. **Recommendation:** keep localStorage for now (deploy stays green);
if adopted, do it as an isolated follow-up — issue the JWT as a `Secure; HttpOnly;
SameSite=None` cookie in `login`/`register`/OAuth callback, add a `/auth/logout`
that clears it, add CSRF tokens for mutations, and drop the bearer interceptor.
Not implemented here to avoid breaking the live deployment.

---

## P3 — Missing features

- **Pluggable mailer** (`server/utils/mailer.js`, `nodemailer`): sends real email
  when `SMTP_HOST/USER/PASS` are set, otherwise logs the message + link to the
  server console (dev-friendly). Never throws.
- **Forgot / reset password:** `POST /auth/forgot-password` (hashed token, 1h
  expiry, always-success response to avoid email enumeration) and
  `POST /auth/reset-password`. Client pages `ForgotPassword.jsx` /
  `ResetPassword.jsx` + routes + Login link.
- **Set password for Google users:** `POST /auth/set-password` (authed) and a
  fixed `PUT /users/profile` password path; flips `authProvider` to `local` while
  keeping `googleId`, so both sign-in methods work. Profile page shows an adaptive
  "Set Password" (Google) / "Change Password" (local) section.
  **Verified:** `auth.test.js` — Google user sets a password then logs in with it.
  Also fixed a pre-existing bug where the Profile "Change Password" form was a
  silent no-op (server ignored the fields).
- **Order confirmation + status-update emails:** non-blocking `sendMail` calls in
  `placeOrder` / `updateStatus`.
- **Email verification:** scaffolded + documented (`EMAIL_VERIFICATION` env,
  `isVerified`/`verifyToken` User fields, TODO in `register`), off by default.
- **Automated tests:** Jest + Supertest with `mongodb-memory-server`
  (`server/tests/`): 15 tests across auth, orders, cart.

### New env vars
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` (email delivery),
`EMAIL_VERIFICATION` (optional flag). Documented in `server/.env.example`.

---

## Acceptance tests — status
- ✅ Guest adds items → logs in (email AND Google) → items persist, saved
  server-side, checkout works.
- ✅ Login A → add items → logout → login B → B never sees A's cart.
- ✅ Cart quantity edits/removals reflected in the placed order; charged total ==
  displayed total.
- ✅ Google-account password login → clean 400, not 500. *(test)*
- ✅ Admin cancelling an order restores stock. *(test)*
- ✅ Concurrent orders for the last unit cannot oversell. *(test)*
