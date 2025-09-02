import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsArrowLeftCircle } from "react-icons/bs";

const NewRegister = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const baseURL = process.env.REACT_APP_BACKEND_API_BASEURL;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/shopApproval/getNewRegisterShops?timestamp=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache" } }
        );

        setShops(
          Array.isArray(response.data.newRegisterdShops)
            ? response.data.newRegisterdShops
            : []
        );
      } catch (err) {
        console.error("Error fetching shops:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [baseURL]);

  const handleDelete = async (shopId) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        setDeletingId(shopId);
        await axios.delete(
          `${baseURL}/shopApproval/deleteApprovedShop/${shopId}`
        );

        setShops((prev) => prev.filter((shop) => shop._id !== shopId));
        alert("Shop registration deleted successfully!");
      } catch (err) {
        console.error("Failed to delete shop:", err);
        alert(err.response?.data?.message || "Error deleting shop");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-4 text-center text-red-500">Something went wrong</div>
    );

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Header (same style as FaqAdd.jsx) */}
      <div className="flex items-center mb-4 bg-white p-4 md:p-5 rounded shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle
              size={25}
              className="text-gray-700 md:text-black"
            />
          </button>
          <h2 className="text-lg md:text-xl font-semibold">New Shop</h2>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-4 md:p-6 rounded-md shadow">
        <table className="w-full table-auto text-sm md:text-base">
          <thead className="bg-[#FEBC1D] text-black">
            <tr>
              <th className="px-4 py-3 text-left border-b">Store</th>
              <th className="px-4 py-3 text-left border-b">Owner</th>
              <th className="px-4 py-3 text-left border-b">Number</th>
              <th className="px-4 py-3 text-left border-b">Status</th>
              <th className="px-4 py-3 text-left border-b">Date</th>
              <th className="px-4 py-3 text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody>
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
              shops.map((shop, index) => (
                <tr
                  key={shop._id}
                  className={`text-sm ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 border-b">{shop.shopName}</td>
                  <td className="px-4 py-3 border-b">{shop.ownerName}</td>
                  <td className="px-4 py-3 border-b">{shop.phoneNumber}</td>
                  <td className="px-4 py-3 border-b text-gray-600">
                    {shop.status || ""}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {new Date(shop.createdAt || shop.date).toLocaleDateString(
                      "en-IN"
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex gap-2 items-center">
                      <FiEye
                        className="cursor-pointer text-lg text-gray-700 hover:text-black"
                        onClick={() =>
                          navigate(`/shop/registere/info/${shop._id}`)
                        }
                      />
                      <button
                        disabled={deletingId === shop._id}
                        onClick={() => handleDelete(shop._id)}
                      >
                        <MdDelete
                          className={`cursor-pointer text-lg ${
                            deletingId === shop._id
                              ? "text-gray-400"
                              : "text-red-500 hover:text-red-700"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewRegister;
