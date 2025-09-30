const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  storeName: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    maxlength: [100, 'Store name cannot exceed 100 characters']
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9]+([.-]?[a-z0-9]+)*$/, 'Please enter a valid domain format'],
    maxlength: [50, 'Domain cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  theme: {
    type: Object,
    default: null
  },
  layout: {
    type: Object,
    default: null
  },
  approved: {
    type: Boolean,
    default: false
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

// Index for faster queries
storeSchema.index({ ownerId: 1 });
storeSchema.index({ domain: 1 });

module.exports = mongoose.model('Store', storeSchema);