import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto text-center p-10 bg-green-50 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold text-green-600"> Payment Successful! </h2>
      <p className="text-gray-700 mt-2">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <button
        className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
        onClick={() => navigate("/")}
      >
        Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
