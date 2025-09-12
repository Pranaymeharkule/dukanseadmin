import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, Plus, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BsArrowLeftCircle } from "react-icons/bs";

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

export default function EditOffer() {
  const navigate = useNavigate();
  const { offerId } = useParams();

  // Form states
  const [offerFor, setOfferFor] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [products, setProducts] = useState([{ productId: "" }]);
  const [bannerImage, setBannerImage] = useState(null);
  const [existingBanner, setExistingBanner] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [offerText, setOfferText] = useState("");

  // Options states
  const [offerForOptions, setOfferForOptions] = useState([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Date formatting utilities
  const formatDDMMYYYYToYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
    return "";
  };

  const formatYYYYMMDDToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Memoize processed product options to avoid reprocessing
  const processedProductOptions = useMemo(() => {
    const seen = new Set();
    return productOptions
      .filter((p) => p._id && p.productName)
      .map((p) => ({
        _id: String(p._id).trim(),
        productName: String(p.productName).trim(),
      }))
      .filter((p) => {
        const lower = p.productName.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });
  }, [productOptions]);

  // Optimized data fetching with better error handling and timeouts
  useEffect(() => {
    const fetchData = async () => {
      if (!offerId) {
        setError("Invalid offer ID");
        setLoading(false);
        return;
      }

      if (!API_BASE_URL) {
        setError("API configuration missing. Please check your environment variables.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Add timeout to requests (10 seconds)
        const timeout = 10000;
        const axiosConfig = {
          timeout,
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        };

        // Use Promise.allSettled instead of Promise.all for better error handling
        const [offerRes, offerForRes, customerRes, productRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/offer/getOffersById/${offerId}`, axiosConfig),
          axios.get(`${API_BASE_URL}/offer/getAllOfferFor`, axiosConfig),
          axios.get(`${API_BASE_URL}/offer/getAllCustomerType`, axiosConfig),
          axios.get(`${API_BASE_URL}/offer/getAllProducts`, axiosConfig),
        ]);

        // Check if main offer request failed
        if (offerRes.status === 'rejected') {
          console.error("Failed to fetch offer:", offerRes.reason);
          throw new Error(`Failed to load offer: ${offerRes.reason?.response?.data?.message || offerRes.reason?.message || 'Network error'}`);
        }

        const offerData = offerRes.value.data?.offer || offerRes.value.data?.data || offerRes.value.data;
        if (!offerData) {
          throw new Error("Offer not found");
        }

        // Set offer data
        setOfferFor(offerData.offerFor || "");
        setCustomerType(offerData.customerType || "");
        setDiscountRate(
          offerData.discountRate
            ? String(offerData.discountRate).replace("%", "").trim()
            : ""
        );
        setDiscountAmount(
          offerData.discountAmount != null ? String(offerData.discountAmount) : ""
        );
        setStartDate(formatDDMMYYYYToYYYYMMDD(offerData.offerStartDate || ""));
        setExpireDate(formatDDMMYYYYToYYYYMMDD(offerData.offerExpireDate || ""));
        setOfferText(offerData.offerText || "");
        setExistingBanner(offerData.bannerImage || "");

        // Process dropdown options with fallbacks
        const offerForList = offerForRes.status === 'fulfilled' && Array.isArray(offerForRes.value.data?.offerForOptions)
          ? offerForRes.value.data.offerForOptions.map((item) => String(item).trim())
          : [];

        const customerTypeList = customerRes.status === 'fulfilled' && Array.isArray(customerRes.value.data?.customerTypeOptions)
          ? customerRes.value.data.customerTypeOptions.map((item) => String(item).trim())
          : [];

        const rawProductList = productRes.status === 'fulfilled' && Array.isArray(productRes.value.data?.products)
          ? productRes.value.data.products
          : [];

        setOfferForOptions(offerForList);
        setCustomerTypeOptions(customerTypeList);
        setProductOptions(rawProductList);

        // Set selected products after productOptions is set
        if (offerData.products && offerData.products.length > 0) {
          // Wait for next tick to ensure productOptions is processed
          setTimeout(() => {
            const productsArray = offerData.products.map((productName) => {
              const matchedProduct = rawProductList.find(
                (p) => p.productName && p.productName.toLowerCase() === String(productName).toLowerCase()
              );
              return {
                productId: matchedProduct ? matchedProduct._id : "",
              };
            });
            const validProducts = productsArray.filter((p) => p.productId);
            setProducts(validProducts.length > 0 ? validProducts : [{ productId: "" }]);
          }, 0);
        } else {
          setProducts([{ productId: "" }]);
        }

        // Log any failed requests (but don't throw errors for optional data)
        if (offerForRes.status === 'rejected') {
          console.warn("Failed to fetch offer for options:", offerForRes.reason);
        }
        if (customerRes.status === 'rejected') {
          console.warn("Failed to fetch customer type options:", customerRes.reason);
        }
        if (productRes.status === 'rejected') {
          console.warn("Failed to fetch product options:", productRes.reason);
        }

      } catch (err) {
        console.error("Failed to fetch data:", err);

        let errorMessage = "Failed to load data. ";
        if (err.code === 'ECONNABORTED') {
          errorMessage += "Request timeout. Please check your connection and try again.";
        } else if (err.response?.status === 404) {
          errorMessage += "Offer not found.";
        } else if (err.response?.status >= 500) {
          errorMessage += "Server error. Please try again later.";
        } else if (err.message) {
          errorMessage += err.message;
        } else {
          errorMessage += "Please try again.";
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [offerId]); // Remove API_BASE_URL from dependencies as it shouldn't change

  // Handlers
  const handleProductChange = (index, value) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index].productId = value;
      return updated;
    });
  };

  const addProductDropdown = () => {
    setProducts((prev) => [...prev, { productId: "" }]);
  };

  const removeProductDropdown = (index) => {
    if (products.length > 1) {
      setProducts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }
      setBannerImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!offerFor || !customerType || (!discountRate && !discountAmount) || !startDate || !expireDate) {
      setError("⚠️ Please fill all required fields.");
      return;
    }

    if (discountRate && (discountRate < 0 || discountRate > 100)) {
      setError("⚠️ Discount rate must be between 0 and 100.");
      return;
    }

    if (new Date(expireDate) <= new Date(startDate)) {
      setError("⚠️ End date must be after start date.");
      return;
    }

    const validProducts = products
      .filter((p) => p.productId)
      .map((p) => {
        const prod = processedProductOptions.find((po) => po._id === p.productId);
        return prod ? prod.productName : null;
      })
      .filter((name) => name !== null);

    if (!validProducts.length) {
      setError("⚠️ Please select at least one product.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("offerFor", offerFor.trim());
      formData.append("customerType", customerType.trim());
      formData.append("products", JSON.stringify(validProducts));

      if (discountRate) {
        formData.append("discountRate", discountRate);
      } else if (discountAmount) {
        formData.append("discountAmount", discountAmount);
      }

      formData.append("offerStartDate", formatYYYYMMDDToDDMMYYYY(startDate));
      formData.append("offerExpireDate", formatYYYYMMDDToDDMMYYYY(expireDate));
      formData.append("offerText", offerText.trim());

      if (bannerImage) {
        formData.append("bannerImage", bannerImage);
      }

      await axios.put(`${API_BASE_URL}/offer/updateOffer/${offerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000, // 30 seconds for file upload
      });

      setSuccess("Offer updated successfully!");
      setTimeout(() => {
        navigate("/offer");
      }, 1500);
    } catch (err) {
      console.error("Error updating offer:", err);

      let errorMessage = "Failed to update offer. ";
      if (err.code === 'ECONNABORTED') {
        errorMessage += "Request timeout. Please try again.";
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += "Please try again.";
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state with better UX
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading offer details...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 relative">
      {/* Success Overlay */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-sm w-full">
            <div className="flex justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-20 h-20 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-800">{success}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
        <button onClick={() => navigate(-1)} title="Go Back">
          <BsArrowLeftCircle size={20} className="text-gray-700 md:text-black" />
        </button>
        <h2 className="ml-2 text-lg text-gray-800 font-medium">Edit Offer</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mt-2 pb-10">
        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4 border border-red-200">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Select User Type */}
        <div className="mb-4">
          <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
            Select User Type <span className="text-red-500">*</span>
          </label>
          <select
            value={offerFor}
            onChange={(e) => setOfferFor(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Select --</option>
            {offerForOptions.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Select Customer */}
        <div className="mb-4">
          <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
            Select Customer <span className="text-red-500">*</span>
          </label>
          <select
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Select --</option>
            {customerTypeOptions.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Select Products */}
        <div className="mb-4">
          <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
            Select Product <span className="text-red-500">*</span>
          </label>
          {products.map((product, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <select
                value={product.productId}
                onChange={(e) => handleProductChange(index, e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Select --</option>
                {processedProductOptions.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.productName}
                  </option>
                ))}
              </select>

              {products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProductDropdown(index)}
                  className="w-10 h-10 flex items-center justify-center text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition"
                  title="Remove product"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addProductDropdown}
            className="text-red-600 text-sm font-medium flex items-center hover:text-red-800 transition"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add More Product
          </button>
        </div>

        {/* Discount */}
        <div className="mb-4">
          <label className="font-poppins block mb-2 text-sm font-medium text-gray-600">
            Discount <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="number"
              placeholder="Enter Discount (%)"
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={discountRate}
              onChange={(e) => {
                setDiscountRate(e.target.value);
                setDiscountAmount("");
              }}
              min="0"
              max="100"
            />
            <span className="text-center text-gray-500 font-semibold">OR</span>
            <input
              type="number"
              placeholder="Enter Discount (₹)"
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={discountAmount}
              onChange={(e) => {
                setDiscountAmount(e.target.value);
                setDiscountRate("");
              }}
              min="0"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="mb-4">
          <div>
            <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
              Offer Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
        </div>
        <div>
          <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
            Offer Expire Date
          </label>
          <input
            type="date"
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        {/* Offer Text */}
        <div className="mb-4">
          <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
            Offer Text
          </label>
          <textarea
            value={offerText}
            onChange={(e) => setOfferText(e.target.value)}
            rows="3"
            className="w-full border border-gray-300 p-2 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter offer description..."
          />
        </div>

        {/* Banner */}
        <div className="mb-6">
          <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
            Banner Image
          </label>
          {existingBanner && !bannerImage && (
            <div className="mb-3">
              <img
                src={existingBanner}
                alt="Current Banner"
                className="w-32 h-20 object-cover rounded border"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
        </div>

        {/* Edit Terms */}
        <div className="mb-4 text-right">
          <Link
            to={`/offer/edit-terms/${offerId}`}
            className="font-poppins text-sm text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50 transition"
          >
            Edit Terms & Conditions
          </Link>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#FEBC1D] text-red-600 font-semibold px-6 py-2 rounded-md hover:bg-yellow-500"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></span>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}