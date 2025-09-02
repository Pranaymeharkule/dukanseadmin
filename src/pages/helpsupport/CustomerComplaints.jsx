import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

/* ---------- Icons ---------- */
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

/* ---------- Status Badge ---------- */
const StatusBadge = ({ status, onClick }) => {
  const baseClasses = "px-2 py-1 rounded text-sm font-medium cursor-pointer";
  const statusClasses = {
    Solved: "text-green-500",
    Resolved: "text-green-500",
    Pending: "text-yellow-500",
    Ongoing: "text-orange-500",
  };

  return (
    <span
      className={`${baseClasses} ${statusClasses[status] || "bg-gray-500"}`}
      onClick={
        status !== "Resolved" && status !== "Solved" ? onClick : undefined
      }
      title={
        status !== "Resolved" && status !== "Solved"
          ? "Mark as Resolved"
          : undefined
      }
    >
      {status}
    </span>
  );
};

/* ---------- Complaints Table ---------- */
const ComplaintsTable = ({ data = [], onDelete, onResolve }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  return (
    <div className="bg-white rounded-md m-2 p-4 shadow">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div className="max-h-[490px] min-w-[1000px]">
          <table className="w-full table-auto">
            <thead className="bg-brandYellow text-white text-center">
              <tr className="text-black text-sm">
                <th className="py-3 px-4 text-base text-left">Store</th>
                <th className="py-3 px-4 text-base text-left">Customer Name</th>
                <th className="py-3 px-4 text-base text-left">Complaints</th>
                <th className="py-3 px-4 text-base text-left">Status</th>
                <th className="py-3 px-4 text-base text-left">Date</th>
                <th className="py-3 px-4 text-base text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data
                .slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage
                )
                .map((item, index) => (
                  <tr
                    key={item._id || item.id || `complaint-${index}`}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.store}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.customerName}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={item.status}
                        onClick={() => onResolve(item)}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => onDelete(item)}
                          className="focus:outline-none"
                          title="Delete Complaint"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {Math.ceil(data.length / rowsPerPage) > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(Math.ceil(data.length / rowsPerPage))].map((_, index) => (
            <button
              key={`page-${index + 1}`}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded font-medium ${
                currentPage === index + 1
                  ? "bg-brandYellow text-red-500 border-red-500"
                  : "bg-white text-red-500 border-red-500 hover:text-red-700 hover:border-red-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(data.length / rowsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
            className="px-2 py-1 text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------- Main Component ---------- */
export default function CustomerComplaints() {
  const navigate = useNavigate();
  const location = useLocation();
  const [complaints, setComplaints] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;
  const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODM3N2Q5OTk2NGQ2ZmQ1OTJiNDVlMiIsImlhdCI6MTc1NjgxNTU5MywiZXhwIjoxNzU2OTAxOTkzfQ.DxCrPaPkCnMl2E9TMxLwjqqze7oLo5SdSc-l33ODz5c";

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/adminSupport/getAllCustomerTickets`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
            params: { t: Date.now() },
          }
        );

        const fetchedComplaints = Array.isArray(response.data.tickets)
          ? response.data.tickets
          : [];
        setComplaints(fetchedComplaints);
      } catch (error) {
        console.error("Error fetching customer complaints:", error);
        setComplaints([]);
      }
    };

    fetchComplaints();
  }, [API_BASE_URL]);

  const handleDeleteClick = (item) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  // ✅ Delete API call when clicking "Yes"
  // ✅ Delete API call when clicking "Yes"
const confirmDelete = async () => {
  if (!currentItem?._id && !currentItem?.id) return;
  const complaintId = currentItem._id || currentItem.id;

  try {
    await axios.delete(`${API_BASE_URL}/adminSupport/delete/${complaintId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    // remove from state
    setComplaints((prev) =>
      prev.filter((c) => c._id !== complaintId && c.id !== complaintId)
    );
  } catch (error) {
    console.error("Error deleting complaint:", error.response?.data || error);
  }

  setIsDeleteModalOpen(false);
  setCurrentItem(null);
};


  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentItem(null);
  };

  // ✅ Resolve Status API
  const handleResolveStatus = async (item) => {
    if (!item._id && !item.id) return;
    const docId = item._id || item.id;

    try {
      const res = await axios.put(
        `${API_BASE_URL}/adminSupport/reSolve/${docId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          params: { t: Date.now() },
        }
      );

      const newStatus = res?.data?.resolvedTicket?.status || "Solved";

      setComplaints((prev) =>
        prev.map((c) =>
          (c._id || c.id) === docId ? { ...c, status: newStatus } : c
        )
      );
    } catch (error) {
      console.error(
        "Error resolving complaint:",
        error.response?.data || error
      );
    }
  };

  return (
    <>
      <div className="bg-gray-100 p-3">
        <div className="bg-white px-4 py-3 rounded-md shadow">
          <h2 className="text-lg font-semibold text-gray-800">
            Help & Support
          </h2>
        </div>

        <div className="bg-white px-4 py-3 mt-4 rounded-md shadow flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/helpSupport")}
            className={`px-4 py-2 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
              location.pathname === "/helpSupport"
                ? "bg-[rgb(254,188,29)] text-white"
                : ""
            }`}
          >
            Seller Complaints
          </button>
          <button
            onClick={() => navigate("/helpSupport/customer-complaints")}
            className={`px-4 py-2 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
              location.pathname === "/helpSupport/customer-complaints"
                ? "bg-[rgb(254,188,29)] "
                : ""
            }`}
          >
            Customer Complaints
          </button>
          <button
            onClick={() => navigate("/helpSupport/customer-support-number")}
            className={`px-4 py-2 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
              location.pathname === "/helpSupport/customer-support-number"
                ? "bg-[rgb(254,188,29)] "
                : ""
            }`}
          >
            Customer Support Number
          </button>
          <button
            onClick={() => navigate("/helpSupport/faq")}
            className={`px-4 py-2 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
              location.pathname === "/helpSupport/faq"
                ? "bg-[rgb(254,188,29)] "
                : ""
            }`}
          >
            FAQ
          </button>
        </div>

        <div className="bg-white rounded-md m-2 p-4 shadow">
          <main className="mt-6">
            <ComplaintsTable
              data={complaints}
              onDelete={handleDeleteClick}
              onResolve={handleResolveStatus}
            />
          </main>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-center text-xl font-semibold text-gray-800">
              Are you sure want to Delete?
            </h2>
            <div className="mt-6 flex justify-center gap-6">
              <button
                onClick={closeModal}
                className="w-28 py-3 border-2 border-red-500 text-red-500 rounded-md hover:bg-red-50 text-base font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-28 py-3 bg-yellow-400 text-orange-600 rounded-md hover:bg-yellow-300 text-base font-semibold"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
