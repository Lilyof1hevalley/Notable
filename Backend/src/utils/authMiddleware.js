const jwt = require('jsonwebtoken');

// Verify JWT token before accessing protected routes
const authMiddleware = (req, res, next) => {
  try {
    // Get token from request header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied, no token provided!' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token!' });
  }
};

module.exports = authMiddleware;