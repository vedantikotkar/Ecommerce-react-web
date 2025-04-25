import React, { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:4000/like/");
        const likedProducts = response.data;

        const productDetails = await Promise.all(
          likedProducts.map(async (product) => {
            const productResponse = await axios.get(
              `http://localhost:4000/products/${product.productId}`
            );
            return productResponse.data;
          })
        );

        setWishlist(productDetails);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/like/remove/product/${productId}`);
      setWishlist(wishlist.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const addToCart = async (product) => {
    try {
      await axios.post(
        `http://localhost:4000/cart-products/add?userId=546a1fd0-214c-4877-ac15-c121f6d207f1&productId=${product.id}`
      );
  
      toast.success(`${product.productName} added to cart!`, {
        position: "top-right",
        autoClose: 3000,
      });
  
      await removeFromWishlist(product.id);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart.");
    }
  };
  

  return (
    <div className="container mx-auto p-10">
      <ToastContainer />
      
      {/* Wishlist Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">Your Wishlist</h2>
        <button
          className="px-4 py-2 bg-green-100 text-green-600 font-semibold rounded-md "
          onClick={() => navigate("/cart")}
        >
          Go to Cart
        </button>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">Loading wishlist...</p>
        ) : error ? (
          <p className="col-span-full text-center text-red-500">{error}</p>
        ) : wishlist.length > 0 ? (
          wishlist.map((product,index) => (
            <div key={`${product.id}-${index}`} className="bg-white shadow-md rounded-lg overflow-hidden p-4">
              <div className="relative">
                <FaTrash
                  className="absolute top-2 right-2 text-sm text-gray-500 hover:text-red-500 cursor-pointer"
                  onClick={() => removeFromWishlist(product.id)}
                />
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-full h-40 object-contain cursor-pointer"
                  onClick={() => navigate(`/productdetail/${product.id}`)}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold">{product.productName}</h3>
                <div className="flex items-center  font-semibold text-yellow-500 text-sm">
                  <span>{product.rating} ★</span>
                  <span className="ml-2 text-gray-500 ">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-gray-800">${product.price}</span>
                  <span className="text-sm text-red-500 font-semibold">{product.discountPercentage}% OFF</span>
                </div>
                <button
                  className="w-full mt-3 bg-blue-50 text-blue-600  font-semibold py-2 rounded-md flex items-center justify-center hover:bg-blue-400 hover:text-white"
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Your wishlist is empty!</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
