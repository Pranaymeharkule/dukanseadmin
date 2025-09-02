import React, { useState, useEffect } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
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
  if (!percent) return { icon: null, text: "", color: "" };
  const value = parseFloat(percent);
  if (isNaN(value)) return { icon: null, text: percent, color: "text-gray-500" };

  return value >= 0
    ? { icon: <FaArrowUp className="mr-1" />, text: `Change: ${percent}`, color: "text-green-500" }
    : { icon: <FaArrowDown className="mr-1" />, text: `Change: ${percent}`, color: "text-red-500" };
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          fetchCoinActivityOverview(filter || "week"), // default filter only in API call
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
            className="bg-white p-5 rounded-xl shadow flex flex-col justify-between"
          >
            <h4 className="text-gray-500 text-sm">{card.label}</h4>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className={`text-sm mt-1 flex items-center ${card.color}`}>
              {card.icon}
              {card.text}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Dropdown for Coin Activity Overview */}
      {coinActivityDropdown.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-5 w-full overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="font-semibold text-lg">Coin Economics</h2>
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
                />
                <YAxis
                  domain={[0, "auto"]}
                  tickCount={6}
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
            <h2 className="font-semibold text-lg">Gullak Management</h2>
            <div className="space-x-2">
              <button className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-sm">
                Filter
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-sm">
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
                {gullakTableData.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{item.coinId}</td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">{item.amount}</td>
                    <td className="p-3">{formatDate(item.issueDate)}</td>
                    <td className="p-3">{formatDate(item.expiryDate)}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          item.status === "active"
                            ? "bg-green-100 text-green-600"
                            : item.status === "redeemed"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-red-100 text-red-600"
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
