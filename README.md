# Sony Cameras Marketplace

A full-stack e-commerce marketplace for Sony cameras. Built as a portfolio project.

## Live Demo
- Frontend: https://sony-cameras-marketplace.vercel.app/
- Backend API: https://sony-cameras-marketplace-api.onrender.com

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS, Zustand, React Query
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT + bcrypt + Google OAuth 2.0 (passport-google-oauth20)
- Images: Cloudinary
- Deployed: Vercel + Render + MongoDB Atlas

## Features
- Browse 21 Sony cameras with filters, search, sort
- Full auth system (register, login, JWT, Google OAuth)
- Cart, wishlist, compare up to 3 cameras
- Full checkout flow with mock payment (Card/UPI/COD)
- Order tracking with 5-step status timeline
- Product reviews and ratings
- Super admin panel — manage products, orders, users
- Responsive design

## Running locally
```bash
# Clone the repo
git clone https://github.com/imposter29/Sony-Cameras-Marketplace.git

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Add your .env file to server/ (see .env.example)
# Required: MONGO_URI, JWT_SECRET, CLOUDINARY_*, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL

# Seed the database
cd server && node seed/seed.js

# Run both
cd .. && npm run dev
```

## Google OAuth Setup
1. Create a project at https://console.cloud.google.com
2. Enable the Google+ API and create OAuth 2.0 credentials
3. Add `http://localhost:3000/api/auth/google/callback` as an authorised redirect URI
4. Copy `client_id` and `client_secret` into `server/.env`

## Note
Backend is hosted on Render free tier — first request after inactivity may take 30-60 seconds to wake up.
