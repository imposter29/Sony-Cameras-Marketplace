const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { sendMail } = require('../utils/mailer');

// Hash a raw reset token before storing/looking it up (never store raw tokens).
const hashToken = (raw) =>
  crypto.createHash('sha256').update(raw).digest('hex');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const user = await User.create({ name, email, password });

    // TODO (P3 — email verification, scaffolded): when EMAIL_VERIFICATION is
    // enabled, generate a verifyToken, email a verification link via the mailer,
    // and gate protected actions on `user.isVerified`. Left optional/off by
    // default so signup continues to log users in immediately.
    // if (process.env.EMAIL_VERIFICATION === 'true') { ...send verify email... }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    // Concurrent requests can slip past the pre-check and hit the unique index.
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
      });
    }

    // Google-only accounts have no password — comparePassword would throw a 500.
    // Return a clear, actionable 400 instead.
    if (!user.password || user.authProvider === 'google') {
      return res.status(400).json({
        success: false,
        message:
          'This account uses Google sign-in. Please continue with Google.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'wishlist',
      'name slug price images'
    );

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request a password reset link
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond success to avoid leaking which emails are registered.
    if (!user || user.authProvider === 'google') {
      return res.json({
        success: true,
        message: 'If an account exists, a reset link has been sent.',
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = hashToken(rawToken);
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const clientURL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    const resetLink = `${clientURL}/reset-password?token=${rawToken}`;

    await sendMail({
      to: user.email,
      subject: 'Reset your password',
      text: `Reset your password using this link (valid for 1 hour): ${resetLink}`,
      html: `<p>Reset your password using the link below (valid for 1 hour):</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });

    res.json({
      success: true,
      message: 'If an account exists, a reset link has been sent.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password using a token
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: hashToken(token),
      resetPasswordExpire: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    user.password = password; // hashed by pre-save hook
    user.authProvider = 'local';
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password has been reset. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set/enable a password for the current (e.g. Google) user so they can
//          also log in with email/password
// @route   POST /api/auth/set-password
exports.setPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = password; // hashed by pre-save hook
    // Allow email/password login going forward; googleId is retained so Google
    // sign-in still resolves this same account first.
    user.authProvider = 'local';
    await user.save();

    res.json({ success: true, message: 'Password set. You can now log in with email and password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
