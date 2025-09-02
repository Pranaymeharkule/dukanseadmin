import React, { useEffect, useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { VscEye } from "react-icons/vsc";
import { IoWarning } from "react-icons/io5";
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

  // Fetch customer details
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const res = await axios.get(
          `https://dukanse-be-f5w4.onrender.com/api/adminCustomer/getCustomerDetails/${customerId}?_=${Date.now()}`,
          {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        if (res.data.success) {
          // Updated to match the actual API response structure
          const details = res.data.data;
          setCustomer(details);
          setIsFlagged(details?.isFraud || false);

          // Map orders from the actual API response structure
          setOrders(
            (details?.previousOrders || []).map((order, index) => ({
              id: order.orderId,
              date: order.date,
              product: order.productName,
              quantity: order.quantity || "-",
              price: order.totalPrice || "₹0",
              status: order.paymentStatus || "-",
            }))
          );

          // Keep referral history as is (empty array if not provided)
          setReferrals(details?.referrals || []);

          // Map Gullak Ledger from coinHistory
          setGullakLedger(
            (details?.coinHistory || []).map((entry, idx) => ({
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

  // Handle Fraud Toggle
  const handleToggle = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        `https://dukanse-be-f5w4.onrender.com/api/adminCustomer/flagAsFraud/${customerId}`
      );

      if (res.data.success) {
        setIsFlagged(true);
        alert("Customer flagged as fraud successfully!");
      } else {
        if (res.data.message?.includes("Already Decleared")) {
          setIsFlagged(true);
          alert("This customer is already marked as fraud.");
        } else {
          alert("Failed to flag customer!");
        }
      }
    } catch (error) {
      console.error("Error flagging fraud:", error);
      alert("Something went wrong while flagging fraud.");
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
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={
                    customer?.profile?.profileImage ||
                    "https://placehold.co/150x150"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              {/* Customer Details */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Full Name
                      </span>
                      <p className="text-base text-gray-900">
                        {customer?.profile?.fullName || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Gender
                      </span>
                      <p className="text-base text-gray-900">
                        {customer?.profile?.gender || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Date of Birth
                      </span>
                      <p className="text-base text-gray-900">
                        {customer?.profile?.dob || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Phone Number
                      </span>
                      <p className="text-base text-gray-900">
                        {customer?.profile?.phoneNumber || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Email
                      </span>
                      <p className="text-base text-gray-900">
                        {customer?.profile?.email || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Address
                      </span>
                      <p className="text-base text-gray-900">
                        {customer?.profile?.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flag Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleToggle}
                  disabled={isFlagged || loading}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isFlagged
                      ? "bg-red-50 border border-red-200 text-red-700 cursor-not-allowed"
                      : "bg-white border border-red-300 text-red-600 hover:bg-red-50"
                  }`}
                >
                  {isFlagged ? (
                    <>
                      <IoWarning className="w-5 h-5" />
                      Marked as Fraud
                    </>
                  ) : loading ? (
                    "Processing..."
                  ) : (
                    "Flag As Fraud"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="border-t bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Previous Order Details
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Sr No.</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Total Price</th>
                    <th className="px-4 py-3">Payment Status</th>
                    <th className="px-4 py-3">View Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{order.date}</td>
                        <td className="px-4 py-3">{order.product}</td>
                        <td className="px-4 py-3">{order.quantity}</td>
                        <td className="px-4 py-3">{order.price}</td>
                        <td className="px-4 py-3">{order.status}</td>
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
          <div className="border-t bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Referral History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Sr No.</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Person Name</th>
                    <th className="px-4 py-3">Referral Code</th>
                    <th className="px-4 py-3">Referred via</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {referrals.length > 0 ? (
                    referrals.map((ref, index) => (
                      <tr key={ref.id}>
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{ref.date}</td>
                        <td className="px-4 py-3">{ref.name}</td>
                        <td className="px-4 py-3">{ref.code}</td>
                        <td className="px-4 py-3">{ref.via}</td>
                        <td className="px-4 py-3">{ref.status}</td>
                      </tr>
                    ))
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
          <div className="border-t bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Gullak Ledger
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Sr No.</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Available Coins</th>
                    <th className="px-4 py-3">Coins Earned</th>
                    <th className="px-4 py-3">Coins Redeemed</th>
                    <th className="px-4 py-3">Coins Expired</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gullakLedger.length > 0 ? (
                    gullakLedger.map((entry, index) => (
                      <tr key={entry.id}>
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{entry.date}</td>
                        <td className="px-4 py-3">{entry.available}</td>
                        <td className="px-4 py-3">{entry.earned}</td>
                        <td className="px-4 py-3">{entry.redeemed}</td>
                        <td className="px-4 py-3">{entry.expired}</td>
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
          <div className="border-t bg-white px-6 py-4">
            <div className="flex justify-center gap-4">
              <button className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors">
                Deactivate
              </button>
              <button
                onClick={() => navigate(`/customer/edit/${customerId}`)}
                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors"
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