// src/pages/helpsupport/CustomerSupportNumber.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CustomerSupportNumber() {
  const navigate = useNavigate();
  const location = useLocation();
  const [supportNumber, setSupportNumber] = useState("+91 123-456-7890");

  // Save handler
  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saved:", supportNumber);
    // here you can call API to save number
  };

  // 🔹 Updated SupportNumberView with button at the bottom center
  const SupportNumberView = () => (
    <form onSubmit={handleSave} className="p-6 flex flex-col min-h-[300px]">
      {/* Label */}
      <label className="block text-gray-800 font-medium mb-2">
        Customer Support Number
      </label>

      {/* Input */}
      <input
        type="text"
        value={supportNumber}
        onChange={(e) => setSupportNumber(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#FEBC1D]"
      />

      {/* Save Button at Bottom Center */}
      <div className="flex justify-center mt-auto">
        <button
          type="submit"
          className="bg-[#FEBC1D] text-red-600 font-semibold px-8 py-2 rounded hover:opacity-90"
        >
          Save
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-gray-100 p-3">
      <div className="bg-white px-4 py-3 rounded-md shadow">
        <h2 className="text-lg font-semibold text-gray-800">Help & Support</h2>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white px-4 py-3 mt-4 rounded-md shadow flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/helpSupport")}
          className={`px-4 py-2 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport"
              ? "bg-[rgb(254,188,29)] "
              : ""
          }`}
        >
          Seller Complaints
        </button>

        <button
          onClick={() => navigate("/helpSupport/customer-complaints")}
          className={`px-4 py-2 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport/customer-complaints"
              ? "bg-[rgb(254,188,29)] "
              : ""
          }`}
        >
          Customer Complaints
        </button>

        <button
          onClick={() => navigate("/helpSupport/customer-support-number")}
          className={`px-4 py-2 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport/customer-support-number"
              ? "bg-[rgb(254,188,29)] "
              : ""
          }`}
        >
          Customer Support Number
        </button>

        <button
          onClick={() => navigate("/helpSupport/faq")}
          className={`px-4 py-2 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport/faq"
              ? "bg-[rgb(254,188,29)] "
              : ""
          }`}
        >
          FAQ
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-md m-2 p-4 shadow">
        <main className="mt-6">
          <SupportNumberView />
        </main>
      </div>
    </div>
  );
}
