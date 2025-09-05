const jwt = require('jsonwebtoken');

/**
 * PUBLIC_INTERFACE
 * authMiddleware verifies JWT tokens sent in Authorization header (Bearer <token>).
 * On success attaches req.user = { id, role } and calls next(). On failure responds 401/403.
 */
function authMiddleware(required = true) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.substring(7) : null;

      if (!token) {
        if (!required) return next();
        return res.status(401).json({ status: 'error', message: 'Missing authorization token' });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ status: 'error', message: 'Server misconfiguration: JWT_SECRET not set' });
      }

      const payload = jwt.verify(token, secret);
      req.user = { id: payload.sub, role: payload.role || 'user' };
      return next();
    } catch (err) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
  };
}

/**
 * PUBLIC_INTERFACE
 * authorizeRoles ensures current user has one of the allowed roles.
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ status: 'error', message: 'Forbidden' });
    next();
  };
}

module.exports = { authMiddleware, authorizeRoles };
