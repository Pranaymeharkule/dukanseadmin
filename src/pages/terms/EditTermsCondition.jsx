// src/pages/settings/EditTermsCondition.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BsArrowLeftCircle } from "react-icons/bs";

// SVG icon component for the calendar
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default function EditTermsCondition() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState("1st January, 2025");

  // ✅ GET terms on load
  useEffect(() => {
    async function fetchTerms() {
      try {
        const response = await fetch(
          "https://dukanse-be.onrender.com/api/settings/getUserTerms"
        );
        const result = await response.json();
        if (result.success && result.termsAndCondition) {
          setTerm(result.termsAndCondition.description);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    }

    fetchTerms();
  }, []);

  // ✅ PUT to update
  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://dukanse-be.onrender.com/api/settings/updateUserTerms",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: term }),
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Terms updated successfully!");
        navigate("/terms-condition");
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-4 bg-white p-4 md:p-5 rounded shadow">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <BsArrowLeftCircle
                size={25}
                className="text-gray-700 md:text-black"
              />
            </button>
            <h2 className="text-lg md:text-xl font-semibold">
              Edit Terms and Condition
            </h2>
          </div>
        </div>

        {/* Main card */}
        <div className=" bg-white p-6 rounded-lg shadow-md flex flex-col border border-gray-300">
  {/* Effective Date */}
  <div className="mb-6">
    <label
      htmlFor="effectiveDate"
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      Effective Date
    </label>
    <div className="relative">
      <input
        type="text"
        id="effectiveDate"
        value={effectiveDate}
        readOnly
        className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer focus:outline-none"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <CalendarIcon />
      </div>
    </div>
  </div>

  {/* ReactQuill Editor */}
  <div className="flex-grow">
    <ReactQuill
      value={term}
      onChange={setTerm}
      modules={EditTermsCondition.modules}
      formats={EditTermsCondition.formats}
      className="rounded-md h-full"
      style={{ minHeight: "350px" }}
    />
  </div>

  {/* Save Button */}
  <div className="flex justify-center mt-8">
    <button
      onClick={handleSave}
      disabled={loading}
      className="px-20 py-3 rounded-lg font-semibold text-black bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200 disabled:bg-yellow-200 disabled:cursor-not-allowed"
    >
      {loading ? "Saving..." : "Save"}
    </button>
  </div>
</div>

      </div>
    </div>
  );
}

// Quill modules + formats
EditTermsCondition.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
};

EditTermsCondition.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];
