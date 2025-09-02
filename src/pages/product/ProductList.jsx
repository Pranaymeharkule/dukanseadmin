import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaFilter, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useDeleteProductByIdMutation,
  useGetAllProductsQuery,
} from "../../redux/apis/productApi";
import { toast } from "react-toastify";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [localProducts, setLocalProducts] = useState([]); // local state for optimistic update

  const { data, isLoading } = useGetAllProductsQuery({
    page: currentPage,
    limit: 10,
    search,
    sortOrder: "desc",
  });

  const [deleteProductById] = useDeleteProductByIdMutation();
  const products = localProducts.length ? localProducts : data?.products || [];
  const navigate = useNavigate();

  // Sync local state with API data
  React.useEffect(() => {
    if (data?.products) {
      setLocalProducts(data.products);
    }
  }, [data]);

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 tracking-wide">
          Product List
        </h2>

        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
          >
            <FaFilter />
            <span className="hidden sm:block">Filter</span>
          </button>

          {/* Add Product */}
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 font-semibold px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
            onClick={() => navigate("/product/product-add")}
          >
            <FaPlus />
            <span className="hidden sm:block">Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter Input */}
      {showFilter && (
        <div className="bg-white px-6 py-3 shadow mt-3 rounded-lg flex items-center gap-3">
          <input
            type="text"
            placeholder=" Search products..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="bg-yellow-400 text-red-700 font-semibold px-5 py-2 rounded-lg shadow hover:bg-yellow-500 transition"
            onClick={() => setCurrentPage(1)}
          >
            Apply
          </button>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-lg mt-4 p-3 shadow-md">
        <div className="overflow-x-auto">
          <div className="max-h-[490px] min-w-[1000px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white sticky top-0">
                <tr className="text-sm">
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">MRP</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {products.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={item.productPhotoFront}
                        alt={item.productName}
                        className="h-16 w-16 object-cover rounded-md border"
                      />
                    </td>
                    <td className="font-medium">{item.productName}</td>
                    <td>₹{item.price}</td>
                    <td>{item.unitsAvailable}</td>
                    <td className="py-3 px-4 flex items-center gap-4">
                      <FiEye
                        className="text-blue-600 text-xl cursor-pointer hover:scale-110 transition-transform"
                        onClick={() =>
                          navigate(`/product/details/${item._id}`)
                        }
                      />
                      <MdDelete
                        className="text-red-500 text-xl cursor-pointer hover:scale-110 transition-transform"
                        onClick={async () => {
                          // 🔥 Optimistic UI removal
                          setLocalProducts((prev) =>
                            prev.filter((p) => p._id !== item._id)
                          );

                          try {
                            await deleteProductById(item._id).unwrap();
                            toast.success(" Product deleted!");
                          } catch {
                            toast.error("❌ Failed to delete product");
                            // rollback (refetch original API data)
                            setLocalProducts(data?.products || []);
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}

                {/* No Products */}
                {products.length === 0 && !isLoading && (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-500 py-6 italic"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Loader */}
            {isLoading && (
              <div className="text-center py-6 text-gray-500">
                Loading products...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
