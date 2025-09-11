import React, { useEffect, useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { VscEye } from "react-icons/vsc";
import axios from "axios";

// Integrated FraudOverlay Component
const FraudOverlay = ({ onClose, onConfirm, loading }) => {
  const [riskLevel, setRiskLevel] = useState("");
  const [activity, setActivity] = useState("");
  const [riskOptions, setRiskOptions] = useState(["Low", "Medium", "High"]);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // Fetch risk level options from API
  useEffect(() => {
    const fetchRiskLevels = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/adminCustomer/riskLevel`);
        if (res.data.success) {
          setRiskOptions(res.data.riskLevelOptions);
        }
      } catch (error) {
        console.error("Error fetching risk levels:", error);
        // Keep default options if API fails
      }
    };

    fetchRiskLevels();
  }, [API_BASE_URL]);

  const handleDone = () => {
    if (!riskLevel) {
      alert("Please select risk level.");
      return;
    }

    // Send the payload in the format expected by the API
    const fraudData = {
      riskLevel,
      activity: activity.trim() || "suspicious activity"
    };

    console.log('Submitting fraud data:', fraudData);
    onConfirm(fraudData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold text-center mb-4">Flag As Fraud</h2>

        {/* Risk Dropdown */}
        <select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Add Risk</option>
          {riskOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Activity Textarea */}
        <textarea
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Activity..."
          className="w-full border rounded px-3 py-2 mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-[45%] border border-red-500 text-red-500 py-2 rounded font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            disabled={loading || !riskLevel}
            className="w-[45%] bg-yellow-400 text-[#EC2D01] py-2 rounded font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main CustomerProfile Component
const CustomerProfile = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [gullakLedger, setGullakLedger] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllReferrals, setShowAllReferrals] = useState(false);
  const [showAllGullak, setShowAllGullak] = useState(false);
  const [showFraudOverlay, setShowFraudOverlay] = useState(false);

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
              status: profileData.status || "active",
              riskLevel: profileData.riskLevel || null,
              activity: profileData.activity || null,
              previousOrders: details.previousOrders || [],
              referrals: details.referralHistory || [],
              coinHistory: details.coinHistory || [],
            },
          });

          // Map orders
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

          // Map referrals
          setReferrals(
            (details.referralHistory || []).map((ref, idx) => ({
              id: ref.slNo || idx + 1,
              date: ref.date || "-",
              name: ref.personName || "-",
              code: ref.referralCode || "-",
              via: ref.referredVia || "-",
              status: ref.status || "-",
            }))
          );

          // Map gullak ledger
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
  }, [customerId, API_BASE_URL]);

  // ✅ Fraud submit handler
  const handleFraudSubmit = async (fraudData) => {
    try {
      setLoading(true);

      const payload = {
        status: "fraud",
        riskLevel: fraudData.riskLevel,
        activity: fraudData.activity,
      };

      const res = await axios.put(
        `${API_BASE_URL}/adminCustomer/flagAsFraud/${customerId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setCustomer(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            status: "fraud",
            riskLevel: res.data.updatedCustomer?.riskLevel || fraudData.riskLevel,
            activity: res.data.updatedCustomer?.activity || fraudData.activity,
          },
        }));
        alert(res.data.message || "Customer flagged as fraud");
        setShowFraudOverlay(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error flagging fraud");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark as legitimate handler
  const handleMarkAsLegitimate = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${API_BASE_URL}/adminCustomer/flagAsFraud/${customerId}`,
        { status: "active" },   // only status sent
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setCustomer(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            status: "active",
            riskLevel: null,
            activity: null,
          },
        }));
        alert(res.data.message || "Customer marked as legitimate");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error updating status");
    } finally {
      setLoading(false);
    }
  };


  const handleViewOrder = (orderId) => {
    navigate(`/order/details/${orderId}`);
  };

  const isFraudStatus = customer?.profile?.status === "fraud";

  return (
    <div className="min-h-screen bg-gray-100 space-y-4 p-6">
      {/* Header */}
      <div className="sticky bg-white top-0 z-50">
        <div className="max-w-7xl bg-white px-4 py-4 rounded-lg sticky top-4 z-10 flex items-center gap-3 shadow-sm">
          <BsArrowLeftCircle
            className="text-2xl cursor-pointer text-gray-700 hover:text-gray-900"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-lg text-gray-800 font-poppins font-medium">
            View Product Detail
          </h2>
        </div>
      </div>

      {/* Customer Profile Section */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 w-full">
          {/* Profile Image and Fraud Button Row */}
          <div className="flex justify-between items-center mb-6">
            {/* Profile Image (LHS) */}
            <div className="w-[140px] h-[140px] bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
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

            {/* Fraud Button (RHS) */}
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  if (customer?.profile?.status === "fraud") {
                    handleMarkAsLegitimate(); // ✅ Direct API call
                  } else {
                    setShowFraudOverlay(true); // ✅ Open overlay first
                  }
                }}
                disabled={loading}
                className={`px-8 py-3 rounded-lg border font-bold text-lg uppercase tracking-wide transition-colors shadow-md ${customer?.profile?.status === "fraud"
                    ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                    : "text-red-600 border-red-600 hover:bg-red-50"
                  }`}
              >
                {loading
                  ? "Loading..."
                  : customer?.profile?.status === "fraud"
                    ? "Mark as Legitimate"
                    : "Flag As Fraud"}
              </button>
            </div>
          </div>

          {/* Customer Details */}
          <div className="w-full max-w-md space-y-3 text-left">
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
          <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-white">
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
            <tbody>
              {(showAllOrders ? orders : orders.slice(0, 3)).length > 0 ? (
                (showAllOrders ? orders : orders.slice(0, 3)).map(
                  (order, index) => (
                    <tr
                      key={order.id}
                      className={
                        index % 2 === 0 ? "bg-[#FFFAFB]" : "bg-white"
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
          <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-white">
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
            <tbody>
              {(showAllReferrals ? referrals : referrals.slice(0, 3))
                .length > 0 ? (
                (showAllReferrals ? referrals : referrals.slice(0, 3)).map(
                  (ref, index) => (
                    <tr
                      key={ref.id}
                      className={
                        index % 2 === 0 ? "bg-[#FFFAFB]" : "bg-white"
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
          <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-white">
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
            <tbody>
              {(showAllGullak ? gullakLedger : gullakLedger.slice(0, 3))
                .length > 0 ? (
                (showAllGullak
                  ? gullakLedger
                  : gullakLedger.slice(0, 3)
                ).map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={
                      index % 2 === 0 ? "bg-[#FFFAFB]" : "bg-white"
                    }
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

      {/* Sticky Edit Button */}
      <div className={`sticky bottom-0 z-50 bg-gray-50 py-4 border-t ${showFraudOverlay ? 'relative z-30' : ''}`}>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(`/customer/edit/${customerId}`)}
            className="w-[200px] h-[50px] bg-brandYellow text-[#EC2D01] rounded-[10px] flex items-center justify-center p-[10px] gap-[8px] font-semibold text-[20px] leading-[50px] tracking-[0] text-center shadow-md"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Fraud Overlay */}
      {showFraudOverlay && (
        <FraudOverlay
          onClose={() => setShowFraudOverlay(false)}
          onConfirm={handleFraudSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default CustomerProfile;