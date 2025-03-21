import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/categories/${categoryId}`)
      .then((res) => setCategoryName(res.data.name))
      .catch((error) => console.error("Error fetching category name:", error));

    axios
      .get(`http://localhost:4000/products/category/${categoryId}`)
      .then((res) => setProducts(res.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, [categoryId]);

  return (
    <div className="p-5 flex-1">
      <h2 className="text-3xl font-bold mb-6">{categoryName} Products</h2>
      <div className="flex flex-wrap gap-5">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-300 p-3 w-52 rounded-lg text-center shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-40 object-cover mb-4 rounded-lg cursor-pointer"
                onClick={() => navigate(`/productdetail/${product.id}`)}
              />
              <h3 className="text-lg font-semibold mb-2">{product.productName}</h3>
              <div className="w-full p-3 text-center">
                <div className="inline-block bg-green-800 text-white px-3 py-1 text-sm font-bold rounded-md">
                  {product.rating} ★
                </div>
                <span className="text-gray-600 ml-2">({product.reviewCount})</span>
              </div>
              <div className="flex justify-center items-center gap-2 mt-2">
                <span className="text-lg font-bold text-red-600">${product.price}</span>
                <span className="text-sm text-red-500">{product.discountPercentage}% OFF</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-lg">No products found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
