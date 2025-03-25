import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RecommendedProducts = () => {
  const [recommended, setRecommended] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/products/all")
      .then((response) => {
        setRecommended(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recommended products:", error);
      });
  }, []);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

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
  }

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

  return (
    <div className="container mx-auto p-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">Just For You</h2>
        <button className="px-4 py-2 bg-green-100  text-green-600 font-semibold rounded-md hover:bg-green-400 hover:text-white" onClick={() => navigate("/cart")}>
          Go to Cart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {recommended.length > 0 ? (
          recommended.map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden p-4">
              <div className="relative">
                <FaHeart
                  className={`absolute top-2 right-2 text-l cursor-pointer ${wishlist.some(item => item.id === product.id) ? 'text-black-500' : 'text-gray-400'}`}
                  onClick={() => handleWishlist(product)}
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
                <div className="flex items-center text-yellow-500 text-sm">
                  <span>{product.rating} ★</span>
                  <span className="ml-2 text-gray-500">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-gray-800">${product.price}</span>
                  <span className="text-sm text-red-500 font-semibold">{product.discountPercentage}% OFF</span>
                </div>
                <button className="w-full mt-3 bg-blue-50 text-blue-600  font-semibold py-2 rounded-md flex items-center justify-center hover:bg-blue-400 hover:text-white
  " onClick={() => addToCart(product)}>
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No recommendations available!</p>
        )}
      </div>
    </div>
  );
};

export default RecommendedProducts;