import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// ===== Header Component =====
const Header = ({ onAddClick }) => {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex-wrap gap-2 mb-4">
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => navigate(-1)}
          type="button"
          title="Go Back"
          className="w-8 h-8 flex items-center justify-center border-[3px] border-gray-600 rounded-full hover:border-gray-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={3} />
        </button>
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
          Notification
        </h1>
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

// ===== FilterTabs Component =====
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
              ${
                activeFilter === f.value
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

// ===== NotificationItem Component =====
const NotificationItem = ({ notification }) => {
  const hasMessage =
    notification.message && notification.message.trim().length > 0;

  return (
    <div className="flex items-center justify-between p-4 bg-[#FFF7E6] rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition mb-4">
      {/* Left section */}
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

      {/* Center section */}
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

      {/* Right section */}
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

// ===== Pagination Component =====
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
    <nav className="flex items-center justify-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="p-1.5 sm:p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={18} />
      </button>
      {getPageNumbers().map((p, index) =>
        p === "..." ? (
          <span key={`dots-${index}`} className="px-1 sm:px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            disabled={loading}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-xs sm:text-sm font-bold disabled:cursor-not-allowed ${
              currentPage === p
                ? "bg-yellow-400 text-white shadow"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="p-1.5 sm:p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

// ===== Main Component =====
export default function AllNotification() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    process.env.REACT_APP_BACKEND_API_BASEURL || "http://localhost:3001/api";

  // ===== Fetch notifications =====
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

      if (response.data && response.data.success) {
        const fetched = response.data.notifications || [];

        if (page === 1 || tab !== activeFilter) {
          setNotifications(fetched);
        } else {
          // Merge without duplicates
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n._id));
            const filteredFetched = fetched.filter((n) => !existingIds.has(n._id));
            return [...prev, ...filteredFetched];
          });
        }

        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || page);
      } else {
        throw new Error(response.data?.message || "Failed to fetch notifications");
      }
    } catch (err) {
      console.error(err);
      if (err.code === "ECONNABORTED") setError("Request timeout. Please try again.");
      else if (err.response?.status === 404) setError("API endpoint not found.");
      else if (err.response?.status >= 500) setError("Server error.");
      else if (err.request) setError("Unable to connect to server.");
      else setError(err.message || "An unexpected error occurred.");

      setNotifications([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ===== Handle filter changes =====
  const handleFilterChange = (newFilter) => {
    if (newFilter === activeFilter) return;
    setActiveFilter(newFilter);
    setCurrentPage(1);
    setNotifications([]);
  };

  // ===== Handle page changes =====
  const handlePageChange = (newPage) => setCurrentPage(newPage);

  // ===== Fetch on filter/page change =====
  useEffect(() => {
    fetchNotifications(currentPage, activeFilter);
  }, [currentPage, activeFilter]);

  // ===== Add new notification from navigation state (once) =====
  useEffect(() => {
    const newNotification = location.state?.newNotification;
    if (newNotification) {
      setNotifications((prev) => {
        if (prev.some((n) => n._id === newNotification._id)) return prev;
        return [newNotification, ...prev];
      });
      navigate(location.pathname, { replace: true, state: {} });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Run only once on mount
  }, []);

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
              {loading && (
                <div className="text-center text-gray-500 p-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#EC2D01]"></div>
                  <p className="mt-2">Loading more...</p>
                </div>
              )}
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
