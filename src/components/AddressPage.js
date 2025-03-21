import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProgressBar from "./ProgressBar";

const AddressPage = ({ userAddress, setUserAddress }) => {
  const [address, setAddress] = useState(userAddress || {
    street: "",
    village: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    mobileNo: "",
  });

  const [username, setUsername] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null); 
  const navigate = useNavigate();
  const apiBaseUrl = "http://localhost:4000/auth"; 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.username) {
          setUsername(storedUser.username);
        } else {
          console.error("User not found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserAddress(address);
    navigate("/order-summary");
  };

  const handleSetDefaultAddress = async () => {
    if (!username) {
      setMessage({ type: "error", text: "User is not logged in!" });
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      const response = await axios.post(`${apiBaseUrl}/save-address/${username}`, address);
      setMessage({ type: "success", text: "Address set as default successfully!" });
      console.log("Address saved:", response.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to set address. Please try again." });
      console.error("Error saving address:", error);
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Enter Address Details</h2>
      <ProgressBar step={1} />

      {message && (
        <div className={`p-3 my-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {["street", "village", "city", "state", "country", "postalCode", "mobileNo"].map((field) => (
          <div className="flex flex-col" key={field}>
            <label className="font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="text"
              name={field}
              value={address[field]}
              onChange={handleChange}
              required
              className="border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition">
          Continue
        </button>
        <button
          type="button"
          className="w-full bg-gray-500 text-white p-2 rounded mt-2 hover:bg-gray-700 transition disabled:opacity-50"
          onClick={handleSetDefaultAddress}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Set as Default Address"}
        </button>
      </form>
    </div>
  );
};

export default AddressPage;
