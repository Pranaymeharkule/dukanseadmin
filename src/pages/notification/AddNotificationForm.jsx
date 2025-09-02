import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

const SuccessOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl flex flex-col items-center gap-4 w-full max-w-xs sm:max-w-sm">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
        Notification has been successfully sent
      </p>
    </div>
  </div>
);

export default function AddNotificationForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userTypes, setUserTypes] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedCustomerType, setSelectedCustomerType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user types
    axios
      .get(`${API_BASE_URL}/notification/getUserType?_=${Date.now()}`, {
        headers: { "Cache-Control": "no-cache" },
      })
      .then((res) => {
        if (res.data?.userTypes) setUserTypes(res.data.userTypes);
      })
      .catch((err) => console.error("Error fetching user types:", err));

    // Fetch customer types
    axios
      .get(`${API_BASE_URL}/offer/getAllCustomerType?_=${Date.now()}`, {
        headers: { "Cache-Control": "no-cache" },
      })
      .then((res) => {
        if (res.data?.customerTypeOptions)
          setCustomerTypes(res.data.customerTypeOptions);
      })
      .catch((err) => console.error("Error fetching customer types:", err));
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Please fill out both the title and message fields.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      message,
      userType: selectedUserType || "All",
      customerType: selectedCustomerType || "All Customers",
      suppressSystemNotification: true,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/notification/sendNotification`,
        payload
      );

      if (response.data.success) {
        // Show success overlay
        setShowSuccess(true);

        // Clear form
        setTitle("");
        setMessage("");
        setSelectedUserType("");
        setSelectedCustomerType("");

        // Pass new notification to AllNotification to prevent duplicate
        const newNotification = response.data.notification;
        navigate("/send-notification", {
          state: { newNotification },
          replace: true,
        });
      } else {
        alert(response.data.message || "Failed to send notification.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending notification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center gap-2 bg-white p-4 rounded shadow mb-6">
        <button
          onClick={() => navigate("/send-notification")}
          type="button"
          title="Go Back"
          className="w-8 h-8 flex items-center justify-center border-[3px] border-gray-600 rounded-full hover:border-gray-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={3} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">
          Send New Notification
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto bg-white p-6 rounded shadow space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select User Type
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
            required
          >
            <option value="">Select User Type</option>
            {userTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Customer Type
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={selectedCustomerType}
            onChange={(e) => setSelectedCustomerType(e.target.value)}
          >
            <option value="">Select Customer Type</option>
            <option value="All Customers">All Customers</option>
            {customerTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notification Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Notification Title"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notification Message
          </label>
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter Notification Message"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-vertical"
          />
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto bg-[#FEBC1D] text-red-600 font-bold py-2 px-6 rounded-lg shadow-sm text-base transition-colors ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-yellow-500 active:bg-yellow-600"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </form>

      {showSuccess && <SuccessOverlay />}
    </div>
  );
}
