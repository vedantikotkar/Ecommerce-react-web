import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const OrderSummary = ({ userAddress }) => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/orders")
      .then((response) => response.json())
      .then((data) => {
        setOrderData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load order details.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="text-center py-16">
      <div className="inline-block w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 font-semibold text-purple-600 text-lg">Loading your order...</p>
    </div>
  );
  
  if (error) return (
    <div className="max-w-lg mx-auto mt-10 p-5 bg-pink-50 border border-pink-200 rounded-lg text-center">
      <p className="text-pink-600 font-bold text-lg">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600">Try Again</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mt-8 border border-teal-100">
    {/* Header with light green gradient */}
    <div className="bg-gradient-to-r from-green-400 to-teal-400 px-6 py-5">
      <h2 className="text-2xl font-bold text-white text-center">Order Summary</h2>
      <div className="mt-3">
        <ProgressBar step={2} />
      </div>
    </div>

      <div className="p-6 bg-gradient-to-b from-purple-50 to-white">
        {/* Shipping Address */}
        <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border-l-4 border-purple-400">
          <h3 className="text-lg font-semibold mb-2 text-purple-800">Shipping Address</h3>
          <p className="text-gray-700">
            {userAddress.street}, {userAddress.city}, <br />
            {userAddress.state}, {userAddress.country} - {userAddress.postalCode}
          </p>
        </div>

        {/* Order Items with colorful cards */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-800 border-b border-purple-200 pb-2">Order Items</h3>
          
          {orderData && orderData.items ? (
            <div className="space-y-3">
              {orderData.items.map((item, index) => (
                <div key={index} className="py-4 px-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-pink-400">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-pink-600">${parseFloat(item.price).toFixed(2)}</p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">
                          ${parseFloat(item.price * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-100">No items found in your order.</p>
          )}
        </div>

        {/* Price Summary with gradient */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl mb-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-indigo-800">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium">${orderData?.subtotal ? parseFloat(orderData.subtotal).toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Shipping:</span>
              <span className="font-medium">${orderData?.shipping ? parseFloat(orderData.shipping).toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Tax:</span>
              <span className="font-medium">${orderData?.tax ? parseFloat(orderData.tax).toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-purple-200 mt-2">
              <span className="text-indigo-800">Total:</span>
              <span className="text-purple-700">${orderData?.total ? parseFloat(orderData.total).toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Raw Order Data with styled container */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-purple-800 flex items-center">
            <span>Complete Order Data</span>
            <span className="ml-2 text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">For Reference</span>
          </h3>
          <div className="bg-white border border-purple-200 rounded-xl p-4 overflow-auto max-h-80 shadow-sm">
            <pre className="text-sm whitespace-pre-wrap break-words text-gray-700">{JSON.stringify(orderData, null, 2)}</pre>
          </div>
        </div>

        {/* Action Button with gradient and animation */}
        <button
          onClick={() => navigate("/payment")}
          className="w-full bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.01] shadow-sm"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;