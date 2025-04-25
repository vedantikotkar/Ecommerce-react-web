import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
   const [passwordStrength, setPasswordStrength] = useState(0);
    const [password, setPassword] = useState("");

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters long";
    if (username.length > 20) return "Username cannot exceed 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateName = (name, field) => {
    if (!name) return `${field} is required`;
    if (name.length < 2) return `${field} must be at least 2 characters long`;
    if (name.length > 50) return `${field} cannot exceed 50 characters`;
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return `${field} can only contain letters, spaces, hyphens, and apostrophes`;
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (password.length > 50) return "Password cannot exceed 50 characters";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    if (!/(?=.*[!@#$%^&*])/.test(password)) return "Password must contain at least one special character (!@#$%^&*)";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate individual fields as user types
    let error = "";
    switch (name) {
      case "username":
        error = validateUsername(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "firstName":
        error = validateName(value, "First Name");
        break;
      case "lastName":
        error = validateName(value, "Last Name");
        break;
      case "password":
        error = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // const validateForm = () => {
  //   const newErrors = {
  //     username: validateUsername(formData.username),
  //     email: validateEmail(formData.email),
  //     firstName: validateName(formData.firstName, "First Name"),
  //     lastName: validateName(formData.lastName, "Last Name"),
  //     password: validatePassword(formData.password)
  //   };

  //   setErrors(newErrors);

  //   // Check if any errors exist
  //   return !Object.values(newErrors).some(error => error !== "");
  // };

  // Form validation
  const validateForm = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      if (!password) newErrors.password = "Password is required";
      else if (passwordStrength < 3) newErrors.password = "Password is too weak";
    } else if (step === 2) {
      if (!formData.phone) newErrors.phone = "Phone is required";
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) 
        newErrors.phone = "Phone should have 10 digits";
      if (!formData.company) newErrors.company = "Company is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.text();

      if (response.ok) {
        setMessage("User registered successfully!");
      } else {
        setMessage(`Error: ${data}`);
      }
    } catch (error) {
      setMessage("Error: Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <img
        src={`${process.env.PUBLIC_URL}/createAccount.png`}
        alt="Create Account"
        className="w-1/2 h-full object-cover hidden md:block"
      />

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
        <h2 className="text-2xl font-semibold">Create an Account</h2>
        <p className="text-gray-600">Enter your details below</p>

        {/* Username Input */}
        <div className="w-3/4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={`w-full p-2 border rounded-md mt-4 ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* First Name Input */}
        <div className="w-3/4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={`w-full p-2 border rounded-md mt-4 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name Input */}
        <div className="w-3/4">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={`w-full p-2 border rounded-md mt-4 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="w-3/4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`w-full p-2 border rounded-md mt-4 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="w-3/4">
          <input
            type="password"
            name="password"
            placeholder="Password "
            className={`w-full p-2 border rounded-md mt-4 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Signup Button */}
        <button
          className="w-3/4 bg-red-100 text-red-600 font-semibold p-2 rounded-md mt-4 hover:bg-red-400 hover:text-white transition"
          onClick={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Message Display */}
        {message && <p className="text-red-500 mt-2">{message}</p>}

        {/* Google Signup Button */}
        <button className="w-3/4 flex items-center justify-center font-semibold bg-blue-50 text-blue-600 border border-gray-300 p-2 rounded-md mt-4 hover:bg-blue-400 hover:text-white transition">
          <FontAwesomeIcon icon={faGoogle} className="mr-2" />
          Sign up with Google
        </button>

        {/* Login Redirect */}
        <p className="mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;