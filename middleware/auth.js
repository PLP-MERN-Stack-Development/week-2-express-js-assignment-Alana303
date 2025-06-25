// middleware/auth.js

const { UnauthorizedError } = require('../utils/errors');

module.exports = function auth(req, res, next) {
  // For public endpoints (e.g., GET /api/products), you might allow without API key.
  // If you want only POST/PUT/DELETE protected, you can conditionally check method:
  const apiKey = req.header('x-api-key');
  const expectedKey = process.env.API_KEY;

  // For demonstration, let’s protect all routes except GET:
  if (req.method === 'GET') {
    return next();
  }

  if (!apiKey || apiKey !== expectedKey) {
    return next(new UnauthorizedError('Invalid or missing API key'));
  }

  next();
};
