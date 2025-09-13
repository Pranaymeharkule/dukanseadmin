import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BsArrowLeftCircle } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Header = ({ onAddClick }) => {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex-wrap gap-2 mb-4">
      {/* Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
        <button
          onClick={() => navigate("/send-notification")}
          type="button"
          title="Go Back"
          className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto"
        >
          <BsArrowLeftCircle size={20} className="text-gray-700 md:text-black" />
        </button>
        <h2 className="text-lg text-gray-800 font-poppins font-medium flex-1 min-w-0">
          Notification
        </h2>
      </div>
      <button
        onClick={onAddClick}
        className="bg-[#FEBC1D] text-[#EC2D01] font-bold py-1.5 px-3 sm:py-2 sm:px-6 rounded-lg text-sm sm:text-base shadow-md"
      >
        + Add
      </button>
    </header>
  );
};

const FilterTabs = ({ activeFilter, setActiveFilter, loading }) => {
  const filters = [
    { label: "All", value: "ALL" },
    { label: "Orders", value: "ORDER" },
    { label: "Complaints", value: "COMPLAINTS" },
    { label: "System", value: "SYSTEM" },
    { label: "Gullak", value: "GULLAK" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-2 sm:px-4 pt-3 sm:pt-4 pb-2 overflow-x-auto mb-4">
      <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 sm:gap-3">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            disabled={loading}
            className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 whitespace-nowrap text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed
              ${activeFilter === f.value
                ? "bg-[#FEBC1D] text-[#EC2D01] shadow"
                : "bg-white text-[#EC2D01] border border-[#EC2D01] hover:bg-red-50"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const NotificationItem = ({ notification }) => {
  const hasMessage =
    notification.message && notification.message.trim().length > 0;

  return (
    <div className="flex items-center justify-between p-4 bg-[#FFF7E6] rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition mb-4">
      <div className="flex items-center gap-3 w-1/3">
        <img
          src={
            notification.profileImage ||
            "https://placehold.co/100x100/CCCCCC/FFFFFF?text=User"
          }
          alt={`${notification.userName || "Unknown"}'s avatar`}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0 border"
          onError={(e) =>
          (e.target.src =
            "https://placehold.co/100x100/CCCCCC/FFFFFF?text=Error")
          }
        />
        <p className="font-semibold text-gray-800 text-base sm:text-lg">
          {notification.userName || "Unknown"}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center text-center w-1/3">
        {hasMessage ? (
          <>
            <p className="font-bold text-gray-900 text-base sm:text-lg">
              {notification.title || ""}
            </p>
            <p className="text-gray-700 text-sm sm:text-base mt-1 line-clamp-2">
              {notification.message}
            </p>
          </>
        ) : (
          <p className="font-bold text-gray-900 text-base sm:text-lg">
            {notification.title || ""}
          </p>
        )}
      </div>
      <div className="flex items-center justify-end gap-3 w-1/3">
        <a
          href="#"
          className="text-sm sm:text-base font-semibold text-red-500 hover:underline whitespace-nowrap"
          onClick={(e) => e.preventDefault()}
        >
          View Details
        </a>
        <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
          {notification.createdAt
            ? new Date(notification.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            : "Now"}
        </p>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, setCurrentPage, totalPages, loading }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page !== "..." && page >= 1 && page <= totalPages && !loading) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className={`p-2 text-red-500 transition rounded-full ${currentPage === 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:text-red-700"
          }`}
      >
        <FaChevronLeft className="text-lg" />
      </button>

      {/* Page Numbers (always at least 3) */}
      {Array.from({ length: Math.max(3, totalPages) }, (_, i) => i + 1).map(
        (pageNum) => {
          const isPhantom = pageNum > totalPages; // beyond real pages
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => {
                if (isPhantom || isActive) return;
                setCurrentPage(pageNum);
              }}
              disabled={isPhantom || isActive}
              className={`px-3 py-1 rounded-md text-base font-bold transition-all ${isActive
                  ? "bg-brandYellow text-red-600"
                  : isPhantom
                    ? "opacity-40 cursor-not-allowed"
                    : "text-red-500 hover:text-red-700"
                }`}
            >
              {pageNum}
            </button>
          );
        }
      )}

      {/* Next Button */}
      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(totalPages, prev + 1))
        }
        disabled={currentPage === totalPages}
        className={`p-2 text-red-500 transition rounded-full ${currentPage === totalPages
            ? "opacity-40 cursor-not-allowed"
            : "hover:text-red-700"
          }`}
      >
        <FaChevronRight className="text-lg" />
      </button>
    </div>
  );
};

export default function AllNotification() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // ✅ Fetch only 10 per page and replace list
  const fetchNotifications = async (page = 1, tab = "ALL") => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/notification/getAllNotification`,
        {
          params: { page, limit: 10, sortOrder: "dsc", tab, _: Date.now() },
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          timeout: 10000,
        }
      );

      if (response.data?.success) {
        setNotifications(response.data.notifications || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || page);
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch notifications"
        );
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "An unexpected error occurred");
      setNotifications([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset page when filter changes
  const handleFilterChange = (newFilter) => {
    if (newFilter === activeFilter) return;
    setActiveFilter(newFilter);
    setCurrentPage(1);
    setNotifications([]);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // ✅ Fetch new page when page/filter changes
  useEffect(() => {
    fetchNotifications(currentPage, activeFilter);
  }, [currentPage, activeFilter]);

  // ✅ Handle adding new notification from another page
  useEffect(() => {
    const newNotification = location.state?.newNotification;
    if (newNotification) {
      setCurrentPage(1);
      setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]); // keep max 10 on page
      navigate(location.pathname, { replace: true, state: {} });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <div className="bg-gray-50 min-h-screen p-2 sm:p-4 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        <Header onAddClick={() => navigate("/send-notification/add")} />

        <FilterTabs
          activeFilter={activeFilter}
          setActiveFilter={handleFilterChange}
          loading={loading}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {error ? (
            <div className="text-center p-6 sm:p-10">
              <p className="text-red-500 mb-4">Error: {error}</p>
              <button
                onClick={() => fetchNotifications(currentPage, activeFilter)}
                className="bg-[#FEBC1D] text-[#EC2D01] font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                disabled={loading}
              >
                {loading ? "Retrying..." : "Retry"}
              </button>
            </div>
          ) : loading && notifications.length === 0 ? (
            <div className="text-center text-gray-500 p-6 sm:p-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#EC2D01] mb-4"></div>
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={notification._id || `notification-${index}`}
                  notification={notification}
                />
              ))}
            </>
          ) : (
            <div className="text-center text-gray-500 p-6 sm:p-10">
              <p>No notifications found for the selected filter.</p>
              {activeFilter !== "ALL" && (
                <button
                  onClick={() => handleFilterChange("ALL")}
                  className="mt-4 text-[#EC2D01] hover:underline font-semibold"
                >
                  View all notifications
                </button>
              )}
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          totalPages={totalPages}
          loading={loading}
        />
      </div>
    </div>
  );
}
