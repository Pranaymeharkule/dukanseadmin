// src/pages/Shop/ViewShop.jsx
import React, { useEffect, useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ViewShop() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ route: /shop/view/:id
  const [shop, setShop] = useState(null);
  const [kycDetails, setKycDetails] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ API Base URL from .env
  const BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // ✅ Fallback images
  const FALLBACKS = {
    shop: "https://cdn-icons-png.flaticon.com/512/1864/1864514.png",
    pan: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    gst: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    license: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
    bank: "https://cdn-icons-png.flaticon.com/512/3135/3135673.png",
  };

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/shopApproval/getApprovedShopById/${id}`,
          { headers: { "Cache-Control": "no-cache" } }
        );

        const shopData = res.data?.shop || null;
        setShop(shopData);
        setKycDetails(shopData?.kycDetails || null);
        setBankDetails(shopData?.bankDetails || null);
      } catch (err) {
        console.error("Error fetching shop:", err);
        setError("Failed to load shop details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchShop();
  }, [id, BASE_URL]);

  if (loading) {
    return <div className="p-6 text-center text-lg">Loading Shop Info...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-lg text-red-500">{error}</div>;
  }

  if (!shop) {
    return (
      <div className="p-6 text-center text-lg text-gray-500">
        No shop details found.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-gray-100 min-h-screen p-4 md:p-6">
        {/* Back */}
        <div className="flex items-center mb-4 bg-white p-4 md:p-5 rounded shadow">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <BsArrowLeftCircle
                size={25}
                className="text-gray-700 md:text-black"
              />
            </button>
            <h2 className="text-lg md:text-xl font-semibold">View Shop Info</h2>
          </div>
        </div>

        <div className="bg-white px-4 py-3 rounded-md shadow">
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
            <div className="flex flex-col items-start">
              {/* Shop Logo */}
              <img
                src={shop?.image || FALLBACKS.shop}
                alt="Shop"
                className="w-28 h-28 rounded-full object-cover mb-4"
              />

              {/* Shop Info */}
              <div className="w-full max-w-4xl space-y-6">
                {[
                  ["Shop Name:", shop?.shopName],
                  ["GSTIN Number:", shop?.gstinNumber],
                  ["Owner’s Name:", shop?.ownerName],
                  ["Mobile Number:", shop?.mobileNumber],
                  ["Email:", shop?.email],
                  ["Shop Address:", shop?.shopAddress],
                  ["Shop Time:", shop?.shopTime],
                  ["Options Available:", shop?.optionsAvailable],
                  [
                    "Preferred Pickup Times:",
                    shop?.preferredPickupTimes?.join(", "),
                  ],
                  ["Created At:", new Date(shop?.createdAt).toLocaleString()],
                  ["Updated At:", new Date(shop?.updatedAt).toLocaleString()],
                ].map(([label, value], idx) => (
                  <div className="grid grid-cols-2 gap-4" key={idx}>
                    <span className="font-semibold">{label}</span>
                    <span>{value || "N/A"}</span>
                  </div>
                ))}

                {/* KYC Details */}
                <h3 className="text-lg font-semibold mt-8">KYC Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-semibold">PAN Card:</span>
                  <img
                    src={kycDetails?.panCardImage || FALLBACKS.pan}
                    alt="PAN Card"
                    className="w-40 h-28 object-cover rounded shadow"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-semibold">GST Details:</span>
                  <img
                    src={kycDetails?.gstDetailsImage || FALLBACKS.gst}
                    alt="GST Details"
                    className="w-40 h-28 object-cover rounded shadow"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-semibold">Shop License:</span>
                  <img
                    src={kycDetails?.shopLicenseImage || FALLBACKS.license}
                    alt="Shop License"
                    className="w-40 h-28 object-cover rounded shadow"
                  />
                </div>

                {/* Bank Details */}
                <h3 className="text-lg font-semibold mt-8">Bank Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-semibold">Bank Passbook:</span>
                  <img
                    src={bankDetails?.bankPassbookImage || FALLBACKS.bank}
                    alt="Bank Passbook"
                    className="w-40 h-28 object-cover rounded shadow"
                  />
                </div>
              </div>

              {/* Buttons INSIDE the content div */}
              <div className="flex justify-center gap-4 mt-8 w-full">
                <button
                  className="bg-white border border-red-500 text-red-500 font-semibold px-6 py-2 rounded-md hover:bg-red-50"
                  onClick={() => navigate(-1)} // ✅ Navigate back instead of API
                >
                  Suspend
                </button>

                <button
                  className="bg-[#FF8C12] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#ff9e33]"
                  onClick={() => navigate(`/shop/info/edit-seller/${id}`)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewShop;
