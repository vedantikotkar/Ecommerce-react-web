import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, ShoppingCart, Heart, Truck, RefreshCw, Package, Check } from "lucide-react";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const userId = "546a1fd0-214c-4877-ac15-c121f6d207f1";

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:4000/products/${productId}`)
      .then((response) => {
        if (response.data) {
          setProduct(response.data);
          setSelectedImage(response.data.imageUrl || (response.data.images && response.data.images[0]));
          setSelectedColor(response.data.colors && response.data.colors[0]);
          setSelectedSize(response.data.sizes && response.data.sizes[0]);
        } else {
          setError("Product not found");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setError("Failed to load product details. Please try again.");
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    if (!product || !product.category || !product.category.id) return;

    axios
      .get(`http://localhost:4000/products/category/${product.category.id}`)
      .then((res) => {
        setRelatedProducts(res.data.filter((item) => item.id !== product.id).slice(0, 5));
      })
      .catch((error) => console.error("Error fetching related products:", error));
  }, [product]);

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/address");
  };

  const handleWishlist = (product) => {
    let updatedWishlist = [...wishlist];
    const index = updatedWishlist.findIndex(item => item.id === product.id);

    if (index === -1) {
      updatedWishlist.push(product);
    } else {
      updatedWishlist.splice(index, 1);
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    axios.post(`http://localhost:4000/like/liked?userId=${userId}&productId=${product.id}`)
      .then(response => console.log("Like updated successfully:", response.data))
      .catch(error => console.error("Error updating like:", error));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        selectedColor,
        selectedSize,
        quantity
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={18} 
            fill={i < fullStars ? '#FFD700' : 'none'} 
            className={`${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-gray-600 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const [sizeIndex, setSizeIndex] = useState(0);
 
  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existingProduct = updatedCart.find((item) => 
      item.id === product.id && 
      item.selectedColor === selectedColor && 
      item.selectedSize === selectedSize
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      updatedCart.push({ 
        ...product, 
        selectedColor, 
        selectedSize,
        quantity 
      });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleImageHover = (zoomed) => {
    setImageZoomed(zoomed);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">Loading product details...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-red-500 text-lg">{error}</p>
      <button onClick={() => navigate(-1)} className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors">Go Back</button>
    </div>
  );

  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Breadcrumbs */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:text-indigo-500 cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-indigo-500 cursor-pointer">{product.category?.name || "Products"}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">{product.productName}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto p-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {/* Left Side - Images */}
            <div className="md:col-span-1 lg:col-span-1 p-4">
              <div className="sticky top-4">
                {/* Main Image */}
                <div 
                  className="relative bg-gray-50 rounded-lg overflow-hidden mb-4"
                  onMouseEnter={() => handleImageHover(true)}
                  onMouseLeave={() => handleImageHover(false)}
                >
                  <div className={`transition-transform duration-500 ${imageZoomed ? 'scale-110' : 'scale-100'}`}>
                    <img
                      src={selectedImage}
                      alt={product.productName}
                      className="w-full h-auto max-h-96 object-contain mx-auto"
                    />
                  </div>
                  <button 
                    className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md transition-all duration-300 ${isInWishlist(product.id) ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                    onClick={() => handleWishlist(product)}
                  >
                    <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Thumbnail Images */}
                <div className="grid grid-cols-5 gap-2">
                  {product.images?.slice(0, 5).map((img, index) => (
                    <div 
                      key={index} 
                      className={`border-2 rounded-md overflow-hidden cursor-pointer ${selectedImage === img ? 'border-indigo-500 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={img}
                        alt={`${product.productName} view ${index + 1}`}
                        className="w-full h-16 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="md:col-span-1 lg:col-span-2 p-6 md:p-8 border-l border-gray-100">
              {/* Product Title and Badges */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{product.productName}</h1>
                  <div className="flex items-center">
                    <span className="text-indigo-600 font-medium mr-4">{product.brand}</span>
                    <div className="flex items-center">
                      {renderRating(product.rating || 4.5)}
                      <span className="ml-2 text-gray-500 text-sm">({product.reviews || 120} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 text-green-600 text-sm font-medium px-3 py-1 rounded-full">In Stock</div>
              </div>

              {/* Price */}
              <div className="flex items-end space-x-3 mb-6 mt-4">
                <div className="text-3xl font-bold text-gray-800">${parseFloat(product.price).toFixed(2)}</div>
                {product.originalPrice && (
                  <>
                    <div className="text-lg text-gray-500 line-through">${parseFloat(product.originalPrice).toFixed(2)}</div>
                    <div className="bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </div>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-6"></div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Color</h3>
                    <span className="text-indigo-600 text-sm font-medium">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-indigo-500 transform scale-110' : 'ring-1 ring-gray-200 hover:ring-gray-300'}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        <div 
                          className="w-10 h-10 rounded-full" 
                          style={{ backgroundColor: color }}
                        >
                          {selectedColor === color && (
                            <div className="flex items-center justify-center h-full">
                              <Check size={16} className="text-white drop-shadow-sm" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Size</h3>
                    <span className="text-indigo-600 text-sm font-medium">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        className={`min-w-14 h-12 px-4 py-2 flex items-center justify-center rounded-md transition-all duration-200 text-sm font-medium ${
                          selectedSize === size 
                            ? 'bg-indigo-500 text-white border-none ring-2 ring-indigo-300' 
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Quantity</h3>
                <div className="flex items-center">
                  <button
                    className="w-12 h-12 rounded-l-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 text-xl font-medium transition-colors duration-200"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <div className="h-12 w-16 flex items-center justify-center text-center border-t border-b border-gray-200 text-gray-800 font-medium text-lg">
                    {quantity}
                  </div>
                  <button
                    className="w-12 h-12 rounded-r-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 text-xl font-medium transition-colors duration-200"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                  
                  <div className="ml-4 text-sm text-gray-500">
                    {product.stock > 10 
                      ? <span className="text-green-600">In Stock</span>
                      : <span className="text-orange-500">Only {product.stock || 8} left</span>
                    }
                  </div>
                </div>
              </div>

                {/* Size Selector */}
          <div className="flex flex-col items-start mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Size</h3>
            <div className="flex items-center bg-gray-100 rounded-lg shadow-md">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-l-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setSizeIndex(Math.max(0, sizeIndex - 1))}
                disabled={sizeIndex <= 0}
              >
                -
              </button>
              <span className="text-center w-20 text-lg font-medium bg-white border-t border-b border-gray-300 px-4 py-2">
                {sizes[sizeIndex]}
              </span>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-r-lg transition duration-200"
                onClick={() => setSizeIndex(Math.min(sizes.length - 1, sizeIndex + 1))}
              >
                +
              </button>
            </div>
          </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6 mt-8">
                <button
                  className="md:col-span-3 h-14 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center relative overflow-hidden"
                  onClick={handleAddToCart}
                >
                  <div className={`flex items-center justify-center w-full h-full absolute transition-transform duration-300 ${addedToCart ? '-translate-y-full' : 'translate-y-0'}`}>
                    <ShoppingCart size={20} className="mr-2" /> Add to Cart
                  </div>
                  <div className={`flex items-center justify-center w-full h-full absolute transition-transform duration-300 ${addedToCart ? 'translate-y-0' : 'translate-y-full'}`}>
                    <Check size={20} className="mr-2" /> Added to Cart
                  </div>
                </button>
                <button
                  className="md:col-span-3 h-14 bg-black hover:bg-gray-900 text-white text-base font-semibold rounded-lg transition-colors duration-200"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Free Delivery</p>
                    <p className="text-gray-500 text-sm">Free shipping on orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">30-Day Returns</p>
                    <p className="text-gray-500 text-sm">Hassle-free return policy</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Secure Packaging</p>
                    <p className="text-gray-500 text-sm">Your products will be packed safely</p>
                  </div>
                </div>
              </div>

              {/* Postal Code Check */}
              <div className="mt-6">
                <p className="font-medium text-gray-700 mb-2">Check Delivery Availability</p>
                <div className="flex">
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Enter Postal Code"
                    className="border border-gray-300 rounded-l-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  />
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-r-lg transition-colors duration-200">
                    Check
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs: Description, Features, Reviews */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-4 font-medium text-base transition-colors duration-200 ${activeTab === "description" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600 hover:text-indigo-500"}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`px-6 py-4 font-medium text-base transition-colors duration-200 ${activeTab === "features" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600 hover:text-indigo-500"}`}
              onClick={() => setActiveTab("features")}
            >
              Features
            </button>
            <button
              className={`px-6 py-4 font-medium text-base transition-colors duration-200 ${activeTab === "reviews" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600 hover:text-indigo-500"}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({product.reviews || 120})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "description" && (
              <div className="prose max-w-none text-gray-700">
                <p>{product.description || "This premium product combines style, comfort, and durability. Designed with the modern consumer in mind, it features high-quality materials and expert craftsmanship. Whether you're using it for work, play, or everyday life, this product is built to exceed your expectations and provide lasting satisfaction."}</p>
                {/* Additional description content can go here */}
                <p className="mt-4">Our products are made with sustainable practices and materials that are better for the environment. We're committed to reducing our carbon footprint while still delivering exceptional quality to our customers.</p>
              </div>
            )}

            {activeTab === "features" && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Product Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  {(product.features || [
                    "Premium quality materials",
                    "Ergonomic design for comfort",
                    "Durable construction",
                    "Water-resistant finish",
                    "Easy to clean",
                    "Lightweight yet sturdy",
                    "Available in multiple colors",
                    "Sustainable manufacturing"
                  ]).map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="text-indigo-500 mr-2 mt-1">
                        <Check size={16} />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <div className="text-4xl font-bold text-gray-800">{product.rating?.toFixed(1) || "4.7"}</div>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-400" fill={i < Math.floor(product.rating || 4.7) ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Based on {product.reviews || 120} reviews</div>
                  </div>
                  
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center mb-1">
                        <div className="text-sm text-gray-600 w-6">{star}</div>
                        <Star size={14} className="text-yellow-400 mr-2" fill="currentColor" />
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${(star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 ml-2">{star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Placeholder for review comments */}
                <div className="space-y-4 mt-6">
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-800">Sarah J.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Verified Purchase</p>
                    <p className="text-gray-700">Absolutely love this product! The quality is exceptional and it looks even better in person. Would definitely recommend.</p>
                  </div>

                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-800">Michael T.</span>
                      <div className="flex">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />
                        ))}
                        <Star size={14} className="text-yellow-400" fill="none" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Verified Purchase</p>
                    <p className="text-gray-700">Good product overall, but could use some minor improvements. Shipping was fast and customer service was helpful when I had questions.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">You May Also Like</h2>
              <button className="text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.productName}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <button
                      className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm transition-colors duration-200 ${
                        isInWishlist(relatedProduct.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlist(relatedProduct);
                      }}
                    >
                      <Heart size={16} fill={isInWishlist(relatedProduct.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{relatedProduct.productName}</h3>
                    <div className="flex items-center text-yellow-400 text-sm mb-2">
                      <Star size={14} fill="currentColor" />
                      <span className="ml-1 text-gray-600">{relatedProduct.rating || 4.5}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <span className="font-bold text-gray-800">${relatedProduct.price}</span>
                        {relatedProduct.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">${relatedProduct.originalPrice}</span>
                        )}
                      </div>
                      <button
                        className="w-10 h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(relatedProduct);
                        }}
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}