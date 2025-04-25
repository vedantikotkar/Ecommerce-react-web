import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaShoppingCart, FaUser, FaSearch, FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showChatbot, setShowChatbot] = useState(false); // State to manage chatbot visibility
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! How can I help you?" }]); // Initial chatbot message
  const [userInput, setUserInput] = useState("");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
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

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages([...messages, userMessage]);
    setUserInput("");

    try {
      const response = await axios.post("http://localhost:5000/chat", { message: userInput });
      const botResponse = { sender: "bot", text: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Error reaching the chatbot." }]);
    }
  };
  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const response = await axios.get(`http://localhost:4000/products/search?keyword=${searchTerm}`);
        navigate("/search-results", { state: { products: response.data } });
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  // Handle chatbot message send
  const sendMessage = () => {
    if (userInput.trim()) {
      setMessages([...messages, { sender: "user", text: userInput }]); // Add user message
      setUserInput("");

      // Simulating a bot response after a short delay
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "I am a chatbot. I will answer soon!" },
        ]);
      }, 1000);
    }
  };

  return (
    <>
      <nav className="w-full fixed top-0 left-0 bg-white shadow-md z-50 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
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
            <form onSubmit={handleSearch} className="relative hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-1 w-72">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent w-full text-sm text-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />


              <button type="submit" className="absolute right-3 text-gray-600">
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


              <div
                className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white 
                   p-4 rounded-full shadow-lg cursor-pointer transition duration-300 
                   flex items-center justify-center w-16 h-16"
                onClick={() => setShowChatbot(true)}
              >
                <FaRobot className="text-3xl" />
              </div>


              {/* Chatbot UI */}
              {showChatbot && (
                <div className="fixed bottom-5 right-5 w-80 bg-white shadow-lg rounded-lg">
                  <div className="flex justify-between items-center bg-blue-100 text-blue-600 p-3  font-semibold rounded-t-lg">
                    <h2>Chatbot</h2>
                    <FaTimes className="cursor-pointer" onClick={() => setShowChatbot(false)} />
                  </div>

                  <div className="p-3 h-64 overflow-y-auto">
                    {messages.map((msg, index) => (
                      <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
                        {msg.text}
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleChatSubmit} className="flex p-3 border-t">
                    <input
                      type="text"
                      className="flex-1 p-2 border rounded-l-md"
                      placeholder="Type a message..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-100 text-blue-600 px-3 py-2 rounded-r-md">
                      <FaPaperPlane />
                    </button>
                  </form>
                </div>

              )}

            </div>
          </div>
        </div>
      </nav>


    </>

  );
};

export default Navbar;
