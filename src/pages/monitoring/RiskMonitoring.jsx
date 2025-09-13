import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AccountIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="15" cy="15" r="15" fill="#FEBC1D" />
    <path
      d="M8.59961 19.6746C8.59961 17.1575 10.7025 15.1171 14.9996 15.1171C19.2968 15.1171 21.3996 17.1575 21.3996 19.6746C21.3996 20.075 21.1075 20.3996 20.7471 20.3996H9.25216C8.89177 20.3996 8.59961 20.075 8.59961 19.6746Z"
      stroke="#EC2D01"
      strokeWidth="1.5"
    />
    <path
      d="M17.3996 9.99961C17.3996 11.3251 16.3251 12.3996 14.9996 12.3996C13.6741 12.3996 12.5996 11.3251 12.5996 9.99961C12.5996 8.67413 13.6741 7.59961 14.9996 7.59961C16.3251 7.59961 17.3996 8.67413 17.3996 9.99961Z"
      stroke="#EC2D01"
      strokeWidth="1.5"
    />
  </svg>
);

const RiskMonitoring = () => {
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);

  const fetchRiskData = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://dukanse-be-f5w4.onrender.com/api/referralDashboard/riskMonitoring?page=${pageNum}&limit=10`
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setRiskData(data.riskData || []);
        setPaginationData({
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || 1,
          previous: data.previous,
          next: data.next
        });
      } else {
        throw new Error(data.message || "Failed to fetch risk data");
      }
    } catch (err) {
      setError(err.message);
      setRiskData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData(page);
  }, [page]);

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
        <h2 className="text-lg text-gray-800 font-medium">Risk Monitoring</h2>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading risk data...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : riskData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">No risk data available</div>
            </div>
          ) : (
            <table className="w-full min-w-[600px] md:min-w-full table-auto border-collapse">
              <thead className="bg-white">
                <tr className="text-gray-800 text-sm border-b border-gray-100">
                  <th className="py-3 px-4 text-left font-semibold">Account Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Suspicious Activity</th>
                  <th className="py-3 px-4 text-left font-semibold">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {riskData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        {item.profileImage ? (
                          <img
                            src={item.profileImage}
                            alt={item.customerName}
                            className="w-6 h-6 rounded-full object-cover border"
                            onError={(e) => {
                              e.currentTarget.src = "";
                            }}
                          />
                        ) : (
                          <AccountIcon />
                        )}
                        <span className="truncate max-w-[150px] sm:max-w-xs md:max-w-full">
                          {item.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[200px] sm:max-w-xs md:max-w-full">
                      {item.activity}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium ${getRiskLevelColor(item.riskLevel)}`}>
                      {item.riskLevel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {paginationData && paginationData.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm">
              {page} / {paginationData.totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(paginationData.totalPages, page + 1))}
              disabled={page === paginationData.totalPages}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskMonitoring;
