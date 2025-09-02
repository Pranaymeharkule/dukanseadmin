import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;
  const handleBackNavigation = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setError("Order ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_BASE_URL}/adminOrder/getOrderById/${orderId}?t=${Date.now()}`,
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        // Check if the response indicates success
        if (response.data && response.data.success) {
          setOrderData(response.data);
        } else {
          // Handle API errors (success: false)
          setError(response.data?.message || "Failed to fetch order details");
        }
      } catch (err) {
        if (err.response) {
          // Check if the response has success: false
          if (err.response.data && err.response.data.success === false) {
            setError(err.response.data.message || "Server Error");
          } else {
            setError(
              err.response.data?.message ||
                `Server Error: ${err.response.status}`
            );
          }
        } else if (err.request) {
          setError(
            "Network error. Please check your connection and try again."
          );
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Re-trigger the useEffect by creating a small delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 flex items-center z-10 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={handleBackNavigation}
              type="button"
              title="Go Back"
              className="w-8 h-8 flex items-center justify-center border-[3px] border-gray-600 rounded-full hover:border-gray-800 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={3} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 px-4">
              Order Details
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center z-10 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={handleBackNavigation}
              type="button"
              title="Go Back"
              className="w-8 h-8 flex items-center justify-center border-[3px] border-gray-600 rounded-full hover:border-gray-800 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={3} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 px-4">
              Order Details
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <div className="text-red-500 text-center mb-4">Error: {error}</div>
          <button
            onClick={handleRetry}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if we have the expected data structure
  if (!orderData || !orderData.orderDetails) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center z-10 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={handleBackNavigation}
              type="button"
              title="Go Back"
              className="w-8 h-8 flex items-center justify-center border-[3px] border-gray-600 rounded-full hover:border-gray-800 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={3} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 px-4">
              Order Details
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <div className="text-gray-500 mb-4">No order data found</div>
          <div className="text-xs text-gray-400 bg-white p-4 rounded-lg border max-w-full overflow-auto">
            <strong>Debug Info:</strong>
            <br />
            OrderData exists: {orderData ? "Yes" : "No"}
            <br />
            Raw data: {JSON.stringify(orderData, null, 2)}
          </div>
        </div>
      </div>
    );
  }

  // Use the correct data structure from API response
  const orderDetails = orderData.orderDetails;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      if (typeof dateString === "string" && dateString.includes(",")) {
        return dateString;
      }
      return new Date(dateString).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "N/A";
    return `+91-${phone}`;
  };

  const formatOrderStatus = (status) => {
    if (!status) return "N/A";
    if (Array.isArray(status)) {
      return status.join(", ");
    }
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatAmount = (amount) => {
    if (!amount || amount === "undefined" || amount === "₹ undefined")
      return "N/A";
    if (typeof amount === "string" && amount.includes("₹")) {
      return amount;
    }
    return `₹ ${amount}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center z-10 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={handleBackNavigation}
            type="button"
            title="Go Back"
            className="w-8 h-8 flex items-center justify-center border-[3px] border-gray-600 rounded-full hover:border-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={3} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 px-4">
            Order Details
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Order ID Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Order Id:
          </div>
          <div className="text-base text-gray-900 font-medium">
            #{orderDetails.orderId || "N/A"}
          </div>

          {/* Product Details Section - Only show if available */}
          {orderDetails.productDetails &&
            orderDetails.productDetails.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Product Details
                </h3>
                <div className="space-y-4">
                  {orderDetails.productDetails.map((product, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        {product.productName || product.name || "Product Name"}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {product.weight || product.quantity || ""}{" "}
                        {product.unit || ""} / Qty:{" "}
                        {product.qty || product.quantity || 1}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmount(
                          product.price || product.amount || product.cost
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Customer Details Section */}
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Customer Details
            </h2>
            <div className="space-y-3">
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">
                  Customer Name:
                </span>
                <span className="text-sm text-gray-900 flex-1">
                  {orderDetails.customerDetails?.customerName || "N/A"}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">
                  Mobile Number:
                </span>
                <span className="text-sm text-gray-900 flex-1">
                  {formatPhoneNumber(
                    orderDetails.customerDetails?.phoneNumber ||
                      orderDetails.customerDetails?.mobileNumber
                  )}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">Address:</span>
                <span className="text-sm text-gray-900 flex-1">
                  {orderDetails.customerDetails?.address || "N/A"}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">Order Type:</span>
                <span className="text-sm text-gray-900 flex-1">
                  {formatOrderStatus(orderDetails.customerDetails?.orderType)}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">
                  Order Status:
                </span>
                <span
                  className={`text-sm font-medium flex-1 ${
                    orderDetails.customerDetails?.orderStatus === "DELIVERED" ||
                    orderDetails.customerDetails?.orderStatus ===
                      "PICKED_UP_BY_CUSTOMER"
                      ? "text-green-600"
                      : orderDetails.customerDetails?.orderStatus ===
                        "CANCELLED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {formatOrderStatus(orderDetails.customerDetails?.orderStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Kirana Store Details Section */}
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Kirana Store Details
            </h2>
            <div className="space-y-3">
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">
                  Kirana Store Name:
                </span>
                <span className="text-sm text-gray-900 flex-1">
                  {orderDetails.kiranaStoreDetails?.kiranaStoreName ||
                    orderDetails.kiranaStoreDetails?.storeName ||
                    "N/A"}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">Order Date:</span>
                <span className="text-sm text-gray-900 flex-1">
                  {formatDate(orderDetails.kiranaStoreDetails?.orderDate) ||
                    "N/A"}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">
                  Mobile Number:
                </span>
                <span className="text-sm text-gray-900 flex-1">
                  {formatPhoneNumber(
                    orderDetails.kiranaStoreDetails?.mobileNumber ||
                      orderDetails.kiranaStoreDetails?.phoneNumber
                  )}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">Address:</span>
                <span className="text-sm text-gray-900 flex-1">
                  {orderDetails.kiranaStoreDetails?.address || "N/A"}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">Order Type:</span>
                <span className="text-sm text-gray-900 flex-1">
                  {formatOrderStatus(
                    orderDetails.kiranaStoreDetails?.orderType
                  )}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">
                  Order Status:
                </span>
                <span
                  className={`text-sm font-medium flex-1 ${
                    orderDetails.kiranaStoreDetails?.orderStatus ===
                      "COMPLETED" ||
                    orderDetails.kiranaStoreDetails?.orderStatus === "DELIVERED"
                      ? "text-green-600"
                      : orderDetails.kiranaStoreDetails?.orderStatus ===
                        "CANCELLED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {formatOrderStatus(
                    orderDetails.kiranaStoreDetails?.orderStatus
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Payment Details
            </h2>
            <div className="space-y-3">
              {orderDetails.paymentDetails?.transactionId && (
                <div className="flex py-1">
                  <span className="text-sm text-gray-600 w-40">
                    Transaction ID:
                  </span>
                  <span className="text-sm text-gray-900 flex-1">
                    {orderDetails.paymentDetails.transactionId}
                  </span>
                </div>
              )}
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">Date:</span>
                <span className="text-sm text-gray-900 flex-1">
                  {formatDate(orderDetails.paymentDetails?.date) || "N/A"}
                </span>
              </div>
              {orderDetails.paymentDetails?.paymentGateway && (
                <div className="flex py-1">
                  <span className="text-sm text-gray-600 w-40">
                    Payment Gateway:
                  </span>
                  <span className="text-sm text-gray-900 flex-1">
                    {orderDetails.paymentDetails.paymentGateway}
                  </span>
                </div>
              )}
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">
                  Payment Method:
                </span>
                <span className="text-sm text-gray-900 flex-1">
                  {orderDetails.paymentDetails?.paymentMethod ||
                    orderDetails.paymentDetails?.paymeentMethod ||
                    "N/A"}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">
                  Shopping Amount:
                </span>
                <span className="text-sm text-gray-900 flex-1">
                  {formatAmount(orderDetails.paymentDetails?.shoppingAmount)}
                </span>
              </div>
              {orderDetails.paymentDetails?.redeemedGullakCoins &&
                orderDetails.paymentDetails.redeemedGullakCoins > 0 && (
                  <div className="flex py-1">
                    <span className="text-sm text-gray-600 w-40">
                      Redeemed Gullak Coin:
                    </span>
                    <span className="text-sm text-gray-900 flex-1">
                      -₹ {orderDetails.paymentDetails.redeemedGullakCoins}
                    </span>
                  </div>
                )}
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">Paid Amount:</span>
                <span className="text-sm text-gray-900 flex-1 font-medium">
                  {formatAmount(orderDetails.paymentDetails?.paidAmount)}
                </span>
              </div>
              <div className="flex py-1">
                <span className="text-sm text-gray-600 w-40">
                  Payment Status:
                </span>
                <span
                  className={`text-sm font-medium flex-1 ${
                    orderDetails.paymentDetails?.paymentStatus === "Success" ||
                    orderDetails.paymentDetails?.paymentStatus === "Successful"
                      ? "text-green-600"
                      : orderDetails.paymentDetails?.paymentStatus === "Failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {orderDetails.paymentDetails?.paymentStatus || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
