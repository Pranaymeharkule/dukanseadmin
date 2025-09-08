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

  const [sellerStats, setSellerStats] = useState(null);
const [revenueStats, setRevenueStats] = useState(null);
const [storeStats, setStoreStats] = useState(null);
const [coinEconomics, setCoinEconomics] = useState([]);





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
          sellerRes,   // ✅ NEW
          revenueRes,   // ✅ add this
            totalStoreRes,   // ✅ add here


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
          axios.get(`${API_BASE_URL}/sellerStats`), // ✅ fetch Seller Stats
          axios.get(`${API_BASE_URL}/revenueStats`),  // ✅ added API call
            axios.get(`${API_BASE_URL}/totalStore`), // ✅ fetch Total Stores
            



          
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
        const formattedWeeklySales = (weeklySalesRes.data?.getWeeklySales || []).map(d => ({
          period: d.day,
          income: d.sales || 0,
        }));
        setWeeklySalesData(formattedWeeklySales);

        // Order Type
        const orderPercentages = orderTypeRes.data?.orderTypePercentage;
        if (orderPercentages) {
          const formattedOrderType = [
            { name: "Pickup", value: orderPercentages.pickup?.percentage || 0 },
            { name: "Delivery", value: orderPercentages.delivery?.percentage || 0 },
          ];
          setOrderTypeData(formattedOrderType);
        }

        // ✅ Seller Stats
        setSellerStats(sellerRes.data?.seller || null);
        setRevenueStats(revenueRes.data?.data || null);   // ✅ new line
        setStoreStats(totalStoreRes.data?.totalStores || null);

        







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
             // NEW
  sellerRes,
  revenueRes,
  totalStoreRes,
  coinEcoRes,
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

  // --- Coin Economics ---
const fetchCoinEconomics = async (period = "week") => {
  try {
    const coinEcoRes = await axios.get(`${API_BASE_URL}/coinEconomics?period=${period}`);
    if (coinEcoRes.data?.success) {
      const apiData = coinEcoRes.data.data;

      const formattedCoinEco = [
        { day: "Mon", issued: apiData.Mon?.issued || 0, redeemed: apiData.Mon?.redeemed || 0 },
        { day: "Tue", issued: apiData.Tue?.issued || 0, redeemed: apiData.Tue?.redeemed || 0 },
        { day: "Wed", issued: apiData.Wed?.issued || 0, redeemed: apiData.Wed?.redeemed || 0 },
        { day: "Thu", issued: apiData.Thu?.issued || 0, redeemed: apiData.Thu?.redeemed || 0 },
        { day: "Fri", issued: apiData.Fri?.issued || 0, redeemed: apiData.Fri?.redeemed || 0 },
        { day: "Sat", issued: apiData.Sat?.issued || 0, redeemed: apiData.Sat?.redeemed || 0 },
        { day: "Sun", issued: apiData.Sun?.issued || 0, redeemed: apiData.Sun?.redeemed || 0 },
      ];

      setCoinEconomics(formattedCoinEco);
    }
  } catch (err) {
    console.error("Coin Economics API error:", err);
  }
};



 
  const stateAOVCards = [
    { label: "Customer AOV", value: "1000", change: "12%" },
    { label: "Seller AOV", value: "1000", change: "02%" },
    { label: "Total AOV", value: "200", change: "5%" },
  ];

  const COLORS = ["#fbc02d", "#f44336"];
  const labelColorMap = { Pickup: "#f44336", Delivery: "#fbc02d" };

const [selectedPeriod, setSelectedPeriod] = useState("This Week");

// Example data (replace with your real data)
const monthlySalesData = [ /* your monthly data */ ];
const yearlySalesData = [ /* your yearly data */ ];

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
        <span className="text-2xl font-bold text-brandRed">Seller</span>
      </div>
      <div className="text-brandRed text-3xl font-bold mb-2">
        {sellerStats ? sellerStats.totalSellerCount : "Loading..."}
      </div>
     <div className="flex items-center space-x-1">
  {/* Circular red box with number */}
 <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
  {/* Up arrow */}
  <span className="text-sm">↑</span>
  {/* Percentage */}
  <span>{sellerStats ? `${sellerStats.growthPercent}%` : ""}</span>
