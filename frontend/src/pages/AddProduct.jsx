import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productAPI, uploadAPI } from "../utils/api";

const AddProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId") || "";

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]); // Store selected files for preview
  const [uploadedImages, setUploadedImages] = useState([]); // Store uploaded Cloudinary images
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Clean up Blob URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const invalidFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return !isValidType || !isValidSize;
    });
    
    if (invalidFiles.length > 0) {
      setError('Some files are invalid. Only JPEG, PNG, WebP, and GIF files under 10MB are allowed.');
      return;
    }
    
    // Create preview URLs and store files
    const filesWithPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    
    setSelectedFiles(filesWithPreviews);
    setError(''); // Clear any previous errors
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const filesToUpload = selectedFiles.map(f => f.file);
      const response = await uploadAPI.uploadImages(filesToUpload);
      
      setUploadProgress(100);
      const images = response.data.images;
      setUploadedImages(images);
      return images;
      
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index, isUploaded = false) => {
    if (isUploaded) {
      // Remove from uploaded images
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from selected files and clean up preview URL
      setSelectedFiles(prev => {
        const fileToRemove = prev[index];
        if (fileToRemove.preview) {
          URL.revokeObjectURL(fileToRemove.preview);
        }
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!storeId) {
      setError("Missing storeId");
      return;
    }
    
    // Basic validation
    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }
    
    if (!form.price || Number(form.price) < 0) {
      setError("Valid price is required");
      return;
    }
    
    if (form.stock === '' || Number(form.stock) < 0) {
      setError("Valid stock quantity is required");
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload images first if any are selected
      let imagesToSave = uploadedImages; // Use already uploaded images
      
      if (selectedFiles.length > 0) {
        // Upload new images
        const newlyUploadedImages = await uploadImages();
        imagesToSave = [...uploadedImages, ...newlyUploadedImages];
      }
      
      // Create product with uploaded image data
      await productAPI.create({
        storeId,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        images: imagesToSave // Send full image objects with URLs and metadata
      });
      
      navigate(`/dashboard/products?storeId=${storeId}`);
      
    } catch (error) {
      console.error('Product creation error:', error);
      setError(error.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="h-12 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/dashboard/products?storeId=${storeId}`)} className="text-neutral-400 hover:text-white">←</button>
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">+</div>
          <div className="text-sm font-semibold">Add Product</div>
        </div>
      </div>
      <main className="max-w-3xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-1 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Create New Product</h1>
          <p className="text-neutral-500 text-sm font-medium">Add a new product to your store</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-300">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Brief description of your product"
              rows={4}
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-neutral-300">Price</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={onChange}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-neutral-300">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={onChange}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-neutral-300">Product Images</label>
            <div className="relative">
              <input
                type="file"
                name="images"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={onFileChange}
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 file:cursor-pointer"
                disabled={uploading || loading}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Upload product images (JPEG, PNG, WebP, GIF). Max 10MB per file, up to 10 files.
            </p>
            {uploading && (
              <div className="mt-4 p-4 bg-neutral-900/70 border border-neutral-800 rounded-lg">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-neutral-300 font-medium">Uploading images...</span>
                  <span className="text-emerald-400 font-semibold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-3 text-neutral-300">Selected Files (Ready to Upload)</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full aspect-square border-2 border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index, false)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all"
                      >
                        ×
                      </button>
                      <p className="text-xs text-center mt-2 truncate text-neutral-400">{file.name}</p>
                      <p className="text-xs text-center text-neutral-500">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-3 text-emerald-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Uploaded Images
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full aspect-square border-2 border-emerald-700/50 rounded-lg overflow-hidden bg-emerald-600/10">
                        <img
                          src={image.url}
                          alt={image.originalName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index, true)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all"
                      >
                        ×
                      </button>
                      <p className="text-xs text-center mt-2 truncate text-neutral-400">{image.originalName}</p>
                      <p className="text-xs text-center text-emerald-500 font-medium">Uploaded ✓</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Creating Product..." : uploading ? "Uploading..." : "Create Product"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(`/dashboard/products?storeId=${storeId}`)}
              className="px-6 py-2.5 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 border border-neutral-700 text-sm font-semibold transition-all"
              disabled={loading || uploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
