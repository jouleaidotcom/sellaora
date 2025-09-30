const Store = require('../models/Store');

// Ensures the authenticated user owns the given storeId
// Expects req.user to be set by authMiddleware
// Usage: ownerCheckMiddleware(req.params.storeId) or with req.body.storeId
const ownerCheckMiddleware = (getStoreId) => {
  return async (req, res, next) => {
    try {
      const storeId = typeof getStoreId === 'function' ? getStoreId(req) : getStoreId;
      if (!storeId) {
        return res.status(400).json({ success: false, message: 'Store ID is required' });
      }

      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({ success: false, message: 'Store not found' });
      }

      if (String(store.ownerId) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not own this store' });
      }

      req.store = store;
      next();
    } catch (error) {
      console.error('Owner check error:', error);
      res.status(500).json({ success: false, message: 'Server error during ownership check' });
    }
  };
};

module.exports = ownerCheckMiddleware;


