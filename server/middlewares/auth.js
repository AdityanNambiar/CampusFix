const jwt = require('jsonwebtoken');

// Middleware for JWT authentication and role-based access
const auth = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    // Get token from header
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      // Check role if needed
      if (roles.length && !roles.includes(user.role)) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  };
};

module.exports = auth; 