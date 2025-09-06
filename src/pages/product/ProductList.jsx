import React, { useState, useMemo } from "react";
import { FiEye } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaPlusCircle,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { BiSortAlt2 } from "react-icons/bi";
import {
  useDeleteProductByIdMutation,
  useGetAllProductsQuery,
} from "../../redux/apis/productApi";
import { toast } from "react-toastify";
import sorting_arrow from "../../assets/sorting-arrows.png";

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

  return (
    <div className="bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-md shadow">
        <h2 className="text-xl font-semibold text-gray-800">Product List</h2>

        {/* Separated Filters + Add Button */}
        <div className="flex items-center gap-4">
          {/* Left Side - Sort Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 text-gray-700 px-3 py-2 rounded-md "
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <img src={sorting_arrow} alt="Sort" className="w-4 h-4" />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[150px]">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition ${
                      sortOrder === option.value
                        ? "bg-yellow-50 text-yellow-700 font-medium"
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
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition ${
                      selectedFilter === option.value
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
            className="flex items-center gap-2 bg-yellow-400 text-red-600 font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition"
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
                {currentPageProducts.length > 0 ? (
                  currentPageProducts.map((item, idx) => (
                    <tr
                      key={item._id || idx}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <img
                          src={
                            item.productPhotoFront || "/placeholder-image.png"
                          }
                          alt={item.productName || "Product"}
                          className="h-16 w-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.png";
                          }}
                        />
                      </td>
                      <td className="py-3 px-4">{item.productName || "N/A"}</td>
                      <td className="py-3 px-4">₹{item.price || 0}</td>
                      <td className="py-3 px-4">{item.unitsAvailable || 0}</td>
                      <td className="py-3 px-4 flex items-center gap-4">
                        <FiEye
                          className="text-gray-600 text-xl cursor-pointer hover:text-gray-800"
                          onClick={() =>
                            navigate(`/product/details/${item._id}`)
                          }
                          title="View Product"
                        />
                        <MdDelete
                          className="text-red-500 text-xl cursor-pointer hover:text-red-700"
                          onClick={() => handleDeleteProduct(item._id)}
                          title="Delete Product"
                        />
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