</div>
  {/* Remaining text */}
  <span className="text-xs text-red-600">Since last month</span>
</div>


    </div>
        <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
  <div className="flex items-center mb-1">
    <LuUserPlus className="text-brandRed h-10 w-5 mr-2" />
    <span className="text-2xl font-bold text-brandRed">Customer</span>
  </div>
  <div className="text-brandRed text-3xl font-bold mb-2">
    {customerStats?.Customer ?? "85"}
  </div>
  {/* Circular red badge with arrow */}
  <div className="flex items-center space-x-1">
    <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
      {/* Up arrow */}
      <span className="text-sm">↑</span>
      {/* Percentage */}
<span>{customerStats && customerStats.growthPercent ? `${customerStats.growthPercent}%` : "214.8%"}</span>
    </div>
    {/* Remaining text */}
    <span className="text-xs text-red-600">Since last month</span>
  </div>
</div>


       <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
  <div className="flex items-center mb-1">
    <LuTicketPercent className="text-brandRed h-10 w-5 mr-2" />
    <span className="text-2xl font-bold text-brandRed">Sales</span>
  </div>
  <div className="text-brandRed text-3xl font-bold mb-2">
    {salesStats?.totalSales ?? "0"}
  </div>
  {/* Circular red badge with arrow */}
  <div className="flex items-center space-x-1">
    <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
      {/* Up/Down arrow */}
      <span className="text-sm">{salesStats?.growthPercent >= 0 ? "↑" : "↓"}</span>
      {/* Percentage */}
      <span>{salesStats?.growthPercent ?? "-90.99%"}</span>
    </div>
    {/* Remaining text */}
    <span className="text-xs text-red-600">Since last month</span>
  </div>
</div>

     <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
  <div className="flex items-center mb-1">
    <FaMoneyBills className="text-brandRed h-10 w-5 mr-2" />
    <span className="text-2xl font-bold text-brandRed">Revenue</span>
  </div>
  <div className="text-brandRed text-3xl font-bold mb-2">
    {revenueStats?.totalRevenueTillNow ?? "Loading..."}
  </div>
  {/* Circular red badge with arrow */}
  <div className="flex items-center space-x-1">
    <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
      {/* Arrow based on growth */}
      <span className="text-sm">
        {revenueStats?.growthPercent >= 0 ? "↑" : "↓"}
      </span>
      {/* Percentage */}
      <span>{revenueStats?.growthPercent ?? "0%"}</span>
    </div>
    {/* Remaining text */}
    <span className="text-xs text-red-600">Since last month</span>
  </div>
</div>


      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    

        <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
  <div className="flex items-center mb-1">
    <span className="text-sm font-bold text-[#EC2D01]">Total Stores</span>
  </div>
  <div className="text-[#EC2D01] text-2xl font-bold mb-2">
    {storeStats?.totalStoresTillNow ?? 0}
  </div>
  {/* Circular red badge with arrow */}
  <div className="flex items-center space-x-1">
    <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
      {/* Arrow based on growth */}
      <span className="text-sm">
        {storeStats?.["growth Percent"] >= 0 ? "↯" : "↯"}
      </span>
      {/* Percentage */}
      <span>{storeStats?.["growth Percent"] ?? "0"}%</span>
    </div>
    {/* Remaining text */}
    <span className="text-xs text-red-600">Since last month</span>
  </div>
</div>



        <div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
  <div className="flex items-center mb-1">
    <span className="text-sm font-bold text-[#EC2D01]">Active Stores</span>
  </div>
  <div className="text-[#EC2D01] text-2xl font-bold mb-2">
    {activeStores?.["Active Stores"] ?? "11"}
  </div>
  {/* Circular red badge with arrow */}
  <div className="flex items-center space-x-1">
    <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
      {/* Arrow based on growth */}
      <span className="text-sm">
        {activeStores?.growthPercent >= 0 ? "↯" : "↯"}
      </span>
      {/* Percentage */}
      <span>{activeStores?.growthPercent ?? "0%"}</span>
    </div>
    {/* Remaining text */}
    <span className="text-xs text-red-600">Since last month</span>
  </div>
