import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    companyName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    phone: "",
    email: "",
    saveInfo: false,
  });

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({ ...billingInfo, [name]: value });
  };

  const handleCheckbox = () => {
    setBillingInfo({ ...billingInfo, saveInfo: !billingInfo.saveInfo });
  };

  const handlePlaceOrder = () => {
    navigate("/payment-success");
  };

  return (
    <div className="flex flex-wrap gap-8 p-10 bg-gray-100 rounded-lg shadow-lg">
      {/* Left Side - Billing Details */}
      <div className="flex-1 min-w-[350px] bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-red-600 pb-2">Billing Details</h2>
        <input
          className="w-full p-3 text-lg border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-red-600 transition-all"
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 text-lg border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-red-600 transition-all"
          name="companyName"
          placeholder="Company Name (Optional)"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 text-lg border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-red-600 transition-all"
          name="streetAddress"
          placeholder="Street Address"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 text-lg border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-red-600 transition-all"
          name="apartment"
          placeholder="Apartment, Floor (Optional)"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 text-lg border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-red-600 transition-all"
          name="city"
          placeholder="Town/City"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 text-lg border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-red-600 transition-all"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 text-lg border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-red-600 transition-all"
          name="email"
          placeholder="Email Address"
          type="email"
          onChange={handleChange}
        />
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={billingInfo.saveInfo}
            onChange={handleCheckbox}
            className="w-5 h-5 cursor-pointer"
          />
          <label className="text-gray-700">Save this information for faster checkout next time</label>
        </div>
      </div>

      {/* Right Side - Order Summary */}
      <div className="flex-1 min-w-[350px] bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-red-600 pb-2">Your Order</h2>
        <div className="flex justify-between text-lg text-gray-700 border-b pb-2">
          <span>Product</span>
          <span>Subtotal</span>
        </div>
        <div className="flex justify-between py-2 text-lg">
          <span>Product Name x 1</span>
          <span>₹1000</span>
        </div>
        <div className="flex justify-between text-lg border-b pb-2">
          <span>Shipping</span>
          <span>₹50</span>
        </div>
        <div className="flex justify-between font-bold text-xl mt-3 border-t-2 border-red-600 pt-2">
          <span>Total</span>
          <span>₹1050</span>
        </div>

        <h3 className="text-lg font-semibold mt-5 border-b-2 border-red-600 pb-2">Payment Options</h3>
        <div className="flex flex-col gap-2 mt-2">
          <label className="flex items-center gap-2 text-lg cursor-pointer">
            <input type="radio" name="payment" value="bank" className="w-5 h-5 cursor-pointer" /> Bank Transfer
          </label>
          <label className="flex items-center gap-2 text-lg cursor-pointer">
            <input type="radio" name="payment" value="cod" className="w-5 h-5 cursor-pointer" /> Cash on Delivery
          </label>
        </div>

        <h3 className="text-lg font-semibold mt-5 border-b-2 border-red-600 pb-2">Coupon Code</h3>
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:border-red-600 transition-all"
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button className="bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 transition-all font-bold">
            Apply Coupon
          </button>
        </div>

        <button
          className="w-full bg-red-600 text-white py-4 rounded-md mt-5 text-lg font-bold hover:bg-red-700 transition-all transform hover:-translate-y-1"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
