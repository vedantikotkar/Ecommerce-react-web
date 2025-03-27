import React, { useState } from "react";

const EmailOTPLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (email) {
      setOtpSent(true);
      alert("OTP has been sent to your email.");
    }
  };

  const handleVerifyOtp = () => {
    if (otp) {
      alert("OTP verified successfully!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 text-center">
        <img src="/createAccount.png" alt="Login" className="w-32 mx-auto mb-4" />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login with OTP</h2>
        <p className="text-gray-600 mb-4">Enter your email to receive an OTP</p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!otpSent ? (
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleSendOtp}
          >
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition mt-3"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailOTPLogin;
