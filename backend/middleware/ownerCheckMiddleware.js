const Store = require('../models/Store');

// Ensures the authenticated user owns the given storeId
// Expects req.user to be set by authMiddleware
// Usage: ownerCheckMiddleware(req.params.storeId) or with req.body.storeId
const ownerCheckMiddleware = (getStoreId) => {
  return async (req, res, next) => {
    console.log('🔍 Owner check middleware:', {
      hasUser: !!req.user,
      userId: req.user?._id,
      getStoreIdType: typeof getStoreId,
      params: req.params,
      path: req.path
    });
    
    try {
      const storeId = typeof getStoreId === 'function' ? getStoreId(req) : getStoreId;
      console.log('🏢 Extracted storeId:', storeId);
      
      if (!storeId) {
        console.log('❌ No storeId provided');
        return res.status(400).json({ success: false, message: 'Store ID is required' });
      }

      const store = await Store.findById(storeId);
      console.log('🔎 Store lookup result:', {
        found: !!store,
        storeOwnerId: store?.ownerId,
        requestUserId: req.user._id,
        match: store ? String(store.ownerId) === String(req.user._id) : false
      });
      
      if (!store) {
        console.log('❌ Store not found for ID:', storeId);
        return res.status(404).json({ success: false, message: 'Store not found' });
      }

      if (String(store.ownerId) !== String(req.user._id)) {
        console.log('❌ Ownership mismatch');
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


