// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ShoppingBag, Trash2, ChevronRight, ArrowLeft, Gift, CreditCard, Truck } from "lucide-react";

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState([]);
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [showCouponField, setShowCouponField] = useState(false);

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(storedCart);
//   }, []);

//   const handleQuantityChange = (id, change) => {
//     const updatedCart = cart.map((item) =>
//       item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
//     );

//     setCart(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const removeFromCart = (id) => {
//     const updatedCart = cart.filter((item) => item.id !== id);
//     setCart(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const applyCoupon = () => {
//     if (couponCode.toUpperCase() === "SAVE10") {
//       setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 10, type: "percentage" });
//     } else if (couponCode.toUpperCase() === "FREE5") {
//       setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 5, type: "fixed" });
//     } else {
//       alert("Invalid coupon code");
//     }
//     setShowCouponField(false);
//   };

//   const removeCoupon = () => {
//     setAppliedCoupon(null);
//     setCouponCode("");
//   };

//   const calculateTotals = () => {
//     const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     let discount = 0;
    
//     if (appliedCoupon) {
//       if (appliedCoupon.type === "percentage") {
//         discount = (subtotal * appliedCoupon.discount) / 100;
//       } else {
//         discount = appliedCoupon.discount;
//       }
//     }
    
//     const shipping = subtotal > 50 ? 0 : 5.99;
//     const total = subtotal - discount + shipping;
    
//     return { subtotal, discount, shipping, total };
//   };

//   const { subtotal, discount, shipping, total } = calculateTotals();
//   const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Header */}
//         <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">Shopping Cart</h1>
//           <div className="text-sm breadcrumbs flex items-center text-gray-500">
//             <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
//             <ChevronRight size={16} className="mx-2" />
//             <span className="font-medium text-gray-800">Cart ({itemCount} items)</span>
//           </div>
//         </div>

//         {cart.length > 0 ? (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                 <div className="p-6 border-b border-gray-100">
//                   <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
//                 </div>
                
//                 <div className="divide-y divide-gray-100">
//                   {cart.map((item) => (
//                     <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center hover:bg-gray-50 transition duration-300">
//                       <div className="relative">
//                         <img 
//                           src={item.imageUrl} 
//                           alt={item.productName} 
//                           className="w-24 h-24 object-cover rounded-lg shadow-sm"
//                         />
//                         {item.discountPercentage && (
//                           <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
//                             -{item.discountPercentage}%
//                           </span>
//                         )}
//                       </div>
                      
//                       <div className="sm:ml-6 flex-1 mt-4 sm:mt-0">
//                         <div className="flex flex-col sm:flex-row sm:justify-between">
//                           <h3 className="text-lg font-semibold text-gray-800">{item.productName}</h3>
//                           <p className="text-lg font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
//                         </div>
                        
//                         {item.selectedColor && (
//                           <p className="text-gray-600 text-sm mt-1">
//                             Color: 
//                             <span 
//                               className="inline-block ml-2 w-4 h-4 rounded-full border border-gray-300" 
//                               style={{ backgroundColor: item.selectedColor }}
//                             />
//                           </p>
//                         )}
                        
//                         {item.selectedSize && (
//                           <p className="text-gray-600 text-sm mt-1">Size: {item.selectedSize}</p>
//                         )}
                        
//                         <div className="flex items-center justify-between mt-4">
//                           <div className="flex items-center">
//                             <button 
//                               className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
//                               onClick={() => handleQuantityChange(item.id, -1)}
//                             >
//                               -
//                             </button>
//                             <span className="mx-3 text-gray-800 font-medium w-6 text-center">{item.quantity}</span>
//                             <button 
//                               className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
//                               onClick={() => handleQuantityChange(item.id, 1)}
//                             >
//                               +
//                             </button>
//                           </div>
                          
