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
import axios from "axios";

import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";


const API_BASE_URL = "https://dukanse-be-f5w4.onrender.com/api/adminDashboard";

// --- SVG Icons to replace react-icons ---
const FaUser = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304h-91.4z"></path></svg>
);
const FaUsers = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.7 0-32 14.3-32 32v144h160V288c0-17.7-14.3-32-32-32zm-320 0H64c-17.7 0-32 14.3-32 32v144h160V288c0-17.7-14.3-32-32-32zM480 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm-192 0c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm-64 32c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32V112c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v144z"></path></svg>
);
const FaChartBar = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M496 496H16c-8.8 0-16-7.2-16-16V16C0 7.2 7.2 0 16 0h16c8.8 0 16 7.2 16 16v448h448c8.8 0 16 7.2 16 16s-7.2 16-16 16zM112 432V240c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16v192c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2-16-16zm128 0V144c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2-16-16zm128 0V304c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16v128c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2-16-16zm128 0V112c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16v320c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2-16-16z"></path></svg>
);
const FaMoneyBillWave = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M624 160H16c-8.84 0-16 7.16-16 16v160c0 8.84 7.16 16 16 16h608c8.84 0 16-7.16 16-16V176c0-8.84-7.16-16-16-16zM320 288c-53.02 0-96-42.98-96-96s42.98-96 96-96 96 42.98 96 96-42.98 96-96 96zM112 160v128c-35.35 0-64 28.65-64 64s28.65 64 64 64h384c35.35 0 64-28.65 64-64s-28.65-64-64-64V160H112z"></path></svg>
);
const FaStore = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M632 32H8C3.58 32 0 35.58 0 40v32c0 4.42 3.58 8 8 8h544l-48 160H64L16 80H8c-4.42 0-8-3.58-8-8V40c0-4.42 3.58-8 8-8h624c4.42 0 8 3.58 8 8v32c0 4.42-3.58 8-8 8H138.67l44.25 147.5c2.52 8.4 10.38 14.5 19.08 14.5h368c8.42 0 16.08-5.85 18.59-14.1L632 80h-8c-4.42 0-8-3.58-8-8V40c0-4.42 3.58-8 8-8zM128 448c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32zm384 0c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32z"></path></svg>
);
const FaRegCheckCircle = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.03 8 8 119.03 8 256s111.03 248 248 248 248-111.03 248-248S392.97 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm-72.5-192L313.37 136l22.63 22.63-144 144-64-64 22.63-22.63L183.5 304z"></path></svg>
);
const FaShoppingCart = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M528.12 301.319l44.03-192.28c6.01-26.26-12.51-51.7-38.77-51.7H133.88l-8.4-36.56C121.31 6.88 113.88 0 105.14 0H16C7.16 0 0 7.16 0 16s7.16 16 16 16h78.33l65.14 285.39-44.5 91.56c-11.33 23.28-1.92 51.36 21.36 62.69 23.28 11.33 51.36 1.92 62.69-21.36L224 416h192l32 64h-32c-8.84 0-16 7.16-16 16s7.16 16 16 16h64c8.84 0 16-7.16 16-16s-7.16-16-16-16h-16l-32-64h16c26.26 0 51.7-12.51 51.7-38.77z"></path></svg>
);
const AiOutlineRise = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
);
const zones = [
  {
    id: 1,
    lat: 21.1458, // Example coordinates
    lng: 79.0882,
    radius: 500,
    name: "University Campus"
  },
  {
    id: 2,
    lat: 21.1702,
    lng: 79.0849,
    radius: 300,
    name: "Ramdaspeth"
  }

  
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
        ]);

        setCustomerStats(custRes.data);
        setSalesStats(salesRes.data);
        setActiveStores(storesRes.data);
        setTodaysOrders(ordersRes.data);
        setMostActiveUsers(activeUsersRes.data?.data || []);
        setTopOrderedItems(topItemsRes.data?.mostOrderedItems || []);
        setNewCustomers(newCustRes.data?.data || []);
        setNewSellers(newSellersRes.data?.data || []);
        setInactiveUsers(inactiveUsersRes.data?.data || []);
        setRecentOrders(recentOrdersRes.data?.data || []);
        
        const formattedWeeklySales = (weeklySalesRes.data?.getWeeklySales || []).map(d => ({
          period: d.day,
          income: d.sales || 0,
        }));
        setWeeklySalesData(formattedWeeklySales);

        const orderPercentages = orderTypeRes.data?.orderTypePercentage;
        if (orderPercentages) {
          const formattedOrderType = [
            { name: "Pickup", value: orderPercentages.pickup?.percentage || 0 },
            { name: "Delivery", value: orderPercentages.delivery?.percentage || 0 },
          ];
          setOrderTypeData(formattedOrderType);
        }

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
            axios.get(`${API_BASE_URL.replace("adminDashboard","referralDashboard")}/getTotalReferrals`),
            axios.get(`${API_BASE_URL.replace("adminDashboard","referralDashboard")}/getActiveReferrals`),
            axios.get(`${API_BASE_URL.replace("adminDashboard","referralDashboard")}/getTotalGullakCoins`),
            axios.get(`${API_BASE_URL.replace("adminDashboard","referralDashboard")}/getCoinsClaimed`),
            axios.get(`${API_BASE_URL.replace("adminDashboard","referralDashboard")}/getTopCustomerReferrals`),
            axios.get(`${API_BASE_URL.replace("adminDashboard","referralDashboard")}/getTopSellerReferrals`),
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

  // Static data
  const coinData = [
    { day: "Mon", issued: 300, redeemed: 220 }, { day: "Tue", issued: 500, redeemed: 120 },
    { day: "Wed", issued: 620, redeemed: 500 }, { day: "Thu", issued: 430, redeemed: 580 },
    { day: "Fri", issued: 230, redeemed: 330 }, { day: "Sat", issued: 420, redeemed: 550 },
    { day: "Sun", issued: 240, redeemed: 130 },
  ];

  const stateAOVCards = [
    { label: "Customer AOV", value: "1000", change: "12%" },
    { label: "Seller AOV", value: "1000", change: "02%" },
    { label: "Total AOV", value: "200", change: "5%" },
  ];

  const COLORS = ["#fbc02d", "#f44336"];
  const labelColorMap = { Pickup: "#f44336", Delivery: "#fbc02d" };

  return (
    <div className="p-4 space-y-6 bg-[#F5F5F5]">
      {/* --- TOP STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FEBC1D] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <FaUser className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-2xl font-medium text-brandRed">Seller</span>
          </div>
          <div className="text-brandRed text-3xl font-bold mb-2">2000</div>
          <p className="text-xs text-red-600">25% since last month</p>
        </div>
        <div className="bg-[#FEBC1D] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <FaUsers className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-2xl font-medium text-brandRed">Customer</span>
          </div>
          <div className="text-brandRed text-3xl font-bold mb-2">
            {customerStats?.Customer ?? "85"}
          </div>
          <p className="text-xs text-red-600">{customerStats?.growth ?? "214.8% growth since last month"}</p>
        </div>
        <div className="bg-[#FEBC1D] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <FaChartBar className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-2xl font-medium text-brandRed">Sales</span>
          </div>
          <div className="text-brandRed text-3xl font-bold mb-2">
            {salesStats?.totalSales ?? "0"}
          </div>
          <p className="text-xs text-red-600">{salesStats?.growth ?? "-90.99% growth since last month"}</p>
        </div>
        <div className="bg-[#FEBC1D] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <FaMoneyBillWave className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-2xl font-medium text-brandRed">Revenue</span>
          </div>
          <div className="text-brandRed text-3xl font-bold mb-2">2000</div>
          <p className="text-xs text-red-600">08% since last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FEBC1D] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <FaStore className="text-[#EC2D01] h-5 w-5 mr-2" />
            <span className="text-sm font-medium text-[#EC2D01]">Total Stores</span>
          </div>
          <div className="text-[#EC2D01] text-2xl font-bold mb-2">1200</div>
          <p className="text-xs text-red-600">0.7% since last month</p>
        </div>
        <div className="bg-[#FEBC1D] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <FaRegCheckCircle className="text-[#EC2D01] h-5 w-5 mr-2" />
            <span className="text-sm font-medium text-[#EC2D01]">Active Stores</span>
          </div>
          <div className="text-[#EC2D01] text-2xl font-bold mb-2">
            {activeStores?.["Active Stores"] ?? "11"}
          </div>
          <p className="text-xs text-red-600">{activeStores?.growth ?? "0.0% growth in new verified stores since last month"}</p>
        </div>
        <div className="bg-[#FEBC1D] p-3 rounded-lg shadow-md">
          <div className="flex items-center mb-1">
            <FaShoppingCart className="text-[#EC2D01] h-5 w-5 mr-2" />
            <span className="text-sm font-medium text-[#EC2D01]">Today's Orders</span>
          </div>
          <div className="text-[#EC2D01] text-2xl font-bold mb-2">
            {todaysOrders?.["Today's Orders"] ?? "0"}
          </div>
          <p className="text-xs text-red-600">{todaysOrders?.growth ?? "-100.0% growth since yesterday"}</p>
        </div>
      </div>
      
      {/* --- Main Content Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg">Sales</h2>
                    <div className="flex gap-2">
                        <button className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">This Week</button>
                        <button className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">This Month</button>
                        <button className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">This Year</button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklySalesData}>
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="income" fill="#EC2D01" radius={[8, 8, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            
            {/* Referral Stats */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="font-semibold text-lg mb-4">Referral Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#FEBC1D] p-4 rounded-lg shadow text-center">
                        <h4 className="text-2xl font-bold text-[#EC2D01]">{totalReferrals?.totalReferrals ?? 0}</h4>
                        <p className="text-sm font-medium text-brandRed">Total Referrals</p>
                        
                    </div>
                    <div className="bg-[#FEBC1D] p-4 rounded-lg shadow text-center">
                        <h4 className="text-2xl font-bold text-[#EC2D01]">{activeReferrals?.totalActiveReferrals ?? 0}</h4>
                        <p className="text-sm font-medium text-brandRed">Active Referrals</p>
                    </div>
                    <div className="bg-[#FEBC1D] p-4 rounded-lg shadow text-center">
                        <h4 className="text-2xl font-bold text-[#EC2D01]">{totalCoins?.breakageRate ?? 0}</h4>
                        <p className="text-sm font-medium text-brandRed">Total Gullak Coins</p>
                    </div>
                    <div className="bg-[#FEBC1D] p-4 rounded-lg shadow text-center">
                        <h4 className="text-2xl font-bold text-[#EC2D01]">{coinsClaimed?.coinsClaimed ?? 0}</h4>
                        <p className="text-sm font-medium text-brandRed">Coins Claimed</p>
                    </div>
                </div>
            </div>

            {/* New Sellers */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="font-semibold text-lg mb-2">New Sellers</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr>
                                <th className="py-2 px-1">Store</th>
                                <th className="py-2 px-1">Owner</th>
                                <th className="py-2 px-1">Email</th>
                                <th className="py-2 px-1">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {newSellers.map((s, i) => (
                            <tr key={i} className="border-b">
                                <td className="py-2 px-1">{s.store}</td>
                                <td className="py-2 px-1">{s.owner}</td>
                                <td className="py-2 px-1">{s.email || "-"}</td>
                                <td className="py-2 px-1">{s.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
            {/* 10 New Orders */}
            <div className="bg-white rounded-lg shadow-md p-4 max-h-[800px] h-full overflow-y-auto">
                <h2 className="font-semibold text-lg mb-2">Top 10 New Orders</h2>
                <table className="w-full text-sm text-left">
                <thead>
                    <tr>
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
      
      {/* --- Coin Economics --- */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">Coin Economics</h2>
            <div className="flex gap-2">
                <button className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">This Week</button>
                <button className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">This Month</button>
                <button className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">This Year</button>
            </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={coinData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="issued" name="Coins Issued" fill="#EC2D01" />
            <Bar dataKey="redeemed" name="Coins Redeemed" fill="#FEBC1D" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AOV Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stateAOVCards.map((item, idx) => (
          <div key={idx} className="bg-[#fed167] p-3 rounded-lg shadow-md">
            <span className="text-sm font-medium text-red-800">{item.label}</span>
            <div className="text-red-800 text-2xl font-bold mb-2">{item.value}</div>
            <div className="flex items-center bg-brandRed text-white px-2 py-0.5 rounded-full text-xs w-max">
              <AiOutlineRise className="mr-1 h-3 w-3" />
              <span>{item.change}</span>
              <span className="ml-1 text-white text-[10px]">Since last month</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* User Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-lg mb-2">Top Ordered Items</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr>
                            <th className="py-2 px-1">Rank</th>
                            <th className="py-2 px-1">Item</th>
                            <th className="py-2 px-1">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                    {topOrderedItems.map((item, i) => (
                        <tr key={i} className="border-b">
                            <td className="py-2 px-1">{item.rank}</td>
                            <td className="py-2 px-1">{item.item}</td>
                            <td className="py-2 px-1">{item.quantity}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-lg mb-2">Most Active Users</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr>
                            <th className="py-2 px-1">Name</th>
                            <th className="py-2 px-1">Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                    {mostActiveUsers.map((u, i) => (
                        <tr key={i} className="border-b">
                            <td className="py-2 px-1">{u.name}</td>
                            <td className="py-2 px-1">{u.ordersPlaced || u.ordersplaced}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-lg mb-2">Most Inactive Users</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr>
                            <th className="py-2 px-1">Name</th>
                            <th className="py-2 px-1">Number</th>
                        </tr>
                    </thead>
                    <tbody>
                    {inactiveUsers.map((u, i) => (
                        <tr key={i} className="border-b">
                            <td className="py-2 px-1">{u.customerName || "-"}</td>
                            <td className="py-2 px-1">{u.phoneNumber}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-lg mb-2">New Customers</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr>
                            <th className="py-2 px-1">Name</th>
                            <th className="py-2 px-1">Number</th>
                        </tr>
                    </thead>
                    <tbody>
                    {newCustomers.map((c, i) => (
                        <tr key={i} className="border-b">
                            <td className="py-2 px-1">{c.name || "-"}</td>
                            <td className="py-2 px-1">{c.number}</td>
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
      <div className="bg-white rounded-lg shadow-md p-2 w-full h-[400px]">
        <h2 className="text-md font-bold text-green-800 mb-2">NAGPUR CITY</h2>
       <MapContainer center={[21.1458, 79.0882]} zoom={13} style={{ height: "400px", width: "100%" }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  />
  {zones.map((zone) => (
    <Circle key={zone.id} center={[zone.lat, zone.lng]} radius={zone.radius} color="blue">
      <Popup>{zone.name}</Popup>
    </Circle>
  ))}
</MapContainer>

        <div className="grid grid-cols-3 gap-2 mt-4 text-sm font-medium">
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
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-lg mb-2 text-center">Delivery vs Pickup</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie data={orderTypeData} cx="50%" cy="50%" innerRadius={80} outerRadius={130} fill="#8884d8" dataKey="value"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) / 2;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={labelColorMap[name]} fontSize={13} fontWeight="600">
                        {name}
                      </text>
                    );
                  }}
                  labelLine={false}
                >
                  {orderTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index]} />))}
                </Pie>
                <Legend verticalAlign="bottom" layout="horizontal" iconType="square"
                  formatter={(value) => {
                    const val = orderTypeData.find((item) => item.name === value)?.value;
                    return (<span className="text-sm font-medium text-gray-800">{val?.toFixed(2)}%</span>);
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

