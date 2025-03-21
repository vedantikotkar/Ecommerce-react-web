import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AccountPage = () => {
  const navigate = useNavigate();
  const [user, setUser ] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  // useEffect(() => {
  //   const storedUser  = JSON.parse(localStorage.getItem("user"));
  //   if (!storedUser ) {
  //     navigate("/login");
  //   } else {
  //     setUser (storedUser );
    
  //     const storedImage = localStorage.getItem("profileImage");
  //     if (storedImage) {
  //       setProfileImage(`http://localhost:4000/uploads/${storedImage}`);
  //     }
  //   }
  // }, [navigate]);

  // const handleImageUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setUploading(true);
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("username", user.username);

  //     try {
  //       const response = await axios.post(
  //         "http://localhost:4000/auth/upload",
  //         formData,
  //         {
  //           headers: { "Content-Type": "multipart/form-data" },
  //         }
  //       );

  //       const uploadedFileName = response.data.split(": ")[1].trim();
  //       const imageUrl = `http://localhost:4000/uploads/${uploadedFileName}`;

  //       setProfileImage(imageUrl);
  //       localStorage.setItem("profileImage", uploadedFileName);
  //     } catch (error) {
  //       console.error("Error uploading profile photo:", error);
  //     } finally {
  //       setUploading(false);
  //     }
  //   }
  // };

  // const handleDeleteImage = async () => {
  //   const filename = localStorage.getItem("profileImage");
  //   if (!filename) return;

  //   try {
  //     await axios.delete(
  //       `http://localhost:4000/auth/remove/${filename}?username=${user.username}`
  //     );

  //     setProfileImage(null);
  //     localStorage.removeItem("profileImage");
  //   } catch (error) {
  //     console.error("Error deleting profile photo:", error);
  //   }
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  // const handleSaveChanges = () => {
  //   console.log("Saving changes:", formData);
  // };

  const menuItems = [
    { id: "profile", label: "My Profile", icon: "user" },
    { id: "address", label: "Address Book", icon: "map" },
    { id: "payment", label: "Payment Options", icon: "credit-card" },
    { id: "orders", label: "Order History", icon: "shopping-bag" },
    { id: "wishlist", label: "Wishlist", icon: "heart" },
    { id: "settings", label: "Account Settings", icon: "settings" },
  ];

  const icons = {
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
    map: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    ),
    "credit-card": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
    "shopping-bag": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
      </svg>
    ),
    heart: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    settings: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  };


  useEffect(() => {
    const storedUser  = JSON.parse(localStorage.getItem("user"));
    if (!storedUser ) {
      navigate("/login");
    } else {
      setUser (storedUser );
      const storedImage = localStorage.getItem("profileImage");
      if (storedImage) {
        setProfileImage(`http://localhost:4000/uploads/${storedImage}`);
      }
    }
  }, [navigate]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", user.username);

      try {
        const response = await axios.post(
          "http://localhost:4000/auth/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const uploadedFileName = response.data.split(": ")[1].trim();
        const imageUrl = `http://localhost:4000/products/images/${uploadedFileName}`;

        setProfileImage(imageUrl);
        localStorage.setItem("profileImage", uploadedFileName);
      } catch (error) {
        console.error("Error uploading profile photo:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDeleteImage = async () => {
    const filename = localStorage.getItem("profileImage");
    if (!filename) return;

    try {
      await axios.delete(
        `http://localhost:4000/auth/remove/${filename}?username=${user.username}`
      );

      setProfileImage(null);
      localStorage.removeItem("profileImage");
    } catch (error) {
      console.error("Error deleting profile photo:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", formData);
    // Implement save changes logic here
  };

  const renderEmptyState = (title, buttonText) => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">You haven't added any {title.toLowerCase()} yet.</p>
      </div>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        {buttonText}
      </button>
    </div>
  );

  const renderDevelopmentPlaceholder = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-700 mb-2">No Data Available</h3>
      <p className="text-gray-500 text-center max-w-md">
        This section is under development. Please check back later for updates.
      </p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24 w-full relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
          <h1 className="text-3xl font-bold text-white">My Account</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 bg-gray-50 py-8 px-6">
              <div className="flex flex-col items-center md:items-start mb-8">
                <div className="relative">
                {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                      onError={() => setProfileImage(null)}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {user && (
                  <div className="mt-4 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                )}
              </div>
                {user && (
                  <div className="mt-4 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                )}
            

              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span className="w-6 h-6 mr-3 flex items-center justify-center">
                      {icons[item.icon]}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

           {/* Profile Content */}
           <div className="flex-1 p-8">
              <div className="space-y-8">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                              onError={() => setProfileImage(null)}
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex">
                          <input
                            type="file"
                            id="imageUpload"
                            onChange={handleImageUpload}
                            hidden
                            accept="image/*"
                          />
                          <label
                            htmlFor="imageUpload"
                            className="bg-blue-500 text-white px-4 py-2 rounded-l-lg cursor-pointer hover:bg-blue-600 transition flex items-center justify-center"
                          >
                            {uploading ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                              </span>
                            ) : (
                              "Change Photo"
                            )}
                          </label>
                          {profileImage && (
                            <button
                              className="bg-red-500 text-white px-4 py-2 rounded-r-lg hover:bg-red-600 transition"
                              onClick={handleDeleteImage}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={user?.username || ""}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={user?.email || ""}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your phone number"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <button 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center"
                        onClick={handleSaveChanges}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
             

              {activeTab === "address" && renderEmptyState("Address Book", "Add New Address")}
              {activeTab === "payment" && renderEmptyState("Payment Options", "Add Payment Method")}
              {(activeTab === "orders" || activeTab === "wishlist" || activeTab === "settings") && renderDevelopmentPlaceholder()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;