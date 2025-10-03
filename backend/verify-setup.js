require('dotenv').config();

console.log('🔍 Verifying Sellaora Publishing Setup...\n');

// Check environment variables
console.log('Environment Variables:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`PORT: ${process.env.PORT || 'not set'}`);
console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'configured' : ' not set'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'configured' : ' not set'}`);
console.log(`VERCEL_TOKEN: ${process.env.VERCEL_TOKEN ? 'configured' : ' not set'}`);

if (!process.env.VERCEL_TOKEN) {
  console.log('\n  Warning: VERCEL_TOKEN is required for publishing to work!');
  console.log('   Get your token at: https://vercel.com/account/tokens');
}

// Check dependencies
console.log('\n📦 Dependencies:');
try {
  require('axios');
  console.log('axios: installed');
} catch {
  console.log('axios: missing - run npm install axios');
}

try {
  require('mongoose');
  console.log(' mongoose: installed');
} catch {
  console.log('mongoose: missing');
}

try {
  require('express');
  console.log('express: installed');
} catch {
  console.log(' express: missing');
}

// Check file structure
console.log('\n📁 File Structure:');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'models/Store.js',
  'routes/storePublish.js',
  'utils/codeGenerator.js',
  'utils/vercelDeploy.js',
  'builds/.gitignore'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}: exists`);
  } else {
    console.log(`❌ ${file}: missing`);
  }
});

// Test code generation
console.log('\n🧪 Testing Code Generation:');
try {
  const { generateReactCode } = require('./utils/codeGenerator');
  const testLayout = {
    name: 'Test Store',
    pages: [{
      name: 'Home',
      sections: [{
        type: 'hero',
        content: { title: 'Test', description: 'Test description' }
      }]
    }]
  };
  
  const result = generateReactCode(testLayout);
  console.log('Code generation: working');
  console.log(`   Generated ${result.appJs.length} chars of JS, ${result.appCss.length} chars of CSS`);
} catch (error) {
  console.log('Code generation: failed');
  console.log(`   Error: ${error.message}`);
}

console.log('\n🎯 Setup Status:');
const hasVercelToken = !!process.env.VERCEL_TOKEN;
const hasMongoUri = !!process.env.MONGO_URI;

if (hasVercelToken && hasMongoUri) {
  console.log('All required configuration is present!');
  console.log('🚀 Publishing feature should work correctly.');
} else {
  console.log('Setup incomplete:');
  if (!hasVercelToken) console.log('   - Add VERCEL_TOKEN to your .env file');
  if (!hasMongoUri) console.log('   - Add MONGO_URI to your .env file');
}

console.log('\n📖 Next steps:');
console.log('1. Start your backend: npm run dev');
console.log('2. Start your frontend: cd ../frontend && npm run dev');
console.log('3. Create or edit a store in the editor');
console.log('4. Click the 🚀 Publish button to deploy!');