import React, { useEffect, useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { VscEye } from "react-icons/vsc";
import axios from "axios";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [gullakLedger, setGullakLedger] = useState([]);
  const [isFlagged, setIsFlagged] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllReferrals, setShowAllReferrals] = useState(false);
  const [showAllGullak, setShowAllGullak] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/adminCustomer/getCustomerDetails/${customerId}?_=${Date.now()}`,
          {
            headers: {
              "Cache-Control":
                "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        if (res.data.success) {
          const details = res.data.customerDetails;

          // Profile
          setCustomer({
            profile: {
              fullName: details.profile?.fullName || "-",
              dob: details.profile?.dob || "-",
              gender: details.profile?.gender || "-",
              phoneNumber: details.profile?.phoneNumber || "-",
              email: details.profile?.email || "-",
              address: details.profile?.address || "-",
              image: details.profile?.profileImage || null,
            },
            isFraud: details.isFraud || false,
          });

          setIsFlagged(details.isFraud || false);

          // Orders
          setOrders(
            (details.previousOrders || []).map((order, index) => ({
              id: order.orderId || index,
              date: order.date || "-",
              product: order.productName || "-",
              quantity: order.quantity || "-",
              price: order.totalPrice || "₹0",
              status: order.paymentStatus || "-",
            }))
          );

          // Referrals
          setReferrals(details.referrals || []);

          // Gullak ledger
          setGullakLedger(
            (details.coinHistory || []).map((entry, index) => ({
              id: index,
              date: entry.date || "-",
              available: entry.availableCoins || "-",
              earned: entry.coinsEarned || "-",
              redeemed: entry.coinsRedeemed || "-",
              expired: entry.coinsExpired || "-",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    fetchCustomerDetails();
  }, [customerId]);

  // Flag as fraud
  const handleToggle = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${API_BASE_URL}/adminCustomer/flagAsFraud/${customerId}`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setIsFlagged(true);
        alert(res.data.message || "Customer flagged as fraud successfully!");
      } else {
        if (res.data.message?.toLowerCase().includes("already")) {
          setIsFlagged(true);
          alert("This customer is already marked as fraud.");
        } else {
          alert(res.data.message || "Failed to flag customer!");
        }
      }
    } catch (error) {
      console.error("Error flagging fraud:", error.response || error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while flagging fraud."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/details/${orderId}`);
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <BsArrowLeftCircle size={28} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              View Customer Info
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Customer Profile Section */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              {/* Profile + Details */}
              <div className="flex flex-col items-start flex-1">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  {customer.profile.image ? (
                    <img
                      src={customer.profile.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </div>

                <div className="w-full max-w-md space-y-4 text-left">
                  {Object.entries(customer.profile).map(([key, value]) => {
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());
                    return (
                      <div key={key} className="flex gap-x-8 items-center">
                        <span className="w-40 font-semibold text-gray-800">
                          {label}:
                        </span>
                        <span className="flex-1 text-gray-700">{value || "-"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Flag Button */}
              <div className="flex-shrink-0 ml-6">
                <button
                  onClick={handleToggle}
                  disabled={isFlagged || loading}
                  className={`px-5 py-2 rounded border font-bold uppercase tracking-wide transition-colors shadow-sm ${
                    isFlagged
                      ? "bg-red-100 text-red-700 border-red-300 cursor-not-allowed"
                      : "text-red-600 border-red-600 hover:bg-red-50"
                  }`}
                >
                  {isFlagged
                    ? "Marked as Fraud"
                    : loading
                    ? "Processing..."
                    : "Flag As Fraud"}
                </button>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <DataTable
            title="Previous Order Details"
            data={orders}
            columns={["Sl.No", "Date", "Product Name", "Quantity", "Total Price", "Payment Status", "View Order"]}
            showAll={showAllOrders}
            setShowAll={setShowAllOrders}
            renderRow={(order, index) => (
              <>
                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{order.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{order.product}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{order.quantity}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{order.price}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{order.status}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleViewOrder(order.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <VscEye size={18} />
                  </button>
                </td>
              </>
            )}
          />

          {/* Referrals Section */}
          <DataTable
            title="Referral History"
            data={referrals}
            columns={["Sl.No", "Date", "Person Name", "Referral code", "Referred via", "Status"]}
            showAll={showAllReferrals}
            setShowAll={setShowAllReferrals}
            renderRow={(ref, index) => (
              <>
                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{ref.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{ref.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{ref.code}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{ref.via}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{ref.status}</td>
              </>
            )}
          />

          {/* Gullak Ledger Section */}
          <DataTable
            title="Gullak Ledger"
            data={gullakLedger}
            columns={["Sl.No", "Date", "Available Coins", "Coins Earned", "Coins Redeemed", "Coins Expired"]}
            showAll={showAllGullak}
            setShowAll={setShowAllGullak}
            renderRow={(entry, index) => (
              <>
                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.available}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.earned}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.redeemed}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.expired}</td>
              </>
            )}
          />

          {/* Action Buttons */}
          <div className="bg-white px-6 py-4">
            <div className="flex justify-center gap-4">
              <button className="px-6 py-2 border border-red-500 text-red-600 rounded-md font-medium hover:bg-red-50">
                Deactivate
              </button>
              <button
                onClick={() => navigate(`/customer/edit/${customerId}`)}
                className="px-6 py-2 bg-yellow-400 text-white rounded-md font-medium hover:bg-yellow-500"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;

// Reusable DataTable component
const DataTable = ({ title, data, columns, showAll, setShowAll, renderRow }) => (
  <div className="bg-white p-6 mt-4">
    <div className="flex justify-between items-center mb-3">
      <h2 className="font-semibold text-gray-900">{title}:</h2>
      <button
        onClick={() => setShowAll(!showAll)}
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        See all
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-sm font-bold text-gray-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            (showAll ? data : data.slice(0, 3)).map((row, index) => (
              <tr
                key={row.id || index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {renderRow(row, index)}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-3 text-center text-gray-500"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
