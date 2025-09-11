  import React, { useState, useEffect } from "react";
  import { useNavigate, useParams, Link } from "react-router-dom";
  import { ArrowLeft } from "lucide-react";
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

        console.log("GET offer response:", res.data);

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
    <div style={{ background: "#F2F3F5" }} className="min-h-screen p-6">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
      `}</style>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Header - Fixed */}
        <div
          className="flex items-center px-6 py-6 mb-6 bg-white rounded-lg shadow-sm sticky top-6 z-10"
          style={{ height: "88px" }}
        >
          <button
            onClick={() => navigate(-1)}
            type="button"
            title="Go Back"
            className="mr-4 w-10 h-10 flex items-center justify-center border-[3px] border-gray-600 rounded-full hover:border-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={3} />
          </button>
          <h2
            className="text-gray-800 font-medium"
            style={{
              fontFamily: "Poppins",
              fontSize: "24px",
              lineHeight: "36px",
              color: "#262626",
            }}
          >
            View Offer
          </h2>
        </div>

        {/* Body */}
        <div
          className="bg-white rounded-lg flex flex-col"
          style={{ height: "auto" }}
        >
          <div
            className="overflow-y-auto p-6 flex-1 hide-scrollbar"
            style={{ maxHeight: "500px" }}
          >
            {/* Info Rows */}
            <InfoRow label="Offer For:" value={offer.offerFor || "N/A"} />
            <InfoRow label="Customer Type:" value={offer.customerType || "N/A"} />
            <InfoRow label="Offer On Product:" value={productNames} />
            <InfoRow label="Discount:" value={discountDisplay} />
            <InfoRow
              label="Offer Start Date:"
              value={parseDate(offer.startDate || offer.offerStartDate)}
            />
            <InfoRow
              label="Offer Expire Date:"
              value={parseDate(offer.expireDate || offer.offerExpireDate)}
            />
            {offer.offerText && (
              <InfoRow label="Offer Text:" value={offer.offerText} />
            )}

            {/* Banner Section */}
            {offer.bannerImage && (
              <div className="flex gap-2 mb-6" style={{ height: "179.67px" }}>
                <div
                  className="font-medium flex items-center"
                  style={{
                    width: "300px",
                    height: "30px",
                    fontFamily: "Poppins",
                    fontSize: "20px",
                    lineHeight: "30px",
                    color: "#262626",
                  }}
                >
                  Banner
                </div>
                <div
                  className="rounded-lg p-2 relative"
                  style={{
                    width: "326px",
                    height: "179.67px",
                    background: "#FFEAE6",
                  }}
                >
                  <img
                    src={offer.bannerImage}
                    alt="Offer Banner"
                    className="rounded-lg w-full h-full object-cover"
                    style={{
                      width: "286px",
                      height: "159.67px",
                    }}
                  />
                  <div
                    className="absolute top-2 left-2 px-3 py-1 rounded text-white text-xs font-normal"
                    style={{
                      background: "#47B247",
                      fontSize: "10.08px",
                      fontFamily: "Poppins",
                    }}
                  >
                    New Offer
                  </div>
                </div>
              </div>
            )}

            {/* Terms & Conditions */}
            <div className="text-right mb-6">
              <Link
                className="font-medium hover:underline"
                style={{
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  lineHeight: "30px",
                  color: "#EC2D01",
                }}
                to={`/offer/see-terms/${offerId}`}
              >
                See Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Edit Button - Fixed at bottom */}
          <div className="flex justify-center p-6 bg-white border-t sticky bottom-0">
            <button
              onClick={() => navigate(`/offer/edit-offer/${offerId}`)}
              className="rounded-xl font-semibold"
              style={{
                background: "#FEBC1D",
                color: "#EC2D01",
                width: "200px",
                height: "50px",
                fontFamily: "Poppins",
                fontSize: "20px",
                lineHeight: "30px",
                fontWeight: "600",
              }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <div className="flex items-center gap-2 mb-6" style={{ height: "65px" }}>
    <div
      className="font-medium flex items-center"
      style={{
        width: "300px",
        height: "30px",
        fontFamily: "Poppins",
        fontSize: "20px",
        lineHeight: "30px",
        color: "#262626",
      }}
    >
      {label}
    </div>
    <div
      className="flex items-center px-4"
      style={{
        width: "724px",
        height: "65px",
        fontFamily: "Poppins",
        fontSize: "16px",
        lineHeight: "24px",
        color: "#262626",
      }}
    >
      {value || "N/A"}
    </div>
  </div>
);
