import React, { useState, useEffect } from "react";
import { FaEye, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaSortAmountDown, FaFilter } from "react-icons/fa";

export default function Shop() {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
const [showSort, setShowSort] = useState(false);


  const [sortOption, setSortOption] = useState("Name A - Z");

  const limit = 8; // ✅ one page shows 8 shops
  const navigate = useNavigate();
  const API_URL =
    "https://dukanse-be-f5w4.onrender.com/api/shopApproval/getAllApprovedShops?limit=50";

  // ✅ Helper to parse DD/MM/YYYY correctly
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`); // yyyy-MM-dd
    }
    return new Date(dateStr);
  };

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [shops, statusFilter, dateFilter, sortOption]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        headers: { "Cache-Control": "no-cache" },
      });

      if (response.data?.success) {
        setShops(response.data.allApprovedShops || []);
      }
    } catch (err) {
      console.error("Error fetching shops:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSorting = () => {
    let list = [...shops];

    // ✅ Status filter
    if (statusFilter === "Active") {
      list = list.filter((s) => s.status?.toLowerCase() === "active");
    } else if (statusFilter === "Pending") {
      list = list.filter((s) => s.status?.toLowerCase() === "pending");
    }

    // ✅ Date filter
    list = list.filter((s) => {
      const shopDate = parseDate(s.OnBoardingdate) || parseDate(s.createdAt);
      if (isNaN(shopDate)) return false;

      shopDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === "This Week") {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return shopDate >= sevenDaysAgo && shopDate <= today;
      }

      if (dateFilter === "This Month") {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return shopDate >= startOfMonth && shopDate <= today;
      }

      if (dateFilter === "This Year") {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        return shopDate >= startOfYear && shopDate <= today;
      }

      return true;
    });

    // ✅ Sort
    if (sortOption === "Name A - Z") {
      list.sort((a, b) => a.shopName.localeCompare(b.shopName));
    } else if (sortOption === "Name Z - A") {
      list.sort((a, b) => b.shopName.localeCompare(a.shopName));
    } else if (sortOption === "Date") {
      list.sort(
        (a, b) =>
          (parseDate(b.OnBoardingdate) || parseDate(b.createdAt)) -
          (parseDate(a.OnBoardingdate) || parseDate(a.createdAt))
      );
    }

    setFilteredShops(list);
    setCurrentPage(1); // reset to page 1 after filter/sort
  };

  const exportToExcel = () => {
    if (!shops || shops.length === 0) {
      alert("No shop data to export.");
      return;
    }

    const worksheetData = shops.map((s, index) => ({
      "S.No": index + 1,
      "Store Name": s.shopName,
      Owner: s.ownerName,
      "Phone Number": s.phoneNumber || "—",
      Email: s.email || "—",
      Status: s.status,
      "Referral Conversion %": s.referralConversion ?? "—",
      "Commission Earned": s.commissionEarned ?? "—",
      Date:
        s.OnBoardingdate ||
        (s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN") : "—"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Shops");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Approved_Shops.xlsx");
  };

  const approveShop = async (shopId) => {
    try {
      const res = await axios.put(
        `https://dukanse-be-f5w4.onrender.com/api/shopApproval/approve-shop/${shopId}`
      );
      if (res.data?.success) {
        setShops((prev) =>
          prev.map((s) => (s._id === shopId ? { ...s, status: "active" } : s))
        );
        alert("Shop Approved Successfully ✅");
      }
    } catch (err) {
      console.error("Error approving shop:", err);
      alert("Failed to approve shop. Please try again.");
    }
  };

  const asPercent = (v) => (v || v === 0 ? `${v}%` : "—");
  const asRupees = (v) => (v || v === 0 ? `₹ ${v}` : "—");

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to fetch approved shops.
      </div>
    );

  // ✅ Pagination (client-side)
  const totalPages = Math.ceil(filteredShops.length / limit);
  const currentShops = filteredShops.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );
  

  return (
    <div className="p-4 bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white p-6 rounded-md shadow mb-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          {/* Date Filters */}
          <div className="flex flex-wrap gap-2">
            {["All", "This Week", "This Month", "This Year"].map((df) => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  dateFilter === df
                    ? "bg-[#FEBC1D] text-"
                    : "border border-red-500 text-red-500 hover:bg-red-50"
                }`}
              >
                {df}
              </button>
            ))}
          </div>

          {/* Filter & Sort */}
          <div className="flex items-center gap-3 relative">
            {/* Status Filter */}
            <div className="relative">
              <button
                className="p-2 rounded hover:bg-gray-100 flex items-center gap-1"
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <FaFilter size={16} />
                <span className="hidden md:inline text-sm">{statusFilter}</span>
              </button>
              {showFilter && (
                <div className="absolute top-10 left-0 w-40 bg-white border rounded-md shadow-lg z-50">
                  <p className="px-3 py-2 font-semibold text-gray-600 border-b">
                    Filter by
                  </p>
                  {["Active", "Suspended", "All"].map((sf) => (
                    <button
                      key={sf}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setStatusFilter(sf);
                        setShowFilter(false);
                      }}
                    >
                      {sf}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                className="p-2 rounded hover:bg-gray-100 flex items-center gap-1"
                onClick={() => setShowSort((prev) => !prev)}
              >
                <FaSortAmountDown size={16} />
                <span className="hidden md:inline text-sm">{sortOption}</span>
              </button>
              {showSort && (
                <div className="absolute top-10 right-0 w-44 bg-white border rounded-md shadow-lg z-50">
                  <p className="px-3 py-2 font-semibold text-gray-600 border-b">
                    Sort by
                  </p>
                  {["Name A - Z", "Name Z - A", "Date"].map((opt) => (
                    <button
                      key={opt}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setSortOption(opt);
                        setShowSort(false);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/shop/newregister")}
              className="px-4 py-1.5 rounded-md border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50"
            >
              New Shop Registered
            </button>
            <button
  onClick={exportToExcel}
  className="px-4 py-1.5 rounded-md border border-red-500 text-red-500 text-sm font-medium flex items-center gap-2 hover:bg-red-50"
>
  <span>⬇</span> Export to Excel
</button>

          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <div className="bg-white rounded-md shadow">
          <div className="p-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FEBC1D] text-black text-sm uppercase">
                  <th className="px-6 py-3 text-left">Store Name</th>
                  <th className="px-6 py-3 text-left">Owner</th>
                  <th className="px-6 py-3 text-left">Number</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Orders Fulfilled</th>
                  <th className="px-6 py-3 text-left">% Referral Conversion</th>
                  <th className="px-6 py-3 text-left">Commission Earned</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentShops.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-6 text-center text-gray-500">
                      No approved shops found.
                    </td>
                  </tr>
                ) : (
                  currentShops.map((shop) => {
                    const statusClass =
                      shop.status === "active"
                        ? "text-green-600"
                        : "text-red-500";
                    return (
                      <tr key={shop._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{shop.shopName}</td>
                        <td className="px-6 py-4">{shop.ownerName}</td>
                        <td className="px-6 py-4">{shop.phoneNumber || "—"}</td>
                        <td className="px-6 py-4">{shop.email || "—"}</td>
                        <td className="px-6 py-4 text-center">
                          {shop.totalOrdersFulfilled ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {asPercent(shop.referralConversion)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {asRupees(shop.commissionEarned)}
                        </td>
                        <td
                          className={`px-6 py-4 text-center font-semibold cursor-pointer ${statusClass}`}
                          onClick={() =>
                            shop.status !== "active" && approveShop(shop._id)
                          }
                        >
                          {shop.status}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {shop.OnBoardingdate
                            ? shop.OnBoardingdate
                            : new Date(shop.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              title="View"
                              onClick={() => navigate(`/shop/view/${shop._id}`)}
                              className="text-gray-700 hover:text-black"
                            >
                              <FaEye />
                            </button>
                            {shop.phoneNumber && (
                              <button
                                title="WhatsApp"
                                onClick={() =>
                                  window.open(
                                    `https://wa.me/${shop.phoneNumber}`
                                  )
                                }
                                className="text-green-500 hover:text-green-600"
                              >
                                <FaWhatsapp />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
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
                  ? "bg-[#FEBC1D] text-black font-semibold"
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
}
