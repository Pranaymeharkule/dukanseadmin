// src/pages/helpsupport/CustomerSupportNumber.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function CustomerSupportNumber() {
  const navigate = useNavigate();
  const location = useLocation();

  const [supportNumber, setSupportNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [supportId, setSupportId] = useState("");

  // API Base URL
  const BASE_URL = "https://dukanse-be-f5w4.onrender.com/api/supportNumber";

  // Fetch support number (GET API)
  useEffect(() => {
    const fetchSupportNumber = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/getNumber`);
        if (res.data.success) {
          setSupportNumber(res.data.supportNumber.contactNumber);
          setSupportId(res.data.supportNumber._id);
        }
      } catch (err) {
        console.error("Error fetching support number:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSupportNumber();
  }, []);

  // Save/Update support number (PUT API)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!supportId) {
      alert("Support ID not found. Please refresh the page.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/updateNumber/${supportId}`,
        { contactNumber: supportNumber }
      );

      if (res.data.success) {
        alert("Customer Support Number updated successfully!");
      } else {
        alert("Failed to update number.");
      }
    } catch (err) {
      console.error("Error updating support number:", err);
      alert("Something went wrong while updating!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-3">
      
      {/* Header */}
      <div className="bg-white px-4 py-3 rounded-md shadow">
        <h2 className="text-lg  text-gray-800">Help & Support</h2>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white px-4 py-3 mt-4 rounded-md shadow flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/helpSupport")}
          className={`px-2 py-1 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport" ? "bg-[rgb(254,188,29)] " : ""
          }`}
        >
          Seller Complaints
        </button>

        <button
          onClick={() => navigate("/helpSupport/customer-complaints")}
          className={`px-2 py-1 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport/customer-complaints"
              ? "bg-[rgb(254,188,29)] "
              : ""
          }`}
        >
          Customer Complaints
        </button>

        <button
          onClick={() => navigate("/helpSupport/customer-support-number")}
          className={`px-2 py-1 rounded-md border  shadow text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport/customer-support-number"
              ? "bg-[rgb(254,188,29)] "
              : ""
          }`}
        >
          Customer Support Number
        </button>

        <button
          onClick={() => navigate("/helpSupport/faq")}
          className={`px-2 py-1 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport/faq"
              ? "bg-[rgb(254,188,29)] "
              : ""
          }`}
        >
          FAQ
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-md mt-4  shadow">
      <div className="w-full bg-white rounded-lg  min-h-[calc(100vh-200px)]">
        <main className="">
          <form
            onSubmit={handleSave}
            className="p-6 flex flex-col min-h-[300px]"
          >
            <label className="block text-gray-800 font-semibold mb-2">
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

            <div className="flex justify-center mt-[19rem]">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FEBC1D] text-red-600 font-semibold px-8 py-2 rounded hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </main>
      </div>
      </div>
    </div>
  );
}
