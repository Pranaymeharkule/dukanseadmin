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

      // ✅ Stats
      setStats({
        totalReferrals: totalReferralsRes?.totalReferrals ?? 0,
        activeReferrals: activeReferralsRes?.activeReferrals ?? 0,
        totalGullakCoins: gullakCoinsRes?.totalGullakCoins ?? 0,
        coinsClaimed: coinsClaimedRes?.coinsClaimed ?? 0,
      });

      // ✅ Customer referrals (array expected)
      if (Array.isArray(customerRes)) {
        setCustomerReferrals(customerRes);
      } else if (Array.isArray(customerRes?.topCustomers)) {
        setCustomerReferrals(customerRes.topCustomers);
      } else {
        setCustomerReferrals([]);
      }

      // ✅ Seller referrals (array expected)
      if (Array.isArray(sellerRes)) {
        setSellerReferrals(sellerRes);
      } else if (Array.isArray(sellerRes?.topSellers)) {
        setSellerReferrals(sellerRes.topSellers);
      } else {
        setSellerReferrals([]);
      }

      // ✅ Coin Economics
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

      // ✅ Risk Monitoring
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Referrals", value: stats.totalReferrals, change: "12%" },
          { title: "Active Referrals", value: stats.activeReferrals, change: "8%" },
          { title: "Total Gullak Coins", value: stats.totalGullakCoins, change: "15%" },
          { title: "Coins Claimed", value: stats.coinsClaimed, change: "25%" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow">
            <h4 className="text-sm font-medium text-gray-600">{item.title}</h4>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-green-500 text-xs flex items-center gap-1">
              <FaArrowUp className="text-xs" />
              {item.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Referrals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Customer Referrals */}
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Top Customer Referrals</h4>
            <a href="#" className="text-blue-500 text-sm">
              See all
            </a>
          </div>
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="text-left text-gray-600">
                <th>Customer</th>
                <th>Coins</th>
                <th>Referrals</th>
              </tr>
            </thead>
            <tbody>
              {customerReferrals.map((ref, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FEBC1D] flex items-center justify-center">
                      <FaUser className="text-[#EC2D01] text-sm" />
                    </div>
                    {/* ✅ Safe fallback */}
                    {ref.customerName || ref.name}
                  </td>
                  <td>{ref.coins}</td>
                  <td>{ref.referrals}</td>
                </tr>
              ))}
              {customerReferrals.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-3 text-gray-500">
                    No customer referral data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Seller Referrals */}
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Top Seller Referrals</h4>
            <a href="#" className="text-blue-500 text-sm">
              See all
            </a>
          </div>
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="text-left text-gray-600">
                <th>Seller</th>
                <th>Coins</th>
                <th>Referrals</th>
              </tr>
            </thead>
            <tbody>
              {sellerReferrals.map((ref, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#EC2D01] flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    {/* ✅ Fixed seller name */}
                    {ref.store || ref.sellerName || ref.shopName}
                  </td>
                  <td>{ref.coins}</td>
                  <td>{ref.referrals}</td>
                </tr>
              ))}
              {sellerReferrals.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-3 text-gray-500">
                    No seller referral data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coin Economics graph */}
      <div className="bg-white rounded shadow-md p-4 w-full mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg p-2">Coin Economics</h2>

          {/* Dropdown */}
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

        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={transformedCoinData} barCategoryGap={20} barGap={8}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 14, fontWeight: 500, fill: "#000000" }}
            />
            <YAxis
              domain={[0, "auto"]}
              tickCount={7}
              interval={0}
              tick={{ fontSize: 14, fill: "#000000", fontWeight: 550 }}
            />
            <Tooltip />
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
              barSize={36}
            />
            <Bar
              dataKey="redeemed"
              name="Coins Redeemed"
              fill="#FEBC1D"
              radius={[6, 6, 0, 0]}
              barSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Monitoring */}
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-3">Risk Monitoring</h4>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-sm min-w-[800px] border-collapse">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr className="text-left text-gray-700 border-b">
                <th className="py-2 px-3">Transaction ID</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Issued On</th>
                <th className="py-2 px-3">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {gullakManagement.map((item, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-3 font-mono text-xs">
                    {item.transactionId}
                  </td>
                  <td className="py-2 px-3">{item.type}</td>
                  <td className="py-2 px-3">{item.description}</td>
                  <td className="py-2 px-3">{item.amount}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === "active"
                          ? "bg-green-100 text-green-700"
                          : item.status === "redeemed"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    {new Date(item.issueDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-2 px-3">
                    {new Date(item.expiryDate).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
              {gullakManagement.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No risk monitoring data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Refer;
