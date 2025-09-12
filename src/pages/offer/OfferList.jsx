import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MdOutlineModeEditOutline, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function OffersTable() {
  const [offers, setOffers] = useState([]);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Get base URL from environment variables
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // Fetch offers with proper error handling
  const fetchOffers = async (pageNum = page, showPaginationLoading = false) => {
    if (showPaginationLoading) {
      setPaginationLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Check if API_BASE_URL is available
      if (!API_BASE_URL) {
        throw new Error(
          "API configuration is missing. Please check your environment variables."
        );
      }

      const response = await axios.get(
        `${API_BASE_URL}/offer/getAllOffers?page=${pageNum}&limit=10`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      const data = response.data?.offers || [];
      setOffers(Array.isArray(data) ? data : []);
      if (response.data?.totalOffers) {
        setTotalPages(Math.ceil(response.data.totalOffers / 10));
      }
      console.log("Fetched offers:", data);
    } catch (error) {
      console.error("Error fetching offers:", error);

      // More specific error handling
      if (error.message && error.message.includes("API configuration")) {
        setError(error.message);
      } else if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message || error.response.statusText;
        setError(`Server Error: ${errorMessage}`);
      } else if (error.request) {
        // Network error
        setError("Network error. Please check your connection and try again.");
      } else {
        // Other error
        setError("Failed to fetch offers");
      }

      setOffers([]);
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOffers(1, false);
  }, [API_BASE_URL]);

  // Delete handlers
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteOverlay(true);
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
    setShowDeleteOverlay(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      // Check if API_BASE_URL is available
      if (!API_BASE_URL) {
        setError(
          "API configuration is missing. Please check your environment variables."
        );
        return;
      }

      await axios.delete(`${API_BASE_URL}/offer/deleteOffer/${deleteId}`);

      // Remove the deleted offer from state
      setOffers((prev) =>
        prev.filter((offer) => getOfferId(offer) !== deleteId)
      );

      setDeleteId(null);
      setShowDeleteOverlay(false);

      // Refresh the current page data
      fetchOffers(page, false);
    } catch (error) {
      console.error(
        "Error deleting offer:",
        error.response?.data || error.message
      );

      // Better error handling for delete operation
      if (error.response) {
        setError(
          `Delete Error: ${error.response.data?.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        setError(
          "Network error while deleting. Please check your connection and try again."
        );
      } else {
        setError("Failed to delete offer");
      }
    }
  };

  // Helper: get unique ID
  const getOfferId = (offer) => offer.id || offer._id || "";

  // Helper: format offer names
  const formatOfferName = (offer) => {
    if (Array.isArray(offer)) {
      return offer.join(", ");
    }
    return offer || "N/A";
  };

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages with ellipsis logic
      if (page <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= maxVisiblePages; i++) {
          pageNumbers.push(i);
        }
        if (totalPages > maxVisiblePages) {
          pageNumbers.push("...");
          pageNumbers.push(totalPages);
        }
      } else if (page >= totalPages - 2) {
        // Show last 5 pages
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show current page with 2 pages on each side
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = page - 2; i <= page + 2; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Pagination handlers with loading
  const handlePreviousPage = async () => {
    if (page > 1 && !paginationLoading) {
      const newPage = page - 1;
      setPage(newPage);
      await fetchOffers(newPage, true);
    }
  };

  const handleNextPage = async () => {
    if (page < totalPages && !paginationLoading) {
      const newPage = page + 1;
      setPage(newPage);
      await fetchOffers(newPage, true);
    }
  };

  const handlePageClick = async (pageNumber) => {
    if (pageNumber !== page && !paginationLoading && pageNumber !== "...") {
      setPage(pageNumber);
      await fetchOffers(pageNumber, true);
    }
  };

  return (
    <div className="bg-gray-100 p-3 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 m-2 py-3 rounded-md shadow">
        <h2 className="text-lg text-gray-800 font-medium">Offers List</h2>
        <button
          className="flex items-center gap-2 bg-brandYellow text-red-500 font-semibold px-4 py-2 rounded-md shadow hover:bg-brandYellow transition"
          onClick={() => navigate("/offer/add")}
        >
          ADD Offer
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-2 ">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
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
            <div>
              <p className="text-sm font-medium">{error}</p>
              <button
                onClick={() => fetchOffers(page, false)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Table */}
      <div className="bg-white rounded-md m-2 p-4 shadow overflow-x-auto relative mt-5">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
              <p className="text-sm text-gray-600">Loading offers...</p>
            </div>
          </div>
        )}

        <table className="w-full min-w-[600px] sm:min-w-[700px]">
          <thead className="bg-brandYellow text-black text-sm">
            <tr>
              <th className="py-3 pl-2 pr-6 text-base text-left whitespace-nowrap">
                Sr. No.
              </th>
              <th className="py-3 pl-2 pr-6 text-base text-center whitespace-nowrap">
                Offer
              </th>
              <th className="py-3 pl-2 pr-6 text-base text-left whitespace-nowrap">
                Discount Rate
              </th>
              <th className="py-3 pl-2 pr-6 text-base text-center whitespace-nowrap">
                Offer Text
              </th>
              <th className="py-3 pl-2 pr-6 text-base text-right whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!loading && offers.length > 0 ? (
              offers.map((item, idx) => {
                const id = getOfferId(item);
                const serialNumber = (page - 1) * 10 + idx + 1;
                return (
                  <tr key={id || idx} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{serialNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">{formatOfferName(item.offer)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-left text-gray-900">
                      {item.discountRate
                        ? `${item.discountRate}% off`
                        : item.discountAmount
                          ? `₹${item.discountAmount} off`
                          : "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">{item.offerText || "N/A"}</td>
                    <td className="py-3 px-4 flex justify-end items-end gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-gray-600 text-xl cursor-pointer hover:text-blue-600"
                        onClick={() =>
                          navigate(`/offer/view/${id}`)
                        }
                        title="View Product"
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
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" onClick={() =>
                        navigate(`/offer/edit/${id}`)
                      } className="text-gray-600 text-xl cursor-pointer hover:text-blue-600" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.621 3.25 16.863 3.15C17.105 3.05 17.359 3 17.625 3C17.891 3 18.1493 3.05 18.4 3.15C18.6507 3.25 18.8673 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.771 5.4 20.863 5.65C20.955 5.9 21.0007 6.15 21 6.4C21 6.66667 20.9543 6.921 20.863 7.163C20.7717 7.405 20.6257 7.62567 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="#333333" />
                      </svg>



                      <button
                        className="text-red-500 text-xl cursor-pointer hover:text-red-700"
                        onClick={() => handleDeleteClick(id)}
                        title="Delete Offer"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 21C6.45 21 5.97933 20.8043 5.588 20.413C5.19667 20.0217 5.00067 19.5507 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8043 20.021 18.413 20.413C18.0217 20.805 17.5507 21.0007 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                            fill="#EC2D01"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : !loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-4"
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
                    <p className="text-lg">No offers available</p>
                    <p className="text-sm mt-1">
                      Create your first offer to get started
                    </p>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            {paginationLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            )}

            {/* Previous Button */}
            <button
              className={`text-red-500 hover:text-red-700 transition-all ${page === 1 || paginationLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
                }`}
              onClick={handlePreviousPage}
              disabled={page === 1 || paginationLoading}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  disabled={paginationLoading}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${page === pageNum
                    ? "bg-[#FEBC1D] text-red-500"
                    : "text-red-500 hover:text-red-700"
                    } ${paginationLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {pageNum}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              className={`text-red-500 hover:text-red-700 transition-all ${page === totalPages || paginationLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
                }`}
              onClick={handleNextPage}
              disabled={page === totalPages || paginationLoading}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Overlay */}
      {showDeleteOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-sm mx-auto">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
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
            </div>
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this offer? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
