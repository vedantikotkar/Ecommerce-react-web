import React, { useState, useEffect } from "react";
import { ShoppingBag, Trash2, ChevronRight, Gift, CreditCard, CheckCircle, ArrowLeft } from "lucide-react";

const CartPage = ({ 
  onNavigate = () => console.log("Navigation"),
  userId = "546a1fd0-214c-4877-ac15-c121f6d207f1" 
}) => {
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponField, setShowCouponField] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/cart-products/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      
      const cartData = await response.json();
      
      const cartWithDetails = await Promise.all(
        cartData.map(async (item) => {
          const productResponse = await fetch(`http://localhost:4000/products/${item.productId}`);
          
          if (!productResponse.ok) {
            throw new Error(`Failed to fetch product details for ${item.productId}`);
          }
          
          const productData = await productResponse.json();
          
          return {
            id: item.productId,
            quantity: item.quantity,
            productName: productData.name,
            price: productData.price,
            imageUrl: productData.imageUrl,
            discountPercentage: productData.discountPercentage
          };
        })
      );
      
      setCart(cartWithDetails);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleQuantityChange = async (id, change) => {
    try {
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      );
      
      setCart(updatedCart);
      
      const endpoint = change > 0 ? 'increase' : 'decrease';
      
      const response = await fetch(`http://localhost:4000/products/${userId}/${id}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${endpoint} quantity`);
      }
    } catch (err) {
      console.error(`Error ${change > 0 ? 'increasing' : 'decreasing'} quantity:`, err);
      fetchCartItems();
      alert(`Failed to update quantity. Please try again.`);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/cart-products/remove?userId=${userId}&productId=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      
      const updatedCart = cart.filter((item) => item.id !== id);
      setCart(updatedCart);
    } catch (err) {
      console.error("Error removing item from cart:", err);
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  const applyCoupon = async () => {
    try {
      const response = await fetch(`http://localhost:4000/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          userId: userId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid coupon code');
      }
      
      const couponData = await response.json();
      
      setAppliedCoupon(couponData);
      setShowCouponField(false);
    } catch (err) {
      console.error("Error applying coupon:", err);
      
      if (couponCode.toUpperCase() === "SAVE10") {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 10, type: "percentage" });
      } else if (couponCode.toUpperCase() === "FREE5") {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 5, type: "fixed" });
      } else {
        alert("Invalid coupon code");
      }
      setShowCouponField(false);
    }
  };

  const removeCoupon = async () => {
    try {
      const response = await fetch(`http://localhost:4000/coupons/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          code: appliedCoupon.code
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove coupon');
      }
      
      setAppliedCoupon(null);
      setCouponCode("");
    } catch (err) {
      console.error("Error removing coupon:", err);
      setAppliedCoupon(null);
      setCouponCode("");
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let discount = 0;
    
    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        discount = (subtotal * appliedCoupon.discount) / 100;
      } else {
        discount = appliedCoupon.discount;
      }
    }
    
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal - discount + shipping;
    
    return { subtotal, discount, shipping, total };
  };
  const processCheckout = async () => {
    try {
      const orderNo = `ORD${Date.now()}`;
      const trackingCode = `TRK${Math.floor(Math.random() * 1000000)}`;
      const shippingService = "DHL";
  
      const itemCount = cart.length;
      const currency = "USD";
    
      for (const item of cart) {
        const response = await fetch(`http://localhost:4000/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderNo: orderNo,
            item: itemCount,
            userId: userId,
            trackingCode: trackingCode,
            shippingService: shippingService,
            productId: item.productId,
            quantity: item.quantity,
            status: "Processing", // You can update this as per your flow
            currency: currency,
            amount: item.price * item.quantity,
          }),
        });
  
        const result = await response.json();
        if (!response.ok) {
          console.error("Order creation failed:", result);
          return;
        }
        console.log("Order created successfully:", result);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  
      
  //     if (!response.ok) {
  //       throw new Error('Failed to create order');
  //     }
      
  //     const orderData = await response.json();
      
  //     onNavigate("checkout", { orderId: orderData.id });
  //   } catch (err) {
  //     console.error("Error creating order:", err);
  //     alert("Failed to proceed to checkout. Please try again.");
  //   }
  // };

  const { subtotal, discount, shipping, total ,amount} = calculateTotals();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-blue-100 border-r-blue-100 rounded-full animate-spin"></div>
          <div className="mt-4 text-xl font-medium text-blue-600">Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-600 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Error Loading Cart</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            onClick={fetchCartItems}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
          
          </div>
          <div className="text-sm breadcrumbs flex items-center text-blue-600 mt-4 md:mt-0">
           
            <ChevronRight size={16} className="mx-2 text-gray-400" />
           
          </div>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <h2 className="text-xl font-bold text-blue-900 flex items-center">
                    <ShoppingBag size={24} className="mr-2 text-blue-600" />
                    Your Items
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="p-6 flex flex-col sm:flex-row items-center transition duration-300 ">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-xl overflow-hidden shadow-md bg-white p-2 flex items-center justify-center">
                          <img 
                            src={item.imageUrl} 
                            alt={item.productName} 
                            className="max-w-full max-h-full object-contain transform transition-transform hover:scale-110"
                          />
                        </div>
                        {item.discountPercentage > 0 && (
                          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            -{item.discountPercentage}%
                          </span>
                        )}
                      </div>
                      
                      <div className="sm:ml-6 flex-1 mt-4 sm:mt-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{item.productName}</h3>
                          <p className="text-lg font-bold text-blue-800">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center bg-blue-50 rounded-full p-1 shadow-sm">
                            <button 
                              className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="mx-4 text-blue-800 font-medium w-6 text-center">{item.quantity}</span>
                            <button 
                              className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            className="flex items-center text-red-500 hover:text-red-700 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={16} className="mr-1" />
                            <span className="text-sm font-medium">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden sticky top-10">
                <div className="p-6 bg-gradient-to-r from-violet-50 to-blue-50 border-b border-blue-100">
                  <h2 className="text-xl font-bold text-blue-900 flex items-center">
                    <CreditCard size={24} className="mr-3 text-blue-600" />
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-lg font-medium text-gray-900">${amount}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-green-600 bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <span className="font-medium">Discount</span>
                        <span className="ml-2 text-xs bg-green-200 text-green-800 py-1 px-2 rounded-full">
                          {appliedCoupon.code}
                        </span>
                        <button 
                          className="ml-2 text-red-500 hover:text-red-600"
                          onClick={removeCoupon}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-lg font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`text-lg font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-blue-900">${total.toFixed(2)}</span>
                    </div>
                    {subtotal > 50 ? (
                      <div className="mt-2 text-sm text-green-600 flex items-center justify-end">
                        <CheckCircle size={14} className="mr-1" />
                        <span>Free shipping applied</span>
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-gray-500 text-right">
                        Add ${(50 - subtotal).toFixed(2)} more to get free shipping
                      </div>
                    )}
                  </div>
                  
                  {!showCouponField && !appliedCoupon && (
                    <button 
                      className="w-full flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:from-green-100 hover:to-emerald-100 py-3 rounded-lg transition-colors mt-4 border border-green-200"
                      onClick={() => setShowCouponField(true)}
                    >
                      <Gift size={20} className="mr-2" />
                      Add Coupon Code
                    </button>
                  )}
                  
                  {showCouponField && (
                    <div className="flex mt-4">
                      <input 
                        type="text" 
                        className="flex-1 border border-blue-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button 
                        className="bg-red-50 text-red-600 px-6 py-3 rounded-r-lg transition-colors hover:bg-red-600 hover:text-white"
                        onClick={applyCoupon}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  
                  <button 
                    className="w-full bg-gradient-to-r from-blue-400 to-violet-400 text-white font-semibold py-4 px-4 rounded-lg transition-all hover:from-blue-700 hover:to-violet-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center mt-8"
                    onClick={processCheckout}
                    disabled={cart.length === 0}
                  >
                    <CheckCircle size={22} className="mr-2" />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-blue-100">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                <ShoppingBag size={48} className="text-blue-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-violet-600 bg-clip-text text-transparent mb-6">Your cart is empty</h2>
            <p className="text-gray-600 mb-10 text-lg max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Let's find something perfect for you!</p>
            <button 
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => onNavigate("home")}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;