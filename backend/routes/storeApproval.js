const express = require('express');
const Store = require('../models/Store');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const ownerCheckMiddleware = require('../middleware/ownerCheckMiddleware');

const router = express.Router({ mergeParams: true });

// PUT /api/store/:storeId/approve
router.put('/:storeId/approve', authMiddleware, ownerCheckMiddleware((req) => req.params.storeId), async (req, res) => {
  try {
    const updated = await Store.findByIdAndUpdate(
      req.params.storeId,
      { approved: true },
      { new: true }
    );

    return res.json({ success: true, data: { store: updated } });
  } catch (error) {
    console.error('Approve store error:', error);
    return res.status(500).json({ success: false, message: 'Server error during approval' });
  }
});

// GET /api/store/:storeId/editor
router.get('/:storeId/editor', authMiddleware, ownerCheckMiddleware((req) => req.params.storeId), async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    const products = await Product.find({ storeId: req.params.storeId }).sort({ createdAt: -1 });

    // Build editor payload expected by frontend
    const payload = {
      storeId: store._id.toString(),
      themeId: store.chosenThemeId || store.theme?.id || null,
      // If theme contains raw HTML, use it; otherwise derive minimal htmlContent from layout
      htmlContent: store.theme?.htmlContent || (store.layout ? `<div id="store-root">${JSON.stringify(store.layout)}</div>` : '<div></div>'),
      pages: (store.pages && Array.isArray(store.pages)) ? store.pages : ['Home'],
      products: products || []
    };

    return res.json({ success: true, data: payload });
  } catch (error) {
    console.error('Get editor data error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching editor data' });
  }
});

// POST /api/store/:storeId/editor-update
router.post('/:storeId/editor-update', authMiddleware, ownerCheckMiddleware((req) => req.params.storeId), async (req, res) => {
  try {
    const { layout, theme, products: productChanges } = req.body;

    // Update store layout/theme
    const update = {};
    if (layout !== undefined) update.layout = layout;
    if (theme !== undefined) update.theme = theme;

    let updatedStore = null;
    if (Object.keys(update).length > 0) {
      updatedStore = await Store.findByIdAndUpdate(req.params.storeId, update, { new: true });
    } else {
      updatedStore = await Store.findById(req.params.storeId);
    }

    // Handle product create/update/delete in a simple batch format
    // productChanges = { create: [...], update: [...], delete: [ids] }
    const results = { created: [], updated: [], deleted: [] };
    if (productChanges && typeof productChanges === 'object') {
      if (Array.isArray(productChanges.create)) {
        for (const p of productChanges.create) {
          const created = await Product.create({ ...p, storeId: req.params.storeId });
          results.created.push(created);
        }
      }

      if (Array.isArray(productChanges.update)) {
        for (const p of productChanges.update) {
          if (!p._id) continue;
          const { _id, ...rest } = p;
          const upd = await Product.findOneAndUpdate({ _id, storeId: req.params.storeId }, rest, { new: true });
          if (upd) results.updated.push(upd);
        }
      }

      if (Array.isArray(productChanges.delete)) {
        for (const id of productChanges.delete) {
          const del = await Product.findOneAndDelete({ _id: id, storeId: req.params.storeId });
          if (del) results.deleted.push(id);
        }
      }
    }

    const allProducts = await Product.find({ storeId: req.params.storeId }).sort({ createdAt: -1 });

    return res.json({ success: true, message: 'Editor changes saved', data: { store: updatedStore, products: allProducts, productResults: results } });
  } catch (error) {
    console.error('Editor update error:', error);
    return res.status(500).json({ success: false, message: 'Server error during editor update' });
  }
});

// POST /api/store/themes/choose
router.post('/themes/choose', authMiddleware, async (req, res) => {
  try {
    const { storeId, themeId } = req.body;
    if (!storeId || !themeId) {
      return res.status(400).json({ success: false, message: 'storeId and themeId are required' });
    }

    // Ensure owner
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
    if (store.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    store.chosenThemeId = themeId;
    await store.save();

    return res.json({ success: true, message: 'Theme chosen', data: { store } });
  } catch (error) {
    console.error('Choose theme error:', error);
    return res.status(500).json({ success: false, message: 'Server error when choosing theme' });
  }
});

module.exports = router;


