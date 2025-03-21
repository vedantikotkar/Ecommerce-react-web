import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <div className="w-64 bg-white h-screen  p-5 mt-10">
   
      <ul className="space-y-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category.id} className="p-3 rounded-md hover:bg-gray-200">
              <Link to={`/category/${category.id}`} className="text-lg text-gray-700 hover:text-blue-600">
                {category.name}
              </Link>
            </li>
          ))
        ) : (
          <p className="text-gray-500">Loading categories...</p>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
