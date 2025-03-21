import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        username: username,
        password: password,
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
      <img src="/createAccount.png" alt="Login" className="w-1/2 h-full object-cover" />

      {/* Right Side - Form Section */}
      <div className="w-1/2 flex flex-col justify-center items-center p-6">
        <h2 className="text-2xl font-semibold">Log in to Exclusive</h2>
        <p className="text-gray-500 mb-4">Enter your details below</p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="w-3/5 p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Username Input */}
        <input
          type="text"
          placeholder="Username"
          className="w-3/5 p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="w-3/5 p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Login Button */}
        <button
          className="w-3/5 p-3 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition"
          onClick={handleLogin}
        >
          Log In
        </button>

        {/* Forgot Password */}
        <p className="mt-3 text-sm">
          <a href="/forgot-password" className="text-purple-600 hover:underline">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
