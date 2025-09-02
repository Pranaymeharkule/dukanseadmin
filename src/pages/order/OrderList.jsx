import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import {
  FaSortAmountDown,
  FaFilter,
  FaRegCalendarAlt,
  FaEye as FaEyeIcon,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const OrderList = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("date");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [gullakFilter, setGullakFilter] = useState("all");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState("all");
  const [orderId, setOrderId] = useState("");

  const shops = [
    "Shop 1",
    "Shop 2",
    "Super Store",
    "Mega Mart",
    "Devendra Kirana Store",
    "Fresh Mart",
  ];
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL; 

  const exportToExcel = () => {
    if (orders.length === 0) return;
    const worksheetData = orders.map(
      ({ Sr, id, date, mode, payment, coin, shopName, deliveryType }) => ({
        "Sr. No": Sr,
        "Order Id": id,
        "Date & Time": date,
        Status: mode,
        Payment: payment,
        "Coin Used": coin,
        "Shop Name": shopName,
        "Delivery Type": deliveryType === "SELF_PICKUP" ? "Pickup" : "Delivery",
      })
    );
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Orders_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 10,
        sortOrder,
        sortBy,
        t: new Date().getTime(),
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();

      // Apply order status filters only when delivery type is "all"
      if (deliveryTypeFilter === "all") {
        if (viewType !== "all") {
          params.orderStatus = viewType.toUpperCase();
        } else if (statusFilter !== "all") {
          params.orderStatus = statusFilter.toUpperCase();
        }
      }

      // Apply delivery type filter - this might be causing the API to return empty results
      // Let's remove this from API params and handle it client-side only
      // if (deliveryTypeFilter !== "all") {
      //   params.deliveryType =
      //     deliveryTypeFilter === "pickup" ? "SELF_PICKUP" : "DELIVERY";
      // }

      if (paymentFilter !== "all") params.paymentStatus = paymentFilter;

      if (gullakFilter === "high") params.minGullak = 10;
      else if (gullakFilter === "low") params.maxGullak = 5;
      else if (gullakFilter === "none") params.gullakUsed = 0;

      if (fromDate) {
        params.fromDate = new Date(fromDate + "T00:00:00.000Z").toISOString();
      }
      if (toDate) {
        params.toDate = new Date(toDate + "T23:59:59.999Z").toISOString();
      }

      const res = await axios.get(
        `${API_BASE_URL}/adminOrder/getAllOrders`,
        { params, headers: { "Cache-Control": "no-cache" } }
      );

      if (res.data.success) {
        let filteredOrders = res.data.AllOrders || [];

        // Apply client-side filters
        if (searchTerm.trim()) {
          filteredOrders = filteredOrders.filter((order) =>
            order.shopId?.shopName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }

        // Client-side delivery type filter
        if (deliveryTypeFilter !== "all") {
          const expected =
            deliveryTypeFilter === "pickup" ? "SELF_PICKUP" : "DELIVERY";
          filteredOrders = filteredOrders.filter(
            (order) => order.deliveryType === expected
          );
        }

        // Apply status filter only if delivery type filter is not active
        if (deliveryTypeFilter === "all") {
          const activeStatus = viewType !== "all" ? viewType : statusFilter;
          if (activeStatus !== "all") {
            filteredOrders = filteredOrders.filter(
              (order) => order.orderStatus === activeStatus.toUpperCase()
            );
          }
        }

        if (paymentFilter !== "all") {
          filteredOrders = filteredOrders.filter(
            (order) => order.paymentStatus === paymentFilter
          );
        }

        if (gullakFilter === "high") {
          filteredOrders = filteredOrders.filter((o) => o.gullakUsed >= 10);
        } else if (gullakFilter === "low") {
          filteredOrders = filteredOrders.filter(
            (o) => o.gullakUsed > 0 && o.gullakUsed <= 5
          );
        } else if (gullakFilter === "none") {
          filteredOrders = filteredOrders.filter((o) => o.gullakUsed === 0);
        }

        const mappedOrders = filteredOrders.map((order, index) => ({
          Sr: index + 1 + (page - 1) * 10,
          id: order.orderNumber,
          orderId: order._id,
          date: new Date(order.orderDate).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          mode: order.orderStatus,
          payment: order.paymentStatus,
          coin: order.gullakUsed,
          shopName: order.shopId?.shopName || "N/A",
          deliveryType: order.deliveryType,
        }));

        setOrders(mappedOrders);
        // Note: Since we're filtering client-side, the totalPages from API might not be accurate
        // For now, we'll use it as is, but ideally pagination should be handled server-side
        setTotalPages(res.data.totalPages || 1);
      } else {
        setOrders([]);
        setTotalPages(1);
        setError(
          res.data.message || "Failed to fetch orders. Please try again."
        );
      }
    } catch (err) {
      setOrders([]);
      setTotalPages(1);
      if (err.response) {
        const msg = err.response.data?.message || err.response.statusText;
        setError(
          msg.includes("Cast to date failed")
            ? "Invalid date format. Please check your date filters and try again."
            : `Server Error: ${msg}`
        );
      } else if (err.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [
    viewType,
    searchTerm,
    page,
    fromDate,
    toDate,
    sortOrder,
    sortBy,
    statusFilter,
    paymentFilter,
    gullakFilter,
    deliveryTypeFilter,
  ]);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchOrders();
      setShowDropdown(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setViewType("all");
    setDeliveryTypeFilter("all");
    setStatusFilter("all");
    setPaymentFilter("all");
    setGullakFilter("all");
    setPage(1);
    setError("");
  };

  const handleSearch = () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setError(
        "From date cannot be later than to date. Please check your date range."
      );
      return;
    }
    setPage(1);
    setError("");
    fetchOrders();
  };

  const handleDeliveryTypeFilter = (type) => {
    setDeliveryTypeFilter(type);
    setViewType("all");
    setFilterVisible(false);
    setPage(1);
    setError("");
  };

  const handleTabClick = (type) => {
    setViewType(type);
    setDeliveryTypeFilter("all");
    setStatusFilter("all");
    setPage(1);
    setError("");
  };

  const handleShopSelect = (shop) => {
    setSearchTerm(shop);
    setShowDropdown(false);
    setPage(1);
    setError("");
  };

  return (
    <div className="p-0.5 bg-gray-100 rounded-md overflow-hidden">
      {/* Filter Buttons & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          {["all", "DELIVERED", "CANCELLED", "PENDING"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full text-sm capitalize ${
                viewType === type
                  ? "bg-yellow-400 text-red-600"
                  : "border border-red-600 text-red-600"
              }`}
              onClick={() => handleTabClick(type)}
            >
              {type === "all"
                ? "All"
                : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-4 relative">
          <div className="flex items-center gap-2">
            <button
              className="p-2 border rounded-md"
              onClick={() => setFilterVisible(!filterVisible)}
            >
              <FaFilter />
            </button>
          </div>

          <button
            onClick={exportToExcel}
            className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-sm"
          >
            Export to Excel
          </button>

          {filterVisible && (
            <div className="absolute top-12 right-0 bg-white border rounded-md shadow-lg p-4 w-64 text-sm z-20">
              <div className="py-1 px-2 text-gray-700 font-semibold border-b mb-3">
                Filter By
              </div>

              {/* Delivery Type Filter */}
              <div className="flex flex-col gap-2 text-sm text-gray-800">
                <button
                  className="text-left hover:underline"
                  onClick={() => handleDeliveryTypeFilter("pickup")}
                >
                  Pickup
                </button>
                <button
                  className="text-left hover:underline"
                  onClick={() => handleDeliveryTypeFilter("delivery")}
                >
                  Delivery
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border">
        {/* Select Shop */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Select Shop
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for shop"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md py-2 pl-10 pr-10 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <FiChevronDown
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            />

            {showDropdown && (
              <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md max-h-40 overflow-y-auto text-sm shadow-lg">
                {shops
                  .filter((shop) =>
                    shop.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((shop, index) => (
                    <li
                      key={index}
                      onMouseDown={() => handleShopSelect(shop)}
                      className="px-4 py-2 hover:bg-yellow-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      {shop}
                    </li>
                  ))}
                {shops.filter((shop) =>
                  shop.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <li className="px-4 py-2 text-gray-500">No shops found</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Order ID + Date Range + Search Button - Updated layout */}
        <div className="p-4">
          <div className="flex items-center gap-4 flex-wrap bg-gray-50 rounded-lg p-4 border border-gray-200">
            {/* Order ID with side label */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-700 whitespace-nowrap f">
                Order ID
              </label>
              <input
                type="text"
                placeholder="Enter"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="rounded-md py-2.5 px-3 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-32"
              />
            </div>

            {/* From Date */}
            <div className="relative">
              <input
                type="date"
                placeholder="From date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-md py-2.5 px-3 pr-10 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-40"
                max={toDate || undefined}
              />
              <FaRegCalendarAlt className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>

            {/* To Date */}
            <div className="relative">
              <input
                type="date"
                placeholder="To date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-md py-2.5 px-3 pr-10 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-40"
                min={fromDate || undefined}
              />
              <FaRegCalendarAlt className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-brandYellow hover:bg-yellow-500 text-black px-6 py-2.5 text-sm rounded-md font-medium shadow-sm transition-all duration-200 whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 mx-2">
          <p className="text-sm">{error}</p>
          {(searchTerm ||
            fromDate ||
            toDate ||
            viewType !== "all" ||
            deliveryTypeFilter !== "all" ||
            paymentFilter !== "all" ||
            gullakFilter !== "all" ||
            orderId) && (
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Clear all filters and show all orders
            </button>
          )}
        </div>
      )}
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 mx-2">
          <p className="text-sm">{error}</p>
          {(searchTerm ||
            fromDate ||
            toDate ||
            viewType !== "all" ||
            deliveryTypeFilter !== "all" ||
            paymentFilter !== "all" ||
            gullakFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Clear all filters and show all orders
            </button>
          )}
        </div>
      )}
      {/* Orders Table */}
      <div className="bg-white p-2 mt-4">
        <div className="overflow-x-auto scrollbar-hidden">
          <div className="overflow-y-auto max-h-[400px] scrollbar-hidden">
            <table className="min-w-[1200px] table-auto">
              <thead className="bg-brandYellow text-black text-sm text-center">
                <tr>
                  <th className="p-3">Sr. No.</th>
                  <th className="p-3">Order Id</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Coin Used</th>
                  <th className="p-3">Shop Name</th>
                  <th className="p-3">Delivery Type</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10">
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-lg">No orders found</p>
                        {searchTerm ||
                        fromDate ||
                        toDate ||
                        viewType !== "all" ||
                        deliveryTypeFilter !== "all" ||
                        paymentFilter !== "all" ||
                        gullakFilter !== "all" ? (
                          <p className="text-sm mt-2">
                            Try adjusting your search criteria
                          </p>
                        ) : (
                          <p className="text-sm mt-2">
                            No order records available
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((cust, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-100 cursor-pointer h-16 text-center text-sm"
                      onClick={() => navigate(`/order/details/${cust.orderId}`)}
                    >
                      <td className="p-3">{cust.Sr}</td>
                      <td className="p-3">{cust.id}</td>
                      <td className="p-3">{cust.date}</td>
                      <td
                        className={`p-3 font-semibold ${
                          cust.mode === "DELIVERED"
                            ? "text-green-600"
                            : cust.mode === "CANCELLED"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {cust.mode}
                      </td>
                      <td
                        className={`p-3 font-semibold ${
                          cust.payment === "Success" ||
                          cust.payment === "Successful"
                            ? "text-green-600"
                            : cust.payment === "Failed" ||
                              cust.payment === "Refunded"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {cust.payment}
                      </td>
                      <td className="p-3">{cust.coin}</td>
                      <td className="p-3">{cust.shopName}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            cust.deliveryType === "SELF_PICKUP"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {cust.deliveryType === "SELF_PICKUP"
                            ? "Pickup"
                            : "Delivery"}
                        </span>
                      </td>
                      <td className="p-3 text-center align-middle">
                        <button
                          title="View"
                          className="text-gray-700 hover:text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/order/details/${cust.orderId}`);
                          }}
                        >
                          <FaEyeIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination - Only show if there are orders */}
      {orders.length > 0 && (
        <div className="bg-white px-2 py-2 sticky bottom-0 z-8 flex justify-center gap-6 mt-2">
          <button
            className="text-red-600 font-bold hover:text-black disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded font-bold ${
                page === i + 1
                  ? "bg-yellow-400 text-red-600" // ✅ Active button bold red
                  : "text-red-600 hover:text-black" // ✅ Inactive buttons bold red
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="text-red-600 font-bold hover:text-black disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderList;
