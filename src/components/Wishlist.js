import React, { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
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
      await axios.delete(`http://localhost:4000/wishlist/remove/${productId}`);
      setWishlist(wishlist.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const addToCart = async (product) => {
    try {
      await axios.post("http://localhost:4000/cart-products/add", {
        userId: "546a1fd0-214c-4877-ac15-c121f6d207f1",
        productId: product.id,
        quantity: 1,
      });

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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Wishlist ({wishlist.length})</h2>

      {loading ? (
        <p className="text-lg text-gray-600">Loading wishlist...</p>
      ) : error ? (
        <p className="text-lg text-red-500">{error}</p>
      ) : wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white border p-4 rounded-lg shadow-lg relative flex flex-col items-center"
            >
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                onClick={() => removeFromWishlist(product.id)}
              >
                <FaTrash size={18} />
              </button>
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-40 object-cover rounded-md cursor-pointer hover:opacity-80"
                onClick={() => navigate(`/productdetail/${product.id}`)}
              />
              <h3 className="text-lg font-semibold mt-2">{product.productName}</h3>
              <span className="text-sm text-gray-500">
                {product.rating} ★ ({product.reviewCount} reviews)
              </span>
              <div className="text-lg font-bold mt-2">
                ${product.price} <span className="text-red-500">{product.discountPercentage}% OFF</span>
              </div>
              <button
                className="mt-3 bg-black text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 w-full hover:bg-gray-800"
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">Your wishlist is empty!</p>
      )}
    </div>
  );
};

export default Wishlist;
