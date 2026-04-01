const authMiddleware = require('./auth');

module.exports = function adminAuthMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};