//                           <button 
//                             className="flex items-center text-red-500 hover:text-red-700 transition-colors"
//                             onClick={() => removeFromCart(item.id)}
//                           >
//                             <Trash2 size={16} className="mr-1" />
//                             <span className="text-sm font-medium">Remove</span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="p-6 bg-gray-50">
//                   <button 
//                     className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
//                     onClick={() => navigate("/home")}
//                   >
//                     <ArrowLeft size={18} className="mr-2" />
//                     Continue Shopping
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             {/* Order Summary */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-6">
//                 <div className="p-6 border-b border-gray-100">
//                   <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
//                 </div>
                
//                 <div className="p-6 space-y-4">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="text-gray-800 font-medium">${subtotal.toFixed(2)}</span>
//                   </div>
                  
//                   {appliedCoupon && (
//                     <div className="flex justify-between text-green-600">
//                       <span className="flex items-center">
//                         Discount 
//                         <span className="ml-2 text-xs bg-green-100 text-green-800 py-1 px-2 rounded">
//                           {appliedCoupon.code}
//                         </span>
//                         <button 
//                           className="ml-2 text-red-500 hover:text-red-700"
//                           onClick={removeCoupon}
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </span>
//                       <span>-${discount.toFixed(2)}</span>
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Shipping</span>
//                     <span className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-800 font-medium"}>
//                       {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
//                     </span>
//                   </div>
                  
//                   {shipping > 0 && (
//                     <div className="text-sm text-gray-500">
//                       Free shipping on orders over $50
//                     </div>
//                   )}
                  
//                   <div className="border-t border-gray-100 pt-4 mt-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-lg font-bold text-gray-800">Total</span>
//                       <span className="text-xl font-bold text-gray-800">${total.toFixed(2)}</span>
//                     </div>
//                   </div>
                  
//                   {!showCouponField && !appliedCoupon && (
//                     <button 
//                       className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors mt-4"
//                       onClick={() => setShowCouponField(true)}
//                     >
//                       <Gift size={16} className="mr-2" />
//                       Add Coupon Code
//                     </button>
//                   )}
                  
//                   {showCouponField && (
//                     <div className="flex mt-4">
//                       <input 
//                         type="text" 
//                         className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="Enter coupon code"
//                         value={couponCode}
//                         onChange={(e) => setCouponCode(e.target.value)}
//                       />
//                       <button 
//                         className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
//                         onClick={applyCoupon}
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   )}
                  
//                   <button 
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center mt-6"
//                     onClick={() => navigate("/checkout")}
//                   >
//                     <CreditCard size={18} className="mr-2" />
//                     Proceed to Checkout
//                   </button>
                  
//                   <div className="flex flex-col space-y-3 mt-6">
//                     <div className="flex items-center text-gray-600">
//                       <Truck size={16} className="mr-2 text-blue-600" />
//                       <span className="text-sm">Free delivery on orders over $50</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <span className="text-sm">30-day easy returns</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                       </svg>
//                       <span className="text-sm">Secure payment</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//             <div className="flex justify-center mb-6">
//               <ShoppingBag size={64} className="text-gray-300" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
//             <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
//             <button 
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
//               onClick={() => navigate("/home")}
//             >
//               Start Shopping
//             </button>
//           </div>
//         )}

//         {/* Product Recommendations */}
//         {cart.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">You might also like</h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               {[1, 2, 3, 4].map((i) => (
//                 <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
//                   <div className="aspect-w-1 aspect-h-1 bg-gray-200">
//                     <img 
//                       src={`/api/placeholder/300/300`} 
//                       alt="Product recommendation" 
//                       className="object-cover w-full h-full"
//                     />
//                   </div>
//                   <div className="p-4">
//                     <h3 className="font-medium text-gray-800">Recommended Product {i}</h3>
//                     <div className="flex items-center mt-1">
//                       <div className="flex text-yellow-400">
//                         {'★★★★★'.split('').map((star, i) => (
//                           <span key={i}>{star}</span>
//                         ))}
//                       </div>
//                       <span className="text-xs text-gray-500 ml-2">(42)</span>
//                     </div>
//                     <div className="mt-2 flex justify-between items-center">
//                       <span className="font-bold text-gray-800">$29.99</span>
//                       <button className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
//                         + Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;


import React, { useState, useEffect } from "react";
import { ShoppingBag, Trash2, ChevronRight, ArrowLeft, Gift, CreditCard, Truck, CheckCircle } from "lucide-react";

