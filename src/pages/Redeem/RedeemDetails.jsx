import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LuCircleArrowLeft } from "react-icons/lu";


const RedeemDetails = () => {
  const { redeemId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRedeemDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://dukanse-be-f5w4.onrender.com/api/payments/getRedemptionById/${redeemId}`
        );
        const result = await res.json();

        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError("No data found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchRedeemDetails();
  }, [redeemId]);

  // 🔹 Row Component
  const DetailRow = ({ label, value, valueColorClass = "text-[#333333] " }) => (
    <div className="flex items-center py-3 text-ld">
      <p className="text-[#333333] min-w-[300px] font-bold">{label}</p>
      <p className={`font-medium text-[#333333] ${valueColorClass}`}>{value}</p>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-[#FEBC1D]";
      case "completed":
      case "success":
        return "text-green-500";
      case "failed":
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-start h-full p-4 font-Poppins space-y-6">
  {loading ? (
    <p className="text-gray-500">Loading...</p>
  ) : error ? (
    <p className="text-red-500 bg-white p-6 rounded-xl shadow-md">{error}</p>
  ) : (
    <>
      {/* 🔹 Header Bar (Separate Card) */}
      <div className="w-full  bg-white rounded-2xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 text-4xl"
          >
           <LuCircleArrowLeft />

          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-[rgba(38, 38, 38, 1)]">
            View Redeem
          </h1>
        </div>
        <div className="w-8"></div>
      </div>

      {/* 🔹 Details Section */}
      <div className="w-full  bg-white rounded-2xl shadow-lg p-8 h-full text-lg">
        <div className="">
          <DetailRow label="Customer Name" value={data.shopName} />
          <DetailRow label="Total Amount" value={`${data.amount}/-`} />
          <DetailRow label="UPI/Bank" value={data.upiOrBank} />
          <DetailRow
            label="Redeem Status"
            value={data.redeemStatus}
            valueColorClass={getStatusColor(data.redeemStatus)}
          />
        </div>

        {/* 🔹 Pay Button */}
        <div className="mt-96 text-center ">
          <a
            href={data.upiLink}
            target="_blank"
            rel="noopener noreferrer"
className="inline-block w-full max-w-48 bg-[rgba(254,188,29,1)]  text-red-700 font-bold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xl"
          >
            Pay Now
          </a>
        </div>
      </div>
    </>
  )}
</div>

  );
};

export default RedeemDetails;
