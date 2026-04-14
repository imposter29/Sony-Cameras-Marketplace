const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { register, login, getMe } = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);

// ── Google OAuth ──────────────────────────────────────────
// Step 1: Redirect user to Google consent screen
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google redirects back here; issue JWT and send to frontend
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    session: false,
  }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
      const clientURL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
      res.redirect(`${clientURL}/auth/callback?token=${token}`);
    } catch (err) {
      const clientURL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
      res.redirect(`${clientURL}/login?error=server_error`);
    }
  }
);

module.exports = router;

