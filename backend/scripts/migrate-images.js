const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sellaora');
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Migration script to handle existing products with old image format
const migrateProductImages = async () => {
  try {
    console.log('🔄 Starting image format migration...');
    
    // Find all products
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    const products = await Product.find({});
    
    console.log(`📊 Found ${products.length} products to check`);
    
    let migrationCount = 0;
    let skipCount = 0;
    
    for (const product of products) {
      try {
        if (!product.images || !Array.isArray(product.images)) {
          skipCount++;
          continue;
        }
        
        // Check if migration is needed
        const needsMigration = product.images.some(image => typeof image === 'string');
        
        if (!needsMigration) {
          skipCount++;
          continue;
        }
        
        // Convert string images to object format
        const migratedImages = product.images.map(image => {
          if (typeof image === 'string') {
            return {
              url: image,
              publicId: '', // Empty for legacy images (they won't be cleaned up from Cloudinary)
              originalName: image,
              size: null,
              width: null,
              height: null,
              format: null
            };
          }
          // Already in new format
          return image;
        });
        
        // Update the product
        await Product.findByIdAndUpdate(
          product._id, 
          { images: migratedImages },
          { strict: false } // Allow updating with new schema
        );
        
        migrationCount++;
        console.log(`✅ Migrated product: ${product.name} (${product._id})`);
        
      } catch (error) {
        console.error(`❌ Error migrating product ${product._id}:`, error.message);
      }
    }
    
    console.log(`\n📈 Migration Summary:`);
    console.log(`   ✅ Migrated: ${migrationCount} products`);
    console.log(`   ⏭️  Skipped: ${skipCount} products (already in correct format)`);
    console.log(`   🔢 Total: ${products.length} products checked`);
    
    if (migrationCount > 0) {
      console.log('\n⚠️  Note: Legacy images (converted from strings) have empty publicId');
      console.log('   These images won\'t be automatically cleaned up from storage');
      console.log('   when products are deleted. This is expected for backward compatibility.');
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
const runMigration = async () => {
  await connectDB();
  await migrateProductImages();
  await mongoose.connection.close();
  console.log('\n👋 Database connection closed. Migration complete!');
};

// Check if running directly (not imported)
if (require.main === module) {
  runMigration();
}

module.exports = { migrateProductImages };