import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_API_BASEURL;

const ViewTermCondition = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch terms from API
  const fetchTermsAndConditions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/settings/getOfferTermsAndCondition`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data.success && data.offerTermsAndCondition) {
        setTerms(data.offerTermsAndCondition);
      } else {
        throw new Error(data.message || "Failed to fetch terms");
      }
    } catch (err) {
      console.error("Error fetching terms:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans p-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-3xl"
        >
          <BsArrowLeftCircle />
        </button>
        <h1 className="text-xl font-poppins font-medium text-gray-800 ml-4">
          View Offer Terms & Conditions
        </h1>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 flex-1 overflow-auto">
        <div className="text-gray-700 text-sm md:text-base leading-relaxed">
          {loading && (
            <p className="text-gray-500">Loading terms and conditions...</p>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-medium">Failed to load terms</p>
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={fetchTermsAndConditions}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && terms && (
            <div>
              {/* Render description as HTML */}
              <div
                className="prose prose-gray max-w-none space-y-4"
                dangerouslySetInnerHTML={{ __html: terms.description }}
              />
              <p className="text-xs text-gray-400 mt-4">
                Last updated: {new Date(terms.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTermCondition;