const CartPage = ({ 
  onNavigate = () => console.log("Navigation"),
  initialCart = [] 
}) => {
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponField, setShowCouponField] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || initialCart;
    setCart(storedCart);
  }, [initialCart]);

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

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 10, type: "percentage" });
    } else if (couponCode.toUpperCase() === "FREE5") {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 5, type: "fixed" });
    } else {
      alert("Invalid coupon code");
    }
    setShowCouponField(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
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

  const { subtotal, discount, shipping, total } = calculateTotals();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-4xl font-bold text-black-900 mb-4 md:mb-0"> </h1>
          <div className="text-sm breadcrumbs flex items-center text-blue-600">
            <span 
              className="hover:bg-blue-100 px-2 py-1 rounded-md cursor-pointer transition-colors" 
              onClick={() => onNavigate("home")}
            >
            
            </span>
            <ChevronRight size={16} className="mx-2 text-black-400" />
            <span className="font-medium text-blue-800">Cart ({itemCount} items)</span>
          </div>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100">
                <div className="p-6 bg-orange-50 border-b border-orange-100">
                  <h2 className="text-xl font-bold text-orange-900 flex items-center">
                    <ShoppingBag size={24} className="mr-2 text-orange-600" />
                    Cart Items
                  </h2>
                </div>
                
                <div className="divide-y divide-orange-100">
                  {cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-6 flex flex-col sm:flex-row items-center transition duration-300 group"
                    >
                      <div className="relative">
                        <img 
                          src={item.imageUrl} 
                          alt={item.productName} 
                          className="w-28 h-28 object-cover  object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform"
                        />
                        {item.discountPercentage && (
                          <span className="absolute top-0 right-0 bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                            -{item.discountPercentage}%
                          </span>
                        )}
                      </div>
                      
                      <div className="sm:ml-6 flex-1 mt-4 sm:mt-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <h3 className="text-l font-semibold text-black-900">{item.productName}</h3>
                          <p className="text-l font-semibold text-semibold-800">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center bg-pink-50 rounded-full p-1">
                            <button 
                              className="w-8 h-8 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              -
                            </button>
                            <span className="mx-3 text-pink-800 font-medium w-6 text-center">{item.quantity}</span>
                            <button 
                              className="w-8 h-8 flex items-center justify-center bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            className="flex items-center text-red-500 hover:text-red-700 transition-colors"
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
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 sticky top-10">
                <div className="border-b border-blue-100 pb-6 mb-6">
                  <h2 className="text-xl font-bold text-blue-900 flex items-center">
                    <CreditCard size={28} className="mr-3 text-blue-600" />
                    Order Summary
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 font-semibold">Subtotal</span>
                    <span className="text-sm font-semibold text-blue-900">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-green-600">
                      <div className="flex items-center">
                        <span>Discount</span>
                        <span className="ml-2 text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                          {appliedCoupon.code}
                        </span>
                        <button 
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={removeCoupon}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 font-semibold">Shipping</span>
                    <span className={`text-sm font-semibold ${shipping === 0 ? 'text-green-600' : 'text-blue-900'}`}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="border-t border-blue-100 pt-6 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-blue-900">Total</span>
                      <span className="text-sm font-semibold text-blue-900">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {!showCouponField && !appliedCoupon && (
                    <button 
                      className="w-full flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 py-3 rounded-lg transition-colors mt-4"
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
                        className="hover:text-red-500 hover:bg-red-50 bg-red-50 text-red-600 px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
                        onClick={applyCoupon}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  
                  <button 
                    className="w-full bg-blue-100 text-blue-600 font-semibold py-4 px-4 rounded-lg transition-colors flex items-center hover:text-blue-500 hover:bg-blue-50 justify-center mt-6"
                    onClick={() => onNavigate("checkout")}
                  >
                    <CheckCircle size={22} className="mr-2" />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-blue-100">
            <div className="flex justify-center mb-8">
              <ShoppingBag size={80} className="text-blue-300" />
            </div>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Your cart is empty</h2>
            <p className="text-blue-700 mb-10 text-lg">Looks like you haven't added anything to your cart yet.</p>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
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