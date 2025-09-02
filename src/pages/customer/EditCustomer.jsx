import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SuccessOverlay from "../../components/overlay/SuccessOverlay";

const IMGUR_CLIENT_ID = "YOUR_IMGUR_CLIENT_ID"; // Replace with your Imgur client ID

const EditCustomer = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    addresses: [""], // multiple addresses
    image: "", // will hold uploaded image URL
  });

  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/adminCustomer/getCustomerDetails/${customerId}?_=${Date.now()}`,
          {
            headers: {
              "Cache-Control":
                "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        if (data.success && data.customerDetails?.profile) {
          const profile = data.customerDetails.profile;
          setFormData({
            name: profile.fullName || "",
            gender: profile.gender || "",
            dob: profile.dob ? profile.dob.split("/").reverse().join("-") : "",
            phone: profile.phoneNumber || "",
            email: profile.email || "",
            addresses: Array.isArray(profile.address)
              ? profile.address
              : [profile.address || ""],
            image: profile.image || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle address change
  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = value;
    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));
  };

  // Add new address
  const addMoreAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, ""],
    }));
  };

  // Upload image to Imgur
  // Replace your handleImageChange function with this improved version:

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!supportedTypes.includes(file.type.toLowerCase())) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB limit for preview)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create local preview URL
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };


  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.gender ||
      !formData.dob ||
      !formData.phone ||
      !formData.email ||
      formData.addresses.some((addr) => !addr.trim())
    ) {
      return alert("Please fill all fields");
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      return alert("Phone number must be exactly 10 digits");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return alert("Invalid email format");
    }

    const dobFormatted = formData.dob.split("-").reverse().join("/"); // DD/MM/YYYY

    const payload = {
      customerName: formData.name,
      gender: formData.gender,
      dateOfBirth: dobFormatted, // DD/MM/YYYY
      phoneNumber: Number(formData.phone),
      email: formData.email,
      addresses: formData.addresses.join(", "), // convert array to string
      profileImage: formData.image || "https://example.com/default-profile.png",
    };

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/adminCustomer/updateCustomerInfo/${customerId}`,
        payload
      );

      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate(`/customer/profile/${customerId}`);
        }, 2500);
      } else {
        alert("Failed to update customer info");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update customer info");
    }
  };

  if (loading) return <p className="p-4">Loading customer data...</p>;

  return (
    <div className="p-2 bg-gray-100">
      <div className="bg-white shadow p-4 border sticky top-0 z-20 flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <BsArrowLeftCircle size={30} />
        </button>
        <h2 className="text-xl font-semibold">Edit Customer Info</h2>
      </div>

      <div className="bg-white rounded-md m-2 p-4 shadow space-y-4 text-sm text-gray-800">
        {/* Image Upload */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Image (Optional)</label>
          <div className="flex items-center space-x-6">
            {/* File Input */}
            <div className="w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm border rounded p-1"
              />
              {uploading && (
                <p className="text-sm text-gray-500 mt-1">Uploading...</p>
              )}
            </div>
          </div>
          {/* Image Preview */}
          {formData.image ? (
            <img
              src={formData.image}
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full border"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full border text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>

        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Date Of Birth</label>
          <input
            type="text"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            placeholder="DD-MM-YYYY"
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        {/* Multiple Addresses */}
        <div>
          <label>Address</label>
          {formData.addresses.map((addr, index) => (
            <textarea
              key={index}
              value={addr}
              onChange={(e) => handleAddressChange(index, e.target.value)}
              rows={3}
              className="w-full border px-4 py-2 rounded mb-2"
            />
          ))}
          <button
            type="button"
            onClick={addMoreAddress}
            className="text-red-500 text-sm font-bold hover:underline"
          >
            + Add More Address
          </button>
        </div>
      </div>

      <div className="bg-white shadow border-t p-2 sticky sticky fixed bottom-0 flex justify-center gap-5">
        <button
          onClick={handleSave}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded"
        >
          Save
        </button>
        {showSuccess && (
          <SuccessOverlay message="Customer info updated successfully!" />
        )}
      </div>
    </div>
  );
};

export default EditCustomer;
