import { useState, useEffect } from "react"; // Import useEffect
import { useNavigate, useSearchParams } from "react-router-dom";
import { productAPI } from "../utils/api";

const AddProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId") || "";

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    // Change images to store objects with file and preview URL
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clean up Blob URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      form.images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [form.images]);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const selectedFiles = Array.from(files || []);
      const newImages = selectedFiles.map((file) => ({
        file: file, // Store the actual file object
        name: file.name, // Keep the name
        preview: URL.createObjectURL(file), // Create a temporary URL for preview
      }));
      setForm((f) => ({ ...f, images: newImages }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!storeId) {
      setError("Missing storeId");
      return;
    }
    try {
      setLoading(true);
      // You'll likely need to send the actual files to your API,
      // often using FormData. For this MVP, we're still just sending names
      // but in a real app, 'form.images' would contain the File objects
      // which you'd append to FormData.
      await productAPI.create({
        storeId,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        // For the API, we still send just the names as per your original logic
        // In a real scenario, you would upload the 'file' objects using FormData.
        images: form.images.map((img) => img.name),
      });
      navigate(`/dashboard/products?storeId=${storeId}`);
    } catch (e) {
      setError(e.message || "Create failed");
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
            onChange={onChange}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            MVP: stores file names only (for API); previews selected images
            below.
          </p>

          {/* Image Previews */}
          {form.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {form.images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 border rounded overflow-hidden"
                >
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center truncate px-1 py-0.5">
                    {image.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
