// src/pages/settings/PrivacyPolicyEdit.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BsArrowLeftCircle } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

// Custom calendar icon
import CalendarSvg from "../../assets/Vector (2).svg";

// Custom Calendar Input
const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <div className="relative w-full">
    <input
      type="text"
      value={value ? format(new Date(value), "d MMMM yyyy") : ""}
      readOnly
      onClick={onClick}
      ref={ref}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer focus:outline-none"
    />
    <div
      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
      onClick={onClick}
    >
      <img src={CalendarSvg} alt="calendar" className="w-5 h-5" />
    </div>
  </div>
));

export default function PrivacyPolicyEdit() {
  const navigate = useNavigate();
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(new Date("2025-01-01"));

  // ✅ GET Privacy Policy on load
  useEffect(() => {
    async function fetchPrivacy() {
      try {
        const response = await fetch(
          "https://dukanse-be.onrender.com/api/settings/getUserPrivacy"
        );
        const result = await response.json();
        if (result.success && result.privacyPolicy) {
          setPolicy(result.privacyPolicy.description);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    }
    fetchPrivacy();
  }, []);

  // ✅ PUT to update Privacy
  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://dukanse-be.onrender.com/api/settings/updateUserPrivacy",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: policy }),
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Privacy Policy updated successfully!");
        navigate("/privacy-policy");
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
    <div className="min-h-screen w-full bg-gray-100 p-3">
      <div className="max-w-6xl mx-auto">
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
              Edit Privacy Policy
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
            <DatePicker
              selected={effectiveDate}
              onChange={(date) => setEffectiveDate(date)}
              customInput={<CustomInput />}
              calendarClassName="custom-calendar"
              wrapperClassName="w-full"
              renderCustomHeader={({
                monthDate,
                decreaseMonth,
                increaseMonth,
              }) => (
                <div className="flex justify-between items-center px-2 py-1">
                  <button
                    onClick={decreaseMonth}
                    className="text-[#EC2D01] font-bold"
                  >
                    {"<"}
                  </button>
                  <span className="font-semibold">
                    {format(monthDate, "MMMM yyyy")}
                  </span>
                  <button
                    onClick={increaseMonth}
                    className="text-[#EC2D01] font-bold"
                  >
                    {">"}
                  </button>
                </div>
              )}
            >
              {(close) => (
                <div className="flex justify-between px-3 py-2">
                  <button
                    className="text-[#EC2D01] font-medium"
                    onClick={() => close()}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-[#EC2D01] font-medium"
                    onClick={() => close()}
                  >
                    OK
                  </button>
                </div>
              )}
            </DatePicker>
          </div>

          {/* ReactQuill Editor */}
          <div className="flex-grow">
            <ReactQuill
              value={policy}
              onChange={setPolicy}
              modules={PrivacyPolicyEdit.modules}
              formats={PrivacyPolicyEdit.formats}
              className="rounded-md h-full"
              style={{ minHeight: "350px" }}
            />
          </div>

          {/* Save Button fixed at bottom */}
          <div className="p-4 flex justify-center sticky bottom-0 bg-white  z-10">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-10 py-2 rounded-lg font-semibold text-[#EC2D01] bg-yellow-400 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Custom Styling */}
      <style jsx>{`
        .custom-calendar {
          border-radius: 12px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 10px;
        }
        .react-datepicker__header {
          background: #fff;
          border-bottom: none;
        }
        .react-datepicker__current-month {
          font-weight: bold;
          font-size: 16px;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #ec2d01 !important;
          color: #fff !important;
          border-radius: 50%;
        }
        .react-datepicker__day--today {
          background-color: rgba(236, 45, 1, 0.15);
          border-radius: 50%;
        }
        .react-datepicker__day:hover {
          background-color: rgba(236, 45, 1, 0.2);
          border-radius: 50%;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #ec2d01;
        }
        .react-datepicker__navigation {
          top: 12px;
        }
      `}</style>
    </div>
  );
}

// Quill modules + formats
PrivacyPolicyEdit.modules = {
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

PrivacyPolicyEdit.formats = [
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
