import React, { useState, useEffect, useCallback } from "react";
import { FaArrowUp, FaUser, FaChevronDown } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = "https://dukanse-be-f5w4.onrender.com/api";

const Refer = () => {
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalGullakCoins: 0,
    coinsClaimed: 0,
  });
  const [customerReferrals, setCustomerReferrals] = useState([]);
  const [sellerReferrals, setSellerReferrals] = useState([]);
  const [coinActivityData, setCoinActivityData] = useState([]);
  const [gullakManagement, setGullakManagement] = useState([]);
  const [filter, setFilter] = useState("week");
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Helper function to get status badge styles dynamically
  const getStatusBadge = (status) => {
    // MODIFICATION: If status is not present, return null to show an empty space.
    if (!status) {
      return null;
    }

    let statusClasses = "bg-gray-100 text-gray-700"; // Default style
    if (status === "Active") {
      statusClasses = "bg-green-100 text-green-700";
    } else if (status === "Pending") {
      statusClasses = "bg-yellow-100 text-yellow-700";
    } else if (status === "Expired") {
      statusClasses = "bg-red-100 text-red-700";
    }

    return (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClasses}`}
      >
        {status}
      </span>
    );
  };

  const filterOptions = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      const endpoints = [
        `${API_BASE_URL}/referralDashboard/getTotalReferrals?t=${timestamp}`,
        `${API_BASE_URL}/referralDashboard/getActiveReferrals?t=${timestamp}`,
        `${API_BASE_URL}/referralDashboard/getTotalGullakCoins?t=${timestamp}`,
        `${API_BASE_URL}/referralDashboard/getCoinsClaimed?t=${timestamp}`,
        `${API_BASE_URL}/referralDashboard/getTopCustomerReferrals?t=${timestamp}`,
        `${API_BASE_URL}/referralDashboard/getTopSellerReferrals?t=${timestamp}`,
        `${API_BASE_URL}/gullakDashboard/getCoinActivityOverview?filter=${filter}&t=${timestamp}`,
        `${API_BASE_URL}/gullakDashboard/gullakManagement?t=${timestamp}`,
      ];

      const [
        totalReferralsRes,
        activeReferralsRes,
        gullakCoinsRes,
        coinsClaimedRes,
        customerRes,
        sellerRes,
        activityRes,
        managementRes,
      ] = await Promise.all(
        endpoints.map((url) => fetch(url).then((res) => res.json()))
      );

      setStats({
        totalReferrals: totalReferralsRes?.totalReferrals ?? 0,
        activeReferrals: activeReferralsRes?.activeReferrals ?? 0,
        totalGullakCoins: gullakCoinsRes?.totalGullakCoins ?? 0,
        coinsClaimed: coinsClaimedRes?.coinsClaimed ?? 0,
      });

      if (Array.isArray(customerRes)) {
        setCustomerReferrals(customerRes);
      } else if (Array.isArray(customerRes?.topCustomers)) {
        setCustomerReferrals(customerRes.topCustomers);
      } else {
        setCustomerReferrals([]);
      }

      if (Array.isArray(sellerRes)) {
        setSellerReferrals(sellerRes);
      } else if (Array.isArray(sellerRes?.topSellers)) {
        setSellerReferrals(sellerRes.topSellers);
      } else {
        setSellerReferrals([]);
      }

      if (
        activityRes?.activityOverview &&
        typeof activityRes.activityOverview === "object"
      ) {
        setCoinActivityData(
          Object.entries(activityRes.activityOverview).map(([day, val]) => ({
            day,
            issued: val.earned?.totalAmount || 0,
            redeemed: val.redeemed?.totalAmount || 0,
          }))
        );
      } else {
        setCoinActivityData([]);
      }

      setGullakManagement(
        Array.isArray(managementRes?.transactions)
          ? managementRes.transactions
          : []
      );
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const transformedCoinData =
    coinActivityData.length > 0
      ? coinActivityData
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
          day,
          issued: 0,
          redeemed: 0,
        }));

  const handleFilterChange = (filterValue) => {
    setFilter(filterValue);
    setIsDropdownOpen(false);
  };

  const selectedOption = filterOptions.find((option) => option.value === filter);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {loading && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
          Loading data...
        </div>
      )}

      {/* Stats Cards */}
     {/* MODIFICATION: Increased gap to gap-6 for better spacing */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
  {[
    { title: "Total Referrals", value: stats.totalReferrals, change: "12%" },
    { title: "Active Referrals", value: stats.activeReferrals, change: "8%" },
    { title: "Total Gullak Coins", value: stats.totalGullakCoins, change: "15%" },
    { title: "Coins Claimed", value: stats.coinsClaimed, change: "25%" },
  ].map((item, idx) => (
    // MODIFICATION: Changed padding to px-4 py-6 to increase height
    <div key={idx} className="bg-white px-4 py-6 rounded-lg shadow">
  <h4 className="text-md font-semibold">{item.title}</h4>
  <p className="text-2xl font-bold mt-1">{item.value}</p>
  <p className="text-base flex items-center gap-1 mt-2">
    <span className="text-green-500 text-lg">↝</span>
    <span className="text-green-500">{item.change}</span>
    <span className="text-gray-500">from last month</span>
  </p>
</div>

  ))}
</div>


      {/* Referrals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Customer Referrals */}
        <div className="bg-white p-5 rounded-lg shadow overflow-x-auto">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Top Customer Referrals</h4>
            <a href="#" className="text-blue-500 text-sm underline">
              See all
            </a>
          </div>
          <table className="w-full text-sm min-w-[450px] mt-7">
            <thead>
              <tr className="text-left ">
                <th>Customer</th>
                <th className="mr-10">Coins</th>
                <th>Referrals</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
  {customerReferrals.map((ref, i) => (
    <tr key={i} className={i !== 0 ? "border-t" : ""}>
      <td className="py-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#FEBC1D] flex items-center justify-center shrink-0">
          <FaUser className="text-[#EC2D01] text-sm" />
        </div>
        {ref.customerName || ref.name}
      </td>
      <td>{ref.coins}</td>
      <td>{ref.referrals}</td>
      <td>{getStatusBadge(ref.status)}</td>
    </tr>
  ))}
  {customerReferrals.length === 0 && (
    <tr>
      <td colSpan={4} className="text-center py-4 text-gray-500">
        No customer referral data available
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>

        {/* Seller Referrals */}
        <div className="bg-white p-5 rounded-lg shadow overflow-x-auto">
          <div className="flex justify-between items-center mb-2 ">
            <h4 className="font-semibold text-base">Top Seller Referrals</h4>
            <a href="#" className="text-blue-500 text-sm underline">
              See all
            </a>
          </div>
          <table className="w-full text-sm min-w-[450px] mt-7">
            <thead>
              <tr className="text-left mt-7 ">
                <th>Seller</th>
                <th className="mr-10">Coins</th>
                <th>Referrals</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
  {sellerReferrals.map((ref, i) => (
    <tr key={i} className={i !== 0 ? "border-t" : ""}>
      <td className="py-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#EC2D01] flex items-center justify-center shrink-0">
          <FaUser className="text-white text-sm" />
        </div>
        {ref.store || ref.sellerName || ref.shopName}
      </td>
      <td>{ref.coins}</td>
      <td>{ref.referrals}</td>
      <td>{getStatusBadge(ref.status)}</td>
    </tr>
  ))}
  {sellerReferrals.length === 0 && (
    <tr>
      <td colSpan={4} className="text-center py-4 text-gray-500">
        No seller referral data available
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      </div>

    <div className="bg-white rounded shadow-md p-4 w-full mb-6">
  {/* Header with Title and Dropdown Filter */}
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-semibold p-2 text-2xl">Coin Economics</h2>
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-32 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span className="text-gray-700">{selectedOption?.label}</span>
        <FaChevronDown
          className={`text-gray-400 text-xs transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <div className="py-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange(option.value)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                  filter === option.value
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Chart Container */}
  <ResponsiveContainer width="100%" height={450}>
    <BarChart
      data={transformedCoinData}
      barSize={40} // Sets a consistent size for all bars
      barGap={12}
      // The margin ensures that labels are not cut off
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <XAxis
        dataKey="day"
        type="category"
        tick={{ fontSize: 14, fontWeight: 500, fill: "#000000" }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        domain={[0, "auto"]}
        tickCount={7}
        interval={0}
        tick={{ fontSize: 14, fill: "#000000", fontWeight: 550 }}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip cursor={{fill: 'rgba(236, 236, 236, 0.5)'}} />
      <Legend
        iconType="circle"
        wrapperStyle={{
          fontSize: "14px",
          fontWeight: 550,
          paddingTop: "10px",
          color: "#000000",
        }}
        formatter={(value) => (
          <span style={{ color: "#000000" }}>{value}</span>
        )}
      />
      <Bar
        dataKey="issued"
        name="Coins Issued"
        fill="#EC2D01"
        radius={[6, 6, 0, 0]}
      />
      <Bar
        dataKey="redeemed"
        name="Coins Redeemed"
        fill="#FEBC1D"
        radius={[6, 6, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>
    </div>
  );
};

export default Refer;