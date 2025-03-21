import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleQuantityChange = (id, change) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotals = () => {
    const shipping = 5.0;
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return { subtotal, shipping, total: subtotal + shipping };
  };

  const { subtotal, shipping, total } = calculateTotals();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <a href="/" className="text-blue-600 hover:text-blue-800 transition duration-300">Home</a> / <span className="font-medium">Cart</span>
      </div>

      {/* Cart Container */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div key={item.id} className="flex items-center border-b pb-5 mb-5 hover:bg-gray-50 p-3 rounded-lg transition duration-300">
              <img src={item.imageUrl} alt={item.productName} className="w-28 h-28 object-cover rounded-lg shadow-md" />
              <div className="ml-6 flex-1">
                <h2 className="text-lg font-semibold">{item.productName}</h2>
                <p className="text-gray-600">Price: <span className="font-medium text-blue-600">${item.price.toFixed(2)}</span></p>
                <div className="flex items-center mt-3">
                  <button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-lg" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                  <span className="mx-4 text-lg font-medium">{item.quantity}</span>
                  <button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-lg" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                </div>
                <p className="mt-2 text-gray-700 font-semibold">Subtotal: <span className="text-green-600">${(item.price * item.quantity).toFixed(2)}</span></p>
              </div>
              <button className="text-red-500 hover:text-red-700 font-medium ml-6 transition duration-300" onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center text-lg">Your cart is empty!</p>
        )}

        {/* Return to Shop Button */}
        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300" onClick={() => navigate("/home")}>Return to Shop</button>
        </div>

        {/* Cart Total Section */}
        {cart.length > 0 && (
          <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold mb-3">Cart Summary</h3>
            <p className="text-gray-700">Subtotal: <span className="font-medium text-blue-600">${subtotal.toFixed(2)}</span></p>
            <p className="text-gray-700">Shipping: <span className="font-medium text-blue-600">${shipping.toFixed(2)}</span></p>
            <p className="text-lg font-bold text-gray-900 mt-2">Total: <span className="text-green-600">${total.toFixed(2)}</span></p>
          </div>
        )}

        {/* Checkout Button */}
        {cart.length > 0 && (
          <button className="w-full mt-6 py-3 bg-green-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-green-700 transition duration-300" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
