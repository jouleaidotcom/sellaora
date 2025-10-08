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
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={onFileChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled={uploading || loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload product images (JPEG, PNG, WebP, GIF). Max 10MB per file, up to 10 files.
          </p>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading images...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Selected Files (Ready to Upload)</h4>
              <div className="grid grid-cols-3 gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="w-24 h-24 border rounded overflow-hidden">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index, false)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                    <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                    <p className="text-xs text-center text-gray-500">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 text-green-600">✓ Uploaded Images</h4>
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="w-24 h-24 border-2 border-green-200 rounded overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.originalName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index, true)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                    <p className="text-xs text-center mt-1 truncate">{image.originalName}</p>
                    <p className="text-xs text-center text-green-600">Uploaded ✓</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            disabled={loading || uploading}
          >
            Cancel
          </button>
        </div>
        
        {/* Summary */}
        {(selectedFiles.length > 0 || uploadedImages.length > 0) && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <strong>Images Summary:</strong>
            {uploadedImages.length > 0 && <span className="text-green-600 ml-2">{uploadedImages.length} uploaded</span>}
            {selectedFiles.length > 0 && <span className="text-blue-600 ml-2">{selectedFiles.length} ready to upload</span>}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProduct;
