import React, { useEffect, useState } from "react";
import { VscEye } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export default function Redeem() {
  const navigate = useNavigate();
  const [redeemRequests, setRedeemRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRedemptionRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://dukanse-be-f5w4.onrender.com/api/payments/getAllRedemptionRequests');
        const result = await response.json();
        if (result.success) setRedeemRequests(result.data);
        else throw new Error('API returned an error');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRedemptionRequests();
  }, []);

  // Pagination
  const totalPages = Math.ceil(redeemRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = redeemRequests.slice(indexOfFirstItem, indexOfLastItem);

  const StatusPill = ({ status }) => {
    const isPending = status === 'Pending';
    const colorClass = isPending ? 'text-[#FEBC1D]' : 'text-[#47B247]';
    return <span className={`font-semibold ${colorClass}`}>{status}</span>;
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-poppins">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-xl mb-6">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-2xl font-semibold text-[#333333]">Redeem List</h1>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden h-[700px]">
          <div className="p-6 sm:p-8 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#FEBC1D] text-[#333333] font-semibold text-xl">
                <tr>
                  <th className="px-6 py-4 rounded-l-lg">Shop Name</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">UPI/Bank</th>
                  <th className="px-6 py-4">Redeem Status</th>
                  <th className="px-6 py-4 text-center rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="text-[#262626]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-red-500">Error: {error}</td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="px-6 py-4 font-medium text-lg">{item.shopName}</td>
                      <td className="px-6 py-4 font-medium text-lg">{item.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium text-lg">{item.upiOrBank}</td>
                      <td className="px-6 py-4 font-medium text-lg"><StatusPill status={item.redeemStatus} /></td>
                      <td
                        className="px-6 py-4 flex justify-center items-center text-2xl font-bold cursor-pointer"
                        onClick={() => navigate(`/redeemdetails/${item.id}`)}
                      >
                        <VscEye className="text-[#333333]" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10">No redemption requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 space-x-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-red-500 disabled:opacity-40"
              >
                <ChevronLeftIcon />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-md transition-all duration-200 ${
                    currentPage === pageNum
                      ? "bg-yellow-400 text-red-600"
                      : "text-red-500 hover:bg-yellow-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-red-500 disabled:opacity-40"
              >
                <ChevronRightIcon />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
