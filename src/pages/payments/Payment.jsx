import React, { useState, useEffect } from "react";
import { FaEye as FaEyeIcon } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState("");
  const { orderId } = useParams();
  const navigate = useNavigate();
  const pageSize = 10;

  // Get base URL from environment variables
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // Calculate pagination for client-side data
  const totalRecords = payments.length;
  const totalClientPages = Math.ceil(totalRecords / pageSize);
  const paginatedPayments = payments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      // Check if API_BASE_URL is available
      if (!API_BASE_URL) {
        setError("API configuration is missing. Please check your environment variables.");
        setLoading(false);
        return;
      }

      // Build params dynamically - only include search if not empty
      const params = {
        page,
        limit,
        sortOrder,
        t: new Date().getTime(),
      };

      // Only add search param if searchTerm is not empty
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      // Convert date format from YYYY-MM-DD to ISO format for backend
      if (fromDate) {
        try {
          const fromDateObj = new Date(fromDate + "T00:00:00.000Z");
          params.fromDate = fromDateObj.toISOString();
        } catch (err) {
          console.error("Invalid fromDate:", fromDate);
        }
      }
      if (toDate) {
        try {
          const toDateObj = new Date(toDate + "T23:59:59.999Z");
          params.toDate = toDateObj.toISOString();
        } catch (err) {
          console.error("Invalid toDate:", toDate);
        }
      }

      const res = await axios.get(
        `${API_BASE_URL}/payments/getAllPaymentsList`,
        {
          params,
          headers: { "Cache-Control": "no-cache" },
        }
      );

      if (res.data.success) {
        const paymentData = res.data.payments || [];
        setPayments(paymentData);
        setTotalPages(res.data.totalPages || 1);

        // Clear error if data is successfully fetched
        setError("");

        // If no payments found and user is searching, show appropriate message
        if (paymentData.length === 0 && (searchTerm || fromDate || toDate)) {
          setError(
            "No payments found matching your search criteria. Please try adjusting your filters."
          );
        } else if (paymentData.length === 0) {
          setError("No payments found in the system.");
        }
      } else {
        setPayments([]);
        setTotalPages(1);
        setError(
          res.data.message || "Failed to fetch payments. Please try again."
        );
      }
    } catch (err) {
      console.error("Error fetching payments", err);
      setPayments([]);
      setTotalPages(1);

      // More specific error handling
      if (err.response) {
        // Server responded with error status
        const errorMessage =
          err.response.data?.message || err.response.statusText;
        if (errorMessage.includes("Cast to date failed")) {
          setError(
            "Invalid date format. Please check your date filters and try again."
          );
        } else {
          setError(`Server Error: ${errorMessage}`);
        }
      } else if (err.request) {
        // Network error
        setError("Network error. Please check your connection and try again.");
      } else {
        // Other error
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fixed useEffect - removed payments from dependency array to prevent infinite loop
  useEffect(() => {
    fetchPayments();
  }, [page, sortOrder, searchTerm, fromDate, toDate]);

  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    setError(""); // Clear previous errors
    fetchPayments(); // ensure immediate API call
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setPage(1); // Reset to first page when clearing filters
    setError("");
  };

  // Validate date range
  const isDateRangeValid = () => {
    if (fromDate && toDate) {
      return new Date(fromDate) <= new Date(toDate);
    }
    return true;
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow p-4 rounded-md">
        <h2 className="text-xl font-semibold">Payments List</h2>
      </div>

      {/* Gap */}
      <div className="h-4"></div>

      {/* Filters */}
      <div className="bg-white p-4 flex flex-wrap gap-3 items-center border rounded-md">
        <label className="font-semibold text-sm">Order ID</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setError(""); // Clear error when date changes
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          max={toDate || undefined}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setError(""); // Clear error when date changes
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          min={fromDate || undefined}
        />
        <button
          onClick={() => {
            if (!isDateRangeValid()) {
              setError(
                "From date cannot be later than to date. Please check your date range."
              );
              return;
            }
            handleSearch();
          }}
          className="bg-brandYellow hover:bg-yellow-500 text-black px-5 py-2 text-sm rounded-md"
        >
          Search
        </button>
        {(searchTerm || fromDate || toDate) && (
          <button
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 text-sm rounded-md"
          >
            Clear
          </button>
        )}
        <button
          onClick={toggleSort}
          className="ml-auto text-gray-700 hover:text-black text-xl"
          title="Sort"
        >
          <FontAwesomeIcon icon={faUpDown} />
        </button>
      </div>

      {/* Gap */}
      <div className="h-4"></div>

      {/* Error Message */}
      {error && (
        <>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <p className="text-sm">{error}</p>
            {(searchTerm || fromDate || toDate) && (
              <button
                onClick={clearFilters}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Clear all filters and show all payments
              </button>
            )}
          </div>
        </>
      )}

      {/* Payments Table */}
      <div className="bg-white border rounded-md overflow-hidden">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : payments.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg">No payments found</p>
              {searchTerm || fromDate || toDate ? (
                <p className="text-sm mt-2">
                  Try adjusting your search criteria
                </p>
              ) : (
                <p className="text-sm mt-2">No payment records available</p>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-brandYellow text-black text-sm text-center">
                <tr>
                  <th className="p-3">Order Id</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-gray-100 cursor-pointer h-16 text-center text-sm"
                    onClick={() =>
                      navigate(`/payment/viewpayment/${p.orderId}`)
                    }
                  >
                    <td className="p-3">{p.orderNumber}</td>
                    <td className="p-3">{p.address || p.location || "N/A"}</td>
                    <td
                      className={`p-3 font-semibold ${
                        p.paymentStatus === "Success"
                          ? "text-green-600"
                          : p.paymentStatus === "Failed"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {p.paymentStatus}
                    </td>
                    <td className="p-3">
                      {p.dateAndTime ||
                        new Date(
                          p.createdAt || p.updatedAt || Date.now()
                        ).toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        title="View"
                        className="text-gray-700 hover:text-black"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/payment/viewpayment/${p.orderId}`);
                        }}
                      >
                        <FaEyeIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gap */}
      <div className="h-4"></div>

      {/* Pagination - Only show if more than 10 records (more than 1 page) */}
      {totalRecords > 10 && (
        <div className="bg-white px-4 py-3 flex justify-center items-center gap-1 border rounded-md mt-4">
          {/* Previous Button */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
            title="Previous Page"
          >
            ‹
          </button>

          {/* Page Numbers */}
          {(() => {
            const pages = [];
            const maxVisiblePages = 5;
            let startPage = Math.max(1, page - 2);
            let endPage = Math.min(totalClientPages, startPage + maxVisiblePages - 1);
            
            // Adjust start if we're near the end
            if (endPage - startPage < maxVisiblePages - 1) {
              startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-12 h-12 flex items-center justify-center text-base font-semibold rounded-xl transition-all duration-200 ${
                    page === i
                      ? "bg-yellow-400 text-black shadow-md"
                      : "text-red-500 hover:text-red-700 hover:bg-gray-50"
                  }`}
                >
                  {i}
                </button>
              );
            }

            return pages;
          })()}

          {/* Next Button */}
          <button
            disabled={page === totalClientPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
            title="Next Page"
          >
            ›
          </button>
        </div>
      )}


    </div>
  );
};
export default Payment;