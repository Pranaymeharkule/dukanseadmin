import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaRegCalendarAlt } from "react-icons/fa";

function PrivacyPolicyEdit() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("2025-01-01");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // ✅ Fetch current policy
  useEffect(() => {
    async function fetchTerms() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/settings/getUserPrivacy`
        );
        if (!response.ok) throw new Error("Failed to fetch privacy policy");

        const data = await response.json();
        const description = data?.privacyPolicy?.description || "";
        setTerm(description);
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
      }
    }
    fetchTerms();
  }, []);

  // ✅ PUT API to update
  const HandleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/settings/updateUserPrivacy`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: term }),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const result = await response.json();
      alert("Privacy policy updated successfully!");
      navigate("/privacy-policy");
    } catch (error) {
      console.error("Error updating policy:", error);
      alert("Failed to update privacy policy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
     <div className="mb-6">
  
  {/* Full width border box */}
  <div className="w-full border-2  rounded-md p-4  flex items-center gap-4">
  <button
    onClick={() => navigate(-1)}
    className="text-gray-600 hover:text-black text-xl"
  >
    <FiArrowLeft />
  </button>
  <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
    Edit Privacy Policy
  </h1>
</div>

</div>


      {/* Card */}
      <div className="bg-white shadow-lg rounded-xl mx-auto p-6 sm:p-8 space-y-6 ">
        {/* Effective Date Input with Icon */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2 ">
            Effective Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <FaRegCalendarAlt className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Rich Text Editor */}
        <div>
          <ReactQuill
            theme="snow"
            value={term}
            onChange={setTerm}
            className="h-[300px] bg-white"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center w-full mt">
          <button
            onClick={HandleUpdate}
            disabled={loading}
            className={`bg-yellow-500 mt-10 hover:bg-yellow-600 text-white font-semibold px-10 py-2.5 rounded-md shadow-md transition duration-200 ease-in-out ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyEdit;
