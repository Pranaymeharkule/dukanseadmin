// src/pages/settings/PrivacyPolicy.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumbs";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/getUserPrivacy`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setContent(data?.privacyPolicy?.description || "No privacy policy found.");
      } catch (err) {
        console.error("Failed to fetch privacy policy:", err);
        setError("Failed to load privacy policy. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, [API_BASE_URL]);

  return (
    // Main container uses flex-col to stack children vertically and h-full to occupy available height
    <div className="flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex justify-start items-center shadow p-2 rounded-md mb-4">
        <Breadcrumb titles={["Privacy Policy"]} />
      </div>

      {/* Privacy Policy Content */}
      {/* flex-grow allows this div to take up all available space, pushing the button to the bottom */}
      <div className="flex-grow overflow-y-auto scrollbar-hide p-6 border border-gray-200 rounded-md prose mb-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading privacy policy...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : content ? (
          // The 'prose' class from Tailwind Typography helps style this HTML content
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p className="text-center text-gray-500">No privacy policy available.</p>
        )}
      </div>

      {/* Edit Button Container */}
      {/* This container is now outside the scrollable area */}
      <div className="flex justify-center w-full">
        <button
          className="w-full bg-brandYellow text-white py-3 rounded-md flex items-center justify-center gap-2 font-medium hover:bg-yellow-600 transition"
          onClick={() => navigate("/privacy-policy/edit")}
        >
          <FiEdit className="text-lg" />
          Edit
        </button>
      </div>
    </div>
  );
}