import React, { useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import panCardImg from "../../assets/pan card.png";
import gstImg from "../../assets/gst.png";
import shopImg from "../../assets/shop.png";
import bankImg from "../../assets/passbook.png";
import axios from "axios";
import {
  useGetNewRegisteredShopsQuery,
  useDeleteNewShopMutation,
  useGetAllApprovedShopsQuery,
} from "../../redux/apis/shopApi";

function ViewRegisterShop() {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const { data: shops, isLoading, isError } = useGetNewRegisteredShopsQuery();
  const shop = shops?.find((s) => s._id === shopId);

  const [rejectShop, { isLoading: isRejecting }] = useDeleteNewShopMutation();
  const { refetch: refetchApprovedShops } = useGetAllApprovedShopsQuery(
    { page: 1, limit: 10, search: "" },
    { skip: true }
  );

  const [isApproving, setIsApproving] = useState(false);

  // Approve Shop API call
  const handleApprove = async () => {
    if (window.confirm("Approve this shop?")) {
      try {
        setIsApproving(true);
  
        // Call GET API instead of POST
        const response = await axios.get(
          `https://dukanse-be-f5w4.onrender.com/api/shopApproval/getApprovedShopById/${shopId}`
        );
  
        console.log(response.data); // optional: check API response
  
        await refetchApprovedShops(); // refresh approved shops if needed
        alert("Shop approved successfully!");
        navigate("/shop");
      } catch (err) {
        alert(err.response?.data?.message || "Approval failed");
      } finally {
        setIsApproving(false);
      }
    }
  };
  

  // Reject Shop API call
  const handleReject = async () => {
    if (window.confirm("Reject and delete this shop?")) {
      try {
        await rejectShop(shopId).unwrap();
        alert("Shop rejected successfully!");
        navigate("/shop/registere");
      } catch (err) {
        alert(err.data?.message || "Rejection failed");
      }
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
    </div>
  );
}

export default ViewRegisterShop;
