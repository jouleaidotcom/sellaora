const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store ID is required']
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [150, 'Product name cannot exceed 150 characters']
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: {
    type: mongoose.Schema.Types.Mixed, // Use Mixed to support both old (strings) and new (objects) formats
    default: [],
    validate: {
      validator: function(images) {
        if (!Array.isArray(images)) return false;
        
        // Allow empty array
        if (images.length === 0) return true;
        
        // Validate each image - can be string (old format) or object (new format)
        return images.every(image => {
          if (typeof image === 'string') {
            return true; // Old format - just strings
          }
          if (typeof image === 'object' && image !== null) {
            // New format - must have at least url
            return typeof image.url === 'string';
          }
          return false;
        });
      },
      message: 'Images must be an array of strings or objects with url property'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

productSchema.index({ storeId: 1 });
productSchema.index({ name: 1 });

module.exports = mongoose.model('Product', productSchema);


