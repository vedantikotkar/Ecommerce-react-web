import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ImageSlider from "./ImageSlider";
import TodaysDeals from "./TodaysDeals";
import RecommendedProducts from "./RecommendedProducts";

const Home = () => {
  return (
    <div className="flex flex-col">
     
      <Navbar />
      <div className="flex mt-4">
        <Sidebar />
        <ImageSlider />
      </div>
      <TodaysDeals />
      <RecommendedProducts />
    </div>
  );
};

export default Home;
