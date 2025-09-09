// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { FiUser } from "react-icons/fi";
import { LuUserPlus } from "react-icons/lu";
import { LuTicketPercent } from "react-icons/lu";
import { FaMoneyBills } from "react-icons/fa6";
import axios from "axios";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API_BASE_URL = "https://dukanse-be-f5w4.onrender.com/api/adminDashboard";

// --- SVG Icons to replace react-icons ---
const AiOutlineRise = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    ></path>
  </svg>
);

const zones = [
  {
    id: 1,
    lat: 21.1458, // Example coordinates for Nagpur
    lng: 79.0882,
    radius: 500,
    name: "University Campus",
    color: "#FF0000",
  },
  {
    id: 2,
    lat: 21.1702,
    lng: 79.0849,
    radius: 300,
    name: "Ramdaspeth",
    color: "#0000FF",
  },
];

export default function Dashboard() {
  // States for APIs
  const [customerStats, setCustomerStats] = useState(null);
  const [salesStats, setSalesStats] = useState(null);
  const [activeStores, setActiveStores] = useState(null);
  const [todaysOrders, setTodaysOrders] = useState(null);
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [topOrderedItems, setTopOrderedItems] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);
  const [newSellers, setNewSellers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [weeklySalesData, setWeeklySalesData] = useState([]);
  const [orderTypeData, setOrderTypeData] = useState([]);

  // Referral states
  const [totalReferrals, setTotalReferrals] = useState(null);
  const [activeReferrals, setActiveReferrals] = useState(null);
  const [totalCoins, setTotalCoins] = useState(null);
  const [coinsClaimed, setCoinsClaimed] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topSellers, setTopSellers] = useState([]);

  const [sellerStats, setSellerStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [storeStats, setStoreStats] = useState(null);
  const [coinEconomics, setCoinEconomics] = useState([]);

  // --- NEW AOV STATES ---
  const [customerAOV, setCustomerAOV] = useState(null);
  const [sellerAOV, setSellerAOV] = useState(null);
  const [totalAOV, setTotalAOV] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          custRes,
          salesRes,
          storesRes,
          ordersRes,
          activeUsersRes,
          topItemsRes,
          newCustRes,
          newSellersRes,
          inactiveUsersRes,
          recentOrdersRes,
          weeklySalesRes,
          orderTypeRes,
          sellerRes,
          revenueRes,
          totalStoreRes,
          // --- NEW AOV RESPONSES ---
          customerAovRes,
          sellerAovRes,
          totalAovRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/customers`),
          axios.get(`${API_BASE_URL}/sales`),
          axios.get(`${API_BASE_URL}/activeStores`),
          axios.get(`${API_BASE_URL}/todaysOrders`),
          axios.get(`${API_BASE_URL}/mostActiveUsers`),
          axios.get(`${API_BASE_URL}/topOrderedItems`),
          axios.get(`${API_BASE_URL}/newCustomers`),
          axios.get(`${API_BASE_URL}/newSellers`),
          axios.get(`${API_BASE_URL}/mostInactiveUsers`),
          axios.get(`${API_BASE_URL}/recentDeliveredOrders`),
          axios.get(`${API_BASE_URL}/weeklySales`),
          axios.get(`${API_BASE_URL}/orderTypeShare`),
          axios.get(`${API_BASE_URL}/sellerStats`),
          axios.get(`${API_BASE_URL}/revenueStats`),
          axios.get(`${API_BASE_URL}/totalStore`),
          // --- NEW AOV API CALLS ---
          axios.get(`${API_BASE_URL}/customerAOV`),
          axios.get(`${API_BASE_URL}/sellerAOV`),
          axios.get(`${API_BASE_URL}/totalAOV`),
        ]);

        setCustomerStats(custRes.data);
        setSalesStats(salesRes.data);
        setActiveStores(storesRes.data);
        if (ordersRes.data) {
          setTodaysOrders({
            count: ordersRes.data["Today's Orders"] || 0,
            growth: ordersRes.data.growth || "0% growth since yesterday",
          });
        }
        setMostActiveUsers(activeUsersRes.data?.data || []);
        setTopOrderedItems(topItemsRes.data?.mostOrderedItems || []);
        setNewCustomers(newCustRes.data?.data || []);
        setNewSellers(newSellersRes.data?.data || []);
        setInactiveUsers(inactiveUsersRes.data?.data || []);
        setRecentOrders(recentOrdersRes.data?.data || []);

        // Weekly Sales
        const formattedWeeklySales = (
          weeklySalesRes.data?.getWeeklySales || []
        ).map((d) => ({
          period: d.day,
          income: d.sales || 0,
        }));
        setWeeklySalesData(formattedWeeklySales);

        // Order Type
        const orderPercentages = orderTypeRes.data?.orderTypePercentage;
        if (orderPercentages) {
          const formattedOrderType = [
            {
              name: "Pickup",
              value: orderPercentages.pickup?.percentage || 0,
            },
            {
              name: "Delivery",
              value: orderPercentages.delivery?.percentage || 0,
            },
          ];
          setOrderTypeData(formattedOrderType);
        }

        setSellerStats(sellerRes.data?.seller || null);
        setRevenueStats(revenueRes.data?.data || null);
        setStoreStats(totalStoreRes.data?.totalStores || null);

        // --- SET NEW AOV STATES ---
        setCustomerAOV(customerAovRes.data);
        setSellerAOV(sellerAovRes.data);
        setTotalAOV(totalAovRes.data);
      } catch (err) {
        console.error("Dashboard API error:", err);
      }
    };

    const fetchReferralStats = async () => {
      try {
        const [
          totalRefRes,
          activeRefRes,
          totalCoinsRes,
          coinsClaimedRes,
          topCustomersRes,
          topSellersRes,
        ] = await Promise.all([
          axios.get(
            `${API_BASE_URL.replace(
              "adminDashboard",
              "referralDashboard"
            )}/getTotalReferrals`
          ),
          axios.get(
            `${API_BASE_URL.replace(
              "adminDashboard",
              "referralDashboard"
            )}/getActiveReferrals`
          ),
          axios.get(
            `${API_BASE_URL.replace(
              "adminDashboard",
              "referralDashboard"
            )}/getTotalGullakCoins`
          ),
          axios.get(
            `${API_BASE_URL.replace(
              "adminDashboard",
              "referralDashboard"
            )}/getCoinsClaimed`
          ),
          axios.get(
            `${API_BASE_URL.replace(
              "adminDashboard",
              "referralDashboard"
            )}/getTopCustomerReferrals`
          ),
          axios.get(
            `${API_BASE_URL.replace(
              "adminDashboard",
              "referralDashboard"
            )}/getTopSellerReferrals`
          ),
        ]);

        setTotalReferrals(totalRefRes.data);
        setActiveReferrals(activeRefRes.data);
        setTotalCoins(totalCoinsRes.data);
        setCoinsClaimed(coinsClaimedRes.data);
        setTopCustomers(topCustomersRes.data?.topCustomers || []);
        setTopSellers(topSellersRes.data?.topSellers || []);
      } catch (err) {
        console.error("Referral API error:", err);
      }
    };

    fetchData();
    fetchReferralStats();
  }, []);

  // --- Coin Economics ---
  const fetchCoinEconomics = async (period = "week") => {
    try {
      const coinEcoRes = await axios.get(
        `${API_BASE_URL}/coinEconomics?period=${period}`
      );
      if (coinEcoRes.data?.success) {
        const apiData = coinEcoRes.data.data;

        const formattedCoinEco = [
          {
            day: "Mon",
            issued: apiData.Mon?.issued || 0,
            redeemed: apiData.Mon?.redeemed || 0,
          },
          {
            day: "Tue",
            issued: apiData.Tue?.issued || 0,
            redeemed: apiData.Tue?.redeemed || 0,
          },
          {
            day: "Wed",
            issued: apiData.Wed?.issued || 0,
            redeemed: apiData.Wed?.redeemed || 0,
          },
          {
            day: "Thu",
            issued: apiData.Thu?.issued || 0,
            redeemed: apiData.Thu?.redeemed || 0,
          },
          {
            day: "Fri",
            issued: apiData.Fri?.issued || 0,
            redeemed: apiData.Fri?.redeemed || 0,
          },
          {
            day: "Sat",
            issued: apiData.Sat?.issued || 0,
            redeemed: apiData.Sat?.redeemed || 0,
          },
          {
            day: "Sun",
            issued: apiData.Sun?.issued || 0,
            redeemed: apiData.Sun?.redeemed || 0,
          },
        ];

        setCoinEconomics(formattedCoinEco);
      }
    } catch (err) {
      console.error("Coin Economics API error:", err);
    }
  };

  // --- Helper to parse growth string ---
  const parseGrowth = (growthString) => {
    if (!growthString) return "...";
    // Extracts the part before "since", e.g., "68.5% decline"
    return growthString.split(" since")[0];
  };

  // --- DYNAMIC AOV CARDS DATA ---
  const stateAOVCards = [
    {
      label: "Customer AOV",
      value: customerAOV ? `₹${customerAOV.currentAOV}` : "Loading...",
      change: parseGrowth(customerAOV?.growth),
    },
    {
      label: "Seller AOV",
      value: sellerAOV ? `₹${sellerAOV.currentAOV}` : "Loading...",
      change: parseGrowth(sellerAOV?.growth),
    },
    {
      label: "Total AOV",
      value: totalAOV ? `₹${totalAOV.currentAOV}` : "Loading...",
      change: parseGrowth(totalAOV?.growth),
    },
  ];

  const COLORS = ["#fbc02d", "#f44336"];
  const labelColorMap = { Pickup: "#f44336", Delivery: "#fbc02d" };

  const [selectedPeriod, setSelectedPeriod] = useState("This Week");

  // Example data (replace with your real data)
  const monthlySalesData = [
    /* your monthly data */
  ];
  const yearlySalesData = [
    /* your yearly data */
  ];

  // --- Fetch coin economics whenever selectedPeriod changes ---
  useEffect(() => {
    if (selectedPeriod === "This Week") fetchCoinEconomics("week");
    if (selectedPeriod === "This Month") fetchCoinEconomics("month");
    if (selectedPeriod === "This Year") fetchCoinEconomics("year");
  }, [selectedPeriod]);

  return (
    <div className="p-4 space-y-6 bg-[#F5F5F5]">
      {/* --- TOP STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <FiUser className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-xl md:text-2xl font-bold text-brandRed">
              Seller
            </span>
          </div>
          <div className="text-brandRed text-2xl md:text-3xl font-bold mb-2">
            {sellerStats ? sellerStats.totalSellerCount : "Loading..."}
          </div>
          <div className="flex items-center space-x-1">
            <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
              <span className="text-sm">↑</span>
              <span>{sellerStats ? `${sellerStats.growthPercent}%` : ""}</span>
            </div>
            <span className="text-xs text-red-600">Since last month</span>
          </div>
        </div>
        <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <LuUserPlus className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-xl md:text-2xl font-bold text-brandRed">
              Customer
            </span>
          </div>
          <div className="text-brandRed text-2xl md:text-3xl font-bold mb-2">
            {customerStats?.Customer ?? "85"}
          </div>
          <div className="flex items-center space-x-1">
            <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
              <span className="text-sm">↑</span>
              <span>
                {customerStats && customerStats.growthPercent
                  ? `${customerStats.growthPercent}%`
                  : "214.8%"}
              </span>
            </div>
            <span className="text-xs text-red-600">Since last month</span>
          </div>
        </div>
        <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <LuTicketPercent className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-xl md:text-2xl font-bold text-brandRed">
              Sales
            </span>
          </div>
          <div className="text-brandRed text-2xl md:text-3xl font-bold mb-2">
            {salesStats?.totalSales ?? "0"}
          </div>
          <div className="flex items-center space-x-1">
            <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
              <span className="text-sm">
                {salesStats?.growthPercent >= 0 ? "↑" : "↓"}
              </span>
              <span>{salesStats?.growthPercent ?? "-90.99%"}</span>
            </div>
            <span className="text-xs text-red-600">Since last month</span>
          </div>
        </div>
        <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <FaMoneyBills className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-xl md:text-2xl font-bold text-brandRed">
              Revenue
            </span>
          </div>
          <div className="text-brandRed text-2xl md:text-3xl font-bold mb-2">
            {revenueStats?.totalRevenueTillNow ?? "Loading..."}
          </div>
          <div className="flex items-center space-x-1">
            <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
              <span className="text-sm">
                {revenueStats?.growthPercent >= 0 ? "↑" : "↓"}
              </span>
              <span>{revenueStats?.growthPercent ?? "0%"}</span>
            </div>
            <span className="text-xs text-red-600">Since last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <span className="text-sm font-bold text-[#EC2D01]">
              Total Stores
            </span>
          </div>
          <div className="text-[#EC2D01] text-2xl font-bold mb-2">
            {storeStats?.totalStoresTillNow ?? 0}
          </div>
          <div className="flex items-center space-x-1">
            <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
              <span className="text-sm">
                {storeStats?.["growth Percent"] >= 0 ? "↯" : "↯"}
              </span>
              <span>{storeStats?.["growth Percent"] ?? "0"}%</span>
            </div>
            <span className="text-xs text-red-600">Since last month</span>
          </div>
        </div>
        <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <span className="text-sm font-bold text-[#EC2D01]">
              Active Stores
            </span>
          </div>
          <div className="text-[#EC2D01] text-2xl font-bold mb-2">
            {activeStores?.["Active Stores"] ?? "11"}
          </div>
          <div className="flex items-center space-x-1">
            <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
              <span className="text-sm">
                {activeStores?.growthPercent >= 0 ? "↯" : "↯"}
              </span>
              <span>{activeStores?.growthPercent ?? "0%"}</span>
            </div>
            <span className="text-xs text-red-600">Since last month</span>
          </div>
        </div>
        <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <span className="text-sm font-bold text-[#EC2D01]">
              Today's Orders
            </span>
          </div>
          <div className="text-[#EC2D01] text-2xl font-bold mb-2">
            {todaysOrders?.count ?? "Loading..."}
          </div>
          <div className="flex items-center space-x-1">
            <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
              <span className="text-sm">
                {todaysOrders?.growthPercent >= 0 ? "↯" : "↯"}
              </span>
              <span>{todaysOrders?.growthPercent ?? "0%"}</span>
            </div>
            <span className="text-xs text-red-600">Since last month</span>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 w-full h-[350px]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">Sales</h2>
              <select
                className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={
                  selectedPeriod === "This Week"
                    ? weeklySalesData
                    : selectedPeriod === "This Month"
                    ? monthlySalesData && monthlySalesData.length > 0
                      ? monthlySalesData
                      : [{ period: "No Data", income: 0 }]
                    : yearlySalesData && yearlySalesData.length > 0
                    ? yearlySalesData
                    : [{ period: "No Data", income: 0 }]
                }
              >
                <XAxis dataKey="period" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="income" fill="#EC2D01" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Referral Program Stats Section */}
          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-left font-poppins font-semibold text-xl md:text-2xl text-gray-800">
                Referral Program Stats
              </h2>
              <a
                href="#"
                className="font-poppins font-semibold text-sm md:text-base text-[#0057AD] hover:underline"
              >
                See more
              </a>
            </div>

            {/* 2x2 layout with original data logic and new UI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-8  pr-8">
              {[
                {
                  title: "Total Referrals",
                  value: totalReferrals?.totalReferrals,
                  growth: totalReferrals?.growthPercent,
                },
                {
                  title: "Active Referrals",
                  value: activeReferrals?.totalActiveReferrals,
                  growth: activeReferrals?.growthPercent,
                },
                {
                  title: "Total Gullak Coins",
                  value: totalCoins?.totalGullakCoins,
                  growth: totalCoins?.growthPercent,
                },
                {
                  title: "Coins Claimed",
                  value: coinsClaimed?.coinsClaimed,
                  growth: coinsClaimed?.growthPercent,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FEBC1DB2] py-4 px-6 rounded-lg shadow-sm flex flex-col justify-start gap-2"
                >
                  {/* Title */}
                  <p className="text-brandRed font-semibold text-base">
                    {item.title}
                  </p>

                  {/* Main Value */}
                  <h4 className="text-brandRed font-bold text-4xl">
                    {item.value ?? 0}
                  </h4>

                  {/* Growth Stats */}
                  <div className="flex items-center mt-auto">
                    <div className="bg-brandRed text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                      {item.growth >= 0 ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 17l5-5m0 0l-5-5m5 5H6"
                          />
                        </svg>
                      )}
                      <span>{Math.abs(item.growth ?? 0)}%</span>
                    </div>
                    <span className="text-brandRed text-sm ml-2">
                      from last month
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Sellers */}
          <div className="bg-white rounded-lg shadow-md p-8 w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-poppins font-semibold text-2xl md:text-3xl text-gray-800">
                New Sellers
              </h2>
              <a
                href="#"
                className="font-poppins font-semibold text-base md:text-lg text-[#0057AD] hover:underline"
              >
                See more
              </a>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-base md:text-lg text-left border-collapse">
                <thead>
                  <tr className=" text-gray-700">
                    {/* ---- MODIFIED LINE ---- */}
                    <th className="py-2 px-16 text-left first:pl-0">Store</th>
                    <th className="py-2 px-16 text-left">Owner</th>
                    <th className="py-2 px-16 text-left">Email</th>
                    {/* ---- MODIFIED LINE ---- */}
                    <th className="py-2 px-16 text-left last:pr-0">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {newSellers.map((s, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-none hover:bg-gray-50 transition"
                    >
                      {/* ---- MODIFIED LINE ---- */}
                      <td className="py-2 px-16 align-middle first:pl-0">
                        {s.store}
                      </td>
                      <td className="py-2 px-16 align-middle">{s.owner}</td>
                      <td className="py-2 px-16 align-middle">
                        {s.email || "-"}
                      </td>
                      {/* ---- MODIFIED LINE ---- */}
                      <td className="py-2 px-16 align-middle whitespace-nowrap last:pr-0">
                        {s.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          {/* 10 New Orders */}
          <div className="bg-white rounded-lg shadow-md overflow-y-auto p-4 w-full h-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">10 New Orders</h2>
              <a
                href="#"
                className="font-poppins font-semibold text-base text-[#0057AD] underline"
              >
                See more
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Order Id</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">{order.orderNumber}</td>
                      <td className="py-2">{order.customerName || "-"}</td>
                      <td className="py-2">Nagpur</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- Coin Economics --- */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-xl">Coin Economics</h2>
          <select
            className="text-sm border border-gray-400 px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={430}>
          <BarChart
            data={coinEconomics}
            margin={{ top: 30, right: 30, left: 0, bottom: 30 }}
            barCategoryGap="30%"
            barSize={40}
          >
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            {/* Added wrapperStyle to create space above the legend */}
          <Legend
  verticalAlign="bottom"
  align="center"
  iconType="circle"
  wrapperStyle={{ paddingTop: "20px" }}
  formatter={(value) => (
    <span style={{ color: "#000", fontWeight: "bold" }}>{value}</span>
  )}
/>


            {/* Bars are now fully curved */}
<Bar
  dataKey="issued"
  name="Coins Issued"
  fill="#EC2D01"
  stackId="a"
  radius={[0, 0, 8, 8]}
/>
<Bar
  dataKey="redeemed"
  name="Coins Redeemed"
  fill="#FEBC1DB2"
  stackId="a"
  radius={[8, 8, 0, 0]}
/>

{/* Text Styling */}
<XAxis
  dataKey="name"
  tick={{ fill: "#000", fontWeight: "bold" }}
/>
<YAxis
  tick={{ fill: "#000", fontWeight: "bold" }}
/>
<Legend
  wrapperStyle={{ color: "#000", fontWeight: "bold" }}
/>
<Tooltip
  contentStyle={{ color: "#000", fontWeight: "bold" }}
/>

          </BarChart>
        </ResponsiveContainer>
      </div>
{/* AOV Cards */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {stateAOVCards.map((item, idx) => (
    <div key={idx} className="bg-[#fed167] p-3 rounded-lg shadow-md">
      <span className="text-sm font-medium text-[#EC2D01]">
        {item.label}
      </span>
      <div className="text-[#EC2D01] text-2xl font-bold mb-2">
        {item.value}
      </div>

      {/* Growth rate with red box + plain "Since last month" */}
      <div className="flex items-center text-xs mt-1">
        <div className="flex items-center bg-[#EC2D01] text-white px-2 py-0.5 rounded-full">
          <AiOutlineRise className="mr-1 h-3 w-3" />
          <span>{item.change}</span>
        </div>
        <span className="ml-2 text-[13px] text-[#EC2D01] font-bold">
          Since last month
        </span>
      </div>
    </div>
  ))}
</div>


      {/* User Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Ordered Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl">Most Ordered Items</h2>
            <a
              href="#"
              className="font-poppins font-semibold text-base text-[#0057AD] underline"
            >
              See more
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xl text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-3">Brand Name</th>
                  <th className="py-3 px-4">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {topOrderedItems.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{item.item}</td>
                    <td className="py-2 px-4">{item.brand || "-"}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Active Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl">Most Active Users</h2>
            <a
              href="#"
              className="font-poppins font-semibold text-base text-[#0057AD] underline"
            >
              See more
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xl text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Number</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Orders</th>
                </tr>
              </thead>
              <tbody>
                {mostActiveUsers.map((u, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 max-w-[150px] truncate">
                      {u.name}
                    </td>
                    <td className="py-2 px-4 max-w-[130px] truncate">
                      {u.number || "-"}
                    </td>
                    <td className="py-2 px-4 max-w-[200px] truncate">
                      {u.email || "-"}
                    </td>
                    <td className="py-2 px-4">
                      {u.ordersPlaced || u.ordersplaced}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Inactive Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl">Most Inactive Users</h2>
            <a
              href="#"
              className="font-poppins font-semibold text-base text-[#0057AD] underline"
            >
              See more
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xl text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Number</th>
                  <th className="py-3 px-4">Email</th>
                </tr>
              </thead>
              <tbody>
                {inactiveUsers.map((u, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 max-w-[150px] truncate">
                      {u.customerName || "-"}
                    </td>
                    <td className="py-2 px-4 max-w-[130px] truncate">
                      {u.phoneNumber || "-"}
                    </td>
                    <td className="py-2 px-4 max-w-[200px] truncate">
                      {u.email || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-2xl">New Customers</h2>
            <a
              href="#"
              className="font-poppins font-semibold text-base text-[#0057AD] underline"
            >
              See more
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xl text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Number</th>
                  <th className="py-3 px-4">Email</th>
                </tr>
              </thead>
              <tbody>
                {newCustomers.map((c, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{c.name || "-"}</td>
                    <td className="py-2 px-4">{c.number || "-"}</td>
                    <td className="py-2 px-4">{c.email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Map and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- Map --- */}
        <div className="bg-white rounded-lg shadow-md p-4 w-full h-[450px] lg:h-auto">
          <h2 className="text-md font-bold text-green-800 mb-2">
            NAGPUR CITY
          </h2>
          <MapContainer
            center={[21.1458, 79.0882]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {zones.map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                color="blue"
              >
                <Popup>{zone.name}</Popup>
              </Circle>
            ))}
          </MapContainer>
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm font-medium">
            {zones.map((zone, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: zone.color }}
                ></div>
                {zone.name}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery vs Pickup Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="font-semibold text-lg mb-2 text-center">
            Delivery vs Pickup
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={orderTypeData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  name,
                }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) / 2;
                  const x =
                    cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y =
                    cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={labelColorMap[name]}
                      fontSize={13}
                      fontWeight="600"
                    >
                      {name}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {orderTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                layout="horizontal"
                iconType="square"
                formatter={(value) => {
                  const val = orderTypeData.find(
                    (item) => item.name === value
                  )?.value;
                  return (
                    <span className="text-sm font-medium text-gray-800">
                      {val?.toFixed(2)}%
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}