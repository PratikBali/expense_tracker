import passport from '../config/passport.js';

export const authenticateJWT = passport.authenticate('jwt', { session: false });

export const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