</div>

<div className="bg-[#FEBC1DB2] p-3 rounded-lg shadow-md">
  <div className="flex items-center mb-1">
    <span className="text-sm font-bold text-[#EC2D01]">Today's Orders</span>
  </div>
  <div className="text-[#EC2D01] text-2xl font-bold mb-2">
    {todaysOrders?.count ?? "Loading..."}
  </div>
  {/* Circular red badge with arrow */}
  <div className="flex items-center space-x-1">
    <div className="inline-flex items-center bg-red-600 text-white text-xs px-3 py-1 rounded-full space-x-1">
      {/* Arrow based on growth */}
      <span className="text-sm">
        {todaysOrders?.growthPercent >= 0 ? "↯" : "↯"}
      </span>
      {/* Percentage */}
      <span>{todaysOrders?.growthPercent ?? "0%"}</span>
    </div>
    {/* Remaining text */}
    <span className="text-xs text-red-600">Since last month</span>
  </div>
</div>


     
      </div>
      
      {/* --- Main Content Area --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">

{/* Sales Chart */}
<div
  className="bg-white rounded-md shadow-md"
  style={{
    width: "750px",
    height: "350px",
    opacity: 1,
    borderRadius: "10px",
    padding: "10px",
    gap: "28px",
  }}
>
  <div className="flex justify-between items-center mb-2">
    <h2 className="font-semibold text-lg">Sales</h2>

    {/* Dropdown for period filter */}
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

  <ResponsiveContainer width="100%" height={250}>
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
<div
  className="bg-white rounded-lg shadow-md"
  style={{
    width: "750px",
    height: "400px",
    opacity: 1,
    borderRadius: "10px",
    padding: "10px",
    gap: "28px",
  }}
