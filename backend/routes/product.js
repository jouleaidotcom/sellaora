const express = require('express');
const Product = require('../models/Product');
const Store = require('../models/Store');
const authMiddleware = require('../middleware/authMiddleware');
const ownerCheckMiddleware = require('../middleware/ownerCheckMiddleware');

const router = express.Router();

// Create new product (must own store)
// POST /api/products
router.post('/', authMiddleware, ownerCheckMiddleware((req) => req.body.storeId), async (req, res) => {
  try {
    const { storeId, name, description, price, stock, images } = req.body;

    if (!storeId || !name || price === undefined || stock === undefined) {
      return res.status(400).json({ success: false, message: 'storeId, name, price, and stock are required' });
    }

    const product = new Product({
      storeId,
      name,
      description: description || '',
      price,
      stock,
      images: Array.isArray(images) ? images : []
    });

    await product.save();

    res.status(201).json({ success: true, message: 'Product created', data: { product } });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: errors[0] || 'Validation error' });
    }
    res.status(500).json({ success: false, message: 'Server error during product creation' });
  }
});

// Get all products for a store
// GET /api/products/:storeId
router.get('/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;

    const products = await Product.find({ storeId }).sort({ createdAt: -1 });
    res.json({ success: true, data: { products } });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching products' });
  }
});

// Get single product by id
// GET /api/products/item/:id
router.get('/item/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: { product } });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching product' });
  }
});

// Update product (must own store)
// PUT /api/products/:id
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    req.product = product;
    next();
  } catch (error) {
    console.error('Find product for update error:', error);
    return res.status(500).json({ success: false, message: 'Server error while preparing update' });
  }
}, ownerCheckMiddleware((req) => req.product.storeId), async (req, res) => {
  try {
    const updates = (({ name, description, price, stock, images }) => ({ name, description, price, stock, images }))(req.body);
    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Product updated', data: { product: updated } });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: errors[0] || 'Validation error' });
    }
    res.status(500).json({ success: false, message: 'Server error during product update' });
  }
});

// Delete product (must own store)
// DELETE /api/products/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    req.product = product;
    next();
  } catch (error) {
    console.error('Find product for delete error:', error);
    return res.status(500).json({ success: false, message: 'Server error while preparing delete' });
  }
}, ownerCheckMiddleware((req) => req.product.storeId), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error during product deletion' });
  }
});

module.exports = router;


