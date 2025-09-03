import React, { useState, useMemo } from "react";
import { FiEye } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaFilter, FaPlus, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useDeleteProductByIdMutation,
  useGetAllProductsQuery,
} from "../../redux/apis/productApi";
import { toast } from "react-toastify";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // asc / desc

  // Fetch ALL products for proper sorting across pages
  const { data, error, isLoading } = useGetAllProductsQuery({
    page: 1,
    limit: 1000, // Fetch a large number to get all products
    search: "",
  });

  const [deleteProductById] = useDeleteProductByIdMutation();
  const navigate = useNavigate();

  const products = data?.products || [];
  const productsPerPage = 10;

  // ⬇️ Apply frontend sorting to all products
  const sortedProducts = useMemo(() => {
    let sortedArray = [...products];

    if (selectedFilter === "price") {
      sortedArray.sort((a, b) => {
        if (sortOrder === "asc") return a.price - b.price;
        return b.price - a.price;
      });
    } else if (selectedFilter === "quantity") {
      sortedArray.sort((a, b) => {
        if (sortOrder === "asc") return a.unitsAvailable - b.unitsAvailable;
        return b.unitsAvailable - a.unitsAvailable;
      });
    }
    // For "all", keep original order

    return sortedArray;
  }, [products, selectedFilter, sortOrder]);

  // Calculate pagination data
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentPageProducts = sortedProducts.slice(startIndex, endIndex);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "price", label: "Price" },
    { value: "quantity", label: "Quantity" },
  ];

  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    setShowFilterDropdown(false);
    setCurrentPage(1); // Reset to first page when filter changes
    if (filterValue === "all") setSortOrder("desc");
  };

  const handleSortOrderChange = (newFilter, newSortOrder) => {
    setSelectedFilter(newFilter);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page when sort changes
    setShowFilterDropdown(false);
  };

  const getCurrentFilterLabel = () => {
    const option = filterOptions.find((opt) => opt.value === selectedFilter);
    const baseLabel = option ? option.label : "All";

    if (selectedFilter === "price" || selectedFilter === "quantity") {
      return `${baseLabel} (${
        sortOrder === "desc" ? "High to Low" : "Low to High"
      })`;
    }

    return baseLabel;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-md shadow">
        <h2 className="text-lg font-semibold text-gray-800">Product List</h2>

        {/* Filter + Add */}
        <div className="flex items-center gap-4">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <FaFilter className="text-sm" />
              <span className="text-sm font-medium">
                {getCurrentFilterLabel()}
              </span>
              {showFilterDropdown ? (
                <FaChevronUp className="text-xs" />
              ) : (
                <FaChevronDown className="text-xs" />
              )}
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[200px]">
                {filterOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 transition ${
                      selectedFilter === option.value
                        ? "bg-yellow-50 text-yellow-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <button
                      className="flex-1 text-left"
                      onClick={() => handleFilterSelect(option.value)}
                    >
                      {option.label}
                    </button>

                    {(option.value === "price" ||
                      option.value === "quantity") && (
                      <div className="flex flex-col ml-2">
                        <button
                          onClick={() =>
                            handleSortOrderChange(option.value, "desc")
                          }
                          className={`p-1 hover:bg-gray-200 rounded ${
                            selectedFilter === option.value &&
                            sortOrder === "desc"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                          title="High to Low"
                        >
                          <FaChevronUp className="text-xs" />
                        </button>
                        <button
                          onClick={() =>
                            handleSortOrderChange(option.value, "asc")
                          }
                          className={`p-1 hover:bg-gray-200 rounded ${
                            selectedFilter === option.value &&
                            sortOrder === "asc"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                          title="Low to High"
                        >
                          <FaChevronDown className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Product Button */}
          <button
            className="flex items-center gap-2 bg-yellow-400 text-red-600 font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition"
            onClick={() => navigate("/product/product-add")}
          >
            <FaPlus />
            ADD Product
          </button>
        </div>
      </div>

      {/* Overlay click to close dropdown */}
      {showFilterDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}

      {/* Product Table */}
      <div className="bg-white rounded-md m-1.5 p-1 shadow">
        <div className="overflow-x-auto">
          <div className="max-h-[490px] min-w-[1000px]">
            <table className="w-full table-auto">
              <thead className="bg-yellow-500 text-white text-left">
                <tr className="text-black text-sm">
                  <th className="py-3 px-4 text-base">Product</th>
                  <th className="py-3 px-4 text-base">Name</th>
                  <th className="py-3 px-4 text-base">MRP</th>
                  <th className="py-3 px-4 text-base">Quantity</th>
                  <th className="py-3 px-4 text-base">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {currentPageProducts.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={item.productPhotoFront}
                        alt={item.productName}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-4">{item.productName}</td>
                    <td className="py-3 px-4">{item.price}</td>
                    <td className="py-3 px-4">{item.unitsAvailable}</td>
                    <td className="py-3 px-4 flex items-center gap-4">
                      <FiEye
                        className="text-gray-600 text-xl cursor-pointer"
                        onClick={() => navigate(`/product/details/${item._id}`)}
                      />
                      <MdDelete
                        className="text-red-500 text-xl cursor-pointer"
                        onClick={async () => {
                          try {
                            await deleteProductById(item._id).unwrap();
                            toast("Product deleted successfully!");
                            // If current page becomes empty after deletion, go to previous page
                            if (
                              currentPageProducts.length === 1 &&
                              currentPage > 1
                            ) {
                              setCurrentPage(currentPage - 1);
                            }
                          } catch (err) {
                            console.error("Delete failed", err);
                            toast("Failed to delete product");
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`text-red-500 hover:text-red-700 transition-all ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            &#8592;
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={currentPage === pageNum}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  currentPage === pageNum
                    ? "bg-[#FEBC1D] text-red-500"
                    : "text-red-500 hover:text-red-700"
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`text-red-500 hover:text-red-700 transition-all ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
