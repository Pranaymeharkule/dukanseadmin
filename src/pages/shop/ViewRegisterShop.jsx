// src/pages/Shop/ViewRegisterShop.jsx
import React, { useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import panCardImg from "../../assets/pan card.png";
import gstImg from "../../assets/gst.png";
import shopImg from "../../assets/shop.png";
import bankImg from "../../assets/passbook.png";
import axios from "axios";
import { useGetNewRegisteredShopsQuery } from "../../redux/apis/shopApi";

function ViewRegisterShop() {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const { data: shops, isLoading, isError } = useGetNewRegisteredShopsQuery();
  const shop = shops?.find((s) => s._id === shopId);

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Approve Shop API call
  const handleApprove = async () => {
    if (window.confirm("Approve this shop?")) {
      try {
        setIsApproving(true);

        const response = await axios.put(
          `https://dukanse-be-f5w4.onrender.com/api/shopApproval/approve-shop/${shopId}`,
          { shopStatus: "active" },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("✅ Approval success:", response.data);

        // ✅ Show success popup
        setSuccessMessage("Your shop has been successfully registered with Dukaanसे");
        setShowSuccess(true);

        // Auto close modal after 2.5 sec and go back
        setTimeout(() => {
          setShowSuccess(false);
          navigate(-1);
        }, 2500);
      } catch (err) {
        console.error("❌ Approval API error:", err);
        alert(err.response?.data?.message || err.message || "Approval failed");
      } finally {
        setIsApproving(false);
      }
    }
  };

  // ❌ Reject Shop (No API – just success popup)
  const handleReject = async () => {
    if (window.confirm("Reject this shop?")) {
      setIsRejecting(true);

      // ✅ Show rejection popup (same style as approval)
      setSuccessMessage("This shop has been successfully rejected.");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate(-1);
      }, 2500);

      setIsRejecting(false);
    }
  };

  if (isLoading)
    return <div className="p-6 text-center">Loading Seller Info...</div>;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load shop details
      </div>
    );
  if (!shop)
    return <div className="p-6 text-center text-red-500">Shop not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center mb-4 bg-white p-4 md:p-5 rounded shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle
              size={25}
              className="text-gray-700 md:text-black"
            />
          </button>
          <h2 className="text-lg md:text-xl font-semibold">View Seller Info</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-4 md:p-6 rounded-md shadow">
        <div className="flex flex-col items-start">
          <img
            src={
              shop.shopImage ||
              "https://cdn-icons-png.flaticon.com/512/1864/1864514.png"
            }
            alt="Shop"
            className="w-28 h-28 rounded-full object-cover mb-6 shadow"
          />

          <div className="w-full max-w-4xl space-y-6">
            {/* Text Details */}
            {[
              ["Shop Name:", shop.shopName],
              ["GSTIN Number:", shop.gstNumber],
              ["Shop Owner’s Name:", shop.ownerName],
              ["Mobile Number:", shop.phoneNumber],
              ["Email:", shop.email],
              ["Shop Address:", shop.address],
              ["Shop Time:", shop.shopTiming],
              ["Option available:", shop.deliveryOption],
              ["Prefer Pickup Time:", shop.pickupTime],
            ].map(([label, value], idx) => (
              <div className="grid grid-cols-2 gap-4" key={idx}>
                <span className="font-medium text-gray-700">{label}</span>
                <span className="text-gray-800">{value || "N/A"}</span>
              </div>
            ))}

            {/* Document Images */}
            {[
              ["PAN Card:", shop.documents?.panCardUrl || panCardImg],
              ["GST Details:", shop.documents?.gstUrl || gstImg],
              ["Shop Details:", shop.documents?.shopLicenseUrl || shopImg],
              ["Bank Details:", shop.documents?.bankPassbookUrl || bankImg],
            ].map(([label, src], idx) => (
              <div className="grid grid-cols-2 gap-4 items-start" key={idx}>
                <span className="font-medium text-gray-700">{label}</span>
                <img
                  src={src}
                  alt={label}
                  className="w-72 h-48 object-contain rounded shadow mt-2"
                />
              </div>
            ))}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-4">
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {successMessage}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewRegisterShop;
