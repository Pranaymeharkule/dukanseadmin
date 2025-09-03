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
          `Delete Error: ${
            error.response.data?.message || error.response.statusText
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
        <h2 className="text-lg font-semibold text-gray-800">Offers List</h2>
        <button
          className="flex items-center gap-2 bg-brandYellow text-red-500 font-semibold px-4 py-2 rounded-md shadow hover:bg-brandYellow transition"
          onClick={() => navigate("/offer/add")}
        >
          <FaPlus />
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
      <div className="bg-white rounded-md m-2 p-4 shadow overflow-x-auto relative mt-8">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
              <p className="text-sm text-gray-600">Loading offers...</p>
            </div>
          </div>
        )}

        <table className="w-full table-auto min-w-[800px]">
          <thead className="bg-brandYellow text-white">
            <tr>
              <th className="py-3 px-4 text-base font-semibold text-black">
                Sr. No.
              </th>
              <th className="py-3 px-4 text-base font-semibold text-black">
                Offer
              </th>
              <th className="py-3 px-4 text-base font-semibold text-black">
                Discount
              </th>
              <th className="py-3 px-4 text-base font-semibold text-black">
                Offer Text
              </th>
              <th className="py-3 px-4 text-base font-semibold text-black">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 text-center">
            {!loading && offers.length > 0 ? (
              offers.map((item, idx) => {
                const id = getOfferId(item);
                const serialNumber = (page - 1) * 10 + idx + 1;
                return (
                  <tr key={id || idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{serialNumber}</td>
                    <td className="py-3 px-4">{formatOfferName(item.offer)}</td>
                    <td className="py-3 px-4">
                      {item.discountRate
                        ? `${item.discountRate}% off`
                        : item.discountAmount
                        ? `₹ ${item.discountAmount} off`
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">{item.offerText || "N/A"}</td>
                    <td className="py-3 px-4 flex justify-center gap-4">
                      <FiEye
                        className="text-gray-600 text-xl cursor-pointer hover:text-blue-600"
                        onClick={() => navigate(`/offer/view/${id}`)}
                        title="View Offer"
                      />
                      <MdOutlineModeEditOutline
                        className="text-gray-600 text-xl cursor-pointer hover:text-green-600"
                        onClick={() => navigate(`/offer/edit/${id}`)}
                        title="Edit Offer"
                      />

                      <MdDelete
                        className="text-red-500 text-xl cursor-pointer hover:text-red-700"
                        onClick={() => handleDeleteClick(id)}
                        title="Delete Offer"
                      />
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
            className={`text-red-500 hover:text-red-700 transition-all ${
              page === 1 || paginationLoading
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
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  page === pageNum
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
            className={`text-red-500 hover:text-red-700 transition-all ${
              page === totalPages || paginationLoading
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
  );
}
