const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Deploys a React build to Vercel using their API
 * @param {string} buildDir - Path to the build directory
 * @param {string} storeName - Name of the store
 * @param {string} domain - Custom domain for the store
 * @returns {Promise<Object>} - Deployment result with URL
 */
async function deployToVercel(buildDir, storeName, domain) {
  try {
    console.log(`🚀 Starting Vercel deployment for ${storeName}...`);
    
    // Check if Vercel token exists
    if (!process.env.VERCEL_TOKEN) {
      throw new Error('VERCEL_TOKEN environment variable is required');
    }
    
    // Build the Vite React project first
    console.log('📦 Building Vite project...');
    try {
      execSync('npm install', { cwd: buildDir, stdio: 'pipe' });
      execSync('npm run build', { cwd: buildDir, stdio: 'pipe' });
    } catch (buildError) {
      console.error('Build failed:', buildError.message);
      throw new Error('Failed to build Vite project: ' + buildError.message);
    }
    
    // Get all build files from dist/ folder
    const distPath = path.join(buildDir, 'dist');
    if (!fs.existsSync(distPath)) {
      throw new Error('Dist directory not found. Make sure npm run build completed successfully.');
    }
    
    const files = await getAllFiles(distPath);
    console.log(`📁 Found ${files.length} files in dist folder`);
    
    // List all files found in dist
    files.forEach(filePath => {
      const relativePath = path.relative(distPath, filePath);
      const size = fs.statSync(filePath).size;
      console.log(`  📄 ${relativePath} (${size} bytes)`);
    });
    
    // Prepare files for Vercel API - only include static build output files
    const vercelFiles = files
      .filter(filePath => {
        const relativePath = path.relative(distPath, filePath);
        
        // Exclude any build configuration files that might have been copied to dist
        const excludePatterns = [
          'package.json',
          'package-lock.json', 
          'vite.config.js',
          'node_modules/',
          '.git/',
          'src/',
          'public/'
        ];
        
        return !excludePatterns.some(pattern => 
          relativePath.includes(pattern) || relativePath.startsWith(pattern)
        );
      })
      .map(filePath => {
        const relativePath = path.relative(distPath, filePath);
        const fileContent = fs.readFileSync(filePath);
        
        // Try sending HTML, CSS, JS as UTF-8 strings instead of base64
        const isTextFile = /\.(html?|css|js|jsx|ts|tsx|json|txt|md|svg)$/i.test(relativePath);
        
        if (isTextFile) {
          return {
            file: relativePath,
            data: fileContent.toString('utf-8')
          };
        } else {
          return {
            file: relativePath,
            data: fileContent.toString('base64')
          };
        }
      });
    
    console.log(`📦 Filtered to ${vercelFiles.length} files for deployment (excluding build config):`);
    vercelFiles.forEach(f => {
      const size = Buffer.from(f.data, 'base64').length;
      console.log(`  ✅ ${f.file} (${size} bytes)`);
    });
    
    // Deploy pure static files - the first deployment worked, the issue was content display
    // Let's investigate the base64 issue differently
    console.log('🚀 Deploying pure static files (no config files)');
    console.log('📦 Files to deploy:', vercelFiles.length);
    console.log('');
    
    // Choose a stable project name so subsequent publishes go to the same URL
    // Prefer the store domain (unique) and fall back to storeName
    const preferred = (domain || storeName || 'store');

    // Sanitize name for Vercel requirements
    // Project names must be lowercase, can include letters, digits, '.', '_', '-'
    const finalName = preferred
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/---+/g, '--')
      .substring(0, 100) || 'store';

    console.log(`📝 Using stable Vercel project name: "${finalName}"`);

    // Create deployment payload
    const deploymentPayload = {
      name: finalName,
      files: vercelFiles,
      target: 'production'
    };
    
    // Deploy to Vercel with skipAutoDetectionConfirmation to bypass framework detection
    console.log('☁️ Deploying to Vercel with auto-detection bypass...');
    const response = await axios.post(
      'https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1',
      deploymentPayload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 300000 // 5 minutes timeout
      }
    );
    
    const deployment = response.data;
    console.log(`✅ Deployment created with ID: ${deployment.id}`);
    
    // Wait for deployment to be ready
    const deploymentUrl = await waitForDeployment(deployment.id, finalName);
    
    console.log(`🌐 Site deployed successfully: https://${deploymentUrl}`);
    
    return {
      success: true,
      url: `https://${deploymentUrl}`,
      deploymentId: deployment.id,
      deploymentUrl
    };
    
  } catch (error) {
    console.error('❌ Vercel deployment failed:', error.message);
    
    if (error.response) {
      console.error('Vercel API Error:', error.response.data);
    }
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data || null
    };
  }
}

