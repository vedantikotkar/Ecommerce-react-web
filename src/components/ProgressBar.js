import React from "react";

const ProgressBar = ({ step }) => {
  const totalSteps = 3; // Define total steps in the flow
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="text-center mb-5">
      <div className="w-full h-2 bg-gray-300 rounded-md overflow-hidden mb-3">
        <div
          className="h-full bg-green-500 transition-all duration-400 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-400">
        <span className={step >= 1 ? "font-bold text-green-500" : ""}>Address</span>
        <span className={step >= 2 ? "font-bold text-green-500" : ""}>Order Summary</span>
        <span className={step >= 3 ? "font-bold text-green-500" : ""}>Payment</span>
      </div>
    </div>
  );
};

export default ProgressBar;
