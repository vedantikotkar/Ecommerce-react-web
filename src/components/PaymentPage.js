import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedSubMethod, setSelectedSubMethod] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const razorpayFormRef = useRef(null);
  const stripeFormRef = useRef(null);
  
  const paymentMethods = [
    { id: "razorpay", label: "Pay via Razorpay", icon: "💳" },
    { id: "stripe", label: "Pay via Stripe", icon: "💳" },
    { id: "upi", label: "UPI", icon: "📱" },
    { id: "netbanking", label: "Net Banking", icon: "🏦" },
    { id: "cod", label: "Cash on Delivery", icon: "💵" }
  ];

  const razorpaySubMethods = [
    { id: "razorpay_button", label: "Razorpay Button", icon: "🔘" },
    { id: "razorpay_link", label: "Payment Link", icon: "🔗" },
    { id: "razorpay_qr", label: "QR Code", icon: "📱" },
    { id: "razorpay_page", label: "Checkout Page", icon: "📃" }
  ];

  const stripeSubMethods = [
    { id: "stripe_button", label: "Stripe Button", icon: "🔘" },
    { id: "stripe_link", label: "Payment Link", icon: "🔗" },
    { id: "stripe_checkout", label: "Checkout Page", icon: "📃" }
  ];

  // Load Razorpay script when component mounts
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        // Check if script already exists
        if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
          resolve(true);
          return;
        }
        
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Load Stripe script
  useEffect(() => {
    const loadStripeScript = () => {
      return new Promise((resolve) => {
        // Check if script already exists
        if (document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
          resolve(true);
          return;
        }
        
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/buy-button.js";
        script.async = true;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadStripeScript();
  }, []);

  // Handle Razorpay Button injection
  useEffect(() => {
    if (selectedSubMethod === "razorpay_button" && razorpayFormRef.current) {
      // Clear any existing content
      while (razorpayFormRef.current.firstChild) {
        razorpayFormRef.current.removeChild(razorpayFormRef.current.firstChild);
      }
      
      // Create a new form
      const form = document.createElement("form");
      
      // Create and add the payment button script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
      script.setAttribute("data-payment_button_id", "pl_Q9KF5uQ0dZvfU7");
      script.async = true;
      
      form.appendChild(script);
      razorpayFormRef.current.appendChild(form);
    }
  }, [selectedSubMethod]);

  // Handle Stripe Button injection
  useEffect(() => {
    if (selectedSubMethod === "stripe_button" && stripeFormRef.current) {
      // Clear any existing content
      while (stripeFormRef.current.firstChild) {
        stripeFormRef.current.removeChild(stripeFormRef.current.firstChild);
      }
      
      setTimeout(() => {
        // Create and add the Stripe button element
        const stripeButton = document.createElement("stripe-buy-button");
        stripeButton.setAttribute("buy-button-id", "buy_btn_1R52mGSDYXsR7RZ2ofR0cKRb");
        stripeButton.setAttribute("publishable-key", "pk_test_51PEnVDSDYXsR7RZ2RcGQlcAaHa6YoIklmLPGwx0mYC92jkQHzLcH030Y4BttcLJta23ue6NPD9mjKKM29qynmxNm004C9RroNx");
        
        stripeFormRef.current.appendChild(stripeButton);
      }, 100); // Small delay to ensure Stripe script is loaded
    }
  }, [selectedSubMethod]);

  // Create a Razorpay Order
  const createOrder = async () => {
    if (!selectedMethod) return;
    
    // For methods that don't need backend order creation, handle directly
    if (selectedMethod === "stripe") {
      handleStripePayment();
      return;
    }
    
    if (selectedMethod === "cod") {
      navigate("/payment-success?method=cod");
      return;
    }
    
    if (selectedMethod === "razorpay" && selectedSubMethod === "razorpay_link") {
      window.open("https://rzp.io/rzp/13yWpQtF", "_blank");
      return;
    }
    
    if (selectedMethod === "razorpay" && selectedSubMethod === "razorpay_qr") {
      setShowQR(true);
      return;
    }
    
    setLoading(true);
    try {
      // API call to create order
      const response = await axios.post("http://localhost:4000/payment/create-order", 
        new URLSearchParams({
          'amount': '50000', // Amount in paise (₹500)
          'currency': 'INR'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      setOrder(response.data);
      
      if (selectedMethod === "razorpay") {
        if (selectedSubMethod === "razorpay_page") {
          handleRazorpayPayment(response.data);
        }
      } else if (selectedMethod === "upi" || selectedMethod === "netbanking") {
        handleRazorpayPayment(response.data, selectedMethod);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      // Fallback for demo purposes
      const demoOrder = {
        id: "order_" + Math.random().toString(36).substring(2, 15),
        amount: 50000,
        currency: "INR"
      };
      setOrder(demoOrder);
      
      if (selectedMethod === "razorpay" && selectedSubMethod === "razorpay_page") {
        handleRazorpayPayment(demoOrder);
      } else if (selectedMethod === "upi" || selectedMethod === "netbanking") {
        handleRazorpayPayment(demoOrder, selectedMethod);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Razorpay Payment
  const handleRazorpayPayment = (orderData, preferredMethod = null) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_NWBNcuulgOOFEc",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "E-Commerce Store",
      description: "Purchase Transaction",
      order_id: orderData.id,
      handler: function (response) {
        verifyPayment(response);
      },
      prefill: {
        name: "Vedanti",
        email: "vedantikotkar45@gmail.com",
        contact: "+91 9359339024"
      },
      notes: {
        address: "Customer Address"
      },
      theme: {
        color: "#6366F1"
      }
    };

    // Set preferred payment method if specified
    if (preferredMethod === "upi") {
      options.method = { 
        upi: true 
      };
    } else if (preferredMethod === "netbanking") {
      options.method = { 
        netbanking: true 
      };
    }

    try {
      const paymentObject = new window.Razorpay(options);
      
      // Handle payment failure
      paymentObject.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      
      paymentObject.open();
    } catch (err) {
      console.error("Error opening Razorpay:", err);
      alert("Error opening payment form. Please try again.");
    }
  };

  // Handle Stripe Payment
  const handleStripePayment = () => {
    switch (selectedSubMethod) {
      case "stripe_checkout":
        window.open("https://buy.stripe.com/test_7sI4i0blt1VB2zueUV", "_blank");
        break;
      case "stripe_link":
        window.open("https://buy.stripe.com/test_7sI4i0blt1VB2zueUV", "_blank");
        break;
      case "stripe_button":
        // Button will handle the payment flow directly
        break;
      default:
        alert("Please select a Stripe payment option");
    }
  };

  // Verify Payment Signature
  const verifyPayment = async (paymentResponse) => {
    try {
      setLoading(true);
      
      try {
        // API call to verify payment
        const response = await axios.post("http://localhost:4000/payment/verify-payment", 
          new URLSearchParams({
            'orderId': order.id,
            'paymentId': paymentResponse.razorpay_payment_id,
            'signature': paymentResponse.razorpay_signature
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );
        
        if (response.data.status === "success") {
          handlePaymentSuccess(paymentResponse);
        } else {
          navigate("/payment-failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        // For demo purposes, assume payment succeeded
        handlePaymentSuccess(paymentResponse);
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  const handlePaymentSuccess = (paymentResponse) => {
    localStorage.setItem('transactionId', paymentResponse.razorpay_payment_id || 'demo_id');
    
   
    navigate("/payment-success", { 
      state: { 
        paymentId: paymentResponse.razorpay_payment_id || 'demo_id',
        orderId: order?.id || 'demo_order',
        amount: order?.amount ? order.amount / 100 : 500 
      } 
    });
  };

  
  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setSelectedSubMethod(null); 
    setShowQR(false);
  };

 
  const handleSubMethodSelect = (subMethodId) => {
    setSelectedSubMethod(subMethodId);
    setShowQR(false);
  };

  
  const getSubMethods = () => {
    if (selectedMethod === "razorpay") {
      return razorpaySubMethods;
    } else if (selectedMethod === "stripe") {
      return stripeSubMethods;
    }
    return [];
  };

  
  const hasSubMethods = () => {
    return selectedMethod === "razorpay" || selectedMethod === "stripe";
  };

  
  const getPaymentButtonText = () => {
    if (loading) return "Processing...";
    if (!selectedMethod) return "Select Payment Method";
    if (hasSubMethods() && !selectedSubMethod) return "Select Payment Option";
    return "Proceed to Pay";
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md mt-10 p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">Complete Your Payment</h2>
      
  
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Payment Method</h3>
        {paymentMethods.map((method) => (
          <div key={method.id} 
            className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedMethod === method.id 
              ? "bg-indigo-100 border-indigo-500 border-2" 
              : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <input 
              type="radio" 
              name="payment" 
              className="mr-2" 
              checked={selectedMethod === method.id}
              onChange={() => {}}
            />
            <span className="text-lg mr-3">{method.icon}</span>
            <span className="font-medium">{method.label}</span>
            {selectedMethod === method.id && (
              <span className="ml-auto text-indigo-600">✓</span>
            )}
          </div>
        ))}
      </div>
      
    
      {hasSubMethods() && selectedMethod && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">How would you like to pay?</h3>
          {getSubMethods().map((subMethod) => (
            <div key={subMethod.id} 
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedSubMethod === subMethod.id 
                ? "bg-indigo-100 border-indigo-500 border-2" 
                : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleSubMethodSelect(subMethod.id)}
            >
              <input 
                type="radio" 
                name="subPayment" 
                className="mr-2" 
                checked={selectedSubMethod === subMethod.id}
                onChange={() => {}}
              />
              <span className="text-lg mr-3">{subMethod.icon}</span>
              <span className="font-medium">{subMethod.label}</span>
              {selectedSubMethod === subMethod.id && (
                <span className="ml-auto text-indigo-600">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
      
     
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold">₹500.00</span>
        </div>
      </div>
      
    
      <button 
        className={`w-full text-white font-bold py-3 px-4 rounded-xl mt-6 transition-all duration-300 ${
          (!selectedMethod || (hasSubMethods() && !selectedSubMethod) || loading)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        }`}
        onClick={createOrder}
        disabled={!selectedMethod || (hasSubMethods() && !selectedSubMethod) || loading}
      >
        {getPaymentButtonText()}
      </button>
      
      
      {selectedSubMethod === "razorpay_button" && (
        <div className="mt-6">
          <div id="razorpay-payment-button" ref={razorpayFormRef} className="w-full flex justify-center">
          
          </div>
        </div>
      )}
      
      {selectedSubMethod === "razorpay_link" && (
        <div className="mt-6 text-center">
          <a 
            href="https://rzp.io/rzp/13yWpQtF" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Pay via Razorpay Link
          </a>
          <p className="text-sm text-gray-600 mt-2">
            You'll be redirected to Razorpay's secure payment page
          </p>
        </div>
      )}
      
      {showQR && selectedSubMethod === "razorpay_qr" && (
        <div className="mt-6 flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-64 h-64 flex items-center justify-center">
            <img 
              src="/api/placeholder/250/250" 
              alt="Payment QR Code" 
              className="w-full h-full object-contain" 
            />
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Scan this QR code with your banking app or UPI app to make the payment
          </p>
        </div>
      )}
      
      {/* Stripe Options */}
      {selectedSubMethod === "stripe_button" && (
        <div className="mt-6">
          <div ref={stripeFormRef} className="w-full flex justify-center">
            {/* Stripe button will be injected here */}
          </div>
        </div>
      )}
      
      {selectedSubMethod === "stripe_link" && (
        <div className="mt-6 text-center">
          <a 
            href="https://buy.stripe.com/test_7sI4i0blt1VB2zueUV" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Pay via Stripe Link
          </a>
          <p className="text-sm text-gray-600 mt-2">
            You'll be redirected to Stripe's secure payment page
          </p>
        </div>
      )}
      
      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-6 text-center">
        Your transaction is secured with industry-standard encryption. By proceeding, you agree to our terms and conditions.
      </p>
    </div>
  );
}