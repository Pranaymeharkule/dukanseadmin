import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import {
  FaSortAmountDown,
  FaFilter,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import CalendarSvg from "../../assets/Vector (2).svg"; // ✅ your custom calendar icon

// ✅ Import custom eye icon
import { ReactComponent as ViewIcon } from "../../assets/view.svg";

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
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [shopFilter, setShopFilter] = useState("");
  const [shopSearch, setShopSearch] = useState("");

  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;
  const CustomInput = React.forwardRef(
    ({ value, onClick, placeholder }, ref) => (
      <div className="relative w-full">
        <input
          type="text"
          value={value ? format(new Date(value), "d MMM yyyy") : ""}
          placeholder={placeholder}  // ✅ add placeholder support
          readOnly
          onClick={onClick}
          ref={ref}
          className="rounded-md py-2.5 px-3 w-full border border-gray-300 cursor-pointer text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={onClick}
        >
          <img src={CalendarSvg} alt="calendar" className="w-5 h-5" />
        </div>
      </div>
    )
  );
  {/* From Date */}
  <DatePicker
    selected={fromDate ? new Date(fromDate) : null}
    onChange={(date) => setFromDate(date ? date.toISOString().split("T")[0] : "")}
    customInput={<CustomInput />}
    calendarClassName="custom-calendar"
  />


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
        limit: 5,
        sortOrder,
        sortBy,
        t: new Date().getTime(),
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();

      if (deliveryTypeFilter === "all" && viewType !== "all") {
        params.orderStatus = viewType.toUpperCase();
      }

      if (paymentFilter !== "all") params.paymentStatus = paymentFilter;

      if (gullakFilter === "high") params.minGullak = 10;
      else if (gullakFilter === "low") params.maxGullak = 5;
      else if (gullakFilter === "none") params.gullakUsed = 0;
      const res = await axios.get(`${API_BASE_URL}/adminOrder/getAllOrders`, {
        params,
        headers: { "Cache-Control": "no-cache" },
      });

      if (res.data.success) {
        let filteredOrders = res.data.AllOrders || [];

        const uniqueShops = [
          ...new Set(
            filteredOrders.map((o) => o.shopId?.shopName).filter(Boolean)
          ),
        ];
        setShops(uniqueShops);

        if (selectedShop) {
          filteredOrders = filteredOrders.filter(
            (order) => order.shopId?.shopName === selectedShop
          );
        }

        if (shopFilter) {
          filteredOrders = filteredOrders.filter(
            (order) => order.shopId?.shopName === shopFilter
          );
        }

        if (searchTerm.trim()) {
          filteredOrders = filteredOrders.filter((order) =>
            order.shopId?.shopName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }

        if (orderId.trim()) {
          filteredOrders = filteredOrders.filter((order) =>
            order.orderNumber.toLowerCase().includes(orderId.toLowerCase())
          );
        }

        if (fromDate) {
          const from = new Date(fromDate + "T00:00:00");
          filteredOrders = filteredOrders.filter(
            (order) => new Date(order.orderDate) >= from
          );
        }
        if (toDate) {
          const to = new Date(toDate + "T23:59:59");
          filteredOrders = filteredOrders.filter(
            (order) => new Date(order.orderDate) <= to
          );
        }

        if (viewType !== "all") {
          filteredOrders = filteredOrders.filter(
            (order) => order.orderStatus === viewType.toUpperCase()
          );
        }

        if (deliveryTypeFilter !== "all") {
          filteredOrders = filteredOrders.filter(
            (order) => order.deliveryType === deliveryTypeFilter
          );
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
    selectedShop,
    orderId,
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
    setShopFilter("");
    setShopSearch("");
    setSelectedShop("");
    setOrderId("");
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
    setStatusFilter("all");
    setPage(1);
    setError("");
  };

  const handleShopSelect = (shop) => {
    setShopFilter(shop);
    setSelectedShop(shop);
    setShopSearch(shop);
    setShowDropdown(false);
    setPage(1);
    setError("");
  };
  
  
  {/* To Date */}
  <DatePicker
    selected={toDate ? new Date(toDate) : null}
    onChange={(date) => setToDate(date ? date.toISOString().split("T")[0] : "")}
    customInput={<CustomInput />}
    calendarClassName="custom-calendar"
  />
  



  return (
    <div className="bg-gray-100 min-h-screen p-3">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-white p-4">
        <div className="flex flex-wrap gap-2 font-semibold">
          {["all", "DELIVERED", "CANCELLED", "IN PROGRESS"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
                viewType === type
                  ? "bg-yellow-400 text-red-600"
                  : "border border-red-600 text-red-600 hover:bg-red-50"
              }`}
              onClick={() => handleTabClick(type)}
            >
              {type === "all"
                ? "All"
                : type === "CANCELLED"
                ? "Cancelled"
                : type === "IN PROGRESS"
                ? "In Progress"
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
                  className="text-left"
                  onClick={() => handleDeliveryTypeFilter("SELF_PICKUP")}
                >
                  Pickup
                </button>
                <button
                  className="text-left "
                  onClick={() => handleDeliveryTypeFilter("HOME_DELIVERY")}
                >
                  Delivery
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-3 rounded-md border ">
        {/* Select Shop */}
       
        <div className=" p-3">
        <label className="block text-[16px] font-semibold mb-2 ">
                  Select Shop
              </label>

          <div className="relative ">
            <input
              type="text"
              placeholder="Search for shop"
              value={shopSearch} // ✅ use shopSearch
              onChange={(e) => setShopSearch(e.target.value)}
              className="w-full rounded-md py-3 pl-10 pr-10 text-sm border border-gray-300 bg-white text-black placeholder-black  focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <FiSearch className="absolute left-3 top-3 text-black-400" />
            <FiChevronDown
              className="absolute right-3 top-3 text-black-400 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            />

            {showDropdown && (
              <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md max-h-40 overflow-y-auto text-sm shadow-lg">
                {shops
                  .filter((shop) =>
                    shop.toLowerCase().includes(shopSearch.toLowerCase())
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
                  shop.toLowerCase().includes(shopSearch.toLowerCase())
                ).length === 0 && (
                  <li className="px-4 py-2 text-gray-500">No shops found</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Order ID + Date Range + Search Button - Updated layout */}
       {/* Order ID + Date Range + Search Button - Updated layout */}
<div className="p-3">
  <div className="flex items-center gap-4 flex-wrap rounded-lg p-4 border border-gray-200">
    {/* Order ID with side label */}
    <div className="flex items-center gap-3">
      <label className="text-sm font-bold text-gray-700 whitespace-nowrap">
        Order ID
      </label>
      <input
        type="text"
        placeholder="Enter"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="rounded-md py-2.5 px-3 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>

    {/* From Date (new DatePicker) */}
    <div className="flex items-center gap-3">
  <DatePicker
    selected={fromDate ? new Date(fromDate) : null}
    onChange={(date) =>
      setFromDate(date ? date.toISOString().split("T")[0] : "")
    }
    customInput={<CustomInput />}
    calendarClassName="custom-calendar"
    maxDate={toDate ? new Date(toDate) : null}
    placeholderText="From Date"
  />
</div>

{/* To Date (new DatePicker) */}
<div className="flex items-center gap-3">
  <DatePicker
    selected={toDate ? new Date(toDate) : null}
    onChange={(date) =>
      setToDate(date ? date.toISOString().split("T")[0] : "")
    }
    customInput={<CustomInput />}
    calendarClassName="custom-calendar"
    minDate={fromDate ? new Date(fromDate) : null}
    placeholderText="To Date"
  />
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


      {/* Orders Table */}
      <div className="bg-white p-3">
        <div className="overflow-x-auto scrollbar-hidden">
          {/* ✅ removed overflow-y-auto */}
          <table className="min-w-[1200px] table-auto">
            <thead className="bg-brandYellow text-black text-sm text-center">
              <tr>
                <th className="p-3">Sr. No.</th>
                <th className="p-3">Order Id</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Mode</th>
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
                    <p className="text-lg text-gray-500">No orders found</p>
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
                    <td className="p-3">{cust.mode}</td>
                    <td className="p-3">{cust.payment}</td>
                    <td className="p-3">{cust.coin}</td>
                    <td className="p-3">{cust.shopName}</td>
                    <td className="p-3">{cust.deliveryType}</td>
                    <td className="p-3 text-center align-middle">
                      <button
                        title="View"
                        className="text-gray-700 hover:text-black"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/order/details/${cust.orderId}`);
                        }}
                      >
                        {/* ✅ Replaced with custom SVG */}
                        <ViewIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
                  ? "bg-yellow-400 text-red-600"
                  : "text-red-600 hover:text-black"
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
    <style jsx>{`
  .custom-calendar {
    border-radius: 12px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
  }
  .react-datepicker__header {
    background: #fff;
    border-bottom: none;
  }
  .react-datepicker__current-month {
    font-weight: bold;
    font-size: 16px;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #ec2d01 !important;
    color: #fff !important;
    border-radius: 50%;
  }
  .react-datepicker__day--today {
    background-color: rgba(236, 45, 1, 0.15);
    border-radius: 50%;
  }
  .react-datepicker__day:hover {
    background-color: rgba(236, 45, 1, 0.2);
    border-radius: 50%;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #ec2d01;
  }
  .react-datepicker__navigation {
    top: 12px;
  }
`}</style>

    </div>
  );
};

export default OrderList;
