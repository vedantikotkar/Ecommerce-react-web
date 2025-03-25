// import React from "react";
// import "./CreateAccount.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGoogle } from "@fortawesome/free-brands-svg-icons";

// const CreateAccount = () => {
//   return (
//     <div className="create-account-container">
//       {/* Correct image path from public folder */}
//       <img src={`${process.env.PUBLIC_URL}/createAccount.png`} alt="Create Account" className="full-image" />

//       <div className="form-section">
//         <h2>Create an Account</h2>
//         <p>Enter your details below</p>

//         <input type="text" placeholder="Name" className="input-field" />
//         <input type="email" placeholder="Email or Phone Number" className="input-field" />
//         <input type="password" placeholder="Password" className="input-field" />

//         <button className="create-account-btn">Create Account</button>

//         <button className="google-signup-btn">
//           <FontAwesomeIcon icon={faGoogle} className="icon" /> Sign up with Google
//         </button>

//         <p className="login-text">
//           Already have an account? <a href="/login">Log in</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default CreateAccount;




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

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, email, firstName, lastName, password } = formData;
    if (!username || !email || !firstName || !lastName || !password) {
      setMessage("All fields are required.");
      return false;
    }
    if (!email.includes("@")) {
      setMessage("Enter a valid email.");
      return false;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return false;
    }
    return true;
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

        
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-3/4 p-2 border border-gray-300 rounded-md mt-4"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-3/4 p-2 border border-gray-300 rounded-md mt-4"
          value={formData.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-3/4 p-2 border border-gray-300 rounded-md mt-4"
          value={formData.lastName}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-3/4 p-2 border border-gray-300 rounded-md mt-4"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min. 6 chars)"
          className="w-3/4 p-2 border border-gray-300 rounded-md mt-4"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Signup Button */}
        <button
          className="w-3/4 bg-red-100 text-red-600  font-semibold p-2 rounded-md mt-4 hover:bg-red-400 hover:text-white transition"
          onClick={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Message Display */}
        {message && <p className="text-red-500 mt-2">{message}</p>}

        {/* Google Signup Button */}
        <button className="w-3/4 flex items-center justify-center font-semibold  bg-blue-50 text-blue-600 border border-gray-300 p-2 rounded-md mt-4 hover:bg-blue-400 hover:text-white transition">
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
