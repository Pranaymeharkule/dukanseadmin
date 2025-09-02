import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Edit Icon
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

// Save Icon
const SaveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// Cancel Icon
const CancelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);


const AddTermCondition = () => {
  const [termsData, setTermsData] = useState(null);
  const [editableContent, setEditableContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [rawContent, setRawContent] = useState("");
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
   const handleBackNavigation = () => {
    navigate(-1);
  };



  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // Fetch terms
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
        setTermsData(data.offerTermsAndCondition);
        setEditableContent(data.offerTermsAndCondition.description);
      } else {
        throw new Error(data.message || "Failed to fetch terms");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

 
  // Update terms
  const updateTerms = async () => {
    try {
      setUpdating(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/settings/updateOfferTermsAndCondition`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: editableContent }),
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Update failed");

      setTermsData(data.updatedOfferTermsAndCondition);
      setIsEditing(false);
      alert("Terms updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditableContent(termsData?.description || "");
  };
  const handleSave = () => updateTerms();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans p-4">
      <div className="flex-1 flex flex-col w-full space-y-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4">
          <header className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center">
              <button
                onClick={handleBackNavigation}
                type="button"
                title="Go Back"
                className="w-8 h-8 flex items-center justify-center border-[3px] border-gray-600 rounded-full hover:border-gray-800 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={3} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 px-4">
                Add Offer Terms & Conditions
              </h1>
            </div>

            {/* Edit Controls */}
            {!loading && !error && termsData && (
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-brandYellow text-white rounded-lg"
                  >
                    <EditIcon />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={updating}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <SaveIcon />
                      <span>{updating ? "Saving..." : "Save"}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={updating}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      <CancelIcon />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </header>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-1 flex flex-col">
          <main className="p-6 overflow-y-auto text-gray-700 leading-relaxed flex-1">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                <span className="ml-3 text-gray-600">
                  Loading terms and conditions...
                </span>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 font-medium">
                    Error loading terms and conditions
                  </p>
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                  <button
                    onClick={fetchTermsAndConditions}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && termsData && (
              <div className="space-y-4">
                {!isEditing ? (
                  <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: termsData.description }}
                  />
                ) : (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Edit Terms and Conditions Content:
                    </label>
                    <textarea
                      value={rawContent}
                      onChange={(e) => {
                        const newRaw = e.target.value;
                        setRawContent(newRaw);

                        const formattedContent = newRaw
                          .split("\n\n")
                          .map((paragraph) =>
                            paragraph.trim()
                              ? `<p style="margin-bottom: 16px;">${paragraph.replace(
                                  /\n/g,
                                  "<br/>"
                                )}</p>`
                              : ""
                          )
                          .join("");

                        setEditableContent(formattedContent);
                      }}
                      rows={15}
                      className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Enter terms and conditions content..."
                    />

                    <p className="text-sm text-gray-500">
                      Separate paragraphs with double line breaks. Basic
                      formatting will be applied automatically.
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Footer */}
          {!isEditing && (
            <footer className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Last updated:{" "}
                  {termsData ? new Date().toLocaleDateString() : "N/A"}
                </p>
                <button
                  onClick={() => (window.location.href = "/offer/add")}
                  className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Done
                </button>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTermCondition;
