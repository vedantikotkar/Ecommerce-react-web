import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { FaHeart, FaCheckCircle } from "react-icons/fa";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]); // Added missing cart state
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = "546a1fd0-214c-4877-ac15-c121f6d207f1";

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);

    // Initialize cart from localStorage
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
        setRelatedProducts(res.data.filter((item) => item.id !== product.id).slice(0, 4));
      })
      .catch((error) => console.error("Error fetching related products:", error));
  }, [product]);

  const handleBuyNow = () => {
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
          <span key={i} className={`text-yellow-500 ${i < fullStars ? 'filled' : (i === fullStars && hasHalfStar ? 'half' : '')}`}>
            <Star size={18} />
          </span>
        ))}
      </div>
    );
  };
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const [sizeIndex, setSizeIndex] = useState(0);
  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existingProduct = updatedCart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.productName} added to cart!`);
  };

  // const handleImageChange = (index) => {
  //   if (product?.images) {
  //     setSelectedImage(product.images[index]);
  //   }
  // };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      <p className="mt-4 text-lg font-medium">Loading product details...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-red-500 text-lg">{error}</p>
      <button onClick={() => navigate(-1)} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">Go Back</button>
    </div>
  );

  if (!product) return null;

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{product.productName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Left Side - Thumbnails */}
        <div className="flex flex-col space-y-3">
          {product.images?.slice(0, 4).map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                alt={`${product.name} view ${index + 1}`}
                className={`w-34 h-34 object-cover cursor-pointer rounded-lg transition-all duration-300 ${selectedImage === img ? "border-2 border-black-500 shadow-md" : "border border-gray-200 opacity-75 hover:opacity-100"}`}
                onClick={() => setSelectedImage(img)}
              />
            </div>
          ))}
        </div>

        {/* Middle - Main Image */}
        <div className="relative flex items-center justify-center bg-white-50 rounded-lg p-4 ">
          <img
            src={selectedImage}
            alt={product.productName}
            className="w-full h-auto max-h-126 object-contain transition-all duration-500"
          />
        </div>

        {/* Right Side - Product Details */}
        <div className="flex flex-col relative flex items-center justify-center bg-gradient-to-r from-white-100 to-gray-200 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{product.productName}</h1>
            <div className="text-gray-600 font-medium">{product.brand}</div>
          </div>

          <div className="flex items-center mb-4">
            {renderRating(product.rating)}
            <span className="ml-2 text-gray-500">({product.reviews} reviews)</span>
          </div>

          <div className="mb-6 bg-gray-50 p-3 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">${parseFloat(product.price).toFixed(2)}</p>
            {product.originalPrice && (
              <div className="flex items-center mt-1">
                <p className="line-through text-gray-500 mr-2">${parseFloat(product.originalPrice).toFixed(2)}</p>
                <p className="text-red-500 font-medium bg-red-50 px-2 py-1 rounded-md">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </p>
              </div>
            )}
          </div>

          {product.description && (
            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Colors</h3>
              <div className="flex space-x-3">
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 rounded-full cursor-pointer transition-transform duration-200 ${selectedColor === color ? 'border-2 border-blue-500 transform scale-110' : 'border border-gray-300'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-md px-4 py-2 cursor-pointer transition-colors duration-200 ${selectedSize === size ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex flex-col items-start mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quantity</h3>
            <div className="flex items-center bg-gray-100 rounded-lg shadow-md">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-l-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-center w-14 text-lg font-medium bg-white border-t border-b border-gray-300 px-4 py-2">
                {quantity}
              </span>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-r-lg transition duration-200"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
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
          <div className="flex space-x-3 mb-6">
            <button
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} className="mr-2" /> Add to Cart
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex-1"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            <button
              className={`flex items-center justify-center p-3 rounded-lg transition-colors ${isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              onClick={() => handleWishlist(product)}
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="mt-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FaCheckCircle className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Free Delivery</p>
                <p className="text-gray-500 text-sm">Orders over $50</p>
              </div>
            </div>

            <div className="flex items-center mb-3">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <FaCheckCircle className="text-green-500" />
              </div>
              <div>
                <p className="font-medium">30-Day Return Policy</p>
                <p className="text-gray-500 text-sm">Hassle-free returns</p>
              </div>
            </div>

            <div className="mt-3 border-t border-gray-200 pt-3">
              <p className="font-semibold mb-2">Check Delivery Availability</p>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Enter Postal Code"
                  className="border p-2 rounded-l-md w-2/3"
                />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition-colors">Check</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Features/Specs */}
      {product.features && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <div className="text-blue-500 mr-2">•</div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">You May Also Like</h2>
            <button className="text-emerald-500 hover:text-emerald-600 font-medium">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div className="relative group">


                  <FaHeart
                    className={`absolute top-2 right-2 text-xl cursor-pointer ${wishlist.some(item => item.id === product.id) ? 'text-red-500' : 'text-gray-400'}`}
                    onClick={() => handleWishlist(product)}
                  />
                  <img
                    src={relatedProduct.imageUrl}
                    alt={relatedProduct.productName}
                    className="w-full h-56 object-cover rounded-t-lg"
                  />
                </div>

                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{relatedProduct.productName}</h3>
                  <div className="flex items-center text-yellow-500 text-sm">
                    <span>{product.rating} ★</span>
                    <span className="ml-2 text-gray-500">({product.reviewCount} reviews)</span>
                  </div>
                  {/* Price & Discount */}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-gray-800">${relatedProduct.price}</span>
                    {relatedProduct.discountPercentage && (
                      <span className="text-sm text-red-500 font-bold">{relatedProduct.discountPercentage}% OFF</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="w-full mt-3 bg-blue-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when clicking the button
                      addToCart(relatedProduct);
                    }}
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}