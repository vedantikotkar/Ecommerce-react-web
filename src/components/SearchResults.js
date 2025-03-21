import React from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const { products } = location.state || { products: [] };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Search Results</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-48 object-contain bg-gray-200"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.productName}</h3>
                <div className="flex items-center mt-2">
                  <span className="bg-green-600 text-white px-2 py-1 text-sm font-bold rounded">{product.rating} ★</span>
                  <span className="text-gray-600 ml-2 text-sm">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-bold text-red-600">${product.price}</span>
                  <span className="bg-red-500 text-white px-2 py-1 text-sm font-bold rounded">{product.discountPercentage}% OFF</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">No products found for your search.</p>
      )}
    </div>
  );
};

export default SearchResults;