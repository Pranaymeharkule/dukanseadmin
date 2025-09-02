import React, { useState, useEffect } from "react";
import { FaEye as FaEyeIcon } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // Fetch payments from backend
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      if (!API_BASE_URL) {
        setError("API base URL not configured.");
        setLoading(false);
        return;
      }

      const params = {
        page,
        limit,
        sortBy: "createdAt",
        sortOrder,
      };

      // Filters
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (fromDate) params.startDate = new Date(fromDate + "T00:00:00Z").toISOString();
      if (toDate) params.endDate = new Date(toDate + "T23:59:59Z").toISOString();

      console.log("Sending API params:", params); // Debug

      const res = await axios.get(`${API_BASE_URL}/payments/getAllPaymentsList`, { params });

      if (res.data.success) {
        const paymentData = res.data.payments || [];
        setPayments(paymentData);
        setTotalPages(res.data.totalPages || 1);

        if (paymentData.length === 0) {
          setError(
            searchTerm || fromDate || toDate
              ? "No payments found matching your search criteria."
              : "No payment records available."
          );
        }
      } else {
        setPayments([]);
        setError(res.data.message || "Failed to fetch payments.");
      }
    } catch (err) {
      console.error(err);
      setPayments([]);
      if (err.response) {
        setError(err.response.data?.message || "Server Error");
      } else if (err.request) {
        setError("Network Error. Check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load & when page or sortOrder changes
  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortOrder]);

  // Handle search button
  const handleSearch = () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setError("From date cannot be later than To date.");
      return;
    }
    setPage(1);
    fetchPayments();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setError("");
    setPage(1);
    fetchPayments();
  };

  // Toggle sort
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      {/* Header */}
      <div className="bg-white shadow p-4 rounded-md mb-4">
        <h2 className="text-xl font-semibold">Payments List</h2>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 flex flex-wrap gap-3 items-center border rounded-md mb-4">
        <input
          type="text"
          value={searchTerm}
          placeholder="Order ID"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={fromDate}
          max={toDate || undefined}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={toDate}
          min={fromDate || undefined}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 text-sm rounded-md"
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

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border rounded-md overflow-x-auto">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : payments.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No payments found.</p>
        ) : (
          <table className="w-full table-auto text-center text-sm">
            <thead className="bg-yellow-400 text-black">
              <tr>
                <th className="p-3">Order Id</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/payment/viewpayment/${p.orderId}`)}
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
                      new Date(p.createdAt || Date.now()).toLocaleString()}
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
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex justify-center gap-1 border rounded-md mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-12 h-12 flex items-center justify-center text-base font-semibold rounded-xl transition-all duration-200 ${
                page === i + 1
                  ? "bg-yellow-400 text-black shadow-md"
                  : "text-red-500 hover:text-red-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