>
  {/* Heading row */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-left font-poppins font-semibold text-[24px] leading-[100%] tracking-[0%]">
      Referral Program Stats
    </h2>

    <a
      href="#"
      className="font-poppins font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#0057AD] underline decoration-[#0057AD] decoration-solid"
    >
      See more
    </a>
  </div>

  {/* Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 justify-center">
  {[
    { title: "Total Referrals", value: totalReferrals?.totalReferrals, growth: totalReferrals?.growthPercent },
    { title: "Active Referrals", value: activeReferrals?.totalActiveReferrals, growth: activeReferrals?.growthPercent },
    { title: "Total Gullak Coins", value: totalCoins?.totalGullakCoins, growth: totalCoins?.growthPercent },
    { title: "Coins Claimed", value: coinsClaimed?.coinsClaimed, growth: coinsClaimed?.growthPercent },
  ].map((item, idx) => (
    <div
      key={idx}
      className="bg-[#FEBC1DB2] w-[300px] h-[140px] p-4 rounded-[10px] shadow border-2 border-[#FEBC1D] flex flex-col justify-between"
    >
      <p className="text-[#EC2D01] font-semibold text-base">{item.title}</p>
      <h4 className="text-[#EC2D01] font-bold text-3xl ">{item.value ?? 0}</h4>
      <div className="flex items-center ">
        <div
          className={`${
            item.growth >= 0 ? "bg-green-600" : "bg-red-600"
          } text-white text-xs font-medium px-3 py-1 rounded-full flex items-center`}
        >
          <span className="mr-1">{item.growth >= 0 ? "↝" : "↯"}</span>
          <span>{item.growth ?? "0"}%</span>
        </div>
        <span className="text-[#EC2D01] text-xs ml-2">from last month</span>
      </div>
    </div>
  ))}
</div>

</div>

{/* New Sellers */}
<div
  className="bg-white rounded-lg shadow-md"
  style={{
    width: "750px",
    height: "350px",
    opacity: 1,
    borderRadius: "10px",
    padding: "10px",
    gap: "28px",
  }}
>
  {/* Heading row */}
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-semibold text-lg">New Sellers</h2>
    <a
      href="#"
      className="font-poppins font-semibold text-[16px] text-[#0057AD] underline decoration-[#0057AD] decoration-solid"
    >
      See more
    </a>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left border-collapse">
      <thead>
        <tr>
          <th className="py-3 px-4 text-left">Store</th>
          <th className="py-3 px-4 text-left">Owner</th>
          <th className="py-3 px-4 text-left">Email</th>
          <th className="py-3 px-4 text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        {newSellers.map((s, i) => (
          <tr key={i} className="border-b hover:bg-gray-50">
            <td className="py-2 px-4">{s.store}</td>
            <td className="py-2 px-4">{s.owner}</td>
            <td className="py-2 px-4">{s.email || "-"}</td>
            <td className="py-2 px-4">{s.date}</td>
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
<div
  className="bg-white rounded-lg shadow-md overflow-y-auto"
  style={{
    width: "500px",   // increased width
    height: "1150px",
    opacity: 1,
    borderRadius: "10px",
    padding: "10px",
    gap: "10px",
    position: "relative",
    marginLeft: "-75px",  // pull towards left
  }}
>



  {/* Heading row */}
  <div className="flex justify-between items-center mb-2">
    <h2 className="font-semibold text-lg">10 New Orders</h2>
    <a
      href="#"
      className="font-poppins font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#0057AD] underline decoration-[#0057AD] decoration-solid"
    >
      See more
    </a>
  </div>

  {/* Table */}
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
      
 {/* --- Coin Economics --- */}
<div className="bg-white rounded-lg shadow-md p-4">
  <div className="flex justify-between items-center mb-2">
    <h2 className="font-semibold text-lg">Coin Economics</h2>

    {/* Dropdown for filter */}
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

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={coinEconomics}>
      <XAxis dataKey="day" axisLine={false} tickLine={false} />
      <YAxis axisLine={false} tickLine={false} />
      <Tooltip />
      <Legend />
      <Bar dataKey="issued" name="Coins Issued" fill="#EC2D01" />
      <Bar dataKey="redeemed" name="Coins Redeemed" fill="#FEBC1DB2" />
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
  {/* Top Ordered Items */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">Top Ordered Items</h2>
      <a
        href="#"
        className="font-poppins font-semibold text-[16px] text-[#0057AD] underline decoration-[#0057AD] decoration-solid"
      >
        See more
      </a>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-lg text-left border-collapse">
        <thead>
          <tr>
            <th className="py-3 px-4">Item</th>
            <th className="py-3 px-4">Brand</th>
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
    <h2 className="font-bold text-lg">Most Active Users</h2>
    <a
      href="#"
      className="font-poppins font-semibold text-[16px] text-[#0057AD] underline decoration-[#0057AD] decoration-solid"
    >
      See more
    </a>
  </div>
  <table className="w-full text-lg text-left border-collapse">
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
          <td className="py-2 px-4 max-w-[150px] truncate">{u.name}</td>
          <td className="py-2 px-4 max-w-[130px] truncate">{u.number || "-"}</td>
          <td className="py-2 px-4 max-w-[200px] truncate">{u.email || "-"}</td>
          <td className="py-2 px-4">{u.ordersPlaced || u.ordersplaced}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Most Inactive Users */}
<div className="bg-white rounded-lg shadow-md p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-bold text-lg">Most Inactive Users</h2>
    <a
      href="#"
      className="font-poppins font-semibold text-[16px] text-[#0057AD] underline decoration-[#0057AD] decoration-solid"
    >
      See more
    </a>
  </div>
  <table className="w-full text-lg text-left border-collapse">
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
          <td className="py-2 px-4 max-w-[150px] truncate">{u.customerName || "-"}</td>
          <td className="py-2 px-4 max-w-[130px] truncate">{u.phoneNumber || "-"}</td>
          <td className="py-2 px-4 max-w-[200px] truncate">{u.email || "-"}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



  {/* New Customers */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-lg">New Customers</h2>
      <a
        href="#"
        className="font-poppins font-semibold text-[16px] text-[#0057AD] underline decoration-[#0057AD] decoration-solid"
      >
        See more
      </a>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-lg text-left border-collapse">
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

