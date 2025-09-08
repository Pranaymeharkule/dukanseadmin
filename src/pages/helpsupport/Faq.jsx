// src/pages/helpsupport/Faq.jsx 
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

// ----- Custom SVG Icons -----
import { ReactComponent as ViewIcon } from "../../assets/view.svg";
import { ReactComponent as EditIcon } from "../../assets/Vector.svg";

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
      d="M19 7l-.867 12.142A2 2 
         0 0116.138 21H7.862a2 2 0 
         01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 
         1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

// ----- FAQ Table -----
const FaqTable = ({ data = [], onView, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <div className="bg-white rounded-md  shadow">
        <div className="max-h-[490px] w-full">
          <table className="w-full table-auto text-sm md:text-base">
            <thead className="bg-brandYellow text-white text-left">
              <tr className="text-black">
                <th className="py-3 px-2 md:px-4">Sr No</th>
                <th className="py-3 px-2 md:px-4">FAQ</th>
                <th className="py-3 px-2 md:px-4">FAQ Ans</th>
                <th className="py-3 px-2 md:px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {paginatedData.map((item, index) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 md:py-3 px-2 md:px-4 text-left">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="py-2 md:py-3 px-2 md:px-4 text-left break-words max-w-[200px]">
                    {item.question}
                  </td>
                  <td className="py-2 md:py-3 px-2 md:px-4 text-left break-words max-w-[200px]">
                    {item.answer}
                  </td>
                  <td className="py-2 md:py-3 px-2 md:px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 md:space-x-4">
                    <button onClick={() => onView(item)} title="View FAQ">
                <ViewIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
              </button>
              <button onClick={() => onEdit(item)} title="Edit FAQ">
                <EditIcon className="h-4 w-4 text-green-500 hover:text-green-700" />
              </button>

                      <button onClick={() => onDelete(item)} title="Delete FAQ">
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
      {data.length > 0 && (
        <div className="flex flex-wrap justify-center items-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-brandYellow text-red-500"
                  : "bg-white text-red-500 hover:text-red-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

// ----- Main Component -----
export default function Faq() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  const [faqs, setFaqs] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/adminFaq/getAllAdminFaqs?t=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched FAQ data:", data);
        if (Array.isArray(data.allFaqs)) {
          setFaqs(data.allFaqs);
        } else setFaqs([]);
      })
      .catch(() => setFaqs([]));
  }, [API_BASE_URL]);

  const handleFaqViewClick = (item) =>
    navigate(`/faq/view/${item._id}`, { state: item });
  const handleFaqEditClick = (item) =>
    navigate(`/faq/edit/${item._id}`, { state: item });
  const handleDeleteClick = (item) => {
    setSelectedFaq(item);
    setIsDeleteModalOpen(true);
  };
  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedFaq(null);
  };

  const confirmDelete = async () => {
    if (!selectedFaq?._id) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/adminFaq/deleteFaqById/${selectedFaq._id}?t=${Date.now()}`,
        {
          method: "DELETE",
          headers: { "Cache-Control": "no-cache" },
        }
      );
      const result = await response.json();
      if (response.ok && result.success) {
        setFaqs((prev) => prev.filter((f) => f._id !== selectedFaq._id));
        closeModal();
        alert("FAQ has been deleted successfully!");
      } else alert(result.message || "Failed to delete FAQ");
    } catch {
      alert("An error occurred while deleting the FAQ");
    }
  };

  return (
    <div className="bg-gray-100 p-3">
      {/* Header */}
      <div className="bg-white px-4 py-3 rounded-md shadow">
        <h2 className="text-lg text-gray-800">Help & Support</h2>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white px-4 py-3 mt-4 rounded-md shadow flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/helpSupport")}
          className={`px-2 py-1 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport" ? "bg-[rgb(254,188,29)] " : ""
          }`}
        >
          Seller Complaints
        </button>

        <button
          onClick={() => navigate("/helpSupport/customer-complaints")}
          className={`px-2 py-1 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport/customer-complaints"
              ? "bg-[rgb(254,188,29)] "
              : ""
          }`}
        >
          Customer Complaints
        </button>

        <button
          onClick={() => navigate("/helpSupport/customer-support-number")}
          className={`px-2 py-1 rounded-md border border-[rgb(236,45,1)] text-[rgb(236,45,1)] ${
            location.pathname === "/helpSupport/customer-support-number"
              ? "bg-[rgb(254,188,29)] "
              : ""
          }`}
        >
          Customer Support Number
        </button>

        <button
          onClick={() => navigate("/helpSupport/faq")}
          className={`px-2 py-1 rounded-md border  text-[rgb(236,45,1)] shadow ${
            location.pathname === "/helpSupport/faq"
              ? "bg-[rgb(254,188,29)] "
              : ""
          }`}
        >
          FAQ
        </button>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-md mt-4  p-1 md:p-4 shadow">
        {/* Add FAQ Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate("/helpSupport/faq/add")}
            className="flex items-center gap-2 bg-brandYellow text-red-600 font-semibold px-3 md:px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition mb-3 "
          >
            ADD FAQ
          </button>
        </div>

        {/* FAQ Table */}
        <FaqTable
          data={faqs}
          onView={handleFaqViewClick}
          onEdit={handleFaqEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-center text-lg md:text-xl font-semibold text-gray-800">
              Are you sure want to Delete?
            </h2>
            <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-center gap-3 md:gap-6">
              <button
                onClick={closeModal}
                className="w-full md:w-28 py-2 md:py-3 border-2 border-red-500 text-red-500 rounded-md hover:bg-red-50 text-sm md:text-base font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-full md:w-28 py-2 md:py-3 bg-yellow-400 text-orange-600 rounded-md hover:bg-yellow-300 text-sm md:text-base font-semibold"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
