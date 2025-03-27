import React, { useState } from "react";

const images = [
  "/iphone2.webp",
  "/coffee3.jpg",
  "/juice.jpg",
  "/frame3.jpg",
  "/burger.webp",
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-half h-screen object-cover overflow-hidden">
      {/* Slide Image */}
      <img
        src={images[currentIndex]}
        alt="Slide"
        className="w-half h-half object-cover"
      />

      {/* Dots Overlay */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
              index === currentIndex ? "bg-white" : "bg-white/60"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>

      {/* Next Button (Uncomment if needed) */}
      {/* <button
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black/50 text-white text-2xl p-2 rounded-full hover:bg-black/80 transition"
        onClick={nextSlide}
      >
        →
      </button> */}
    </div>
  );
};

export default ImageSlider;
