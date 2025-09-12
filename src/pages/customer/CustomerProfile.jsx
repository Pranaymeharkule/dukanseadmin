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
      <div className="bg-white rounded-lg shadow p-6 w-[300px]">
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
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Header - Fixed */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle size={20} className="text-gray-700 md:text-black" />
          </button>
          <h2 className="text-lg text-gray-800 font-medium">View Customer Info</h2>
        </div>
      </div>

      {/* Main Container - Fixed height with scrollable content */}
      <div className="bg-white rounded-lg mt-4 shadow-md flex flex-col h-[80vh]">
        {/* Scrollable content */}
        <div
          className="p-6 overflow-y-auto flex-1 scrollbar-hidden"
        >

          <div className="flex flex-col items-start scrollbar-hidden space-y-8">
            {/* Profile Section */}
            <div className="w-full">
              {/* Customer Profile Section */}
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
                className={`px-6 py-3 rounded-lg border font-bold text-lg uppercase tracking-wide transition-colors shadow-md ${customer?.profile?.status === "fraud"
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
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Customer Details
                </h2>
                <div className="w-full max-w-md space-y-4 text-left">
                  {[
                    ["Full Name:", customer?.profile?.fullName],
                    ["Gender:", customer?.profile?.gender],
                    ["Date Of Birth:", customer?.profile?.dob],
                    ["Phone Number:", customer?.profile?.phoneNumber],
                    ["Email:", customer?.profile?.email],
                    ["Address:", customer?.profile?.address],
                  ].map(([label, value], idx) => (
                    <div className="grid grid-cols-2 gap-4 items-start" key={idx}>
                      <span className="font-semibold text-gray-700">{label}</span>
                      <span className="text-gray-800">{value || "-"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-900">Previous Order Details:</h2>
                <button
                  onClick={() => setShowAllOrders(!showAllOrders)}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  See all
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr>
                      {["Sl.No", "Date", "Product Name", "Quantity", "Total Price", "Payment Status", "View Order"].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-sm font-bold text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(showAllOrders ? orders : orders.slice(0, 3)).length > 0 ? (
                      (showAllOrders ? orders : orders.slice(0, 3)).map((order, index) => (
                        <tr key={order.id} className={index % 2 === 0 ? "bg-[#FFFAFB]" : "bg-white"}>
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
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Referral History Section */}
            <div className="w-full">
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
                  <thead>
                    <tr>
                      {["Sl.No", "Date", "Person Name", "Referral Code", "Referred via", "Status"].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-sm font-bold text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(showAllReferrals ? referrals : referrals.slice(0, 3)).length > 0 ? (
                      (showAllReferrals ? referrals : referrals.slice(0, 3)).map((ref, index) => (
                        <tr key={ref.id} className={index % 2 === 0 ? "bg-[#FFFAFB]" : "bg-white"}>
                          <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{ref.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{ref.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{ref.code}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{ref.via}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{ref.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                          No referrals found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gullak Ledger Section */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-900">Gullak Ledger:</h2>
                <button
                  onClick={() => setShowAllGullak(!showAllGullak)}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  See all
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr>
                      {["Sl.No", "Date", "Available Coins", "Coins Earned", "Coins Redeemed", "Coins Expired"].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-sm font-bold text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(showAllGullak ? gullakLedger : gullakLedger.slice(0, 3)).length > 0 ? (
                      (showAllGullak ? gullakLedger : gullakLedger.slice(0, 3)).map((entry, index) => (
                        <tr key={entry.id} className={index % 2 === 0 ? "bg-[#FFFAFB]" : "bg-white"}>
                          <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.available}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.earned}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.redeemed}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.expired}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                          No gullak entries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
        </div>

        {/* Fixed Edit Button at bottom */}
        <div className="p-4 flex justify-center bg-white border-t">
          <button
            onClick={() => navigate(`/customer/edit/${customerId}`)}
            className="bg-[#FEBC1D] text-red-600 font-semibold px-6 py-2 rounded-md hover:bg-yellow-500"
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
    </div>
  );
};

export default CustomerProfile; 