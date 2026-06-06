const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Strict limiter for Claude API calls (expensive)
const claudeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,
  message: { error: 'Strategy generation rate limit reached. Please wait a minute.' }
});

// Admin auth middleware
const requireAdmin = (req, res, next) => {
  const token = req.headers['x-admin-secret'] || req.query.secret;
  if (!token || token !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

module.exports = { apiLimiter, claudeLimiter, requireAdmin };
