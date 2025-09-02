import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const SuccessOverlay = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm w-full">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-semibold">{message}</h2>
      </div>
    </div>
  );
};

export default SuccessOverlay;