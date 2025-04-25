import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState({});

  const userId = "71cc1375-fde7-426c-a2da-a539bd7fac1a";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:4000/orders/user/${userId}`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setOrders(data);

        data.forEach((order) => fetchProductDetails(order.productId));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchProductDetails = async (productId) => {
    if (!productId) return;
    try {
      const response = await axios.get(`http://localhost:4000/products/${productId}`);
      if (response.data) {
        setProducts((prevProducts) => ({
          ...prevProducts,
          [productId]: response.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleRatingSubmit = async (productId, rating) => {
    try {
      const response = await fetch(
        `http://localhost:4000/rated-products/rate?userId=${userId}&productId=${productId}&rating=${rating}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to submit rating");
      alert("Rating submitted!");
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleReviewSubmit = async (productId, review) => {
    try {
      const response = await fetch(
        `http://localhost:4000/reviewed-products/review?userId=${userId}&productId=${productId}&review=${encodeURIComponent(review)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to submit review");
      alert("Review submitted!");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:4000/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete order");

      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      console.log(`Order ${orderId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : (
        orders.map((order) => {
          const product = products[order.productId] || {};
          return (
            <div key={order.id} className="flex bg-gray-100 p-4 rounded-lg shadow-md mb-4">
              <img
                src={product.imageUrl || "/placeholder.jpg"}
                alt={`Order ${order.id}`}
                className="w-24 h-24 rounded-lg mr-4 object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-green-600">{order.status}</span>
                  <span className="text-gray-500">{order.date}</span>
                </div>
                <h3 className="text-lg font-semibold">{product.productName}</h3>
                <Rating productId={order.productId} onRatingSubmit={handleRatingSubmit} />
                <Review productId={order.productId} onReviewSubmit={handleReviewSubmit} />
              </div>
              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="ml-2 text-red-500 hover:text-red-700 transition text-sm"
                title="Delete Order"
              >
                🗑️
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

const Rating = ({ productId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
    onRatingSubmit(productId, rate);
  };

  return (
    <div className="mt-2">
      <h4 className="text-sm font-medium">Rate this product:</h4>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
            onClick={() => handleRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

const Review = ({ productId, onReviewSubmit }) => {
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;
    await onReviewSubmit(productId, review);
    setReview("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <h4 className="text-sm font-medium">Leave a review:</h4>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here..."
        required
        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
      />
      <button
        type="submit"
        className="mt-2 bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-400 hover:text-white transition"
      >
        Submit
      </button>
    </form>
  );
};

export default Orders;
