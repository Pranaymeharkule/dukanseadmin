import React, { useState, useEffect } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaFilter,
  FaDownload,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  fetchTotalActiveCoins,
  fetchBreakageRate,
  fetchCoinsExpiringSoon,
  fetchCoinActivityOverview,
  fetchGullakManagement,
  fetchCoinActivityDropdown,
} from "../../api/gullakApi";

import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";

// ✅ Utility: Export filtered table data as CSV
const handleExport = (data) => {
  if (!data || data.length === 0) return;

  // Create CSV header
  const headers = ["Coin ID", "Type", "Amount", "Issue Date", "Expiry Date", "Status"];
  const rows = data.map((item) => [
    item.coinId,
    item.type,
    item.amount,
    formatDate(item.issueDate),
    formatDate(item.expiryDate),
    item.status,
  ]);

  // Combine header + rows
  const csvContent =
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "gullak_table.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// ✅ Utility: Fix Invalid Date issue
const formatDate = (dateStr) => {
  if (!dateStr) return "--";
  let cleanDate = dateStr;
  if (dateStr.includes(".")) {
    const [main, ms] = dateStr.split(".");
    if (ms?.length > 3) {
      cleanDate = `${main}.${ms.slice(0, 3)}`;
    }
  }
  const d = new Date(cleanDate);
  return isNaN(d.getTime()) ? "--" : d.toLocaleDateString();
};

// ✅ Utility: Dynamic change % UI
const getChangeUI = (percent) => {
  if (!percent) return { icon: null, percentText: "", suffix: "", color: "" };

  const value = parseFloat(percent);
  if (isNaN(value)) {
    return {
      icon: null,
      percentText: percent,
      suffix: "from last month",
      color: "text-gray-500",
    };
  }

  if (value >= 0) {
    return {
      icon: <IoMdTrendingUp className="text-green-500 mr-1" />,
      percentText: `${percent}`,
      suffix: "from last month",
      color: "text-green-500",
    };
  }

  return {
    icon: <IoMdTrendingDown className="text-red-500 mr-1 " />,
    percentText: `${percent}`,
    suffix: "from last month",
    color: "text-red-500",
  };
};

const Gullak = () => {
  const [totalCoins, setTotalCoins] = useState(null);
  const [coinsChangePercent, setCoinsChangePercent] = useState(null);

  const [breakageRate, setBreakageRate] = useState(null);
  const [breakageChangePercent, setBreakageChangePercent] = useState(null);

  const [expiringCoins, setExpiringCoins] = useState(null);
  const [expiringChangePercent, setExpiringChangePercent] = useState(null);

  const [coinActivity, setCoinActivity] = useState([]);
  const [gullakTableData, setGullakTableData] = useState([]);
  const [coinActivityDropdown, setCoinActivityDropdown] = useState([]);
  const [filter, setFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ State for table search
  const [tableSearchTerm, setTableSearchTerm] = useState("");

  // ✅ Derived filtered data
  const filteredTableData = gullakTableData.filter((item) => {
    const searchTerm = tableSearchTerm.toLowerCase();
    return (
      item.coinId.toLowerCase().includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm) ||
      item.amount.toString().includes(searchTerm) ||
      formatDate(item.issueDate).toLowerCase().includes(searchTerm) ||
      formatDate(item.expiryDate).toLowerCase().includes(searchTerm) ||
      item.status.toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          coinsRes,
          breakageRes,
          expiringRes,
          activityRes,
          tableRes,
          dropdownRes,
        ] = await Promise.all([
          fetchTotalActiveCoins(),
          fetchBreakageRate(),
          fetchCoinsExpiringSoon(),
          fetchCoinActivityOverview(filter || "week"),
          fetchGullakManagement(),
          fetchCoinActivityDropdown(),
        ]);

        // ✅ Total Active Coins
        setTotalCoins(coinsRes?.data?.totalActiveCoins ?? null);
        setCoinsChangePercent(coinsRes?.data?.changePercent ?? null);

        // ✅ Breakage Rate
        setBreakageRate(breakageRes?.data?.breakageRate ?? null);
        setBreakageChangePercent(breakageRes?.data?.changePercent ?? null);

        // ✅ Coins Expiring Soon
        setExpiringCoins(expiringRes?.data?.coinsExpiringSoon ?? null);
        setExpiringChangePercent(expiringRes?.data?.changePercent ?? null);

        // ✅ Coin Activity
        const activityObj = activityRes?.data?.activityOverview ?? {};
        const activityArray = Object.keys(activityObj).map((key) => ({
          day: key,
          issued: activityObj[key]?.earned?.totalAmount ?? 0,
          redeemed: activityObj[key]?.redeemed?.totalAmount ?? 0,
          expired: activityObj[key]?.expired?.totalAmount ?? 0,
        }));
        setCoinActivity(activityArray);

        // ✅ Gullak Management Table
        setGullakTableData(tableRes?.data?.transactions ?? []);

        // ✅ Dropdown
        setCoinActivityDropdown(dropdownRes?.data?.gullakDropdown ?? []);
        if (!filter && dropdownRes?.data?.gullakDropdown?.length > 0) {
          setFilter(dropdownRes.data.gullakDropdown[0].value);
        }
      } catch (err) {
        console.error("❌ API Error:", err);
        setError("Failed to load Gullak Dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  if (loading) {
    return <div className="p-6 text-center">Loading Gullak Dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen w-full">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Total Active Coins",
            value: totalCoins ?? "--",
            ...getChangeUI(coinsChangePercent),
          },
          {
            label: "Breakage Rate",
            value: breakageRate ?? "--",
            ...getChangeUI(breakageChangePercent),
          },
          {
            label: "Coins Expiring Soon",
            value: expiringCoins ?? "--",
            ...getChangeUI(expiringChangePercent),
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow flex flex-col justify-between min-h-[130px]"
          >
            <h4 className="text-base font-semibold">{card.label}</h4>
            <p className="text-2xl font-bold">{card.value}</p>

            <p className="flex items-center gap-1 text-base mt-1">
              {card.icon}
              <span className={card.color}>{card.percentText}</span>
              <span className="text-gray-500">{card.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Coin Activity Overview */}
      {coinActivityDropdown.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-5 w-full overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="font-semibold text-xl">Coin Activity Overview</h2>
            <select
              className="border rounded px-3 py-1 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {coinActivityDropdown.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[1400px] max-w-full">
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={coinActivity} barCategoryGap={10} barGap={2}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 14, fontWeight: 500, fill: "#000000" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, "auto"]}
                  tickCount={6}
                  tick={{ fontSize: 14, fill: "#000000", fontWeight: 550 }}
                  axisLine={false}
                  tickLine={false}
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
                  fill="#FEBC1D"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
                <Bar
                  dataKey="redeemed"
                  name="Coins Redeemed"
                  fill="#0057AD"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
                <Bar
                  dataKey="expired"
                  name="Coins Expired"
                  fill="#EC2D01"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gullak Table */}
      {gullakTableData.length > 0 && (
        <div className="mt-6 bg-white p-5 rounded-xl shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="font-semibold text-xl">Gullak Management</h2>
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
{/* Filter Input */}
<div className="flex flex-col w-full sm:w-24">
  <div className="relative w-full">
    <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
    {/* Text inside input */}
    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-red-600 text-sm pointer-events-none">
      Filter
    </span>
    <input
      type="text"
      value={tableSearchTerm}
      onChange={(e) => setTableSearchTerm(e.target.value)}
      className="w-full border border-red-500 text-red-600 px-10 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
    />
  </div>
</div>



  {/* Export Button */}
  <button
    className="border border-red-500 text-red-500 bg-white px-4 py-2 rounded-md text-sm flex items-center justify-center hover:bg-red-50"
    onClick={() => handleExport(filteredTableData)} // call export function
  >
    <FaDownload className="mr-2" />
    Export
  </button>
</div>

          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="text-base">
                <tr>
                  <th className="p-3">Coin ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTableData.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{item.coinId}</td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">{item.amount}</td>
                    <td className="p-3">{formatDate(item.issueDate)}</td>
                    <td className="p-3">{formatDate(item.expiryDate)}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-medium capitalize ${
                          item.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gullak;
