import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

export default function ViewOffer() {
  const navigate = useNavigate();
  const { offerId } = useParams();

  const [offer, setOffer] = useState(null);
  const [error, setError] = useState("");

  const parseDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return dateStr.includes("/") ? dateStr : "N/A";
  };

  useEffect(() => {
    if (!offerId) {
      setError("Invalid offer ID.");
      return;
    }

    const fetchOffer = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/offer/getOffersById/${offerId}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        const data = res.data.offer;
        if (!data) {
          setError("Offer not found.");
        } else {
          setOffer(data);
        }
      } catch (err) {
        console.error("Error fetching offer details:", err);
        setError("Could not load offer details.");
      }
    };

    fetchOffer();
  }, [offerId]);

  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!offer) return <div className="p-4 text-center">Loading offer details...</div>;

  const productNames = offer.products
    ? offer.products.map((p) => p.productName).join(", ")
    : offer.offerOn?.join(", ") || "N/A";

  const discountDisplay = offer.discountRate
    ? `${offer.discountRate}`.includes("%")
      ? offer.discountRate
      : `${offer.discountRate} %`
    : offer.discountAmount
      ? `₹${offer.discountAmount}`
      : "N/A";

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle size={20} className="text-gray-700 md:text-black" />
          </button>
          <h2 className="text-lg text-gray-800 font-medium">View Offer</h2>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-lg mt-4 p-4 shadow-md flex flex-col h-[80vh]">
        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto flex-1 no-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="flex flex-col items-start">
            {offer.bannerImage && (
              <img
                src={offer.bannerImage}
                alt="Offer Banner"
                className="w-80 h-44 object-cover rounded shadow mb-6"
              />
            )}

            <div className="w-full max-w-4xl space-y-4">
              <InfoRow label="Offer For:" value={offer.offerFor} />
              <InfoRow label="Customer Type:" value={offer.customerType} />
              <InfoRow label="Offer On Product:" value={productNames} />
              <InfoRow label="Discount:" value={discountDisplay} />
              <InfoRow label="Offer Start Date:" value={parseDate(offer.startDate || offer.offerStartDate)} />
              <InfoRow label="Offer Expire Date:" value={parseDate(offer.expireDate || offer.offerExpireDate)} />
              {offer.offerText && <InfoRow label="Offer Text:" value={offer.offerText} />}

              <div className="text-right">
                <Link
                  to={`/offer/view-terms/${offerId}`}
                  className="text-red-600 font-medium hover:underline text-lg"
                >
                  See Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex justify-center gap-4 bg-white border-t">
          <button
            onClick={() => navigate(`/offer/edit/${offerId}`)}
            className="bg-[#FEBC1D] text-red-600 font-semibold px-6 py-2 rounded-md hover:bg-yellow-500"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-2 gap-4">
    <span className="font-semibold text-gray-700">{label}</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);