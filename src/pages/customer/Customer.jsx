  import React, { useState, useEffect, useMemo } from "react";
  import {
    FaSortAmountDown,
    FaFilter,
    FaEye,
    FaWhatsapp,
    FaTrash,
    FaChevronLeft,
    FaChevronRight,
  } from "react-icons/fa";
  import { FiSearch, FiDownload } from "react-icons/fi";
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

    const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortBy, setSortBy] = useState("name");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paginationData, setPaginationData] = useState({
      totalPages: 1,
      next: false,
    });
    const [deleteModal, setDeleteModal] = useState({
      open: false,
      customerId: null,
    });

    const handleDelete = async () => {
      if (!deleteModal.customerId) return;

      try {
        const res = await axios.put(
          `${API_BASE_URL}/adminCustomer/delete/${deleteModal.customerId}`
        );

        if (res.data.success) {
          alert("Customer deleted successfully!");
          setCustomers((prev) =>
            prev.filter((cust) => cust._id !== deleteModal.customerId)
          );
        } else {
          alert(res.data.message || "Failed to delete customer");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Error deleting customer. Please try again.");
      } finally {
        setDeleteModal({ open: false, customerId: null });
      }
    };

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

        if (res.data && res.data.success) {
          const customerArray = res.data.customers || res.data.data || [];
          console.log("Mapped Customer Array:", customerArray);

          const mappedCustomers = customerArray.map((customer) => ({
            _id: customer._id,
            profileImage: customer.profileImage || "",
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

      if (viewType === "new") {
        const now = new Date();
        filtered = customers.filter((cust) => {
          const custDate = parseDate(cust.Date);
          if (!custDate) return false;
          const diffDays = (now - custDate) / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        });
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter((cust) => cust.status === statusFilter);
      }

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

    const handleSort = (type, order) => {
      setSortBy(type);
      setSortOrder(order);
      setSortVisible(false);
    };

    const handleFilter = (status) => {
      setStatusFilter(status);
      setFilterVisible(false);
    };

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
      <div className="max-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Card - with shadow */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between">
              {/* View type buttons */}
              <div className="flex items-center gap-2">
                <button
                  className={`px-4 py-2 rounded-full text-sm ${viewType === "all"
                      ? "bg-brandYellow text-red-700 shadow-md font-medium"
                      : "border border-red-600 text-red-600 font-normal"
                    }`}
                  onClick={() => setViewType("all")}
                >
                  All Customer
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm ${viewType === "new"
                      ? "bg-brandYellow text-red-700 shadow-md font-medium"
                      : "border border-red-600 text-red-600 font-normal"
                    }`}
                  onClick={() => setViewType("new")}
                >
                  New Customer
                </button>
              </div>

              {/* Right actions */}
              <div className="relative flex items-center gap-2">
                <button
                  className="p-2"
                  onClick={() => setFilterVisible(!filterVisible)}
                >
                  <FaFilter />
                </button>
                <button
                  className="p-2"
                  onClick={() => setSortVisible(!sortVisible)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="16"
                    height="16"
                    viewBox="0 0 30 30"
                    fill="none"
                    className="w-4 h-4"
                  >
                    <rect width="30" height="30" fill="url(#pattern0_4522_13470)" />
                    <defs>
                      <pattern
                        id="pattern0_4522_13470"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlinkHref="#image0_4522_13470"
                          transform="scale(0.0104167)"
                        />
                      </pattern>
                      <image
                        id="image0_4522_13470"
                        width="96"
                        height="96"
                        preserveAspectRatio="none"
                        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAABs0lEQVR4nO2cuW5DQRDD9q9dJmX+WkGA9D7eIY2WBLbXkIbdeS0AAAAAAIBr+V5r/SDZJ1//jwhG+UQIkE+EAPkK+Tp6tq9avgIiVAZ4R77MEeoCfCJfxghVAY7IlylCTYAz5MsQoSLAmfJ1c4TxAa6QrxsjjA5wpXyZfhPGcId8EcEvX0TwyxcR/PK1e4QE+do1QpJ87RYhUb52i3CEZxLdpO+rP1Dh++oPVPi++gMVvq/+QIXvqz9Q4fvqD1T4vvoDFb7vMPUHpkMAMwQwQwAzBDBDADMEMEMAM+kBFL6v/kCF76s/UOH76g9U+L76AxW+r/5Ahe+rP1Dh++oPVPi+ekQALwQwQwAzBDBDADMEMEMAM/UB0g9U+L76AxW+r/5Ahe+rP1Dh++oPVPi++gMVvq/+QIXvqz9Q4fviebwg0fW+1iY8AmRvKz8xwnbykyJsKz8hwvbynRGQb4yAfGOEePnPDpgcIV5+QoCrIoyQnxLg7Ahj5CcFOCvCKPlpAY5GGCc/McCnEUbKTw3wboSx8pMDvBphtPwJPJCfGYFPvjEC8o3/k/33AAAAAAAA1lX8Av/fmrZrQyxPAAAAAElFTkSuQmCC"
                      />
                    </defs>
                  </svg>
                </button>
                <button
                  className="flex items-center gap-2 border border-red-500 text-red-500 font-semibold px-3 py-1 rounded-md text-sm hover:bg-red-50"
                  onClick={handleExport}
                >
                  <FiDownload className="text-base" />
                  Export to Excel
                </button>

                {sortVisible && (
                  <div className="absolute top-12 right-24 bg-white border rounded-md shadow-lg p-2 w-36 text-sm z-10">
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
                      className="py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSort("date", "asc")}
                    >
                      Date (Oldest)
                    </div>
                  </div>
                )}

                {filterVisible && (
                  <div className="absolute top-12 right-44 bg-white border rounded-md shadow-lg p-2 w-44 text-sm z-10">
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
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search & Table Card - Removed shadow and made it full height */}
          <div className="bg-white rounded-lg p-6 min-h-[calc(100vh-200px)]">
            {/* Search */}
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder="Search Customer"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="px-10 py-2 border w-full rounded-full text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brandYellow"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-md overflow-x-auto scrollbar-hidden">
              <table className="min-w-[1800px] table-auto w-full">
                <thead className="bg-brandYellow text-gray-800 ">
                  <tr>
                    <th className="p-3 font-bold text-left">Customer Name</th>
                    <th className="p-3 font-bold text-center">Mobile No.</th>
                    <th className="p-3 font-bold text-center">Location</th>
                    <th className="p-3 font-bold text-center">Total Orders</th>
                    <th className="p-3 font-bold text-center">Coins Credited</th>
                    <th className="p-3 font-bold text-center">Coins Redeemed</th>
                    <th className="p-3 font-bold text-center">Coins Expired</th>
                    <th className="p-3 font-bold text-center">Status</th>
                    <th className="p-3 font-bold text-center">Date</th>
                    <th className="p-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedCustomers.length > 0 ? (
                    <>
                      {filteredAndSortedCustomers.map((cust) => (
                        <tr
                          key={cust._id}
                          className="hover:bg-gray-50 cursor-pointer h-11 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/customer/profile/${cust._id}`);
                          }}
                        >
                          <td className="p-1">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  cust.profileImage ||
                                  "https://static.vecteezy.com/system/resources/previews/020/911/740/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                                }
                                className="w-8 h-8 rounded-full"
                              />
                              {cust.customerName}
                            </div>
                          </td>
                          <td className="p-1 text-left">{cust.phoneNumber}</td>
                          <td className="p-1 text-center">{cust.location}</td>
                          <td className="p-1 text-center">{cust.totalorders}</td>
                          <td className="p-1 text-center">
                            {cust.coinsCredited}
                          </td>
                          <td className="p-1 text-center">
                            {cust.coinsRedeemed}
                          </td>
                          <td className="p-1 text-center">{cust.coinsExpired}</td>
                          <td className="p-1 capitalize text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${cust.status === "active"
                                ? "bg-green-100 text-green-800"
                                : cust.status === "fraud"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                                }`}
                            >
                              {cust.status}
                            </span>
                          </td>
                          <td className="p-1 text-center">{cust.Date}</td>
                          <td className="p-1">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                title="View"
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/customer/profile/${cust._id}`);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="inline-block"
                                >
                                  <path
                                    d="M12.5 16C14.1569 16 15.5 14.6569 15.5 13C15.5 11.3431 14.1569 10 12.5 10C10.8431 10 9.5 11.3431 9.5 13C9.5 14.6569 10.8431 16 12.5 16Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                  <path
                                    d="M21.5 14C21.5 14 20.5 6 12.5 6C4.5 6 3.5 14 3.5 14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                </svg>
                              </button>
                              <button
                                title="WhatsApp"
                                className="text-green-500 hover:text-green-600 transition-colors"
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
                                className="text-red-500 hover:text-red-600 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteModal({
                                    open: true,
                                    customerId: cust._id,
                                  });
                                }}
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7 21C6.45 21 5.97933 20.8043 5.588 20.413C5.19667 20.0217 5.00067 19.5507 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8043 20.021 18.413 20.413C18.0217 20.805 17.5507 21.0007 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                                    fill="#EC2D01"
                                  />
                                </svg>
                              </button>
                              {/* Delete Confirmation Modal */}
                              {deleteModal.open && (
                                <div
                                  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                                  onClick={(e) => e.stopPropagation()} // stop row click
                                >
                                  <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
                                    <h2 className="text-lg font-semibold mb-4">
                                      Are you sure want to Delete?
                                    </h2>
                                    <div className="flex justify-between gap-4">
                                      <button
                                        className="flex-1 border border-red-500 text-red-500 py-2 rounded-md hover:bg-red-50"
                                        onClick={() =>
                                          setDeleteModal({
                                            open: false,
                                            customerId: null,
                                          })
                                        }
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className="flex-1 bg-yellow-400 text-white font-semibold py-2 rounded-md hover:bg-yellow-500"
                                        onClick={(e) => {
                                          e.stopPropagation(); // important
                                          handleDelete();
                                        }}
                                      >
                                        Yes
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Empty rows to keep height as 10 rows */}
                      {Array.from({
                        length: Math.max(
                          0,
                          10 - filteredAndSortedCustomers.length
                        ),
                      }).map((_, i) => (
                        <tr key={`empty-${i}`} className="h-11">
                          <td colSpan="10"></td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      {/* No data message */}
                      <tr>
                        <td
                          colSpan="10"
                          className="text-center p-8 text-gray-500"
                        >
                          No customers found
                        </td>
                      </tr>
                      {/* Fill remaining rows to keep table height same */}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <tr key={`empty-${i}`} className="h-11">
                          <td colSpan="10"></td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {/* Previous Button */}
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className={`p-2 text-red-500 transition rounded-full ${page === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-red-700"
                  }`}
              >
                <FaChevronLeft className="text-lg" />
              </button>

              {/* Page Numbers (always at least 3) */}
              {Array.from(
                { length: Math.max(3, paginationData?.totalPages || 1) },
                (_, i) => i + 1
              ).map((pageNum) => {
                const totalPages = paginationData?.totalPages || 1;
                const isPhantom = pageNum > totalPages; // beyond real pages
                const isActive = pageNum === page;

                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      if (isPhantom || isActive) return;
                      setPage(pageNum);
                    }}
                    disabled={isPhantom || isActive}
                    className={`px-3 py-1 rounded-md text-base font-bold transition-all ${isActive
                      ? "bg-brandYellow text-red-600"
                      : isPhantom
                        ? "opacity-40 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() =>
                  setPage((prev) =>
                    Math.min(paginationData?.totalPages || 1, prev + 1)
                  )
                }
                disabled={page === (paginationData?.totalPages || 1)}
                className={`p-2 text-red-500 transition rounded-full ${page === (paginationData?.totalPages || 1)
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-red-700"
                  }`}
              >
                <FaChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Customer;