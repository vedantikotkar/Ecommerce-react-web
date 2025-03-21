import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Logout button clicked!");

    const refreshToken = localStorage.getItem("refreshToken");

    console.log("Refresh Token:", refreshToken);

    if (!refreshToken) {
      console.warn("No valid token found. Redirecting to login.");
      clearStorageAndRedirect();
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/logout",
        { refreshToken }
      );

      if (response.status === 200) {
        console.log("Logout successful:", response.data);
      } else {
        console.warn("Logout request did not return status 200.");
      }
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
    } finally {
      clearStorageAndRedirect();
    }
  };

  const clearStorageAndRedirect = () => {
    console.log("Clearing tokens...");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("authUser");

    console.log("Redirecting to login...");
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-3">Are you sure you want to logout?</h2>
        <button 
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
