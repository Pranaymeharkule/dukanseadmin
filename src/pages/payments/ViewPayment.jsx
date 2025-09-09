import React, { useEffect, useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ViewPayment = () => {
  const navigate = useNavigate();
  const { orderId } = useParams(); // this is actually order's _id
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get base URL from environment variables
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  useEffect(() => {
    if (orderId) {
      // Check if API_BASE_URL is available
      if (!API_BASE_URL) {
        setError(
          "API configuration is missing. Please check your environment variables."
        );
        setLoading(false);
        return;
      }

      axios
        .get(`${API_BASE_URL}/payments/getPaymentDetailsById/${orderId}`, {
          params: { t: new Date().getTime() }, // 🔹 prevent 304 cache issue
          headers: { "Cache-Control": "no-cache" }, // 🔹 force fresh data
        })
        .then((res) => {
          if (res.data.success) {
            setPayment(res.data.paymentById);
          } else {
            setError("No payment details found");
          }
        })
        .catch((err) => {
          console.error("Error fetching payment details:", err);
          if (err.response) {
            // Server responded with error status
            const errorMessage =
              err.response.data?.message || err.response.statusText;
            setError(`Server Error: ${errorMessage}`);
          } else if (err.request) {
            // Network error
            setError(
              "Network error. Please check your connection and try again."
            );
          } else {
            // Other error
            setError("Failed to fetch payment details");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setError("Order ID is missing");
      setLoading(false);
    }
  }, [orderId, API_BASE_URL]);

  // Function to get payment status styling
  const getPaymentStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "successful":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "failure":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-white p-5 rounded shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle
              size={30}
              className="text-gray-700 hover:text-black"
            />
          </button>
          <h2 className="text-xl font-semibold">View Payment Details</h2>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white shadow-md rounded-md p-6">
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p>Loading payment details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-red-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-lg font-medium">
                Error Loading Payment Details
              </p>
              <p className="text-sm mt-2">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-800 space-y-5">
            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-700">Order ID</span>
              <span>{payment.orderId || "--"}</span>
            </div>

            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-700">Location</span>
              <span>{payment.location || "--"}</span>
            </div>

            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-700">Customer Name</span>
              <span>{payment.customerName || "--"}</span>
            </div>

            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-700">Date</span>
              <span>{payment.date || "--"}</span>
            </div>

            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-700">
                Transaction ID
              </span>
              <span>{payment.transactionId || "--"}</span>
            </div>

            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-700">
                Mode of Payment
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  payment.modeOfPayment === "Cash"
                    ? "text-green-700"
                    : "text-green-700"
                }`}
              >
                {payment.modeOfPayment || "--"}
              </span>
            </div>

            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-700">Total Amount</span>
              <span className="text-green-600 font-semibold">
                ₹{payment.totalAmount || 0}
              </span>
            </div>

            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-700">Payment Status</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusStyle(
                  payment.paymentStatus
                )}`}
              >
                {payment.paymentStatus || "--"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPayment;