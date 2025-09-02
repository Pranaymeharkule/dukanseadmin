import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import SuccessOverlay from "../../components/overlay/SuccessOverlay";
import axios from "axios";

function EditShopInfo() {
  const navigate = useNavigate();
  const { shopId: id } = useParams();

  const [shopData, setShopData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState({});
  const [error, setError] = useState(null);

  const BASE_URL =
    process.env.REACT_APP_BACKEND_API_BASEURL ||
    "https://dukanse-be-f5w4.onrender.com/api";

  useEffect(() => {
    if (!id) {
      setError("Invalid shop ID");
      return;
    }

    const fetchShop = async () => {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const res = await axios.get(
          `${BASE_URL}/shopApproval/getApprovedShopById/${id}`,
          { headers }
        );

        const incoming = res.data?.shop;
        if (!incoming) {
          setError("No shop details found.");
        } else {
          setShopData({
            shopName: incoming.shopName || "",
            gstNumber: incoming.gstinNumber || "", // ✅ corrected key
            ownerName: incoming.ownerName || "",
            phoneNumber: incoming.mobileNumber || "", // ✅ corrected key
            email: incoming.email || "",
            address: incoming.shopAddress || "", // ✅ corrected key
            optionsAvailable: incoming.optionsAvailable || "Pickup",
            shopTime: incoming.preferredPickupTimes || [],
          
            // images
            image: incoming.image || "",
          
            // ✅ KYC and Bank details are not inside `shop` in your response
            panCardImage: res.data?.kycDetails?.panCardImage || "",
            gstDetailsImage: res.data?.kycDetails?.gstDetailsImage || "",
            shopLicenseImage: res.data?.kycDetails?.shopLicenseImage || "",
          
            bankPassbookImage: res.data?.bankDetails?.bankPassbookImage || "",
            bankName: res.data?.bankDetails?.bankName || "",
            IFSCCode: res.data?.bankDetails?.IFSCCode || "",
            accountNumber: res.data?.bankDetails?.accountNumber || "",
            accountHolderName: res.data?.bankDetails?.accountHolderName || "",
            accountType: res.data?.bankDetails?.accountType || "",
          });
          
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load shop details.");
      }
    };

    fetchShop();
  }, [id, BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles((prev) => ({ ...prev, [field]: file }));
      // preview with object URL
      setShopData((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const debugFormData = (fd) => {
    // useful for debugging — logs keys and types (files show as File)
    for (let pair of fd.entries()) {
      console.log(pair[0], pair[1]);
    }
  };

  const handleSave = async () => {
    if (!id) {
      setError("Invalid shop ID. Cannot update.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Top-level shop fields: use keys that match GET/expected backend keys
      formData.append("shopName", shopData.shopName || "");
      formData.append("gstNumber", shopData.gstNumber || "");
      formData.append("ownerName", shopData.ownerName || "");
      formData.append("phoneNumber", shopData.phoneNumber || "");
      formData.append("email", shopData.email || "");
      formData.append("address", shopData.address || "");
      formData.append("optionsAvailable", shopData.optionsAvailable || "Pickup");

      // shop time (send as JSON string if array)
      const shopTimeValue = Array.isArray(shopData.shopTime)
        ? JSON.stringify(shopData.shopTime)
        : shopData.shopTime
        ? String(shopData.shopTime)
        : "[]";
      // Use key that backend expects — from your screenshot it looked like "shopTime"
      formData.append("shopTime", shopTimeValue);

      // KYC images: append both nested and top-level variants (be safe)
      if (imageFiles.panCardImage) {
        formData.append("kycDetails[panCardImage]", imageFiles.panCardImage);
        formData.append("panCardImage", imageFiles.panCardImage);
      }
      if (imageFiles.gstDetailsImage) {
        formData.append("kycDetails[gstDetailsImage]", imageFiles.gstDetailsImage);
        formData.append("gstDetailsImage", imageFiles.gstDetailsImage);
      }
      if (imageFiles.shopLicenseImage) {
        formData.append("kycDetails[shopLicenseImage]", imageFiles.shopLicenseImage);
        formData.append("shopLicenseImage", imageFiles.shopLicenseImage);
      }

      // Bank details (nested and top-level)
      formData.append("bankDetails[bankName]", shopData.bankName || "");
      formData.append("bankDetails[IFSCCode]", shopData.IFSCCode || "");
      formData.append("bankDetails[accountNumber]", shopData.accountNumber || "");
      formData.append(
        "bankDetails[accountHolderName]",
        shopData.accountHolderName || ""
      );
      formData.append("bankDetails[accountType]", shopData.accountType || "");

      // also append top-level names (if backend expects these)
      formData.append("bankName", shopData.bankName || "");
      formData.append("IFSCCode", shopData.IFSCCode || "");
      formData.append("accountNumber", shopData.accountNumber || "");
      formData.append("accountHolderName", shopData.accountHolderName || "");
      formData.append("accountType", shopData.accountType || "");

      if (imageFiles.bankPassbookImage) {
        formData.append("bankDetails[bankPassbookImage]", imageFiles.bankPassbookImage);
        formData.append("bankPassbookImage", imageFiles.bankPassbookImage);
      }

      // Shop main image
      if (imageFiles.image) formData.append("image", imageFiles.image);

      // Debug: log everything so you can inspect in console before sending
      debugFormData(formData);

      const token = localStorage.getItem("token");

      // IMPORTANT: Do not set Content-Type header yourself; axios will set boundary automatically
      const response = await axios.put(
        `${BASE_URL}/shopApproval/updateApprovedShopDetails/${id}`,
        formData,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // don't set Content-Type here
          },
        }
      );

      if (response.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate(-1);
        }, 2000);
      } else {
        setError("Update failed. Unexpected response.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update shop info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Updated input list with names that match the expected keys
  const inputFields = [
    { label: "Shop Name", name: "shopName" },
    { label: "GST Number", name: "gstNumber" },
    { label: "Owner Name", name: "ownerName" },
    { label: "Mobile Number", name: "phoneNumber" },
    { label: "Email", name: "email" },
    { label: "Shop Address", name: "address" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex items-center gap-3 mb-4 bg-white p-4 md:p-5 rounded shadow">
        <BsArrowLeftCircle
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-xl font-semibold">Edit Seller Info</h2>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded-md shadow-md p-6 overflow-y-auto max-h-[80vh]">
        <div className="text-left mb-6">
          <label className="block font-semibold mb-2">Shop Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "image")}
            className="block mb-2"
          />
          {shopData.image && (
            <img
              src={shopData.image}
              alt="Shop"
              className="w-32 h-32 rounded-full object-cover border"
            />
          )}
        </div>

        <div className="space-y-4 mb-6">
          {inputFields.map((field) => (
            <div key={field.name}>
              <label className="block font-semibold mb-1">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={shopData[field.name] || ""}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">KYC Documents</h3>
          {[
            { label: "PAN Card", name: "panCardImage" },
            { label: "GST Details", name: "gstDetailsImage" },
            { label: "Shop License", name: "shopLicenseImage" },
            { label: "Bank Passbook", name: "bankPassbookImage" },
          ].map((doc) => (
            <div key={doc.name} className="mb-3">
              <label className="block mb-1">{doc.label}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, doc.name)}
                className="block mb-2"
              />
              {shopData[doc.name] && (
                <img
                  src={shopData[doc.name]}
                  alt={doc.label}
                  className="w-40 h-28 object-contain border rounded"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-yellow-400 text-red-600 font-semibold px-8 py-2 rounded hover:bg-yellow-500"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {success && <SuccessOverlay message="Shop info updated successfully!" />}
    </div>
  );
}

export default EditShopInfo;
