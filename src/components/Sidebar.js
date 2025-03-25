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
    <div className="w-64 bg-white text-black h-screen  p-5 mt-10">
   
      <ul className="space-y-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category.id} className="p-3 rounded-md hover:bg-blue-200 hover:text-white">
              <Link to={`/category/${category.id}`} className="text-sm  font-bold text-black hover:text-white">
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