/**
 * Recursively gets all files in a directory
 * @param {string} dirPath - Directory path
 * @param {string[]} files - Array to collect file paths
 * @returns {string[]} - Array of file paths
 */
async function getAllFiles(dirPath, files = []) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      await getAllFiles(itemPath, files);
    } else {
      files.push(itemPath);
    }
  }
  
  return files;
}

/**
 * Waits for a Vercel deployment to be ready
 * @param {string} deploymentId - Vercel deployment ID
 * @returns {Promise<string>} - Deployment URL
 */
async function waitForDeployment(deploymentId, stableName, maxAttempts = 30) {
  console.log('⏳ Waiting for deployment to be ready...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get(
        `https://api.vercel.com/v13/deployments/${deploymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
          }
        }
      );
      
      const deployment = response.data;
      
      // Debug: Log the full response to understand the structure
      if (attempt === 1) {
        console.log('🔍 Deployment response structure:', {
          state: deployment.state,
          readyState: deployment.readyState,
          status: deployment.status,
          url: deployment.url,
          alias: deployment.alias
        });
      }
      
      // Check multiple possible state fields
      const state = deployment.state || deployment.readyState || deployment.status;
      
      if (state === 'READY' || state === 'ready') {
        // Prefer the stable alias when available, then fall back to project domain
        const finalUrl = deployment.alias?.[0] || `${stableName}.vercel.app` || deployment.url || `${deploymentId}.vercel.app`;
        console.log(`🎉 Deployment ready! URL: ${finalUrl}`);
        return finalUrl;
      } else if (state === 'ERROR' || state === 'error' || state === 'FAILED') {
        // Try to get more details about the error
        console.log('🔍 Full deployment object for error analysis:', JSON.stringify(deployment, null, 2));
        
        let errorDetails = 'Unknown build error';
        
        // Check for build errors
        if (deployment.builds && deployment.builds.length > 0) {
          console.log('🔍 Build information:', JSON.stringify(deployment.builds, null, 2));
          const failedBuild = deployment.builds.find(b => b.error);
          if (failedBuild) {
            errorDetails = failedBuild.error.message || failedBuild.error;
            console.log('❌ Build error details:', failedBuild.error);
          }
        }
        
        // Check for general error fields
        if (deployment.error) {
          console.log('❌ General error:', deployment.error);
          errorDetails = deployment.error.message || deployment.error;
        }
        
        throw new Error(`Deployment failed on Vercel: ${errorDetails}`);
      }
      
      console.log(`⏳ Deployment status: ${state || 'unknown'} (attempt ${attempt}/${maxAttempts})`);
      
      // For the first few attempts, wait less time
      const waitTime = attempt <= 5 ? 5000 : 10000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
    } catch (error) {
      console.log(`⚠️ Deployment check attempt ${attempt} failed:`, error.message);
      
      // If we're getting 404s, the deployment might not be queryable yet
      if (error.response?.status === 404 && attempt < 10) {
        console.log('   Deployment not found yet, waiting for it to become queryable...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }
      
      if (attempt === maxAttempts) {
        throw new Error(`Deployment check failed after ${maxAttempts} attempts: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  throw new Error('Deployment timed out - took longer than expected');
}

/**
 * Gets deployment status from Vercel
 * @param {string} deploymentId - Vercel deployment ID
 * @returns {Promise<Object>} - Deployment status
 */
async function getDeploymentStatus(deploymentId) {
  try {
    const response = await axios.get(
      `https://api.vercel.com/v13/deployments/${deploymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get deployment status: ${error.message}`);
  }
}

/**
 * Deletes a deployment from Vercel
 * @param {string} deploymentId - Vercel deployment ID
 * @returns {Promise<boolean>} - Success status
 */
async function deleteDeployment(deploymentId) {
  try {
    await axios.delete(
      `https://api.vercel.com/v13/deployments/${deploymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
        }
      }
    );
    
    return true;
  } catch (error) {
    console.error('Failed to delete deployment:', error.message);
    return false;
  }
}

module.exports = {
  deployToVercel,
  waitForDeployment,
  getDeploymentStatus,
  deleteDeployment
};