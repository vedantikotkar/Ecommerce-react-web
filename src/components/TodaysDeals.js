import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TodaysDeals = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [startIndex] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const userId = 1;

  useEffect(() => {
    axios.get("http://localhost:4000/products/all")
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching deals:", error));
  }, []);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 24);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });

      if (difference <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
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

    axios.post(`http://localhost:4000/like/liked?userId=${userId}&productId=${product.id}`)
      .then(response => console.log("Like updated successfully:", response.data))
      .catch(error => console.error("Error updating like:", error));
  };

  
  return (
    <div className="max-w-12xl mx-auto p-12 bg-white  rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Today's Deals</h2>

      <div className="flex justify-center items-center text-lg font-semibold text-red-600">
        {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
        {products.length > 0 ? (
          products.slice(startIndex, startIndex + itemsPerPage).map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition">
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-full h-40 object-contain cursor-pointer"
                  onClick={() => navigate(`/productdetail/${product.id}`)}
                />
                <FaHeart 
                  className={`absolute top-2 right-2 text-l cursor-pointer transition ${
                    wishlist.some(item => item.id === product.id) ? 'text-black-500' : 'text-gray-400'
                  }`}
                  onClick={() => handleWishlist(product)}
                />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-sm font-semibold">{product.productName}</h3>
                <div className="text-yellow-500  text-sm font-semibold flex justify-center items-center gap-1">
                  <span>{product.rating} ★</span>
                  <span className="text-gray-500">({product.reviewCount} reviews)</span>
                </div>
                <div className="mt-2">
                  <span className="text-l font-semibold text-gray-800">${product.price}</span>
                  <span className="ml-10 text-sm text-red-500 font-semibold">{product.discountPercentage}% OFF</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">Loading deals...</p>
        )}
      </div>
    </div>
  );
};

export default TodaysDeals;
