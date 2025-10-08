const express = require('express');
const Product = require('../models/Product');
const Store = require('../models/Store');
const authMiddleware = require('../middleware/authMiddleware');
const ownerCheckMiddleware = require('../middleware/ownerCheckMiddleware');
const { deleteImages } = require('../utils/cloudinary');

const router = express.Router();

router.post('/', authMiddleware, ownerCheckMiddleware((req) => req.body.storeId), async (req, res) => {
  try {
    const { storeId, name, description, price, stock, images } = req.body;

    if (!storeId || !name || price === undefined || stock === undefined) {
      return res.status(400).json({ success: false, message: 'storeId, name, price, and stock are required' });
    }

    // Handle images - schema validation will ensure format is correct
    const validatedImages = Array.isArray(images) ? images : [];

    const product = new Product({
      storeId,
      name,
      description: description || '',
      price,
      stock,
      images: validatedImages
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

router.get('/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    let { page = 1, limit = 12, search = '', sortBy = 'createdAt', sortDir = 'desc', status } = req.query;
    if (search === 'undefined' || search === 'null') search = '';
    if (status === 'undefined' || status === 'null') status = undefined;

    page = parseInt(page, 10) || 1;
    limit = Math.min(parseInt(limit, 10) || 12, 100);

    const filter = { storeId };
    if (status && ['draft', 'published'].includes(status)) {
      filter.status = status;
    }
    if (search) {
      const s = String(search).trim();
      if (s) {
        filter.$or = [
          { name: { $regex: s, $options: 'i' } },
          { description: { $regex: s, $options: 'i' } }
        ];
      }
    }

    const sort = {};
    const dir = sortDir === 'asc' ? 1 : -1;
    if (['name', 'price', 'stock', 'createdAt', 'updatedAt'].includes(sortBy)) {
      const key = sortBy === 'price,' ? 'price' : sortBy;
      sort[key] = dir;
    } else {
      sort.createdAt = -1;
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, data: { products, total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching products' });
  }
});

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
    const { name, description, price, stock, images, status } = req.body;
    
    // Build updates object, excluding undefined values
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (stock !== undefined) updates.stock = stock;
    if (status !== undefined) updates.status = status;
    
    // Handle images - schema validation will ensure format is correct
    if (images !== undefined) {
      updates.images = Array.isArray(images) ? images : [];
    }

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

router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { action, ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No product ids provided' });
    }
    const products = await Product.find({ _id: { $in: ids } });
    if (products.length !== ids.length) {
      return res.status(404).json({ success: false, message: 'One or more products not found' });
    }

    const storeIds = [...new Set(products.map(p => String(p.storeId)))];
    const stores = await Store.find({ _id: { $in: storeIds }, ownerId: req.user._id });
    if (stores.length !== storeIds.length) {
      return res.status(403).json({ success: false, message: 'Access denied for one or more products' });
    }

    if (action === 'delete') {
      const allPublicIds = [];
      products.forEach(product => {
        if (product.images && product.images.length > 0) {
          const publicIds = product.images
            .map(image => {
              // Handle both old format (strings) and new format (objects)
              if (typeof image === 'string') {
                return null; // Old format doesn't have publicId
              }
              return image.publicId || null;
            })
            .filter(publicId => publicId && publicId.trim() !== '');
          allPublicIds.push(...publicIds);
        }
      });
      
      if (allPublicIds.length > 0) {
        try {
          await deleteImages(allPublicIds);
          console.log(`Bulk cleanup: removed ${allPublicIds.length} images from Cloudinary`);
        } catch (imageDeleteError) {
          console.warn('Failed to bulk delete images from Cloudinary:', imageDeleteError);
        }
      }
      
      await Product.deleteMany({ _id: { $in: ids } });
      return res.json({ success: true, message: 'Products deleted' });
    }
    if (action === 'publish') {
      await Product.updateMany({ _id: { $in: ids } }, { $set: { status: 'published', publishedAt: new Date() } });
      return res.json({ success: true, message: 'Products published' });
    }
    if (action === 'unpublish') {
      await Product.updateMany({ _id: { $in: ids } }, { $set: { status: 'draft' }, $unset: { publishedAt: 1 } });
      return res.json({ success: true, message: 'Products unpublished' });
    }

    return res.status(400).json({ success: false, message: 'Invalid action' });
  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({ success: false, message: 'Server error during bulk action' });
  }
});

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
    const product = req.product;
    
    if (product.images && product.images.length > 0) {
      const publicIds = product.images
        .map(image => {
          // Handle both old format (strings) and new format (objects)
          if (typeof image === 'string') {
            return null; // Old format doesn't have publicId
          }
          return image.publicId || null;
        })
        .filter(publicId => publicId && publicId.trim() !== '');
      
      if (publicIds.length > 0) {
        try {
          await deleteImages(publicIds);
          console.log(`Cleaned up ${publicIds.length} images for product ${product._id}`);
        } catch (imageDeleteError) {
          console.warn('Failed to delete images from Cloudinary:', imageDeleteError);
        }
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error during product deletion' });
  }
});

module.exports = router;


