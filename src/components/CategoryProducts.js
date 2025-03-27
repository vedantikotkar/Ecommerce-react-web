import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [wishlist, setWishlist] = useState([]);

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

  const handleWishlist = (product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const addToCart = (product) => {
    console.log("Added to cart:", product);
  };

  return (
    <div className="p-5 flex-1">
      <h2 className="text-3xl font-bold mb-6">{categoryName} Products</h2>
      <div className="flex flex-wrap gap-5">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg overflow-hidden w-64"
            >
              <div className="relative p-4">
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-full h-40 object-contain cursor-pointer"
                  onClick={() => navigate(`/productdetail/${product.id}`)}
                />
                <FaHeart
                  className={`absolute top-2 right-2 text-xl cursor-pointer ${
                    wishlist.some((item) => item.id === product.id)
                      ? "text-black-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleWishlist(product)}
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold">{product.productName}</h3>
                <div className="flex items-center text-yellow-500 text-sm">
                  <span>{product.rating} ★</span>
                  <span className="ml-2 text-gray-500">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-gray-800">
                    ${product.price}
                  </span>
                  <span className="text-sm text-red-600 font-semibold">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
              </div>
              <button
                className="w-full bg-blue-100 text-blue-600 font-semibold py-3 rounded-b-md flex items-center justify-center hover:bg-blue-400 hover:text-white transition"
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-lg">
            No products found for this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
