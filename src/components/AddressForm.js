import React, { useState } from "react";

const AddressForm = () => {
  const [address, setAddress] = useState({
    street: "",
    village: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Address Submitted:", address);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">Enter Address Details</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {[
          { label: "Street", name: "street" },
          { label: "Village", name: "village" },
          { label: "City", name: "city" },
          { label: "State", name: "state" },
          { label: "Country", name: "country" },
          { label: "Postal Code", name: "postalCode" },
        ].map(({ label, name }) => (
          <div key={name} className="mb-4">
            <label className="block font-medium mb-1">{label}:</label>
            <input
              type="text"
              name={name}
              value={address[name]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
