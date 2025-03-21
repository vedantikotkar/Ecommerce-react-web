import { useState } from "react";
import axios from "axios";

export default function PaymentIntegration() {
  const [amount, setAmount] = useState(0);
  const [order, setOrder] = useState(null);
  const [paymentId, setPaymentId] = useState("");
  const [signature, setSignature] = useState("");
  const [status, setStatus] = useState(null);

  const createOrder = async () => {
    try {
      const response = await axios.post("http://localhost:8080/payment/create-order", {
        amount: amount,
        currency: "INR",
      });
      setOrder(response.data);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const verifyPayment = async () => {
    try {
      const response = await axios.post("http://localhost:8080/payment/verify-payment", {
        orderId: order?.orderId,
        paymentId: paymentId,
        signature: signature,
      });
      setStatus(response.data.status);
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Payment Integration</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Amount (INR)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <button
        onClick={createOrder}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create Order
      </button>
      {order && (
        <div className="mb-4">
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Amount:</strong> {order.amount} {order.currency}</p>
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium">Payment ID</label>
        <input
          type="text"
          value={paymentId}
          onChange={(e) => setPaymentId(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Signature</label>
        <input
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <button
        onClick={verifyPayment}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Verify Payment
      </button>
      {status && <p className="mt-4 font-bold">{status}</p>}
    </div>
  );
}
