import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setResponseMessage("Email sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setResponseMessage("Error sending email. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Error sending email. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 bg-white shadow-lg rounded-2xl flex flex-col md:flex-row gap-8">
      {/* Contact Info Section */}
      <div className="flex-1 bg-gray-100 p-6 rounded-xl shadow-md transition duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-bold text-gray-700 border-b-2 border-gray-400 pb-2 mb-6">
          Contact Us
        </h2>

        <div className="mb-6 p-4 border rounded-lg hover:shadow-md transition bg-gray-50">
          <span className="text-3xl text-blue-500">📞</span>
          <h3 className="text-lg font-semibold text-gray-700">Call Us</h3>
          <p className="text-gray-600">Available 24/7, 7 days a week.</p>
          <p className="font-semibold text-gray-800">+1 978-487-8379</p>
        </div>

        <div className="mb-6 p-4 border rounded-lg hover:shadow-md transition bg-gray-50">
          <span className="text-3xl text-blue-500">📧</span>
          <h3 className="text-lg font-semibold text-gray-700">Email Us</h3>
          <p className="text-gray-600">We respond within 24 hours.</p>
          <p className="font-semibold text-gray-800">customer@exclusive.com</p>
          <p className="font-semibold text-gray-800">support@exclusive.com</p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="flex-1 bg-gray-100 p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-700 text-center border-b-2 border-gray-400 pb-2 mb-6">
          Get In Touch
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700">Your Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Your Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Your Phone*</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Your Message</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-100 text-blue-600 py-3 rounded-lg font-semibold text-sm hover:bg-blue-400 hover:text-white"
          >
            Send Message
          </button>
        </form>

        {responseMessage && (
          <p className="text-center mt-4 font-semibold text-green-600">{responseMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
