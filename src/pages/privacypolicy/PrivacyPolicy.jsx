// src/pages/settings/PrivacyPolicy.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumbs";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // ✅ Fetch privacy policy on mount
  useEffect(() => {
    async function fetchPrivacyPolicy() {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/getUserPrivacy`);
        const data = await res.json();
        const description = data?.privacyPolicy?.description || "No privacy policy found.";
        setContent(description);
      } catch (error) {
        console.error("Failed to fetch privacy policy:", error);
        setContent("Error loading privacy policy.");
      } finally {
        setLoading(false);
      }
    }

    fetchPrivacyPolicy();
  }, []);

  return (
    <div className="flex flex-col lg:h-full">
      {/* Header: Breadcrumb & Edit Button */}
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb titles={["Privacy Policy"]} />
        <button
          className="bg-brandYellow text-white px-6 py-2 rounded-md flex items-center gap-2 font-medium"
          onClick={() => navigate("/privacy-policy/edit")}
        >
          <FiEdit className="text-lg" />
          Edit
        </button>
      </div>

      {/* Privacy Policy Content */}
      <div className="text-gray-700 h-[65vh] overflow-y-auto scrollbar-hide p-4 border border-gray-200 rounded-md prose">
        {loading ? <p>Loading...</p> : <div dangerouslySetInnerHTML={{ __html: content }} />}
      </div>
    </div>
  );
}
