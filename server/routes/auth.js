import express from 'express';
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.CLIENT_URL + '/login?error=auth_failed',
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend
    res.redirect(process.env.CLIENT_URL + '/dashboard?auth=success');
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', authenticateJWT, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar,
      currency: req.user.currency,
      language: req.user.language,
    },
  });
});

// @route   POST /api/auth/logout
// @desc    Logout user
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;

