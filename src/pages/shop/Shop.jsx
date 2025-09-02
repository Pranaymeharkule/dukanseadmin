import React, { useState, useEffect } from "react";
import { FaSortAmountDown, FaFilter, FaEye, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Shop() {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortOption, setSortOption] = useState("Name A - Z");

  const limit = 8;
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BACKEND_API_BASEURL;

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    let list = [...shops];
    const now = new Date();

    // ✅ Status filter
    if (statusFilter === "Active") {
      list = list.filter((s) => s.status?.toLowerCase() === "active");
    } else if (statusFilter === "Suspended") {
      list = list.filter((s) => s.status?.toLowerCase() === "suspended");
    }

    // ✅ Date filter
    if (dateFilter === "This Week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      list = list.filter((s) => new Date(s.createdAt) >= startOfWeek);
    } else if (dateFilter === "This Month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      list = list.filter((s) => new Date(s.createdAt) >= startOfMonth);
    } else if (dateFilter === "This Year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      list = list.filter((s) => new Date(s.createdAt) >= startOfYear);
    }

    applySort(sortOption, list);
  }, [shops, statusFilter, dateFilter, sortOption]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}/shopApproval/getAllApprovedShops?ts=${new Date().getTime()}`,
        { headers: { "Cache-Control": "no-cache" } }
      );

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

  const applySort = (option, list = filteredShops) => {
    let sorted = [...list];
    if (option === "Name A - Z") {
      sorted.sort((a, b) => a.shopName.localeCompare(b.shopName));
    } else if (option === "Name Z - A") {
      sorted.sort((a, b) => b.shopName.localeCompare(a.shopName));
    } else if (option === "Date") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFilteredShops(sorted);
    setPage(1);
  };

  const approveShop = async (shopId) => {
    try {
      const res = await axios.put(
        `${baseURL}/shopApproval/approve-shop/${shopId}`
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

  const totalPages = Math.ceil(filteredShops.length / limit);
  const currentShops = filteredShops.slice((page - 1) * limit, page * limit);

  const asDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "--/--/----";
  const asPercent = (v) => (v || v === 0 ? `${v}%` : "—");
  const asRupees = (v) => (v || v === 0 ? `₹ ${v}` : "—");

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to fetch approved shops.
      </div>
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
                    ? "bg-[#FEBC1D] text-black"
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
            <button className="px-4 py-1.5 rounded-md border border-red-500 text-red-500 text-sm font-medium flex items-center gap-2 hover:bg-red-50">
              <span>⬇</span> Export to Excel
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="bg-white rounded-md shadow">
          <div className="p-6 overflow-x-auto">
            <table className="min-w-[1400px] w-full table-auto">
              <thead className="bg-[#FEBC1D] text-black">
                <tr className="text-left">
                  <th className="p-3">Store Name</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Number</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Total Orders Fulfilled</th>
                  <th className="p-3">Avg. Order Time</th>
                  <th className="p-3">% Referral Conversion</th>
                  <th className="p-3">Commission Earned</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentShops.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="p-6 text-center text-gray-500">
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
                      <tr
                        key={shop._id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="p-3">{shop.shopName}</td>
                        <td className="p-3">{shop.ownerName}</td>
                        <td className="p-3">{shop.phoneNumber || "—"}</td>
                        <td className="p-3">{shop.email || "—"}</td>
                        <td className="p-3">—</td>
                        <td className="p-3">—</td>
                        <td className="p-3">
                          {asPercent(shop.referralConversion)}
                        </td>
                        <td className="p-3">
                          {asRupees(shop.commissionEarned)}
                        </td>
                        <td
                          className={`p-3 font-semibold cursor-pointer ${statusClass}`}
                          onClick={() =>
                            shop.status !== "active" && approveShop(shop._id)
                          }
                          title={
                            shop.status !== "active"
                              ? "Click to Approve"
                              : "Already Approved"
                          }
                        >
                          {shop.status}
                        </td>
                        <td className="p-3">
                          {shop.OnBoardingdate || asDate(shop.createdAt)}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t px-4 py-4 flex justify-center items-center gap-3 text-sm">
              <button
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="h-8 w-8 flex items-center justify-center rounded-full text-[rgb(236,45,1)] hover:bg-red-50 disabled:opacity-30"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={
                    page === p
                      ? "min-w-8 h-8 px-3 rounded-full bg-[#FEBC1D] text-black font-semibold shadow-sm"
                      : "min-w-8 h-8 px-3 rounded-full text-[rgb(236,45,1)] hover:bg-red-50"
                  }
                >
                  {p}
                </button>
              ))}
              <button
                aria-label="Next page"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="h-8 w-8 flex items-center justify-center rounded-full text-[rgb(236,45,1)] hover:bg-red-50 disabled:opacity-30"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
