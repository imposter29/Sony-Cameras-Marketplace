// Auto-forward rejected promises from async route handlers to errorHandler.
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('./config/passport');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiters');

const app = express();

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// Middleware
app.use(helmet());

// Request logging (concise in production, verbose in dev; quiet under test).
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Passport is used statelessly (JWT, session: false) — no express-session,
// serializeUser/deserializeUser, or passport.session() required.
app.use(passport.initialize());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://sony-cameras-marketplace.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server calls

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Strip any keys containing `$` or `.` from req.body/query/params so operator
// objects can't be injected into Mongo queries (e.g. { email: { $ne: null } }).
app.use(mongoSanitize());

// Global rate limiting across the API.
app.use('/api', globalLimiter);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/contact', require('./routes/contact.routes'));

// Admin user management routes
const verifyToken = require('./middleware/auth');
const adminOnly = require('./middleware/adminOnly');
const User = require('./models/User.model');

app.get('/api/admin/users', verifyToken, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.patch('/api/admin/users/:id/toggle', verifyToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
