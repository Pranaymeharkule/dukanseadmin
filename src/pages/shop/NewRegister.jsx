import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsArrowLeftCircle } from "react-icons/bs";
import { ReactComponent as ViewIcon } from "../../assets/view.svg";

/* ---------- Helpers ---------- */
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

const formatDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString("en-IN");
};

/* ---------- Status Badge ---------- */
const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 py-1 rounded text-sm font-medium";
  const statusClasses = {
    pending: "text-yellow-500",
    active: "text-green-500",
    approved: "text-green-500",
    rejected: "text-red-500",
  };
  return (
    <span
      className={`${baseClasses} ${
        statusClasses[String(status).toLowerCase()] || "text-gray-500"
      }`}
    >
      {status}
    </span>
  );
};

/* ---------- Trash Icon ---------- */
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-red-500 hover:text-red-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

/* ---------- Main Component ---------- */
export default function NewRegister() {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(shops.length / rowsPerPage);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/shopApproval/getNewRegisterShops`,
        { params: { t: Date.now() } }
      );
      setShops(
        Array.isArray(res.data?.newRegisterdShops)
          ? res.data.newRegisterdShops
          : []
      );
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error fetching shops:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-4 text-center text-red-500">
        Something went wrong. Check console.
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle
              size={20}
              className="text-gray-700 md:text-black"
            />
          </button>
          <h2 className="text-lg text-gray-800 font-medium">New Shop</h2>
        </div>
      </div>

      {/* Table with new UI */}
      <div class="bg-white rounded-md p-2 mt-4 shadow">
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <div className="w-full bg-white rounded-lg min-h-[calc(100vh-200px)]">
          <table className="w-full table-auto min-w-[700px]">
            <thead className="bg-[#FEBC1D] text-black text-center">
              <tr className="text-sm">
                <th className="py-3 px-4 text-base text-left">Store</th>
                <th className="py-3 px-4 text-base text-left">Owner</th>
                <th className="py-3 px-4 text-base text-left">Number</th>
                <th className="py-3 px-4 text-base text-left">Email</th>
                <th className="py-3 px-4 text-base text-left">Status</th>
                <th className="py-3 px-4 text-base text-left">Date</th>
                <th className="py-3 px-4 text-base text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shops.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 border-b"
                  >
                    No new shop registrations found.
                  </td>
                </tr>
              ) : (
                shops
                  .slice(
                    (currentPage - 1) * rowsPerPage,
                    currentPage * rowsPerPage
                  )
                  .map((shop) => (
                    <tr
                      key={shop._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shop.shopName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {shop.ownerName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {shop.phoneNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shop.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={shop.shopStatus} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(shop.createdAt || shop.date)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                        <ViewIcon
                          className="w-5 h-5 cursor-pointer text-gray-700 hover:text-black"
                          onClick={() =>
                            navigate(`/shop/registere/info/${shop._id}`)
                          }
                        />
                          {/* <button onClick={() => handleDelete(shop)}>
                            <TrashIcon />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Pagination */}
      {shops.length > 0 && (
        <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={`page-${index + 1}`}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded font-medium ${
                currentPage === index + 1
                  ? "bg-[#FEBC1D] text-red-500 border-red-500"
                  : "bg-white text-red-500 border border-red-500 hover:text-red-700 hover:border-red-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  </div>
  );
}
