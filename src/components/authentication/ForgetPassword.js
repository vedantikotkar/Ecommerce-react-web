import React, { useState } from "react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setMessage("Reset link has been sent to your email.");
    // Here, you can call your API to send the reset password link
  };

  return (
    <div className="flex h-screen">
      {/* Left Image Section */}
      <img
        src={`${process.env.PUBLIC_URL}/createAccount.png`}
        alt="Forgot Password"
        className="w-1/2 h-full object-cover hidden md:block"
      />

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
        <h2 className="text-2xl font-semibold ">Forgot Password?</h2>
        <p className="text-gray-600 text-center mt-2">
          Enter your email below and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="w-3/4 mt-6">
          <label className="block text-gray-700 text-sm mb-2">Email Address:</label>
          <input
            type="email"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-red-100  font-semibold text-red-600  py-2 rounded-md mt-4 hover:bg-red-400 hover:text-white transition"
          >
            Send Reset Link
          </button>
        </form>

        {/* Message Display */}
        {message && <p className="text-green-600 mt-2">{message}</p>}

        {/* Back to Login */}
        <p className="mt-4 text-gray-600">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
