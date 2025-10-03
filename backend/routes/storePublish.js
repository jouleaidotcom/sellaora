const express = require('express');
const Store = require('../models/Store');
const authMiddleware = require('../middleware/authMiddleware');
const { createViteProject } = require('../utils/viteScaffold');
const { generateComponents } = require('../utils/componentGenerator');
const { deployToVercel } = require('../utils/vercelDeploy');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// @route   POST /api/store/:storeId/publish
// @desc    Publish store to Vercel
// @access  Private (store owner only)
router.post('/:storeId/publish', authMiddleware, async (req, res) => {
  let buildDir = null;
  
  try {
    const { storeId } = req.params;
    console.log(`🚀 Starting publish process for store: ${storeId}`);
    
    // Find and validate store
    const store = await Store.findById(storeId);
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
        message: 'Access denied. You can only publish your own stores.'
      });
    }
    
    // Check if JSON layout exists (use jsonLayout or fall back to layout)
    const storeLayout = store.jsonLayout || store.layout;
    if (!storeLayout) {
      return res.status(400).json({
        success: false,
        message: 'Store layout not found. Please design your store first.'
      });
    }
    
    // Update JSON layout with any new data from request body
    let finalLayout = storeLayout;
    if (req.body.jsonLayout) {
      finalLayout = req.body.jsonLayout;
      store.jsonLayout = req.body.jsonLayout;
      store.layout = req.body.jsonLayout; // Keep both in sync
      await store.save();
      console.log('📝 Updated store layout');
    }
    
    console.log('🏗️ Creating Vite React project...');
    
    // Create Vite project structure
    buildDir = createViteProject(storeId, store.storeName);
    
    // Debug: Log the layout data being used
    console.log('🔍 Debug: finalLayout being used:', JSON.stringify(finalLayout, null, 2));
    
    // Generate React components from JSON layout
    generateComponents(buildDir, finalLayout);
    
    console.log(`📁 React project created at: ${buildDir}`);
    
    // Deploy to Vercel
    console.log('☁️ Deploying to Vercel...');
    const deploymentResult = await deployToVercel(
      buildDir,
      store.storeName,
      store.domain
    );
    
    if (!deploymentResult.success) {
      throw new Error(`Vercel deployment failed: ${deploymentResult.error}`);
    }
    
    // Update store with deployment info
    store.publishedUrl = deploymentResult.url;
    store.vercelDeploymentId = deploymentResult.deploymentId;
    store.lastPublished = new Date();
    await store.save();
    
    console.log('✅ Store published successfully');
    
    // Clean up build directory
    if (buildDir && fs.existsSync(buildDir)) {
      try {
        fs.rmSync(buildDir, { recursive: true, force: true });
        console.log('🧹 Cleaned up build directory');
      } catch (cleanupError) {
        console.warn('⚠️ Failed to clean up build directory:', cleanupError.message);
      }
    }
    
    res.json({
      success: true,
      message: 'Store published successfully',
      data: {
        url: deploymentResult.url,
        deploymentId: deploymentResult.deploymentId,
        publishedAt: store.lastPublished,
        store: {
          id: store._id,
          name: store.storeName,
          domain: store.domain,
          publishedUrl: store.publishedUrl
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Publish failed:', error);
    
    // Clean up build directory on error
    if (buildDir && fs.existsSync(buildDir)) {
      try {
        fs.rmSync(buildDir, { recursive: true, force: true });
        console.log('🧹 Cleaned up build directory after error');
      } catch (cleanupError) {
        console.warn('⚠️ Failed to clean up build directory:', cleanupError.message);
      }
    }
    
    // Handle specific error types
    let errorMessage = 'Failed to publish store';
    let statusCode = 500;
    
    if (error.message.includes('VERCEL_TOKEN')) {
      errorMessage = 'Vercel configuration error. Please contact support.';
      statusCode = 503;
    } else if (error.message.includes('Invalid JSON layout')) {
      errorMessage = 'Invalid store layout. Please check your store design.';
      statusCode = 400;
    } else if (error.message.includes('Build failed')) {
      errorMessage = 'Failed to build your store. Please check your store configuration.';
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/store/:storeId/publish/status
// @desc    Get publishing status
// @access  Private (store owner only)
router.get('/:storeId/publish/status', authMiddleware, async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const store = await Store.findById(storeId);
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
        message: 'Access denied. You can only view your own store status.'
      });
    }
    
    res.json({
      success: true,
      data: {
        isPublished: !!store.publishedUrl,
        publishedUrl: store.publishedUrl,
        lastPublished: store.lastPublished,
        deploymentId: store.vercelDeploymentId,
        hasLayout: !!store.jsonLayout
      }
    });
    
  } catch (error) {
    console.error('Get publish status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get publish status'
    });
  }
});

// @route   PUT /api/store/:storeId/layout
// @desc    Update store layout (for publishing)
// @access  Private (store owner only)
router.put('/:storeId/layout', authMiddleware, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { jsonLayout } = req.body;
    
    if (!jsonLayout) {
      return res.status(400).json({
        success: false,
        message: 'JSON layout is required'
      });
    }
    
    const store = await Store.findById(storeId);
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
    
    // Update the layout
    store.jsonLayout = jsonLayout;
    await store.save();
    
    res.json({
      success: true,
      message: 'Store layout updated successfully',
      data: {
        storeId: store._id,
        updated: true
      }
    });
    
  } catch (error) {
    console.error('Update layout error:', error);
    
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
      message: 'Failed to update store layout'
    });
  }
});

// @route   DELETE /api/store/:storeId/unpublish
// @desc    Unpublish store (remove from Vercel)
// @access  Private (store owner only)
router.delete('/:storeId/unpublish', authMiddleware, async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const store = await Store.findById(storeId);
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
        message: 'Access denied. You can only unpublish your own stores.'
      });
    }
    
    // Clear publish data
    store.publishedUrl = null;
    store.vercelDeploymentId = null;
    store.lastPublished = null;
    await store.save();
    
    res.json({
      success: true,
      message: 'Store unpublished successfully',
      data: {
        storeId: store._id,
        unpublished: true
      }
    });
    
  } catch (error) {
    console.error('Unpublish error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unpublish store'
    });
  }
});

// Debug endpoint to check store layout data
router.get('/:storeId/debug-layout', authMiddleware, async (req, res) => {
  try {
    const { storeId } = req.params;
    const store = await Store.findById(storeId);
    
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    
    // Check if user is the owner
    if (store.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({
      success: true,
      data: {
        storeId: store._id,
        storeName: store.storeName,
        hasJsonLayout: !!store.jsonLayout,
        hasLayout: !!store.layout,
        jsonLayoutType: typeof store.jsonLayout,
        layoutType: typeof store.layout,
        jsonLayoutKeys: store.jsonLayout ? Object.keys(store.jsonLayout) : null,
        layoutKeys: store.layout ? Object.keys(store.layout) : null,
        // Don't return full data to avoid huge responses, just structure info
        jsonLayoutPages: store.jsonLayout?.pages ? store.jsonLayout.pages.length : null,
        layoutPages: store.layout?.pages ? store.layout.pages.length : null,
        layoutSections: store.layout?.sections ? store.layout.sections.length : null
      }
    });
  } catch (error) {
    console.error('Debug layout error:', error);
    res.status(500).json({ success: false, message: 'Failed to get debug info' });
  }
});

module.exports = router;
