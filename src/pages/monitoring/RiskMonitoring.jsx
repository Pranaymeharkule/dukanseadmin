import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AccountIcon = () => (
  <svg
    width="30"
    height="30"
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
  const [totalFraudCustomers, setTotalFraudCustomers] = useState(0);

  const fetchRiskData = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://dukanse-be-f5w4.onrender.com/api/referralDashboard/riskMonitoring?page=${pageNum}&limit=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRiskData(data.riskData || []);
        setTotalFraudCustomers(data.totalFarudCustomers || 0);
        setPaginationData({
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || 1,
          previous: data.previous,
          next: data.next
        });
      } else {
        throw new Error(data.message || 'Failed to fetch risk data');
      }
    } catch (err) {
      console.error('Error fetching risk data:', err);
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
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col">
        <div className="bg-white rounded-lg shadow-sm mb-3 sm:mb-4 md:mb-6">
          <div className="p-3 sm:p-4 md:p-6">
            <h1 className="text-lg text-gray-800 font-poppins font-medium">
              Risk Monitoring
            </h1>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center">
          <div className="text-gray-500">Loading risk data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col">
        <div className="bg-white rounded-lg shadow-sm mb-3 sm:mb-4 md:mb-6">
          <div className="p-3 sm:p-4 md:p-6">
            <h1 className="text-lg text-gray-800 font-poppins font-medium">
              Risk Monitoring
            </h1>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm mb-3 sm:mb-4 md:mb-6">
        <div className="p-3 sm:p-4 md:p-6">
          <h1 className="text-lg text-gray-800 font-poppins font-medium">
            Risk Monitoring
          </h1>
        </div>
      </div>

      {/* Table wrapper fills remaining space */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          {riskData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">No risk data available</div>
            </div>
          ) : (
            <table className="w-full min-w-[600px] sm:min-w-[700px]">
              <thead className="bg-white text-white text-center">
                <tr className="text-black text-sm">
                  <th className="py-3 px-4 text-base font-poppins text-left">
                    Account Name
                  </th>
                  <th className="py-3 px-4 text-base font-poppins text-left">
                    Suspicious Activity
                  </th>
                  <th className="py-3 px-4 text-base font-poppins text-left">
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {riskData.map((item, index) => (
                  <tr key={`${item.customerName}-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-1 whitespace-nowrap font-poppins text-sm text-gray-600">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {item.profileImage ? (
                            <img
                              src={item.profileImage}
                              alt={item.customerName}
                              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border"
                              onError={(e) => {
                                e.currentTarget.onerror = null; // prevent looping
                                e.currentTarget.src = ""; // fallback to blank -> AccountIcon will render
                              }}
                            />
                          ) : (
                            <AccountIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                          )}
                        </div>
                        <div className="ml-2 md:ml-3">
                          <div className="font-poppins text-sm text-gray-600">
                            {item.customerName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-poppins text-sm text-gray-600">
                      {item.activity}
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 font-poppins whitespace-nowrap text-left">
                      <span className={`font-poppins font-medium text-[9px] sm:text-[10px] md:text-[12px] leading-none tracking-wide ${getRiskLevelColor(item.riskLevel)}`}>
                        {item.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {paginationData && paginationData.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 p-4">
            {/* Previous Button */}
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className={`p-2 text-red-500 transition rounded-full ${page === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-red-700"
                }`}
            >
              <FaChevronLeft className="text-lg" />
            </button>

            {/* Page Numbers (always at least 3) */}
            {Array.from(
              { length: Math.max(3, paginationData?.totalPages || 1) },
              (_, i) => i + 1
            ).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 rounded-md text-base font-bold ${pageNum === page
                    ? "bg-yellow-300 text-red-600"
                    : "text-red-500 hover:text-red-700"
                  }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() =>
                setPage((prev) =>
                  Math.min(
                    Math.max(3, paginationData?.totalPages || 1),
                    prev + 1
                  )
                )
              }
              disabled={page === Math.max(3, paginationData?.totalPages || 1)}
              className={`p-2 text-red-500 transition rounded-full ${page === Math.max(3, paginationData?.totalPages || 1)
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-red-700"
                }`}
            >
              <FaChevronRight className="text-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskMonitoring;