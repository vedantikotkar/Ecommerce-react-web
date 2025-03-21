import React from "react";

const AboutPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About Us</h1>
        <p className="text-gray-600 mb-4">
          Welcome to our website! We are dedicated to providing the best services and products to our customers.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Our Mission</h2>
        <p className="text-gray-600">
          Our mission is to create innovative solutions that improve the lives of people worldwide.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Our Vision</h2>
        <p className="text-gray-600">
          We envision a world where technology simplifies everyday tasks and enhances productivity.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Contact Us</h2>
        <p className="text-gray-600">
          📧 Email: <span className="font-medium text-blue-600">support@example.com</span> <br />
          📍 Address: 123, Tech Street, Silicon Valley, CA
        </p>
        
      </div>
    </div>
  );
};

export default AboutPage;
