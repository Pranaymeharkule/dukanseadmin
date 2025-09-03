import React, { useEffect, useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { VscEye } from "react-icons/vsc";
import axios from "axios";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [isFlagged, setIsFlagged] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [gullakLedger, setGullakLedger] = useState([]);
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

          // ✅ Use profile if available, else fallback
          const profileData = details.profile || details;

          setCustomer({
            profile: {
              fullName: profileData.fullName || profileData.customerName || "-",
              dob: profileData.dob || profileData.dateOfBirth || "-",
              gender: profileData.gender || "-",
              phoneNumber: profileData.phoneNumber || "-",
              email: profileData.email || "-",
              address: profileData.address || profileData.addresses || "-",
              image: profileData.profileImage || null,
            },
            previousOrders: details.previousOrders || [],
            referrals: details.referrals || [],
            coinHistory: details.coinHistory || [],
            isFraud: details.isFraud || false,
          });

          setIsFlagged(details.isFraud || false);

          // ✅ Map orders
          setOrders(
            (details.previousOrders || []).map((order, index) => ({
              id: order.orderId,
              date: order.date,
              product: order.productName || "-",
              quantity: order.quantity || "-",
              price: order.totalPrice || "₹0",
              status: order.paymentStatus || "-",
            }))
          );

          // ✅ Map referrals
          setReferrals(details.referrals || []);

          // ✅ Map gullak ledger
          setGullakLedger(
            (details.coinHistory || []).map((entry, idx) => ({
              id: idx,
              date: entry.date,
              available: entry.availableCoins,
              earned: entry.coinsEarned,
              redeemed: entry.coinsRedeemed,
              expired: entry.coinsExpired,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    fetchCustomerDetails();
  }, [customerId]);

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
              {/* Profile + Details (stacked left) */}
              <div className="flex flex-col items-start flex-1">
                {/* Profile Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  {customer?.profile?.image ? (
                    <img
                      src={customer.profile.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </div>

                {/* Customer Details */}
                <div className="w-full max-w-md space-y-9 text-left">
                  <div className="flex gap-x-8 items-center">
                    <span className="w-40 font-semibold text-gray-800">
                      Full Name:
                    </span>
                    <span className="flex-1 text-gray-700">
                      {customer?.profile?.fullName || "-"}
                    </span>
                  </div>

                  <div className="flex gap-x-8 items-center">
                    <span className="w-40 font-semibold text-gray-800">
                      Gender:
                    </span>
                    <span className="flex-1 text-gray-700">
                      {customer?.profile?.gender || "-"}
                    </span>
                  </div>

                  <div className="flex gap-x-8 items-center">
                    <span className="w-40 font-semibold text-gray-800">
                      Date Of Birth:
                    </span>
                    <span className="flex-1 text-gray-700">
                      {customer?.profile?.dob || "-"}
                    </span>
                  </div>

                  <div className="flex gap-x-8 items-center">
                    <span className="w-40 font-semibold text-gray-800">
                      Phone Number:
                    </span>
                    <span className="flex-1 text-gray-700">
                      {customer?.profile?.phoneNumber || "-"}
                    </span>
                  </div>

                  <div className="flex gap-x-8 items-center">
                    <span className="w-40 font-semibold text-gray-800">
                      Email:
                    </span>
                    <span className="flex-1 text-gray-700">
                      {customer?.profile?.email || "-"}
                    </span>
                  </div>

                  <div className="flex gap-x-8 items-start">
                    <span className="w-40 font-semibold text-gray-800">
                      Address:
                    </span>
                    <span className="flex-1 text-gray-700 break-words">
                      {customer?.profile?.address || "-"}
                    </span>
                  </div>
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
          <div className="bg-white p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-900">
                Previous Order Details:
              </h2>
              <button
                onClick={() => setShowAllOrders(!showAllOrders)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                See all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Sl.No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Total Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Payment Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      View Order
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(showAllOrders ? orders : orders.slice(0, 3)).length > 0 ? (
                    (showAllOrders ? orders : orders.slice(0, 3)).map(
                      (order, index) => (
                        <tr
                          key={order.id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.date}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.product}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.price}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.status}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleViewOrder(order.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <VscEye size={18} />
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Referral History Section */}
          <div className="bg-white p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-900">Referral History:</h2>
              <button
                onClick={() => setShowAllReferrals(!showAllReferrals)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                See all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Sl.No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Person Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Referral code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Referred via
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(showAllReferrals ? referrals : referrals.slice(0, 3))
                    .length > 0 ? (
                    (showAllReferrals ? referrals : referrals.slice(0, 3)).map(
                      (ref, index) => (
                        <tr
                          key={ref.id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {ref.date}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {ref.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {ref.code}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {ref.via}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {ref.status}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        No referrals found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gullak Ledger Section */}
          <div className="bg-white p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-900">Gullak ledger:</h2>
              <button
                onClick={() => setShowAllGullak(!showAllGullak)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                See all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Sl.No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Available Coins
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Coins Earned
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Coins Redeemed
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                      Coins Expired
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(showAllGullak ? gullakLedger : gullakLedger.slice(0, 3))
                    .length > 0 ? (
                    (showAllGullak
                      ? gullakLedger
                      : gullakLedger.slice(0, 3)
                    ).map((entry, index) => (
                      <tr
                        key={entry.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {entry.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {entry.available}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {entry.earned}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {entry.redeemed}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {entry.expired}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        No gullak entries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
