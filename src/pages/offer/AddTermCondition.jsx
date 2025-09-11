import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const SuccessCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="text-green-500 h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"
    />
  </svg>
);

const AddTermsCondition = () => {
  const [termsData, setTermsData] = useState(null);
  const [editableContent, setEditableContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { offerId } = useParams();


  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // ✅ Fetch Offer Terms
  const fetchTermsAndConditions = async () => {
    try {
      setLoading(true);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  // ✅ Update Offer Terms
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

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate(`/offer/edit-terms/${offerId}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
      alert("Failed to update terms.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans p-4 relative">
      {/* ✅ Success Overlay */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center animate-fadeIn">
            <SuccessCheckIcon className="mb-4" />
            <p className="text-gray-800 font-semibold text-lg text-center">
              Terms updated successfully
            </p>
          </div>
        </div>
      )}


      <div className="flex-1 flex flex-col w-full space-y-4">
        {/* Header */}
        <div className="bg-white rounded-xl overflow-hidden">
          <header className="flex items-center justify-between p-3 gap-3 bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="w-8 h-8 flex items-center justify-center border-[3px] border-gray-600 rounded-full hover:border-gray-800 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={3} />
              </button>
              <h1 className="text-lg text-gray-800 font-poppins font-medium">
                Add Offer Terms & Conditions
              </h1>
            </div>

            {/* Edit Controls */}
            {!loading && !error && termsData && (
              <div className="flex justify-between items-center mb-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-brandYellow text-white px-6 py-2 rounded-md flex items-center gap-2 font-poppins font-medium"
                  >
                    <FiEdit className="text-lg" />Edit
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={updateTerms}
                      disabled={updating}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-poppins disabled:opacity-50"
                    >
                      {updating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditableContent(termsData?.description || "");
                      }}
                      disabled={updating}
                      className="px-4 py-2 bg-gray-500 text-white font-poppins rounded-lg hover:bg-gray-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </header>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl flex-1 flex flex-col">
          <main className="p-6 flex-1 overflow-y-auto text-gray-700 leading-relaxed">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                <span className="ml-3 text-gray-600 font-poppins font-medium">
                  Loading terms and conditions...
                </span>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 font-medium">Error loading terms</p>
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                  <button
                    onClick={fetchTermsAndConditions}
                    className="mt-3 font-poppins px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && termsData && (
              <>
                {!isEditing ? (
                  <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: termsData.description }}
                  />
                ) : (
                  <ReactQuill
                    theme="snow"
                    value={editableContent}
                    onChange={setEditableContent}
                    className="h-[400px] bg-white font-poppins"
                  />
                )}
              </>
            )}
          </main>

          {/* Footer */}
          {!isEditing && (
            <footer className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-center">
              <button
                onClick={() => navigate(`/offer/add`)}
                className="px-6 py-3 bg-brandYellow text-brandRed font-semibold font-poppins rounded-lg hover:bg-yellow-500"
              >
                Add
              </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTermsCondition;
