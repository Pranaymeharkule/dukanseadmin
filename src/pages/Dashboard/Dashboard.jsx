// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { AiOutlineRise } from "react-icons/ai";
import {
  FaUser,
  FaUsers,
  FaChartBar,
  FaMoneyBillWave,
  FaStore,
  FaRegCheckCircle,
  FaShoppingCart,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
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
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const API_BASE_URL = "https://dukanse-be-f5w4.onrender.com/api/adminDashboard";

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
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/customers`),
          axios.get(`${API_BASE_URL}/sales`),
          axios.get(`${API_BASE_URL}/activeStores`),
          axios.get(`${API_BASE_URL}/todaysOrders`),
          axios.get(`${API_BASE_URL}/mostActiveUsers`),
          axios.get(`${API_BASE_URL}/topOrderedItems`),
          axios.get(`${API_BASE_URL}/newCustomers`),
          axios.get(`${API_BASE_URL}/newSellers`),
        ]);

        setCustomerStats(custRes.data);
        setSalesStats(salesRes.data);
        setActiveStores(storesRes.data);
        setTodaysOrders(ordersRes.data);
        setMostActiveUsers(activeUsersRes.data?.data || []);
        setTopOrderedItems(topItemsRes.data?.mostOrderedItems || []);
        setNewCustomers(newCustRes.data?.data || []);
        setNewSellers(newSellersRes.data?.data || []);
      } catch (err) {
        console.error("Dashboard API error:", err);
      }
    };

    fetchData();
  }, []);


  // --- inside Dashboard component ---

// Referral states
const [totalReferrals, setTotalReferrals] = useState(null);
const [activeReferrals, setActiveReferrals] = useState(null);
const [totalCoins, setTotalCoins] = useState(null);
const [coinsClaimed, setCoinsClaimed] = useState(null);
const [topCustomers, setTopCustomers] = useState([]);
const [topSellers, setTopSellers] = useState([]);

useEffect(() => {
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

  fetchReferralStats();
}, []);


  // ---- Static data (unchanged) ----
  const salesData = [
    { period: "Mon", income: 35000 },
    { period: "Tue", income: 47000 },
    { period: "Wed", income: 52000 },
    { period: "Thu", income: 23000 },
    { period: "Fri", income: 45000 },
    { period: "Sat", income: 58000 },
    { period: "Sun", income: 49000 },
  ];

  const referralStats = [
    { label: "Total Referrals", value: "246", change: "-12%" },
    { label: "Active Referrals", value: "189", change: "-08%" },
    { label: "Total Gullak Coins", value: "2000", change: " 15%" },
    { label: "Coins Claimed", value: "480", change: "25%" },
  ];

  const coinData = [
    { day: "Mon", issued: 300, redeemed: 220 },
    { day: "Tue", issued: 500, redeemed: 120 },
    { day: "Wed", issued: 620, redeemed: 500 },
    { day: "Thu", issued: 430, redeemed: 580 },
    { day: "Fri", issued: 230, redeemed: 330 },
    { day: "Sat", issued: 420, redeemed: 550 },
    { day: "Sun", issued: 240, redeemed: 130 },
  ];

  const stateAOVCards = [
    { label: "Customer AOV", value: "1000", change: "12%" },
    { label: "Seller AOV", value: "1000", change: "02%" },
    { label: "Total AOV", value: "200", change: "5%" },
  ];

  const orders = Array.from({ length: 10 }).map((_, i) => ({
    id: "87458562",
    name: i === 0 ? "Nirmala Lohiya" : "Vipin Kukreja",
    location: "Nagpur",
  }));

  const inactiveUserData = [
    { label: "Nirmala Lohiya", value: "87000456731", email: "pratik@gmail.com" },
    { label: "Rohit Sharma", value: "87000456732", email: "rohit@gmail.com" },
    { label: "Ananya", value: "87000456733", email: "ananya@gmail.com" },
  ];

  const donutData = [
    { name: "Pickup", value: 42.69 },
    { name: "Delivery", value: 57.31 },
  ];
  const COLORS = ["#fbc02d", "#f44336"];
  const labelColorMap = { Pickup: "#f44336", Delivery: "#fbc02d" };

  const zones = [
    { name: "University Campus", position: [21.1458, 79.0882], color: "#f44336" },
    { name: "Ramdaspeth", position: [21.145, 79.071], color: "#fbc02d" },
    { name: "Telangkhedi", position: [21.1332, 79.0513], color: "#ff9800" },
    { name: "Wardhaman Nagar", position: [21.1443, 79.1185], color: "#424242" },
    { name: "Civil Lines", position: [21.152, 79.0734], color: "#2196f3" },
  ];

  return (
    <div className="p-2 space-y-4 h-max bg-[#F5F5F5]">
      {/* --- MAIN STAT CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Seller (static) */}
        <div className="bg-[#FEBC1D] p-2 rounded-md shadow-md">
          <div className="flex items-center mb-1">
            <FaUser className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-2xl font-medium text-brandRed">Seller</span>
          </div>
          <div className="text-brandRed text-3xl font-bold mb-2">2000</div>
          <p className="text-xs text-red-600">25% since last month</p>
        </div>

        {/* Customer (API) */}
        <div className="bg-[#FEBC1D] p-2 rounded-md shadow-md">
          <div className="flex items-center mb-1">
            <FaUsers className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-2xl font-medium text-brandRed">Customer</span>
          </div>
          <div className="text-brandRed text-3xl font-bold mb-2">
            {customerStats?.Customer ?? "0"}
          </div>
          <p className="text-xs text-red-600">{customerStats?.growth}</p>
        </div>

        {/* Sales (API) */}
        <div className="bg-[#FEBC1D] p-2 rounded-md shadow-md">
          <div className="flex items-center mb-1">
            <FaChartBar className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-2xl font-medium text-brandRed">Sales</span>
          </div>
          <div className="text-brandRed text-3xl font-bold mb-2">
            {salesStats?.Sales ?? "0"}
          </div>
          <p className="text-xs text-red-600">{salesStats?.growth}</p>
        </div>

        {/* Revenue (static) */}
        <div className="bg-[#FEBC1D] p-2 rounded-md shadow-md">
          <div className="flex items-center mb-1">
            <FaMoneyBillWave className="text-brandRed h-10 w-5 mr-2" />
            <span className="text-2xl font-medium text-brandRed">Revenue</span>
          </div>
          <div className="text-brandRed text-3xl font-bold mb-2">2000</div>
          <p className="text-xs text-red-600">08% since last month</p>
        </div>
      </div>

      {/* --- SUB STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#FEBC1D] p-2 rounded-md shadow-md">
          <div className="flex items-center mb-1">
            <FaStore className="text-[#EC2D01] h-5 w-5 mr-2" />
            <span className="text-sm font-medium text-[#EC2D01]">Total Stores</span>
          </div>
          <div className="text-[#EC2D01] text-2xl font-bold mb-2">1200</div>
          <p className="text-xs text-red-600">0.7% since last month</p>
        </div>

        {/* Active Stores (API) */}
        <div className="bg-[#FEBC1D] p-2 rounded-md shadow-md">
          <div className="flex items-center mb-1">
            <FaRegCheckCircle className="text-[#EC2D01] h-5 w-5 mr-2" />
            <span className="text-sm font-medium text-[#EC2D01]">Active Stores</span>
          </div>
          <div className="text-[#EC2D01] text-2xl font-bold mb-2">
            {activeStores?.["Active Stores"] ?? "0"}
          </div>
          <p className="text-xs text-red-600">{activeStores?.growth}</p>
        </div>

        {/* Today’s Orders (API) */}
        <div className="bg-[#FEBC1D] p-2 rounded-md shadow-md">
          <div className="flex items-center mb-1">
            <FaShoppingCart className="text-[#EC2D01] h-5 w-5 mr-2" />
            <span className="text-sm font-medium text-[#EC2D01]">Today's Orders</span>
          </div>
          <div className="text-[#EC2D01] text-2xl font-bold mb-2">
            {todaysOrders?.["Today's Orders"] ?? "0"}
          </div>
          <p className="text-xs text-red-600">{todaysOrders?.growth}</p>
        </div>
      </div>

      {/* --- Sales Chart --- */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-semibold text-lg mb-2">Sales</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={salesData}>
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#EC2D01" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- Referral Stats --- */}
      <div className="bg-white rounded-lg shadow-md p-4">
{/* --- Referral Stats (API-driven) --- */}
<div className="bg-white rounded-lg shadow-md p-4">
  <h2 className="font-semibold text-lg mb-2">Referral Stats</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Total Referrals */}
    <div className="bg-[#FEBC1D] p-4 rounded-lg shadow text-center">
      <h4 className="text-2xl font-bold text-[#EC2D01]">
        {totalReferrals?.totalReferrals ?? 0}
      </h4>
      <p className="text-sm font-medium text-brandRed">Total Referrals</p>
      <p className="text-xs text-red-600">
        {totalReferrals?.changePercent} since last month
      </p>
    </div>

    {/* Active Referrals */}
    <div className="bg-[#FEBC1D] p-4 rounded-lg shadow text-center">
      <h4 className="text-2xl font-bold text-[#EC2D01]">
        {activeReferrals?.totalActiveReferrals ?? 0}
      </h4>
      <p className="text-sm font-medium text-brandRed">Active Referrals</p>
      <p className="text-xs text-red-600">
        {activeReferrals?.changePercent} since last month
      </p>
    </div>

    {/* Total Gullak Coins */}
    <div className="bg-[#FEBC1D] p-4 rounded-lg shadow text-center">
      <h4 className="text-2xl font-bold text-[#EC2D01]">
        {totalCoins?.breakageRate ?? 0}
      </h4>
      <p className="text-sm font-medium text-brandRed">Total Gullak Coins</p>
      <p className="text-xs text-red-600">
        {totalCoins?.changePercent} since last month
      </p>
    </div>

    {/* Coins Claimed */}
    <div className="bg-[#FEBC1D] p-4 rounded-lg shadow text-center">
      <h4 className="text-2xl font-bold text-[#EC2D01]">
        {coinsClaimed?.coinsClaimed ?? 0}
      </h4>
      <p className="text-sm font-medium text-brandRed">Coins Claimed</p>
      <p className="text-xs text-red-600">
        {coinsClaimed?.changePercent} since last month
      </p>
    </div>
  </div>

  {/* --- Top Customers --- */}
  <div className="mt-6">
    <h3 className="font-semibold text-md mb-2">Top Customer Referrals</h3>
    <table className="w-full text-sm text-left">
      <thead>
        <tr>
          <th className="py-2">Customer</th>
          <th className="py-2">Coins</th>
          <th className="py-2">Referrals</th>
        </tr>
      </thead>
      <tbody>
        {topCustomers.map((c, i) => (
          <tr key={i} className="border-b">
            <td className="py-2">{c.customerName}</td>
            <td className="py-2">{c.coins}</td>
            <td className="py-2">{c.referrals}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* --- Top Sellers --- */}
  <div className="mt-6">
    <h3 className="font-semibold text-md mb-2">Top Seller Referrals</h3>
    <table className="w-full text-sm text-left">
      <thead>
        <tr>
          <th className="py-2">Store</th>
          <th className="py-2">Coins</th>
          <th className="py-2">Referrals</th>
        </tr>
      </thead>
      <tbody>
        {topSellers.map((s, i) => (
          <tr key={i} className="border-b">
            <td className="py-2">{s.store}</td>
            <td className="py-2">{s.coins}</td>
            <td className="py-2">{s.referrals}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>

      {/* --- Top 10 New Orders (static) --- */}
      <div className="bg-white rounded-lg shadow-md p-4 max-h-[400px] overflow-y-auto">
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
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.name}</td>
                <td className="py-2">{order.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Coin Economics (static) --- */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-semibold text-lg mb-2">Coin Economics</h2>
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

      {/* --- AOV Cards (static) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stateAOVCards.map((item, idx) => (
          <div key={idx} className="bg-[#fed167] p-2 rounded-md shadow-md">
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

      {/* --- Most Active Users (API) --- */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-semibold text-lg mb-2">Most Active Users</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Number</th>
              <th className="py-2">Email</th>
              <th className="py-2">Orders</th>
            </tr>
          </thead>
          <tbody>
            {mostActiveUsers.map((u, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.number}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.ordersPlaced}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Most Inactive Users (static) --- */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-semibold text-lg mb-2">Most Inactive Users</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Number</th>
              <th className="py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {inactiveUserData.map((u, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{u.label}</td>
                <td className="py-2">{u.value}</td>
                <td className="py-2">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- New Customers (API) --- */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-semibold text-lg mb-2">New Customers</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Number</th>
              <th className="py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {newCustomers.map((c, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{c.name || "-"}</td>
                <td className="py-2">{c.number}</td>
                <td className="py-2">{c.email || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- New Sellers (API) --- */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-semibold text-lg mb-2">New Sellers</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="py-2">Store</th>
              <th className="py-2">Owner</th>
              <th className="py-2">Email</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {newSellers.map((s, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{s.store}</td>
                <td className="py-2">{s.owner}</td>
                <td className="py-2">{s.email || "-"}</td>
                <td className="py-2">{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Map --- */}
      <div className="bg-white rounded-lg shadow-md p-2 w-full h-[400px]">
        <h2 className="text-md font-bold text-green-800 mb-2">NAGPUR CITY</h2>
        <MapContainer
          center={[21.1458, 79.0882]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {zones.map((zone, idx) => (
            <Circle
              key={idx}
              center={zone.position}
              radius={500}
              pathOptions={{ color: zone.color }}
            >
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

      {/* --- Delivery vs Pickup Pie --- */}
      <div className="bg-white rounded-lg shadow-md p-4 w-full">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
                const radius = innerRadius + (outerRadius - innerRadius) / 2;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
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
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              layout="horizontal"
              iconType="square"
              formatter={(value) => {
                const val = donutData.find((item) => item.name === value)?.value;
                return (
                  <span className="text-sm font-medium text-gray-800">{val}</span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
