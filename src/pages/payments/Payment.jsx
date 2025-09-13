import React, { useState, useEffect } from "react";
import { FaEye as FaEyeIcon } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { RxCalendar } from "react-icons/rx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaChevronLeft, FaChevronRight,
} from "react-icons/fa"
const CustomInput = React.forwardRef(
  ({ value, onClick, placeholder }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-sm w-44 bg-white hover:border-gray-400"
    >
      <span className={value ? "text-gray-800" : "text-gray-400"}>
        {value || placeholder}
      </span>
      <RxCalendar alt="calendar" className="w-4 h-4 ml-2"/>
    </button>
  )
);
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
  const search = orderId || "";
  const [paginationData, setPaginationData] = useState({
    totalPages: 1,
    next: false,
  });

  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // Apply date filter locally before pagination
  const filteredPayments = payments.filter((p) => {
    const paymentDate = new Date(p.dateAndTime || p.createdAt || p.updatedAt);
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59`) : null;

    if (from && paymentDate < from) return false;
    if (to && paymentDate > to) return false;
    return true;
  });

  const totalRecords = filteredPayments.length;
  const totalClientPages = Math.ceil(totalRecords / pageSize);
  const paginatedPayments = filteredPayments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const ViewIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="inline-block"
      >
        <path
          d="M12.5 16C14.1569 16 15.5 14.6569 15.5 13C15.5 11.3431 14.1569 10 12.5 10C10.8431 10 9.5 11.3431 9.5 13C9.5 14.6569 10.8431 16 12.5 16Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M21.5 14C21.5 14 20.5 6 12.5 6C4.5 6 3.5 14 3.5 14"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      if (!API_BASE_URL) {
        setError(
          "API configuration is missing. Please check your environment variables."
        );
        setLoading(false);
        return;
      }

      const params = {
        page,
        limit,
        sortOrder,
        t: new Date().getTime(),
      };

      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }


      if (search) {
        params.search = search;
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
        const totalPages = res.data.totalPages || 1;
        const hasNext = res.data.next || paymentData.length === limit;

        setPaginationData({ totalPages, next: hasNext });

        if (paymentData.length === 0) {
          setError("No payments found.");
        }
        setTotalPages(res.data.totalPages || 1);
        setError("");

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

      if (err.response) {
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
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, sortOrder, searchTerm, fromDate, toDate]);

  const handleSearch = () => {
    setPage(1);
    setError("");
    fetchPayments();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setPage(1);
    setError("");
  };

  const isDateRangeValid = () => {
    if (fromDate && toDate) {
      return new Date(fromDate) <= new Date(toDate);
    }
    return true;
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 py-3 rounded-md shadow">
        <h2 className="text-lg text-gray-800 font-medium">Payments List</h2>
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

        {/* From Date */}
        <div className="flex items-center gap-3">
          <DatePicker
            selected={fromDate ? new Date(fromDate) : null}
            onChange={(date) =>
              setFromDate(date ? date.toISOString().split("T")[0] : "")
            }
            customInput={<CustomInput />}
            placeholderText="From Date"
            calendarClassName="custom-calendar"
            maxDate={toDate ? new Date(toDate) : null}
          />
        </div>

        {/* To Date */}
        <div className="flex items-center gap-3">
          <DatePicker
            selected={toDate ? new Date(toDate) : null}
            onChange={(date) =>
              setToDate(date ? date.toISOString().split("T")[0] : "")
            }
            customInput={<CustomInput />}
            placeholderText="To Date"
            calendarClassName="custom-calendar"
            minDate={fromDate ? new Date(fromDate) : null}
          />
        </div>

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
                <tr className="text-black text-sm">
                  <th className="py-3 px-4 text-base text-left">Order Id</th>
                  <th className="py-3 px-4 text-base text-center">Location</th>
                  <th className="py-3 px-4 text-base text-center">Status</th>
                  <th className="py-3 px-4 text-base text-center">Date & Time</th>
                  <th className="py-3 px-4 text-base text-left">Action</th>
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
                    <td className="p-3 text-left">{p.orderNumber}</td>
                    <td className="p-3">{p.address || p.location || "N/A"}</td>
                    <td
                      className={`p-3 font-semibold ${p.paymentStatus === "Success"
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
                        <ViewIcon />
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

      {/* Pagination (same as Customer) */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {/* Previous Button */}
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className={`p-2 text-red-500 transition rounded-full ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:text-red-700"
            }`}
        >
          <FaChevronLeft className="text-lg" />
        </button>

        {/* Page Numbers */}
        {Array.from(
          { length: Math.max(3, paginationData?.totalPages || 1) },
          (_, i) => i + 1
        ).map((pageNum) => {
          const totalPages = paginationData?.totalPages || 1;
          const isPhantom = pageNum > totalPages;
          const isActive = pageNum === page;

          return (
            <button
              key={pageNum}
              onClick={() => {
                if (!isPhantom && !isActive) setPage(pageNum);
              }}
              disabled={isPhantom || isActive}
              className={`px-3 py-1 rounded-md text-base font-bold transition-all ${isActive
                  ? "bg-yellow-400 text-red-600"
                  : isPhantom
                    ? "opacity-40 cursor-not-allowed"
                    : "text-red-500 hover:text-red-700"
                }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() =>
            setPage((prev) =>
              Math.min(paginationData?.totalPages || 1, prev + 1)
            )
          }
          disabled={page === (paginationData?.totalPages || 1)}
          className={`p-2 text-red-500 transition rounded-full ${page === (paginationData?.totalPages || 1)
              ? "opacity-40 cursor-not-allowed"
              : "hover:text-red-700"
            }`}
        >
          <FaChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Payment;