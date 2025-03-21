import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (searchTerm.trim()) {
      try {
        const response = await axios.get(`http://localhost:4000/products/search?keyword=${searchTerm}`);
        navigate("/search-results", { state: { products: response.data } });
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 bg-white shadow-md z-50 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
        
        {/* Logo */}
        <div 
          className="text-xl font-bold text-gray-900 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          E-Shop
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <a href="/home" className="text-gray-800 font-medium hover:text-gray-600">Home</a>
          <a href="/contact" className="text-gray-800 font-medium hover:text-gray-600">Contact</a>
          <a href="/about" className="text-gray-800 font-medium hover:text-gray-600">About</a>
          <a href="/" className="text-gray-800 font-medium hover:text-gray-600">Sign Up</a>
        </div>

        {/* Navbar Icons */}
        <div className="flex items-center space-x-5">
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden sm:flex items-center bg-gray-200 rounded-full px-4 py-1 w-72">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full text-sm text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 text-gray-600 hover:text-gray-800">
              <FaSearch />
            </button>
          </form>

          {/* Wishlist Icon */}
          <FaHeart 
            className="text-xl text-gray-700 cursor-pointer hover:text-red-500 transition"
            onClick={() => navigate("/wishlist")}
          />

          {/* Shopping Cart Icon */}
          <FaShoppingCart 
            className="text-xl text-gray-700 cursor-pointer hover:text-blue-500 transition"
            onClick={() => navigate("/cart")}
          />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <FaUser 
              className="text-xl text-gray-700 cursor-pointer hover:text-green-500 transition"
              onClick={toggleDropdown} 
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-2 w-40">
                <a href="/account" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Account</a>
                <a href="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Orders</a>
                <a href="/cancellations" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Cancellations</a>
                <a href="/reviews" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Reviews</a>
                <a href="/logout" className="block px-4 py-2 text-red-500 font-bold hover:bg-red-100">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
