import React, { useState, useEffect, useMemo } from "react";
import {
  FaSortAmountDown,
  FaFilter,
  FaEye,
  FaWhatsapp,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Customer = () => {
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [viewType, setViewType] = useState("all");
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paginationData, setPaginationData] = useState({
    totalPages: 1,
    next: false,
  });

  // Updated API base URL
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // Fetch customer list from API
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/adminCustomer/getAllCustomersInfo?page=${page}&limit=${limit}&search=${search}&sortOrder=${sortOrder}&_=${Date.now()}`,
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      console.log("Customer List API:", res.data);

      // Handle the API response structure
      if (res.data && res.data.success) {
        const customerArray = res.data.customers || res.data.data || [];
        console.log("Mapped Customer Array:", customerArray);

        const mappedCustomers = customerArray.map((customer) => ({
          _id: customer._id,
          customerName:
            customer.customerName ||
            customer.name ||
            `Customer ${customer.phoneNumber || customer.phone}`,
          phoneNumber: customer.phoneNumber || customer.phone,
          location: customer.location || customer.address || "Not specified",
          totalorders: customer.totalOrders || customer.totalorders || 0,
          coinsCredited:
            customer.coinsCredited || customer.coins?.credited || 0,
          coinsRedeemed:
            customer.coinsRedeemed || customer.coins?.redeemed || 0,
          coinsExpired: customer.coinsExpired || customer.coins?.expired || 0,
          status: customer.status || "active",
          Date:
            customer.Date ||
            (customer.createdAt
              ? new Date(customer.createdAt).toLocaleDateString("en-GB")
              : "N/A"),
        }));

        setCustomers(mappedCustomers);

        // Use API pagination data if available, otherwise calculate
        const totalPages =
          res.data.totalPages ||
          Math.max(1, Math.ceil(customerArray.length / limit));
        const hasNext = res.data.next || customerArray.length === limit;

        setPaginationData({
          totalPages,
          next: hasNext,
        });
      } else {
        setCustomers([]);
        setPaginationData({
          totalPages: 1,
          next: false,
        });
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      // Handle error gracefully
      setCustomers([]);
      setPaginationData({
        totalPages: 1,
        next: false,
      });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search, sortOrder]);

  // Helper function to parse DD/MM/YYYY date format
  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === "N/A") return null;
    try {
      const [day, month, year] = dateStr.split("/");
      if (!day || !month || !year) return null;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } catch (error) {
      console.error("Error parsing date:", dateStr, error);
      return null;
    }
  };

  // Enhanced filtering and sorting
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers;

    // Apply view type filter (new customers)
    if (viewType === "new") {
      const now = new Date();
      filtered = customers.filter((cust) => {
        const custDate = parseDate(cust.Date);
        if (!custDate) return false;
        const diffDays = (now - custDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 7; // last 7 days as "new"
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((cust) => cust.status === statusFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        case "date":
          aValue = parseDate(a.Date);
          bValue = parseDate(b.Date);
          // Handle null dates
          if (!aValue && !bValue) return 0;
          if (!aValue) return 1;
          if (!bValue) return -1;
          break;
        case "orders":
          aValue = a.totalorders;
          bValue = b.totalorders;
          break;
        case "coins":
          aValue = a.coinsCredited;
          bValue = b.coinsCredited;
          break;
        default:
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
      }

      if (sortBy === "date") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else if (sortBy === "orders" || sortBy === "coins") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
    });

    return sorted;
  }, [customers, viewType, statusFilter, sortBy, sortOrder]);

  // Handle sort selection
  const handleSort = (type, order) => {
    setSortBy(type);
    setSortOrder(order);
    setSortVisible(false);
  };

  // Handle filter selection
  const handleFilter = (status) => {
    setStatusFilter(status);
    setFilterVisible(false);
  };

  // --- Export to Excel ---
  const handleExport = () => {
    if (!filteredAndSortedCustomers.length) {
      alert("No data to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredAndSortedCustomers.map((cust) => ({
        "Customer Name": cust.customerName,
        "Mobile No.": cust.phoneNumber,
        Location: cust.location,
        "Total Orders": cust.totalorders,
        "Coins Credited": cust.coinsCredited,
        "Coins Redeemed": cust.coinsRedeemed,
        "Coins Expired": cust.coinsExpired,
        Status: cust.status,
        Date: cust.Date,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "customers.xlsx");
  };

  return (
    <div className="p-0.5 bg-gray-100 rounded-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-white p-2.5">
        {/* View type buttons */}
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              viewType === "all"
                ? "bg-brandYellow text-brandRed"
                : "border border-brandRed text-brandRed"
            }`}
            onClick={() => setViewType("all")}
          >
            All Customer
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              viewType === "new"
                ? "bg-brandYellow text-brandRed"
                : "border border-brandRed text-brandRed"
            }`}
            onClick={() => setViewType("new")}
          >
            New Customer
          </button>
        </div>

        {/* Right actions */}
        <div className="relative flex items-center gap-2">
          <button
            className="p-2 border rounded-md"
            onClick={() => setFilterVisible(!filterVisible)}
          >
            <FaFilter />
          </button>
          <button
            className="p-2 border rounded-md"
            onClick={() => setSortVisible(!sortVisible)}
          >
            <FaSortAmountDown />
          </button>
          <button
            className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-sm"
            onClick={handleExport}
          >
            Export to Excel
          </button>

          {sortVisible && (
            <div className="absolute top-12 right-24 bg-white border rounded-md shadow-md p-2 w-36 text-sm z-10">
              <div
                className="py-1 hover:bg-gray-100 cursor-pointer border-b mb-1"
                onClick={() => handleSort("name", "asc")}
              >
                Name A - Z
              </div>
              <div
                className="py-1 hover:bg-gray-100 cursor-pointer border-b mb-1"
                onClick={() => handleSort("name", "desc")}
              >
                Name Z - A
              </div>
              <div
                className="py-1 hover:bg-gray-100 cursor-pointer border-b mb-1"
                onClick={() => handleSort("date", "desc")}
              >
                Date (Newest)
              </div>
              <div
                className="py-1 hover:bg-gray-100 cursor-pointer border-b mb-1"
                onClick={() => handleSort("date", "asc")}
              >
                Date (Oldest)
              </div>
            </div>
          )}

          {filterVisible && (
            <div className="absolute top-12 right-44 bg-white border rounded-md shadow-md p-2 w-44 text-sm z-10">
              <div
                className="py-1 hover:bg-gray-100 cursor-pointer border-b mb-1"
                onClick={() => handleFilter("all")}
              >
                All Status
              </div>
              <div
                className="py-1 hover:bg-gray-100 cursor-pointer border-b mb-1"
                onClick={() => handleFilter("active")}
              >
                Active
              </div>
              <div
                className="py-1 hover:bg-gray-100 cursor-pointer border-b mb-1"
                onClick={() => handleFilter("fraud")}
              >
                Fraud
              </div>
              <div
                className="py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleFilter("inactive")}
              >
                Inactive
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search & Table */}
      <div className="bg-white p-2">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search Customer"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border w-96 rounded-full text-sm bg-gray-100"
          />
        </div>

        <div className="bg-white rounded-md shadow overflow-x-auto">
          <div className="overflow-y-auto max-h-[480px]">
            <table className="min-w-[1800px] table-auto">
              <thead className="bg-yellow-500 text-brandText text-left">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Mobile No.</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Total Orders</th>
                  <th className="p-3">Coins Credited</th>
                  <th className="p-3">Coins Redeemed</th>
                  <th className="p-3">Coins Expired</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedCustomers.length > 0 ? (
                  filteredAndSortedCustomers.map((cust) => (
                    <tr
                      key={cust._id}
                      className="border-b hover:bg-gray-100 cursor-pointer h-16"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customer/profile/${cust._id}`);
                      }}
                    >
                      <td className="flex items-center gap-3 p-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            cust.customerName
                          )}`}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        {cust.customerName}
                      </td>
                      <td className="p-3">{cust.phoneNumber}</td>
                      <td className="p-3">{cust.location}</td>
                      <td className="p-3 text-center">{cust.totalorders}</td>
                      <td className="p-3 text-center">{cust.coinsCredited}</td>
                      <td className="p-3 text-center">{cust.coinsRedeemed}</td>
                      <td className="p-3 text-center">{cust.coinsExpired}</td>
                      <td className="p-3 capitalize">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            cust.status === "active"
                              ? "bg-green-100 text-green-800"
                              : cust.status === "fraud"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {cust.status}
                        </span>
                      </td>
                      <td className="p-3">{cust.Date}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <button
                            title="View"
                            className="text-gray-700 hover:text-black"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/customer/profile/${cust._id}`);
                            }}
                          >
                            <FaEye />
                          </button>
                          <button
                            title="WhatsApp"
                            className="text-green-500 hover:text-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `https://wa.me/${cust.phoneNumber}`,
                                "_blank"
                              );
                            }}
                          >
                            <FaWhatsapp />
                          </button>
                          <button
                            title="Delete"
                            className="text-red-500 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Delete feature not available in API.");
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center p-8 text-gray-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {paginationData?.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            {/* Previous Button */}
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`text-red-500 hover:text-red-700 transition-all ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              &#8592;
            </button>

            {/* Current Page */}
            <button
              disabled
              className="px-3 py-1 rounded-md font-bold bg-[#FEBC1D] text-red-500"
            >
              {page}
            </button>

            {/* Next Button */}
            <button
              onClick={() => setPage(page + 1)}
              disabled={!paginationData.next}
              className={`text-red-500 hover:text-red-700 transition-all ${
                !paginationData.next ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              &#8594;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customer;
