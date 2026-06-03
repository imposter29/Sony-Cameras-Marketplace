# 🎥 Sony Cameras Marketplace

> A full-stack e-commerce platform for Sony cameras — built as a portfolio project showcasing modern web development practices.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-brightgreen?style=for-the-badge&logo=vercel)](https://sony-cameras-marketplace.vercel.app/)
[![API](https://img.shields.io/badge/API-Backend-blue?style=for-the-badge&logo=render)](https://sony-cameras-marketplace-api.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🌐 Live Links

| Service    | URL                                                                   |
|------------|-----------------------------------------------------------------------|
| Frontend   | https://sony-cameras-marketplace.vercel.app/                          |
| Backend API | https://sony-cameras-marketplace-api.onrender.com                    |

> **⚠️ Note:** The backend is hosted on Render's free tier. The first request after a period of inactivity may take **30–60 seconds** to cold-start.

---

## 🔑 Demo Admin Credentials

Use these credentials to log in to the admin panel on the live site or locally after seeding:

| Field    | Value             |
|----------|-------------------|
| Email    | `admin@sony.com`  |
| Password | `Admin@1234`      |

> The admin panel is accessible at `/admin` after logging in with the above credentials.

---

## ✨ Features

- 📸 **Browse 21 Sony cameras** with filters, search, and sort
- 🔐 **Full auth system** — Register, Login, JWT sessions, Google OAuth 2.0
- 🛒 **Cart, Wishlist & Compare** — Compare up to 3 cameras side-by-side
- 💳 **Checkout flow** — Mock payment via Card / UPI / Cash on Delivery
- 📦 **Order tracking** — 5-step live status timeline
- ⭐ **Product reviews & ratings**
- 🛡️ **Super Admin panel** — Manage products, orders, and users
- 📱 **Fully responsive** design

---

## 🛠️ Tech Stack

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

## 🚀 Running Locally

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

# Google OAuth (optional — see setup below)
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
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

## 🔧 Google OAuth Setup

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

## 📁 Project Structure

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

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both client and server in dev mode |
| `npm run server` | Start server only |
| `npm run client` | Start client only |
| `npm run seed` | Seed the database with products and admin user |

