import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================================
// Presentational Component
// ============================================================================
const TermsContent = ({ isLoading, term }) => {
  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>Loading...</p>
      </div>
    );
  }

  if (!term) {
    return (
      <p className="text-center text-gray-500 py-10">
        No Terms & Conditions found.
      </p>
    );
  }

  return (
    <>
      {/* Dynamically inserted HTML content */}
      <div
        className="prose prose-base max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: term.description }}
      />
    </>
  );
};

// ============================================================================
// Container Component
// ============================================================================
export default function TermsCondition() {
  const navigate = useNavigate();
  const [term, setTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [effectiveDate, setEffectiveDate] = useState("");

  useEffect(() => {
    async function fetchTerms() {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://dukanse-be.onrender.com/api/settings/getUserTerms"
        );
        const result = await response.json();
        if (result.success && result.termsAndCondition) {
          const data = result.termsAndCondition;

          // format createdAt -> "22 September, 2025"
          if (data.createdAt) {
            const dateObj = new Date(data.createdAt);
            const formattedDate = dateObj.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
            setEffectiveDate(formattedDate);
          }

          setTerm(data);
        } else {
          setTerm({
            description: `<p>Error loading terms and conditions.</p>`,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setTerm({
          description: `<p>Error loading terms and conditions. Please try again later.</p>`,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchTerms();
  }, []);

  const handleEdit = () => {
    navigate("/terms-condition/edit");
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-3">
      {/* Header */}
      <div className="bg-white px-4 py-3 rounded-md shadow">
        <h2 className="text-lg text-gray-800 font-medium">
          Terms & Conditions
        </h2>
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
          <TermsContent isLoading={isLoading} term={term} />
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
