// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaChartBar,
  FaRegCheckCircle,
  FaShoppingCart,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { MapContainer, TileLayer, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const BASE_URL = "https://dukanse-be-f5w4.onrender.com";

export default function Dashboard() {
  const [customerStats, setCustomerStats] = useState(null);
  const [salesStats, setSalesStats] = useState(null);
  const [activeStores, setActiveStores] = useState(null);
  const [todaysOrders, setTodaysOrders] = useState(null);
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [topOrderedItems, setTopOrderedItems] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);
  const [newSellers, setNewSellers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          customerRes,
          salesRes,
          activeStoresRes,
          todaysOrdersRes,
          activeUsersRes,
          topItemsRes,
          newCustomersRes,
          newSellersRes,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/api/adminDashboard/customers`),
          axios.get(`${BASE_URL}/api/adminDashboard/sales`),
          axios.get(`${BASE_URL}/api/adminDashboard/activeStores`),
          axios.get(`${BASE_URL}/api/adminDashboard/todaysOrders`),
          axios.get(`${BASE_URL}/api/adminDashboard/mostActiveUsers`),
          axios.get(`${BASE_URL}/api/adminDashboard/topOrderedItems`),
          axios.get(`${BASE_URL}/api/adminDashboard/newCustomers`),
          axios.get(`${BASE_URL}/api/adminDashboard/newSellers`),
        ]);

        setCustomerStats(customerRes.data);
        setSalesStats(salesRes.data);
        setActiveStores(activeStoresRes.data);
        setTodaysOrders(todaysOrdersRes.data);
        setMostActiveUsers(activeUsersRes.data.data || []);
        setTopOrderedItems(topItemsRes.data.mostOrderedItems || []);
        setNewCustomers(newCustomersRes.data.data || []);
        setNewSellers(newSellersRes.data.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    fetchData();
  }, []);

  const donutData = [
    { name: "Pickup", value: 42.69 },
    { name: "Delivery", value: 57.31 },
  ];
  const COLORS = ["#fbc02d", "#f44336"];

  const zones = [
    { name: "University Campus", position: [21.1458, 79.0882], color: "#f44336" },
    { name: "Ramdaspeth", position: [21.145, 79.071], color: "#fbc02d" },
    { name: "Telangkhedi", position: [21.1332, 79.0513], color: "#ff9800" },
    { name: "Wardhaman Nagar", position: [21.1443, 79.1185], color: "#424242" },
    { name: "Civil Lines", position: [21.152, 79.0734], color: "#2196f3" },
  ];

  return (
    <div className="p-4 space-y-8 bg-[#F5F5F5] min-h-screen">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Customers"
          value={customerStats?.Customer ?? "-"}
          growth={customerStats?.growth ?? "No data"}
          icon={<FaUsers className="h-8 w-8" />}
          positive
        />
        <StatCard
          title="Sales"
          value={salesStats?.Sales ?? "-"}
          growth={salesStats?.growth ?? "No data"}
          icon={<FaChartBar className="h-8 w-8" />}
        />
        <StatCard
          title="Active Stores"
          value={activeStores?.["Active Stores"] ?? "-"}
          growth={activeStores?.growth ?? "No data"}
          icon={<FaRegCheckCircle className="h-8 w-8" />}
        />
        <StatCard
          title="Today’s Orders"
          value={todaysOrders?.["Today's Orders"] ?? "-"}
          growth={todaysOrders?.growth ?? "No data"}
          icon={<FaShoppingCart className="h-8 w-8" />}
          positive
        />
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TableCard title="Most Active Users" headers={["Name", "Number", "Email", "Orders Placed"]}>
          {mostActiveUsers.map((user, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              <td className="py-2 px-2">{user.name}</td>
              <td className="py-2 px-2">{user.number}</td>
              <td className="py-2 px-2">{user.email}</td>
              <td className="py-2 px-2 font-semibold text-brandRed">{user.ordersPlaced}</td>
            </tr>
          ))}
        </TableCard>

        <TableCard title="Top Ordered Items" headers={["Item", "Brand", "Quantity"]}>
          {topOrderedItems.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              <td className="py-2 px-2">{item.item}</td>
              <td className="py-2 px-2">{item.brandName}</td>
              <td className="py-2 px-2 font-semibold text-brandRed">{item.quantity}</td>
            </tr>
          ))}
        </TableCard>

        <TableCard title="New Customers" headers={["Name", "Number", "Email"]}>
          {newCustomers.map((cust, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              <td className="py-2 px-2">{cust.name || "N/A"}</td>
              <td className="py-2 px-2">{cust.number}</td>
              <td className="py-2 px-2">{cust.email || "N/A"}</td>
            </tr>
          ))}
        </TableCard>

        <TableCard title="New Sellers" headers={["Store", "Owner", "Email", "Date"]}>
          {newSellers.map((seller, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              <td className="py-2 px-2">{seller.store}</td>
              <td className="py-2 px-2">{seller.owner}</td>
              <td className="py-2 px-2">{seller.email || "N/A"}</td>
              <td className="py-2 px-2">{seller.date}</td>
            </tr>
          ))}
        </TableCard>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl shadow-md p-4 w-full">
        <h2 className="text-lg font-semibold text-brandRed mb-3">📍 Nagpur City Zones</h2>
        <MapContainer
          center={[21.1458, 79.0882]}
          zoom={13}
          className="h-[350px] w-full rounded-lg"
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
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-md p-4 w-full">
        <h2 className="text-lg font-semibold text-brandRed mb-3">Order Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label={({ name }) => name}
              labelLine={false}
            >
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              layout="horizontal"
              iconType="circle"
              formatter={(value) => {
                const val = donutData.find((item) => item.name === value)?.value;
                return (
                  <span className="text-sm font-medium text-gray-800">
                    {value}: {val}
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* -------------------- Reusable Components -------------------- */
function StatCard({ title, value, growth, icon, positive }) {
  return (
    <div className="bg-gradient-to-br from-[#FEBC1D] to-[#FFD54F] p-4 rounded-xl shadow-lg hover:shadow-xl transition flex flex-col justify-between">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-white rounded-full text-brandRed shadow">{icon}</div>
        <span className="ml-3 text-lg sm:text-xl font-semibold text-brandRed">{title}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-brandRed">{value}</div>
      <div className="flex items-center bg-brandRed text-white px-3 py-1 mt-2 rounded-full text-xs w-max">
        {positive ? <FaArrowUp className="mr-1 h-3 w-3" /> : <FaArrowDown className="mr-1 h-3 w-3" />}
        <span>{growth}</span>
      </div>
    </div>
  );
}

function TableCard({ title, headers, children }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
      <h2 className="font-semibold text-lg mb-3 text-brandRed">{title}</h2>
      <table className="w-full text-sm text-left min-w-[500px] border rounded-lg">
        <thead className="bg-[#FEBC1D]/20 text-brandRed font-medium">
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} className="py-2 px-3 border-b">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}
