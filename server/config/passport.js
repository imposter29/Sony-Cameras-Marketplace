const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

// Only register the Google strategy when credentials are configured. Passport's
// GoogleStrategy throws at construction if clientID is missing, which would
// crash the server (and the test suite) whenever Google OAuth env is unset.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if a local account exists with the same email — link it
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            user.authProvider = 'google';
            if (!user.avatar && profile.photos?.[0]?.value) {
              user.avatar = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          }
        }

        // Brand-new user — create account
        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          authProvider: 'google',
          avatar: profile.photos?.[0]?.value || null,
          role: 'user',
          isActive: true,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
  );
} else {
  console.warn('[passport] Google OAuth disabled — GOOGLE_CLIENT_ID/SECRET not set.');
}

// No serializeUser/deserializeUser: OAuth runs with { session: false } and we
// issue a JWT in the callback, so Passport never persists a session.

module.exports = passport;
