// src/pages/Shop/ViewRegisterShop.jsx
import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ViewRegisterShop() {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const [shop, setShop] = useState(null);
  const [kycDetails, setKycDetails] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // ✅ Fetch Shop Details by ID
  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/shopApproval/getApprovedShopById/${shopId}`,
          { headers: { "Cache-Control": "no-cache" } }
        );

        setShop(res.data?.shop || null);
        setKycDetails(res.data?.kycDetails || null);
        setBankDetails(res.data?.bankDetails || null);
      } catch (err) {
        console.error("Error fetching shop:", err);
        setError("Failed to load shop details.");
      } finally {
        setLoading(false);
      }
    };

    if (shopId) fetchShop();
  }, [shopId, BASE_URL]);

  // ✅ Approve Shop
  const handleApprove = async () => {
    if (window.confirm("Approve this shop?")) {
      try {
        setIsApproving(true);
        await axios.put(
          `${BASE_URL}/shopApproval/approve-shop/${shopId}`,
          { shopStatus: "active" },
          { headers: { "Content-Type": "application/json" } }
        );

        setSuccessMessage(
          "Your shop has been successfully registered with Dukaanसे"
        );
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          navigate(-1);
        }, 2500);
      } catch (err) {
        console.error("Approval error:", err);
        alert(err.response?.data?.message || "Approval failed");
      } finally {
        setIsApproving(false);
      }
    }
  };

  // ❌ Reject Shop
  const handleReject = async () => {
    if (window.confirm("Reject this shop?")) {
      try {
        setIsRejecting(true);
        await axios.put(
          `${BASE_URL}/shopApproval/approve-shop/${shopId}`,
          { shopStatus: "rejected" },
          { headers: { "Content-Type": "application/json" } }
        );

        setSuccessMessage("This shop has been successfully rejected.");
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          navigate(-1);
        }, 2500);
      } catch (err) {
        console.error("Rejection error:", err);
        alert(err.response?.data?.message || "Rejection failed");
      } finally {
        setIsRejecting(false);
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Loading Seller Info...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!shop) return <div className="p-6 text-center text-red-500">Shop not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle size={20} className="text-gray-700 md:text-black" />
          </button>
          <h2 className="text-lg text-gray-800 font-medium">View Seller Info</h2>
        </div>
      </div>

      {/* Main Container with space and scrolling */}
      <div className="bg-white rounded-lg mt-4 shadow-md flex flex-col h-[80vh]">
        {/* Scrollable content */}
        <div
          className="p-6 overflow-y-auto flex-1 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="flex flex-col items-start">
            <img
              src={shop?.image || "https://cdn-icons-png.flaticon.com/512/1864/1864514.png"}
              alt="Shop"
              className="w-28 h-28 rounded-full object-cover mb-6 shadow"
            />

            <div className="w-full max-w-4xl space-y-6">
              {/* Text Details */}
              {[
                ["Shop Name:", shop?.shopName],
                ["GSTIN Number:", shop?.gstinNumber],
                ["Shop Owner’s Name:", shop?.ownerName],
                ["Mobile Number:", shop?.mobileNumber],
                ["Email:", shop?.email],
                ["Shop Address:", shop?.shopAddress],
                ["Shop Time:", shop?.shopTime],
                ["Option available:", shop?.optionsAvailable],
                [
                  "Prefer Pickup Time:",
                  Array.isArray(shop?.preferredPickupTimes)
                    ? shop.preferredPickupTimes.join(", ")
                    : "N/A",
                ],
              ].map(([label, value], idx) => (
                <div className="grid grid-cols-2 gap-4" key={idx}>
                  <span className="font-semibold text-gray-700">{label}</span>
                  <span className="text-gray-800">{value || "N/A"}</span>
                </div>
              ))}

              {/* ✅ Document Images from Backend */}
              <div className="grid grid-cols-2 gap-4 items-start">
                <span className="font-semibold text-gray-700">PAN Card:</span>
                {kycDetails?.panCardImage ? (
                  <img
                    src={kycDetails.panCardImage}
                    alt="PAN Card"
                    className="w-72 h-48 object-contain rounded shadow mt-2"
                  />
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                <span className="font-semibold text-gray-700">GST Details:</span>
                {kycDetails?.gstDetailsImage ? (
                  <img
                    src={kycDetails.gstDetailsImage}
                    alt="GST"
                    className="w-72 h-48 object-contain rounded shadow mt-2"
                  />
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                <span className="font-semibold text-gray-700">Shop License:</span>
                {kycDetails?.shopLicenseImage ? (
                  <img
                    src={kycDetails.shopLicenseImage}
                    alt="Shop License"
                    className="w-72 h-48 object-contain rounded shadow mt-2"
                  />
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                <span className="font-semibold text-gray-700">Bank Passbook:</span>
                {bankDetails?.bankPassbookImage ? (
                  <img
                    src={bankDetails.bankPassbookImage}
                    alt="Bank Passbook"
                    className="w-72 h-48 object-contain rounded shadow mt-2"
                  />
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Static Action Buttons (fixed at bottom like Edit button) */}
        <div className="p-4 flex justify-center gap-4 bg-white">
          <button
            className="border border-red-500 font-semibold text-red-500 px-6 py-2 rounded-md hover:bg-red-100 disabled:bg-gray-300"
            onClick={handleReject}
            disabled={isRejecting || isApproving}
          >
            {isRejecting ? "Rejecting..." : "Reject"}
          </button>
          <button
            className="bg-[#FEBC1D] text-red-600 font-semibold px-6 py-2 rounded-md hover:bg-yellow-500 disabled:bg-gray-300"
            onClick={handleApprove}
            disabled={isApproving || isRejecting}
          >
            {isApproving ? "Approving..." : "Approve"}
          </button>
        </div>
      </div>

      {/* ✅ Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{successMessage}</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewRegisterShop;
