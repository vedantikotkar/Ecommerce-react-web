import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/products/all")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching all products:", error);
      });
  }, []);

  const handleWishlist = (product) => {
    let updatedWishlist = [...wishlist];
    const index = updatedWishlist.findIndex((item) => item.id === product.id);

    if (index === -1) {
      updatedWishlist.push(product);
    } else {
      updatedWishlist.splice(index, 1);
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="relative bg-white shadow-lg rounded-lg overflow-hidden p-4 hover:shadow-xl transition"
            >
              <div className="absolute top-3 right-3">
                <FaHeart
                  className={`text-xl cursor-pointer transition-colors ${wishlist.some(item => item.id === product.id) ? 'text-red-500' : 'text-gray-400'}`}
                  onClick={() => handleWishlist(product)}
                />
              </div>
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-48 object-cover cursor-pointer rounded"
                onClick={() => navigate(`/productdetail/${product.id}`)}
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{product.productName}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className="text-yellow-500 font-bold">{product.rating} ★</span>
                  <span className="ml-2">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold text-gray-900">${product.price}</span>
                  <span className="text-sm text-red-500 font-semibold">{product.discountPercentage}% OFF</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No products available!</p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;