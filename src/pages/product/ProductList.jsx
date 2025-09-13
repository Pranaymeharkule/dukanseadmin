import React, { useState, useMemo } from "react";
import { FiEye } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaPlusCircle,
  FaChevronLeft, 
  FaChevronRight
} from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { BiSortAlt2 } from "react-icons/bi";
import {
  useDeleteProductByIdMutation,
  useGetAllProductsQuery,
} from "../../redux/apis/productApi";
import { toast } from "react-toastify";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default"); // default, asc, desc

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

    if (selectedFilter === "price" && sortOrder !== "default") {
      sortedArray.sort((a, b) => {
        if (sortOrder === "asc") return a.price - b.price;
        return b.price - a.price;
      });
    } else if (selectedFilter === "quantity" && sortOrder !== "default") {
      sortedArray.sort((a, b) => {
        if (sortOrder === "asc") return a.unitsAvailable - b.unitsAvailable;
        return b.unitsAvailable - a.unitsAvailable;
      });
    }
    // For "all" or "default", keep original order

    return sortedArray;
  }, [products, selectedFilter, sortOrder]);

  // Calculate pagination data
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentPageProducts = sortedProducts.slice(startIndex, endIndex);

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "asc", label: "Low to High" },
    { value: "desc", label: "High to Low" },
  ];

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "price", label: "Price" },
    { value: "quantity", label: "Quantity" },
  ];

  const handleSortSelect = (sortValue) => {
    setSortOrder(sortValue);
    setShowSortDropdown(false);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    setShowFilterDropdown(false);
    setCurrentPage(1); // Reset to first page when filter changes
    // Reset sort to default when changing filter
    if (filterValue === "all") {
      setSortOrder("default");
    }
  };

  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortOrder);
    return option ? option.label : "Default";
  };

  const getCurrentFilterLabel = () => {
    const option = filterOptions.find((opt) => opt.value === selectedFilter);
    return option ? option.label : "All";
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProductById(productId).unwrap();
      toast.success("Product deleted successfully!");
      // If current page becomes empty after deletion, go to previous page
      if (currentPageProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">
            Error loading products: {error.message}
          </div>
        </div>
      </div>
    );
  }
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

  return (
    <div className="p-4 bg-gray-100 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-md shadow mb-4">
        <h2 className="text-lg text-gray-800 font-poppins font-medium">Product List</h2>

        {/* Separated Filters + Add Button */}
        <div className="flex items-center gap-1">
          {/* Left Side - Sort Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 text-gray-700 px-2 py-2 rounded-md"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="16"
                height="16"
                viewBox="0 0 30 30"
                fill="none"
                className="w-4 h-4"
              >
                <rect width="30" height="30" fill="url(#pattern0_4522_13470)" />
                <defs>
                  <pattern
                    id="pattern0_4522_13470"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlinkHref="#image0_4522_13470"
                      transform="scale(0.0104167)"
                    />
                  </pattern>
                  <image
                    id="image0_4522_13470"
                    width="96"
                    height="96"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAABs0lEQVR4nO2cuW5DQRDD9q9dJmX+WkGA9D7eIY2WBLbXkIbdeS0AAAAAAIBr+V5r/SDZJ1//jwhG+UQIkE+EAPkK+Tp6tq9avgIiVAZ4R77MEeoCfCJfxghVAY7IlylCTYAz5MsQoSLAmfJ1c4TxAa6QrxsjjA5wpXyZfhPGcId8EcEvX0TwyxcR/PK1e4QE+do1QpJ87RYhUb52i3CEZxLdpO+rP1Dh++oPVPi++gMVvq/+QIXvqz9Q4fvqD1T4vvoDFb7vMPUHpkMAMwQwQwAzBDBDADMEMEMAM+kBFL6v/kCF76s/UOH76g9U+L76AxW+r/5Ahe+rP1Dh++oPVPi+ekQALwQwQwAzBDBDADMEMEMAM/UB0g9U+L76AxW+r/5Ahe+rP1Dh++oPVPi++gMVvq/+QIXvqz9Q4fviebwg0fW+1iY8AmRvKz8xwnbykyJsKz8hwvbynRGQb4yAfGOEePnPDpgcIV5+QoCrIoyQnxLg7Ahj5CcFOCvCKPlpAY5GGCc/McCnEUbKTw3wboSx8pMDvBphtPwJPJCfGYFPvjEC8o3/k/33AAAAAAAA1lX8Av/fmrZrQyxPAAAAAElFTkSuQmCC"
                  />
                </defs>
              </svg>
            </button>

            {showSortDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[150px]">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition ${sortOrder === option.value
                      ? "bg-brandYellow text-yellow-700 font-medium"
                      : "text-gray-700"
                      }`}
                    onClick={() => handleSortSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Filter Dropdown */}
          <div className="relative">
            <button
              className="flex items-center justify-center text-gray-700 w-10 h-10 hover:bg-gray-100 transition"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <FaFilter className="text-lg" />
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[150px]">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition ${selectedFilter === option.value
                      ? "bg-yellow-50 text-yellow-700 font-medium"
                      : "text-gray-700"
                      }`}
                    onClick={() => handleFilterSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Add Product Button */}
          <button
            className="flex items-center gap-2 bg-brandYellow font-poppins text-brandRed font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition"
            onClick={() => navigate("/product/product-add")}
          >
            <FaPlusCircle />
            ADD Product
          </button>
        </div>
      </div>

      {/* Overlay click to close dropdowns */}
      {(showSortDropdown || showFilterDropdown) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setShowSortDropdown(false);
            setShowFilterDropdown(false);
          }}
        />
      )}

      {/* Product Table Card */}
      <div className="bg-white rounded-md shadow flex-1 flex flex-col min-h-0 px-4 py-3">
        <div className="bg-white rounded-md shadow flex flex-col min-h-[500px]">
          {/* Table Wrapper */}
          <div className="overflow-x-auto flex-1 flex flex-col">
            <table className="w-full table-auto">
              <thead className="bg-brandYellow text-white text-center">
                <tr className="text-black text-sm">
                  <th className="py-3 px-4 text-base text-left">Product</th>
                  <th className="py-3 px-4 text-base text-center">Name</th>
                  <th className="py-3 px-4 text-base text-center">MRP</th>
                  <th className="py-3 px-4 text-base text-center">Quantity</th>
                  <th className="py-3 px-4 text-base text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 min-h-[400px] ">
                {currentPageProducts.length > 0 ? (
                  currentPageProducts.map((item, idx) => (
                    <tr
                      key={item._id || idx}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-1 px-4 text-left">
                        <div className="flex justify-start">
                          <img
                            src={
                              item.productPhotoFront || "/placeholder-image.png"
                            }
                            alt={item.productName || "Product"}
                            className="h-9 w-9 object-cover rounded"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.png";
                            }}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-poppins text-center text-sm text-gray-600 break-words">
                        {item.productName || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-poppins text-center text-sm text-gray-600">
                        ₹{item.price || 0}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-poppins text-center text-sm text-gray-600">
                        {item.unitsAvailable || 0}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex justify-end items-center justify-end gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-gray-600 cursor-pointer hover:text-gray-800"
                            onClick={() =>
                              navigate(`/product/details/${item._id}`)
                            }
                            title="View Product"
                          >
                            <path
                              d="M12.5 16C14.1569 16 15.5 14.6569 15.5 13C15.5 11.3431 14.1569 10 12.5 10C10.8431 10 9.5 11.3431 9.5 13C9.5 14.6569 10.8431 16 12.5 16Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M21.5 14C21.5 14 20.5 6 12.5 6C4.5 6 3.5 14 3.5 14"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>

                          <button
                            onClick={() => handleDeleteProduct(item._id)}
                            title="Delete Product"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Card */}
          {totalPages > 1 && (
            <div className="bg-white rounded-md shadow mt-4 p-3">
              <div className="flex justify-center items-center gap-4">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`text-red-500 hover:text-red-700 transition-all p-1 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  <FaChevronLeft className="text-lg" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={currentPage === pageNum}
                      className={`px-3 py-1 rounded-md font-bold transition-all text-sm ${currentPage === pageNum
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
                  className={`text-red-500 hover:text-red-700 transition-all p-1 ${currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                >
                  <FaChevronRight className="text-lg" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
