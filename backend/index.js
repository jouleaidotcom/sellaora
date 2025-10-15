require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');
const productRoutes = require('./routes/product');
const uploadRoutes = require('./routes/upload');
const storeAIRoutes = require('./routes/storeAI');
const storeApprovalRoutes = require('./routes/storeApproval');
const storeEditorRoutes = require('./routes/storeEditor');
const storePublishRoutes = require('./routes/storePublish');
const teamRoutes = require('./routes/team');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} ${req.method} ${req.path}`);
  if (req.path.includes('ai-prompt')) {
    console.log('🤖 AI request details:', {
      headers: Object.keys(req.headers),
      body: req.body,
      params: req.params,
      query: req.query
    });
  }
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sellaora');
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Server will continue running without database. Some features may not work.');
    // Don't exit process, let server run without DB for testing
  }
};

connectDB();

app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Joule API is running',
    version: '1.0.0',
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      store: '/api/store',
      products: '/api/products',
      teams: '/api/teams',
      upload: '/api/upload'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/store', storeAIRoutes);
app.use('/api/store', storeApprovalRoutes);
app.use('/api/store', storeEditorRoutes);
app.use('/api/store', storePublishRoutes);
app.use('/api/teams', teamRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server URL: http://0.0.0.0:${PORT}`);
});