# <img src="https://api.iconify.design/lucide/camera.svg?color=%233b82f6" width="32" height="32" align="center" /> Sony Cameras Marketplace

> A full-stack e-commerce platform for Sony cameras — built as a portfolio project showcasing modern web development practices.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-brightgreen?style=for-the-badge&logo=vercel)](https://sony-cameras-marketplace.vercel.app/)
[![API](https://img.shields.io/badge/API-Backend-blue?style=for-the-badge&logo=render)](https://sony-cameras-marketplace-api.onrender.com)

---

## <img src="https://api.iconify.design/lucide/globe.svg?color=%233b82f6" width="24" height="24" align="center" /> Live Links

| Service    | URL                                                                   |
|------------|-----------------------------------------------------------------------|
| Frontend   | https://sony-cameras-marketplace.vercel.app/                          |
| Backend API | https://sony-cameras-marketplace-api.onrender.com                    |

> **<img src="https://api.iconify.design/lucide/info.svg?color=%23f59e0b" width="18" height="18" align="center" /> Note:** The backend is hosted on Render's free tier. The first request after a period of inactivity may take **30–60 seconds** to cold-start.

---

## <img src="https://api.iconify.design/lucide/key.svg?color=%2310b981" width="24" height="24" align="center" /> Demo Admin Credentials

Use these credentials to log in to the admin panel on the live site or locally after seeding:

| Field    | Value             |
|----------|-------------------|
| Email    | `admin@sony.com`  |
| Password | `Admin@1234`      |

> The admin panel is accessible at `/admin` after logging in with the above credentials.

---

## <img src="https://api.iconify.design/lucide/sparkles.svg?color=%238b5cf6" width="24" height="24" align="center" /> Features

- <img src="https://api.iconify.design/lucide/camera.svg?color=%230ea5e9" width="18" height="18" align="center" /> **Browse 21 Sony cameras** with filters, search, and sort
- <img src="https://api.iconify.design/lucide/shield-check.svg?color=%2310b981" width="18" height="18" align="center" /> **Full auth system** — Register, Login, JWT sessions, Google OAuth 2.0
- <img src="https://api.iconify.design/lucide/shopping-cart.svg?color=%233b82f6" width="18" height="18" align="center" /> **Cart, Wishlist & Compare** — Compare up to 3 cameras side-by-side
- <img src="https://api.iconify.design/lucide/credit-card.svg?color=%23f59e0b" width="18" height="18" align="center" /> **Checkout flow** — Mock payment via Card / UPI / Cash on Delivery
- <img src="https://api.iconify.design/lucide/package.svg?color=%238b5cf6" width="18" height="18" align="center" /> **Order tracking** — 5-step live status timeline
- <img src="https://api.iconify.design/lucide/star.svg?color=%23eab308" width="18" height="18" align="center" /> **Product reviews & ratings**
- <img src="https://api.iconify.design/lucide/shield.svg?color=%23f43f5e" width="18" height="18" align="center" /> **Super Admin panel** — Manage products, orders, and users
- <img src="https://api.iconify.design/lucide/smartphone.svg?color=%230ea5e9" width="18" height="18" align="center" /> **Fully responsive** design

---

## <img src="https://api.iconify.design/lucide/layers.svg?color=%233b82f6" width="24" height="24" align="center" /> Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Zustand | Global state management |
| React Query | Server state & data fetching |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | API framework |
| MongoDB + Mongoose | Database & ODM |
| JWT + bcrypt | Authentication & password hashing |
| Passport.js (Google OAuth 2.0) | Social login |
| Cloudinary | Image hosting |

### Infrastructure
| Service | Role |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## <img src="https://api.iconify.design/lucide/terminal.svg?color=%2310b981" width="24" height="24" align="center" /> Running Locally

### Prerequisites
- Node.js v18+
- npm v9+
- A MongoDB Atlas cluster (or local MongoDB)
- Cloudinary account (free tier works)
- Google Cloud Console project (for OAuth)

### 1. Clone the repository

```bash
git clone https://github.com/imposter29/Sony-Cameras-Marketplace.git
cd Sony-Cameras-Marketplace
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
npm install --prefix server

# Install client dependencies
npm install --prefix client
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set the following:

```env
PORT=3000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<any_random_secret>
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Admin account created during seeding
ADMIN_EMAIL=admin@sony.com
ADMIN_PASSWORD=Admin@1234

# Google OAuth (optional — sign-in is disabled if unset; see setup below)
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Email / SMTP (optional) — password-reset & order emails are logged to the
# server console in dev when unset. Set all three to enable real delivery.
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=

# Feature flags
# EMAIL_VERIFICATION=false   # (scaffolded) require email verification on signup
```

### 4. Seed the database

```bash
npm run seed
```

This will:
- Clear existing products and categories
- Populate 21 Sony cameras across 5 categories
- Create the admin user with the credentials specified in `.env`

### 5. Start the development servers

```bash
npm run dev
```

This concurrently starts:
- **Backend** at `http://localhost:3000`
- **Frontend** at `http://localhost:5173`

---

## <img src="https://api.iconify.design/lucide/settings.svg?color=%23f43f5e" width="24" height="24" align="center" /> Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Enable the **Google+ API** (or People API)
5. Click **Create Credentials → OAuth 2.0 Client ID**
6. Set application type to **Web application**
7. Add the following **Authorised Redirect URI**:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
8. Copy the `Client ID` and `Client Secret` into `server/.env`

---

## <img src="https://api.iconify.design/lucide/folder-tree.svg?color=%23eab308" width="24" height="24" align="center" /> Project Structure

```
Sony-Cameras-Marketplace/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── store/           # Zustand state stores
│   │   └── hooks/           # Custom React hooks
│   └── vite.config.js
│
├── server/                  # Node.js + Express backend
│   ├── controllers/         # Route handler logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express route definitions
│   ├── middleware/          # Auth & error middleware
│   ├── config/              # DB & Passport config
│   ├── seed/                # Database seeding script
│   └── app.js
│
└── package.json             # Root scripts (concurrently)
```

---

## <img src="https://api.iconify.design/lucide/scroll.svg?color=%238b5cf6" width="24" height="24" align="center" /> Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both client and server in dev mode |
| `npm run server` | Start server only |
| `npm run client` | Start client only |
| `npm run seed` | Seed the database with products and admin user |
| `cd server && npm test` | Run the backend test suite (Jest + Supertest, in-memory MongoDB) |

