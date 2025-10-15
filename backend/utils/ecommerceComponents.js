const ECOMMERCE_COMPONENT_TEMPLATES = {
  productDetail: {
    prompt: `Generate a modern product detail page component with Tailwind CSS. Requirements:
- Full-screen product gallery with zoom functionality
- Product information with variants (size, color)
- Add to cart and buy now buttons
- Quantity selector and variant picker
- Reviews and ratings section
- Related products slider
- Professional mobile-responsive design
- Modern UI with animations and hover effects`,

    example: `import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Minus, Plus, Share2, Truck, Shield, RotateCcw } from 'lucide-react';

const ProductDetail = ({ product = {} }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '#000000');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const images = product.images || [product.image] || [];
  const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const colors = product.colors || ['#000000', '#8B4513', '#000080'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-3xl bg-gray-100 aspect-square">
            <img 
              src={images[selectedImage] || product.image || 'https://via.placeholder.com/600x600'} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            
            {/* Badges */}
            {product.badge && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                {product.badge}
              </div>
            )}
            
            {/* Wishlist Button */}
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={\`absolute top-4 right-4 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 \${
                isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
              }\`}
            >
              <Heart className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={\`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 \${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'
                  }\`}
                >
                  <img src={image} alt={\`Product view \${index + 1}\`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-8">
          {/* Rating and Reviews */}
          <div className="flex items-center gap-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={\`w-5 h-5 \${i < (product.rating || 5) ? 'fill-current' : ''}\`} />
              ))}
            </div>
            <span className="text-gray-600">({product.reviews || 0} reviews)</span>
            <button className="text-blue-500 hover:underline">Write a review</button>
          </div>

          {/* Product Title and Price */}
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              {product.name || 'Product Name'}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-gray-900">
                {product.price || '$99'}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                  Save {Math.round((1 - parseFloat(product.price?.replace('$', '')) / parseFloat(product.originalPrice?.replace('$', ''))) * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {product.description || 'Premium quality product with exceptional features and design.'}
          </p>

          {/* Color Selection */}
          <div>
            <h3 className="text-lg font-bold mb-4">Color: <span className="font-normal">Selected</span></h3>
            <div className="flex gap-3">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={\`w-12 h-12 rounded-full border-4 transition-all duration-200 \${
                    selectedColor === color ? 'border-gray-900 scale-110' : 'border-gray-300 hover:border-gray-500'
                  }\`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Size: <span className="font-normal">{selectedSize}</span></h3>
              <button className="text-blue-500 hover:underline text-sm">Size Guide</button>
            </div>
            
            <div className="flex gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={\`px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 \${
                    selectedSize === size 
                      ? 'border-gray-900 bg-gray-900 text-white' 
                      : 'border-gray-300 hover:border-gray-500'
                  }\`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">Quantity:</span>
              <div className="flex items-center border-2 border-gray-300 rounded-xl">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 font-bold min-w-[60px] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3">
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
              
              <button className="flex-1 bg-gray-900 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
                Buy Now
              </button>
            </div>

            {/* Share Button */}
            <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5" />
              Share this product
            </button>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Truck className="w-8 h-8 text-blue-500" />
              <div>
                <div className="font-bold text-sm">Free Shipping</div>
                <div className="text-xs text-gray-500">On orders over $50</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <div className="font-bold text-sm">Secure Payment</div>
                <div className="text-xs text-gray-500">SSL encrypted</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <RotateCcw className="w-8 h-8 text-purple-500" />
              <div>
                <div className="font-bold text-sm">Easy Returns</div>
                <div className="text-xs text-gray-500">30-day return policy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;`
  },

  shoppingCart: {
    prompt: `Generate a modern shopping cart component with Tailwind CSS. Requirements:
- Sliding cart drawer/modal interface
- Product list with images, quantities, and prices
- Quantity update controls
- Remove item functionality
- Subtotal, tax, and total calculations
- Checkout button and continue shopping
- Empty cart state with call-to-action
- Responsive design with smooth animations`,

    example: `
import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const ShoppingCart = ({ 
  isOpen = false, 
  onClose = () => {}, 
  items = [],
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onCheckout = () => {}
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + tax + shipping;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-black">Shopping Cart</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-8">Add some products to get started</p>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                  {/* Product Image */}
                  <img 
                    src={item.image || 'https://via.placeholder.com/80x80'} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1 space-y-2">
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    
                    {/* Variants */}
                    {(item.size || item.color) && (
                      <div className="flex gap-4 text-sm text-gray-600">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && (
                          <div className="flex items-center gap-1">
                            <span>Color:</span>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-gray-900">
                        \${(item.price * item.quantity).toFixed(2)}
                      </span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-bold min-w-[50px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>\${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>\${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : \`\$\${shipping.toFixed(2)}\`}</span>
              </div>
              
              {shipping > 0 && (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  Add \${(50 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}
              
              <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>\${total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Checkout Button */}
            <button 
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              Proceed to Checkout
              <ArrowRight className="w-6 h-6" />
            </button>
            
            {/* Continue Shopping */}
            <button 
              onClick={onClose}
              className="w-full py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;`
  },

  checkout: {
    prompt: `Generate a modern checkout flow component with Tailwind CSS. Requirements:
- Multi-step checkout process (shipping, payment, review)
- Form validation and error handling
- Payment method selection
- Order summary sidebar
- Address form with validation
- Progress indicator
- Mobile-responsive design
- Modern UI with smooth transitions`,

    example: `
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CreditCard, Shield, Truck, Check } from 'lucide-react';

const Checkout = ({ 
  cartItems = [], 
  onOrderComplete = () => {},
  onBack = () => {} 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: ''
  });

  const steps = [
    { id: 'shipping', title: 'Shipping', description: 'Enter your shipping information' },
    { id: 'payment', title: 'Payment', description: 'Choose your payment method' },
    { id: 'review', title: 'Review', description: 'Review your order' }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOrderComplete(formData);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={\`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 \${
                  index <= currentStep 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }\`}>
                  {index < currentStep ? <Check className="w-6 h-6" /> : index + 1}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={\`w-20 md:w-32 h-0.5 mx-4 transition-colors duration-300 \${
                    index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }\`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-black text-gray-900">{steps[currentStep].title}</h2>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-8">
              
              {/* Shipping Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      
                      <input
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      
                      <input
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="md:col-span-2 p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                    
                    {/* Payment Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={() => handleInputChange('paymentMethod', 'card')}
                        className={\`p-4 border-2 rounded-xl flex items-center gap-3 transition-all duration-200 \${
                          formData.paymentMethod === 'card' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-blue-300'
                        }\`}
                      >
                        <CreditCard className="w-6 h-6 text-blue-500" />
                        <span className="font-medium">Credit Card</span>
                      </button>
                      
                      <button
                        onClick={() => handleInputChange('paymentMethod', 'paypal')}
                        className={\`p-4 border-2 rounded-xl flex items-center gap-3 transition-all duration-200 \${
                          formData.paymentMethod === 'paypal' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-blue-300'
                        }\`}
                      >
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">P</div>
                        <span className="font-medium">PayPal</span>
                      </button>
                    </div>
                    
                    {/* Card Details */}
                    {formData.paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Card number"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        
                        <div className="grid grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                            className="p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                          />
                          
                          <input
                            type="text"
                            placeholder="CVC"
                            value={formData.cardCvc}
                            onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                            className="p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                          />
                          
                          <input
                            type="text"
                            placeholder="Cardholder name"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange('cardName', e.target.value)}
                            className="p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Security Notice */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <Shield className="w-6 h-6 text-green-500" />
                    <div className="text-sm">
                      <div className="font-medium text-green-800">Secure Payment</div>
                      <div className="text-green-600">Your payment information is encrypted and secure.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Review */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    
                    {/* Items */}
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold">{item.name}</h4>
                            <div className="text-sm text-gray-600">
                              Qty: {item.quantity} × \${item.price}
                            </div>
                          </div>
                          <div className="font-bold">
                            \${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Shipping & Payment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-600">
                        <div>{formData.firstName} {formData.lastName}</div>
                        <div>{formData.address}</div>
                        <div>{formData.city}, {formData.state} {formData.zipCode}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-2">Payment Method</h4>
                      <div className="text-sm text-gray-600">
                        {formData.paymentMethod === 'card' ? 'Credit Card' : 'PayPal'}
                        {formData.paymentMethod === 'card' && formData.cardNumber && (
                          <div>**** **** **** {formData.cardNumber.slice(-4)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  {currentStep === 0 ? 'Back to Cart' : 'Previous'}
                </button>
                
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {currentStep === steps.length - 1 ? 'Complete Order' : 'Continue'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-3xl shadow-lg p-8 h-fit">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-bold">
                    \${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>\${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>\${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : \`\$\${shipping.toFixed(2)}\`}</span>
              </div>
              
              <div className="flex justify-between text-xl font-black border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>\${total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Free Shipping Notice */}
            {shipping > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <Truck className="w-4 h-4" />
                  <span>Add \${(50 - subtotal).toFixed(2)} more for free shipping!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;`
  }
};

module.exports = { ECOMMERCE_COMPONENT_TEMPLATES };