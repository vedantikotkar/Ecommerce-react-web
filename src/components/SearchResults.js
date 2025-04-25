import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

const SearchResults = () => {
  const location = useLocation();
  const { products } = location.state || { products: [] };

  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState("123"); // Replace with real user ID logic

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const handleLikeUnlike = async (product) => {
    const isLiked = wishlist.some((item) => item.id === product.id);
    try {
      if (isLiked) {
        await axios.delete(
          `http://localhost:4000/like/unlike?userId=${userId}&productId=${product.id}`
        );
      } else {
        await axios.post(
          `http://localhost:4000/like/liked?userId=${userId}&productId=${product.id}`
        );
      }

      const updatedWishlist = isLiked
        ? wishlist.filter((item) => item.id !== product.id)
        : [...wishlist, product];

      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Search Results</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
              
              
              <FaHeart
                className={`absolute top-2 right-2 text-sm cursor-pointer z-10 ${
                  wishlist.some((item) => item.id === product.id)
                    ? "text-black-500"
                    : "text-gray-400"
                }`}
                onClick={() => handleLikeUnlike(product)}
              />

              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-48 object-contain bg-gray-200"
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900">{product.productName}</h3>
                <div className="flex items-center text-yellow-500 text-sm">
                  <span>{product.rating} ★</span>
                  <span className="ml-2 text-gray-500">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-gray-600">${product.price}</span>
                  <span className="text-red-600 font-semibold px-2 py-1 text-sm font-bold rounded">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">No products found for your search.</p>
      )}
    </div>
  );
};

export default SearchResults;
