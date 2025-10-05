const express = require('express');
const Store = require('../models/Store');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/store
// @desc    Create a new store
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { storeName, domain, description, currency, locale } = req.body;

    // Validation
    if (!storeName || !domain) {
      return res.status(400).json({
        success: false,
        message: 'Please provide store name and domain'
      });
    }

    // Check if domain already exists
    const existingStore = await Store.findOne({ domain });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'A store with this domain already exists'
      });
    }

    // Create store
    const store = new Store({
      ownerId: req.user._id,
      storeName,
      domain,
      description: description || '',
      currency: currency || 'USD',
      locale: locale || 'en-US'
    });

    await store.save();

    // Populate owner information
    await store.populate('ownerId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: {
        store
      }
    });
  } catch (error) {
    console.error('Store creation error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors[0] || 'Validation error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during store creation'
    });
  }
});

// @route   GET /api/store/:id
// @desc    Get store details by ID
// @access  Public (for now, could be made private later)
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('ownerId', 'name email');
    
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      data: {
        store
      }
    });
  } catch (error) {
    console.error('Get store error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid store ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching store'
    });
  }
});

// @route   GET /api/store
// @desc    Get all stores for the authenticated user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const stores = await Store.find({ ownerId: req.user._id })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        stores,
        count: stores.length
      }
    });
  } catch (error) {
    console.error('Get user stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stores'
    });
  }
});

// @route   PUT /api/store/:id
// @desc    Update store details
// @access  Private (only store owner)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { storeName, domain, description, isActive, currency, locale } = req.body;
    
    // Find store
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user is the owner
    if (store.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own stores.'
      });
    }

    // Check if new domain already exists (if domain is being changed)
    if (domain && domain !== store.domain) {
      const existingStore = await Store.findOne({ domain });
      if (existingStore) {
        return res.status(400).json({
          success: false,
          message: 'A store with this domain already exists'
        });
      }
    }

    // Update store
    const updateData = {};
    if (storeName) updateData.storeName = storeName;
    if (domain) updateData.domain = domain;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (currency) updateData.currency = currency;
    if (locale) updateData.locale = locale;

    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email');

    res.json({
      success: true,
      message: 'Store updated successfully',
      data: {
        store: updatedStore
      }
    });
  } catch (error) {
    console.error('Update store error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors[0] || 'Validation error'
      });
    }

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid store ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during store update'
    });
  }
});

// @route   DELETE /api/store/:id
// @desc    Delete store
// @access  Private (only store owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Find store
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user is the owner
    if (store.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own stores.'
      });
    }

    await Store.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    console.error('Delete store error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid store ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during store deletion'
    });
  }
});

module.exports = router;