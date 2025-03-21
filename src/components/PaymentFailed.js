import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto text-center p-10 bg-red-50 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold text-red-600"> Payment Failed! </h2>
      <p className="text-gray-700 mt-2">
        Oops! Something went wrong with your payment. Please try again.
      </p>
      <button
        className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
        onClick={() => navigate("/checkout")}
      >
        Try Again
      </button>
    </div>
  );
};

export default PaymentFailed;
