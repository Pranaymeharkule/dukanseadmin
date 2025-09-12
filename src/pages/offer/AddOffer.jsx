import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BsArrowLeftCircle } from "react-icons/bs";

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

export default function AddOffer() {
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [offerFor, setOfferFor] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerExpireDate, setOfferExpireDate] = useState("");
  const [products, setProducts] = useState([{ productId: "" }]);
  const [offerText, setOfferText] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [offerTerms, setOfferTerms] = useState("From 9 to 3 only");

  // Dropdown data
  const [offerForOptions, setOfferForOptions] = useState([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Save form state to sessionStorage
  const saveFormState = () => {
    const formState = {
      offerFor,
      customerType,
      discountRate,
      discountAmount,
      offerStartDate,
      offerExpireDate,
      products,
      offerText,
      offerTerms,
      // Note: bannerImage (File object) cannot be serialized, so it's excluded
    };

    try {
      sessionStorage.setItem("addOfferFormState", JSON.stringify(formState));
    } catch (e) {
      console.warn("SessionStorage not available:", e);
    }
  };

  // Load form state from sessionStorage
  const loadFormState = () => {
    try {
      const savedState = sessionStorage.getItem("addOfferFormState");
      if (savedState) {
        const formState = JSON.parse(savedState);
        setOfferFor(formState.offerFor || "");
        setCustomerType(formState.customerType || "");
        setDiscountRate(formState.discountRate || "");
        setDiscountAmount(formState.discountAmount || "");
        setOfferStartDate(formState.offerStartDate || "");
        setOfferExpireDate(formState.offerExpireDate || "");
        setProducts(formState.products || [{ productId: "" }]);
        setOfferText(formState.offerText || "");
        setOfferTerms(formState.offerTerms || "From 9 to 3 only");
        return true;
      }
    } catch (e) {
      console.warn("Error loading form state:", e);
    }
    return false;
  };

  // Clear form state from sessionStorage
  const clearFormState = () => {
    try {
      sessionStorage.removeItem("addOfferFormState");
    } catch (e) {
      console.warn("Error clearing form state:", e);
    }
  };

  useEffect(() => {
    const fetchData = async (retryCount = 0) => {
      try {
        const [offerForRes, customerRes, productRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/offer/getAllOfferFor?t=${Date.now()}`),
          axios.get(`${API_BASE_URL}/offer/getAllCustomerType?t=${Date.now()}`),
          axios.get(`${API_BASE_URL}/product/getAllProducts?page=1&limit=1000&sortOrder=desc&t=${Date.now()}`),
        ]);

        const offerForList = Array.isArray(offerForRes.data?.offerForOptions)
          ? offerForRes.data.offerForOptions.map((item) => String(item).trim())
          : [];

        const customerTypeList = Array.isArray(
          customerRes.data?.customerTypeOptions
        )
          ? customerRes.data.customerTypeOptions.map((item) =>
            String(item).trim()
          )
          : [];

        const seen = new Set();
        const productList = Array.isArray(productRes.data?.products)
          ? productRes.data.products
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
            })
          : [];

        setOfferForOptions(offerForList);
        setCustomerTypeOptions(customerTypeList);
        setProductOptions(productList);
        setError("");
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
        if (retryCount < 3) {
          setTimeout(() => fetchData(retryCount + 1), 2000);
          setError(`Loading data... Attempt ${retryCount + 1}/3`);
        } else {
          setError(
            "Failed to load data after multiple attempts. Please refresh the page."
          );
        }
      }
    };

    fetchData();
  }, []);

  // Handle form state restoration on component mount
  useEffect(() => {
    // Priority 1: Check if returning from Add Terms page (via location.state)
    if (location.state && Object.keys(location.state).length > 0) {
      const data = location.state;
      setOfferFor(data.offerFor || "");
      setCustomerType(data.customerType || "");
      setDiscountRate(data.discountRate || "");
      setDiscountAmount(data.discountAmount || "");
      setOfferStartDate(data.offerStartDate || "");
      setOfferExpireDate(data.offerExpireDate || "");
      setProducts(data.products || [{ productId: "" }]);
      setOfferText(data.offerText || "");
      setOfferTerms(data.offerTerms || "From 9 to 3 only");
      // Clear the saved state since we're using location.state
      clearFormState();
    }
    // Priority 2: Check sessionStorage for saved form state
    else {
      loadFormState();
    }
  }, [location.state]);

  // Auto-save form state whenever any field changes
  useEffect(() => {
    // Only save if we have some meaningful data
    if (
      offerFor ||
      customerType ||
      discountRate ||
      discountAmount ||
      offerStartDate ||
      offerExpireDate ||
      offerText ||
      (products.length > 0 && products.some((p) => p.productId))
    ) {
      saveFormState();
    }
  }, [
    offerFor,
    customerType,
    discountRate,
    discountAmount,
    offerStartDate,
    offerExpireDate,
    products,
    offerText,
    offerTerms,
  ]);

  const handleProductChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { productId: value };
    setProducts(updatedProducts);
  };

  const removeProductDropdown = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const addProductDropdown = () => {
    setProducts([...products, { productId: "" }]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setBannerImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !offerFor ||
      !customerType ||
      (!discountRate && !discountAmount) ||
      !offerStartDate ||
      !offerExpireDate
    ) {
      setError("⚠️ Please fill all required fields.");
      setLoading(false);
      return;
    }

    if (discountRate && (discountRate < 0 || discountRate > 100)) {
      setError("⚠️ Discount rate must be between 0 and 100.");
      setLoading(false);
      return;
    }

    // Get valid product IDs
    const validProductIds = products
      .map((p) => p.productId)
      .filter((id) => productOptions.some((po) => po._id === id));

    if (validProductIds.length === 0) {
      setError("⚠️ Please select at least one valid product.");
      setLoading(false);
      return;
    }

    // Convert product IDs to product names for the API
    const validProductNames = validProductIds
      .map((id) => {
        const product = productOptions.find((po) => po._id === id);
        return product ? product.productName : null;
      })
      .filter(Boolean); // Remove any null values

    if (validProductNames.length === 0) {
      setError("⚠️ Unable to find product names for selected products.");
      setLoading(false);
      return;
    }

    try {
      // Create FormData for the API request
      const formData = new FormData();

      // Add basic fields
      formData.append("offerFor", offerFor.trim());
      formData.append("customerType", customerType.trim());
      formData.append("offerStartDate", formatDate(offerStartDate));
      formData.append("offerExpireDate", formatDate(offerExpireDate));
      formData.append("offerText", offerText.trim());
      formData.append("offerTerms", offerTerms.trim());

      // Add discount (either rate or amount)
      if (discountRate) {
        formData.append("discountRate", discountRate);
      } else if (discountAmount) {
        formData.append("discountAmount", discountAmount);
      }

      // Add products as array with single quotes (custom format for API)
      const productsString = `['${validProductNames.join("', '")}']`;
      formData.append("products", productsString);

      // Add banner image if exists
      if (bannerImage) {
        formData.append("bannerImage", bannerImage);
      }

      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        `${API_BASE_URL}/offer/createOffer`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("API Response:", response.data);

      // Handle successful response
      if (response.data.success) {
        const offerId = response.data.offer?._id;

        setSuccess(response.data.message || "Offer added successfully!");
        setError("");
        clearFormState();
        resetForm();

        // Navigate to the created offer's view page if ID is available
        if (offerId) {
          setTimeout(() => {
            navigate(`/offer/view/${offerId}`);
          }, 1500);
        } else {
          setTimeout(() => {
            navigate("/offer");
          }, 1500);
        }
      } else {
        setError("❌ Failed to create offer. Please try again.");
      }

    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);

      setError(
        err.response?.data?.message ||
        "❌ Failed to add offer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to reset form
  const resetForm = () => {
    setOfferFor("");
    setCustomerType("");
    setDiscountRate("");
    setDiscountAmount("");
    setOfferStartDate("");
    setOfferExpireDate("");
    setProducts([{ productId: "" }]);
    setOfferText("");
    setOfferTerms("From 9 to 3 only");
    setBannerImage(null);
  };

  const handleTermsNavigation = () => {
    // Save current form state before navigation
    saveFormState();

    // Navigate to Add Terms page with current state
    navigate("/offer/add-terms", {
      state: {
        offerFor,
        customerType,
        discountRate,
        discountAmount,
        offerStartDate,
        offerExpireDate,
        products,
        offerText,
        offerTerms,
      },
    });
  };

  const handleBackNavigation = () => {
    // Clear form state when going back
    clearFormState();
    navigate(-1);
  };
  return (
    <div className="bg-gray-100 min-h-screen p-4 flex flex-col">
      {/* Sticky Header */}
      <div className="stickyflex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackNavigation}
            type="button"
            title="Go Back"
          >
            <BsArrowLeftCircle size={20} className="text-gray-700 md:text-black" />
          </button>
          <h2 className="text-lg text-gray-800 font-medium">Add Offer</h2>
        </div>
      </div>

      {/* Form */}
      <form
        id="offer-form"
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mt-2 pb-10"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* User Type */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-00 font-poppins">
            Select User Type
          </label>
          <select
            value={offerFor}
            onChange={(e) => setOfferFor(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={loading}
          >
            <option value="">-- Select --</option>
            {offerForOptions.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Type */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-600 font-poppins">
            Select Customer
          </label>
          <select
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={loading}
          >
            <option value="">-- Select --</option>
            {customerTypeOptions.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Products */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-600 font-poppins">
            Select Product
          </label>
          {products.map((product, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <select
                value={product.productId}
                onChange={(e) => handleProductChange(index, e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
                disabled={loading}
              >
                <option value="">-- Select --</option>
                {productOptions.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.productName}
                  </option>
                ))}
              </select>
              {products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProductDropdown(index)}
                  className="w-10 h-10 flex items-center justify-center text-red-500 border border-red-300 rounded hover:bg-red-50"
                  disabled={loading}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProductDropdown}
            className="text-red-600 text-sm font-medium hover:text-orange-600"
            disabled={loading}
          >
            + Add More Product
          </button>
        </div>

        {/* Discount */}
        <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <input
            type="number"
            value={discountRate}
            onChange={(e) => {
              setDiscountRate(e.target.value);
              setDiscountAmount("");
            }}
            placeholder="Enter Discount (%)"
            className="w-full border border-gray-300 p-2 rounded"
            min="0"
            max="100"
            disabled={loading}
          />
          <span className="text-center text-gray-500 font-semibold">OR</span>
          <input
            type="number"
            value={discountAmount}
            onChange={(e) => {
              setDiscountAmount(e.target.value);
              setDiscountRate("");
            }}
            placeholder="Enter Discount (₹)"
            className="w-full border border-gray-300 p-2 rounded"
            min="0"
            disabled={loading}
          />
        </div>

        {/* Dates */}
        <div className="mb-4">
          <div>
            <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
              Offer Start Date
            </label>
            <input
              type="date"
              value={offerStartDate}
              onChange={(e) => setOfferStartDate(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
              disabled={loading}
            />
          </div>
        </div>
        <div>
          <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
            Offer Expire Date
          </label>
          <input
            type="date"
            value={offerExpireDate}
            onChange={(e) => setOfferExpireDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={loading}
          />
        </div>

        {/* Offer Text */}
        <div className="mb-4 p-2">
          <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
            Offer Text
          </label>
          <textarea
            value={offerText || ""}
            onChange={(e) => setOfferText(e.target.value)}
            rows="3"
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter Offer Text"
            disabled={loading}
          />
        </div>

        {/* Banner */}
        <div className="mb-4">
          <label className="font-poppins block mb-1 text-sm font-medium text-gray-600">
            Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded"
            disabled={loading}
          />
          {bannerImage && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {bannerImage.name}
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="mb-4 text-right">
          <button
            type="button"
            onClick={handleTermsNavigation}
            className="font-poppins text-red-600 cursor-pointer inline-block border-2 border-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition-colors duration-200 font-bold"
            disabled={loading}
          >
            + Add Terms & Conditions
          </button>
        </div>
      </form>

      {/* Sticky Submit */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-md z-30 p-4 flex justify-center">
        <button
          type="submit"
          form="offer-form"
          className={`font-poppins px-6 py-2   rounded-lg text-lg font-bold shadow-md transition-colors ${loading
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-brandYellow text-red-600 hover:bg-yellow-600"
            }`}
          disabled={loading}
        >
          {loading ? "Adding Offer..." : "Add Offer"}
        </button>
      </div>
    </div>
  );
}