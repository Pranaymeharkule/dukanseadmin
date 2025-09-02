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
  const [paginationData, setPaginationData] = useState({
    totalPages: 1,
    next: false,
  });

  // Updated API base URL
  const API_BASE_URL = "https://dukanse-be-f5w4.onrender.com/api";

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
        const customerArray = res.data.data || res.data.customers || [];
        console.log("Mapped Customer Array:", customerArray);

        const mappedCustomers = customerArray.map((customer) => ({
          _id: customer._id,
          customerName:
            customer.customerName ||
            customer.name ||
            `Customer ${customer.phone || customer.phoneNumber}`,
          phoneNumber: customer.phone || customer.phoneNumber,
          location: customer.location || customer.address || "Not specified",
          totalorders: customer.totalOrders || customer.totalorders || 0,
          coinsCredited:
            customer.coinsCredited || customer.coins?.credited || 0,
          coinsRedeemed:
            customer.coinsRedeemed || customer.coins?.redeemed || 0,
          coinsExpired: customer.coinsExpired || customer.coins?.expired || 0,
          status: customer.status || "active",
          Date:
            customer.Date || customer.createdAt
              ? new Date(customer.createdAt).toLocaleDateString("en-GB")
              : "N/A",
        }));

        setCustomers(mappedCustomers);

        // Since the API doesn't provide pagination info, calculate it
        const totalCustomers = mappedCustomers.length;
        const calculatedTotalPages = Math.max(
          1,
          Math.ceil(totalCustomers / limit)
        );
        const hasNext = totalCustomers === limit; // Assume there's more data if we got a full page

        setPaginationData({
          totalPages: calculatedTotalPages,
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

  // --- New Customer Filter (frontend only) ---
  const filteredCustomers = useMemo(() => {
    if (viewType === "new") {
      const now = new Date();
      return customers.filter((cust) => {
        if (!cust.Date || cust.Date === "N/A") return false;
        try {
          // Parse the date format "DD/MM/YYYY"
          const [day, month, year] = cust.Date.split("/");
          const custDate = new Date(year, month - 1, day);
          const diffDays = (now - custDate) / (1000 * 60 * 60 * 24);
          return diffDays <= 7; // last 7 days as "new"
        } catch (error) {
          console.error("Error parsing date:", cust.Date);
          return false;
        }
      });
    }
    return customers;
  }, [customers, viewType]);

  // --- Export to Excel ---
  const handleExport = () => {
    if (!filteredCustomers.length) {
      alert("No data to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredCustomers.map((cust) => ({
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
                className="py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSortOrder("asc");
                  setSortVisible(false);
                }}
              >
                Name A - Z
              </div>
              <div
                className="py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSortOrder("desc");
                  setSortVisible(false);
                }}
              >
                Name Z - A
              </div>
              <div className="py-1 text-gray-400">Date</div>
            </div>
          )}

          {filterVisible && (
            <div className="absolute top-12 right-44 bg-white border rounded-md shadow-md p-1 w-44 text-sm z-10">
              <div className="p-2 text-gray-500">
                API does not support filtering
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
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => (
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
        <div className="flex justify-center items-center mt-4 gap-2 text-sm">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="text-orange-300 disabled:opacity-50"
          >
            &#8592;
          </button>
          <button className="bg-orange-500 text-white px-3 py-1 rounded-full">
            {page}
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!paginationData.next}
            className="text-orange-500 disabled:opacity-50"
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customer;
