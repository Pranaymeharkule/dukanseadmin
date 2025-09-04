// src/pages/helpsupport/CustomerSupportNumber.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CustomerSupportNumber() {
  const navigate = useNavigate();
  const location = useLocation();

  const [supportNumber, setSupportNumber] = useState(
    localStorage.getItem("supportNumber") || ""
  );

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("supportNumber", supportNumber);
    alert("Customer Support Number saved!");
  };

  return (
    <div className="bg-gray-100 p-3">
      {/* Header */}
      <div className="bg-white px-4 py-3 rounded-md shadow">
        <h2 className="text-lg font-semibold text-gray-800">Help & Support</h2>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white px-4 py-3 mt-4 rounded-md shadow flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/helpSupport")}
          className={`px-4 py-2 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport" ? "bg-[rgb(254,188,29)] " : ""
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
          <form
            onSubmit={handleSave}
            className="p-6 flex flex-col min-h-[300px]"
          >
            <label className="block text-gray-800 font-medium mb-2">
              Customer Support Number
            </label>

            <input
              type="tel"
              placeholder="+91 1234567890"
              value={supportNumber}
              onChange={(e) => setSupportNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#FEBC1D]"
            />

            <div className="flex justify-center mt-auto">
              <button
                type="submit"
                className="bg-[#FEBC1D] text-red-600 font-semibold px-8 py-2 rounded hover:opacity-90"
              >
                Save
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
