import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters long";
    if (username.length > 20) return "Username cannot exceed 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters long";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate individual fields as user types
    let error = "";
    switch (name) {
      case "email":
        error = validateEmail(value);
        break;
      case "username":
        error = validateUsername(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      username: validateUsername(formData.username),
      password: validatePassword(formData.password)
    };

    setErrors(newErrors);

    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleLogin = async () => {
    // Validate form before submission
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      // Extract tokens from response
      const { refreshToken } = response.data;
      localStorage.setItem("refreshToken", refreshToken);

      console.log("Login Successful. Tokens stored!");
      alert("Login Successful!");
      navigate("/account"); // Redirect to Account Page
    } catch (err) {
      setError("Invalid credentials! Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <img 
        src="/createAccount.png" 
        alt="Login" 
        className="w-1/2 h-full object-cover hidden md:block" 
      />

      {/* Right Side - Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
        <h2 className="text-2xl font-semibold">Log in to Exclusive</h2>
        <p className="text-gray-500 mb-4">Enter your details below</p>

        {/* Email Input */}
        <div className="w-3/4 md:w-3/5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`w-full p-2 border rounded-md mb-1 focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-400"
            }`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email}</p>
          )}
        </div>

        {/* Username Input */}
        <div className="w-3/4 md:w-3/5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={`w-full p-2 border rounded-md mb-1 focus:outline-none focus:ring-2 ${
              errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-400"
            }`}
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mb-2">{errors.username}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="w-3/4 md:w-3/5">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`w-full p-2 border rounded-md mb-1 focus:outline-none focus:ring-2 ${
              errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-400"
            }`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">{errors.password}</p>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Login Button */}
        <button
          className="w-3/4 md:w-3/5 p-3 bg-red-100 text-red-600 font-semibold rounded-md hover:bg-red-400 hover:text-white transition"
          onClick={handleLogin}
        >
          Log In
        </button>

        {/* Forgot Password */}
        <p className="mt-3 text-sm">
          <a href="/forgot-password" className="text-blue-600">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;