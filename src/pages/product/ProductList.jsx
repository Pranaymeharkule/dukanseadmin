import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaFilter, FaPlusort, FaSortAmountDown } from "react-icons/fa";
import { useNavigates } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import {
  useDeleteProductByIdMutation,
  useGetAllProductsQuery,
} from "../../redux/apis/productApi";
import { toast } from "react-toastify";
const ProductList = () => {
  // Corrected call in ProductList component
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading } = useGetAllProductsQuery({
    page: currentPage,
    limit: 10,
    search: "",
    sortOrder: "desc",
  });
  const [deleteProductById] = useDeleteProductByIdMutation();

  console.log({ data, error, isLoading });
  const products = data?.products || [];

  const navigate = useNavigate();

  return (
    <div className=" bg-gray-100   ">
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-md shadow">
        {/* Left: Title */}
        <h2 className="text-lg font-semibold text-gray-800">Product List</h2>

        {/* Right: Icons and Button */}
        <div className="flex items-center gap-4">
          {/* Filter Icon */}
          <FaFilter className="text-gray-700 cursor-pointer text-lg" />

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

      {/* Scrollable Table */}

      <div className="bg-white rounded-md m-1.5 p-1 shadow  ">
        {/* Horizontally Scrollable + Vertically Scrollable */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
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
                {products.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img
                        src={item.productPhotoFront}
                        alt={item.productName}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td>{item.productName}</td>
                    <td>{item.price}</td>
                    <td>{item.unitsAvailable}</td>
                    <td className="py-3 px-4 flex items-center gap-4">
                      <FiEye
                        className="text-gray-600 text-xl cursor-pointer "
                        onClick={() => navigate(`/product/details/${item._id}`)}
                      />
                      {/* Delete Product By Id  */}
                      <MdDelete
                        className="text-red-500 text-xl cursor-pointer"
                        onClick={async () => {
                          {
                            try {
                              await deleteProductById(item._id).unwrap();
                              toast("Product deleted successfully!");
                            } catch (err) {
                              console.error("Delete failed", err);
                              toast("Failed to delete product");
                            }
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
    </div>
  );
};

export default ProductList;
