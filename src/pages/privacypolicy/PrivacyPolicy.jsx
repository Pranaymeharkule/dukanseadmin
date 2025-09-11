// src/pages/settings/PrivacyPolicy.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";

// ============================================================================
// Presentational Component
// ============================================================================
const PrivacyContent = ({ isLoading, privacy }) => {
  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>Loading...</p>
      </div>
    );
  }

  if (!privacy) {
    return (
      <p className="text-center text-gray-500 py-10">
        No Privacy Policy found.
      </p>
    );
  }

  return (
    <>
      {/* Dynamically inserted HTML content */}
      <div
        className="prose prose-base max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: privacy.description }}
      />
    </>
  );
};

// ============================================================================
// Container Component
// ============================================================================
export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [effectiveDate, setEffectiveDate] = useState("");

  useEffect(() => {
    async function fetchPrivacy() {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://dukanse-be.onrender.com/api/settings/getUserPrivacy"
        );
        const result = await response.json();

        // Prefer result.privacyPolicy (as your other component used result.termsAndCondition)
        if (result.success && result.privacyPolicy) {
          const data = result.privacyPolicy;

          if (data.createdAt) {
            const dateObj = new Date(data.createdAt);
            const formattedDate = dateObj.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
            setEffectiveDate(formattedDate);
          }

          setPrivacy(data);
        } else if (result.privacyPolicy) {
          // handle when success flag missing but payload exists
          const data = result.privacyPolicy;
          if (data.createdAt) {
            const dateObj = new Date(data.createdAt);
            const formattedDate = dateObj.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
            setEffectiveDate(formattedDate);
          }
          setPrivacy(data);
        } else {
          // fallback
          setPrivacy({
            description: `<p>Error loading privacy policy.</p>`,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setPrivacy({
          description:
            `<p>Error loading privacy policy. Please try again later.</p>`,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrivacy();
  }, []);

  const handleEdit = () => {
    navigate("/privacy-policy/edit");
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-3">
      {/* Header */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <BsArrowLeftCircle
                size={20}
                className="text-gray-700 md:text-black"
              />
            </button>
            <h2 className="text-lg text-gray-800 font-medium">
               Privacy Policy
            </h2>
          </div>
        </div>


      {/* Content */}
      <div className="bg-white rounded-lg mt-4 shadow-md flex flex-col h-[80vh]">
        {/* Effective Date fixed at top */}
        {effectiveDate && (
          <div className="px-6 py-3  bg-white sticky top-0 z-10">
            <p className="font-semibold text-gray-800">
              Effective Date: {effectiveDate}
            </p>
          </div>
        )}

        {/* Scrollable text */}
        <div
          className="p-6 overflow-y-auto flex-1 text-justify break-words text-base"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
              /* Chrome, Safari, Edge */
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          <PrivacyContent isLoading={isLoading} privacy={privacy} />
        </div>

        {/* Edit button fixed at bottom */}
        <div className="p-4 flex justify-center">
          <button
            onClick={handleEdit}
            className="px-10 py-2 rounded-lg font-semibold text-[#EC2D01] bg-yellow-400  disabled:cursor-not-allowed"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
