import React from 'react';
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import panCardImg from "../../assets/pan card.png";
import gstImg from "../../assets/gst.png";
import shopImg from "../../assets/shop.png";
import bankImg from "../../assets/passbook.png";

// Step 1: Import the necessary RTK Query hooks
import { 
  useGetApprovedShopByIdQuery,
  useDeleteApprovedShopMutation 
} from '../../redux/apis/shopApi'; // Adjust path if needed

function ViwShop() {
  const navigate = useNavigate();
  const { shopId } = useParams(); // Get the shop's ID from the URL

  // Step 2: Fetch the approved shop's data using the ID
  const { data: shop, isLoading, isError } = useGetApprovedShopByIdQuery(shopId, {
    skip: !shopId, // Don't run the query if shopId is missing
  });

  // Get the mutation hook for deleting/suspending a shop
  const [deleteShop, { isLoading: isDeleting }] = useDeleteApprovedShopMutation();

  // Step 3: Implement the Suspend/Delete handler
  const handleSuspend = async () => {
    if (window.confirm("Are you sure you want to suspend/delete this shop?")) {
      try {
        await deleteShop(shopId).unwrap();
        alert("Shop has been suspended successfully.");
        navigate('/shop'); // Navigate back to the main shop list
      } catch (err) {
        console.error("Failed to suspend shop:", err);
        alert(`Error: ${err.data?.message || "Could not suspend shop."}`);
      }
    }
  };

  // Step 4: Handle loading and error states
  if (isLoading) {
    return <div className="p-6 text-center text-lg">Loading Shop Info...</div>;
  }
  if (isError) {
    return <div className="p-6 text-center text-lg text-red-500">Failed to load shop details.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-md sticky top-0 z-20 flex items-center space-x-2">
        <BsArrowLeftCircle
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-xl font-semibold">View Shop Info</h2>
      </div>

      {/* Scrollable content - Using optional chaining (?.) to safely access data */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
        <div className="flex flex-col items-start">
          <img
            src={shop?.shopImage || "https://cdn-icons-png.flaticon.com/512/1864/1864514.png"}
            alt="Shop"
            className="w-28 h-28 rounded-full object-cover mb-4"
          />

          <div className="w-full max-w-4xl space-y-6">
            {/* Shop Info */}
            {[
              ["Shop Name:", shop?.shopName],
              ["GSTIN Number:", shop?.gstNumber],
              ["Shop Owner’s Name:", shop?.ownerName],
              ["Mobile Number:", shop?.phoneNumber],
              ["Email:", shop?.email],
              ["Shop Address:", shop?.address],
              ["Shop Time:", shop?.shopTiming],
              ["Option available:", shop?.deliveryOption],
              ["Prefer Pickup Time:", shop?.pickupTime],
            ].map(([label, value], idx) => (
              <div className="grid grid-cols-2 gap-4" key={idx}>
                <span className="font-semibold">{label}</span>
                <span>{value || "N/A"}</span>
              </div>
            ))}

            {/* Documents */}
            <div className="grid grid-cols-2 gap-4 items-start">
              <span className="font-semibold">PAN Card:</span>
              <img src={shop?.documents?.panCardUrl || panCardImg} alt="PAN Card" className="w-70 h-50 object-contain rounded shadow" />
            </div>
            <div className="grid grid-cols-2 gap-4 items-start">
              <span className="font-semibold">GST Details:</span>
              <img src={shop?.documents?.gstUrl || gstImg} alt="GST" className="w-70 h-50 object-contain rounded shadow" />
            </div>
            <div className="grid grid-cols-2 gap-4 items-start">
              <span className="font-semibold">SHOP DETAILS:</span>
              <img src={shop?.documents?.shopLicenseUrl || shopImg} alt="Shop License" className="w-70 h-50 object-contain rounded shadow" />
            </div>
            <div className="grid grid-cols-2 gap-4 items-start">
              <span className="font-semibold">Bank Details:</span>
              <img src={shop?.documents?.bankPassbookUrl || bankImg} alt="Bank Detail" className="w-70 h-50 object-contain rounded shadow" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="bg-white px-6 py-4 shadow-md sticky bottom-0 z-20 flex justify-center gap-4">
        <button 
          className="border border-red-500 text-red-500 px-6 py-2 rounded-md hover:bg-red-100 disabled:bg-gray-300"
          onClick={handleSuspend}
          disabled={isDeleting}
        >
          {isDeleting ? 'Suspending...' : 'Suspend'}
        </button>
      
<button
  onClick={() => navigate(`/shop/info/edit-seller/${shopId}`)}
>
  Edit
</button>
      </div>
    </div>
  );
}

export default ViwShop;