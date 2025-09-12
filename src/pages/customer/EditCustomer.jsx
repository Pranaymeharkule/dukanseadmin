import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GrUpload } from "react-icons/gr";
import SuccessOverlay from "../../components/overlay/SuccessOverlay";

const EditCustomer = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    addresses: [""],
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/adminCustomer/getCustomerDetails/${customerId}?_=${Date.now()}`
        );

        if (data.success && data.customerDetails?.profile) {
          const profile = data.customerDetails.profile;

          const normalizedGender =
            profile.gender?.toLowerCase() === "male"
              ? "Male"
              : profile.gender?.toLowerCase() === "female"
              ? "Female"
              : profile.gender?.toLowerCase() === "other"
              ? "Other"
              : "";

          setFormData({
            name: profile.fullName || "",
            gender: normalizedGender,
            dob: profile.dob ? profile.dob.split("/").reverse().join("-") : "",
            phone: profile.phoneNumber || "",
            email: profile.email || "",
            addresses: Array.isArray(profile.address)
              ? profile.address
              : [profile.address || ""],
            image: profile.image || "",
          });

          setPreview(profile.image || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId, API_BASE_URL]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressChange = (index, value) => {
    const updated = [...formData.addresses];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, addresses: updated }));
  };

  const addMoreAddress = () => {
    setFormData((prev) => ({ ...prev, addresses: [...prev.addresses, ""] }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a valid image file");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.gender ||
      !formData.dob ||
      !formData.phone ||
      !formData.email
    ) {
      return alert("Please fill all required fields");
    }

    const payload = {
      customerName: formData.name,
      gender: formData.gender,
      dateOfBirth: formData.dob.split("-").reverse().join("/"),
      phoneNumber: Number(formData.phone),
      email: formData.email,
      addresses: formData.addresses.join(", "),
      profileImage: preview || formData.image,
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
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex flex-col">
      {/* Sticky Header */}
      <div className="sticky bg-white top-0 z-50">
        <div className="max-w-7xl bg-white px-4 py-4 rounded-lg sticky top-4 z-10 flex items-center gap-3 shadow-sm">
          <BsArrowLeftCircle
            className="text-2xl cursor-pointer text-gray-700 hover:text-gray-900"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-lg text-gray-800 font-poppins font-medium">
            Edit Customer Info
          </h2>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-md shadow flex-1 flex flex-col min-h-0 mt-4">
        {/* Scrollable Content */}
        <div className="flex-1 px-4 md:px-6 py-6 overflow-y-auto min-w-[320px] md:min-w-[700px]">
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 font-poppins">
              Image (Optional)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="w-full sm:w-auto h-[65px] flex items-center gap-2 p-4 border border-[#EEEEEE] bg-white font-poppins font-normal text-[16px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full sm:w-auto text-[16px] font-poppins font-normal text-[#EEEEEE]"
                />
                {uploading && (
                  <p className="text-[16px] text-gray-500 mt-1 font-poppins font-normal">
                    Uploading...
                  </p>
                )}
              </div>

              {/* Image Preview */}
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-[140px] h-[140px] object-cover rounded-full border mt-3 sm:mt-0"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full border text-xs text-gray-500 mt-3 sm:mt-0">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-3 text-sm text-gray-800">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 font-poppins">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-[40px] flex gap-2 p-4 border border-[#EEEEEE]"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 font-poppins">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#EEEEEE] rounded-md text-gray-700"
              >
                <option value="" className="text-gray-400">
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 font-poppins">
                Date Of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full h-[40px] flex gap-2 p-4 border border-[#EEEEEE]"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 font-poppins">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-[40px] flex gap-2 p-4 border border-[#EEEEEE]"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 font-poppins">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-[40px] flex gap-2 p-4 border border-[#EEEEEE]"
              />
            </div>

            {/* Addresses */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 font-poppins">
                Address
              </label>
              {formData.addresses.map((addr, i) => (
                <textarea
                  key={i}
                  value={addr}
                  onChange={(e) => handleAddressChange(i, e.target.value)}
                  rows={3}
                  className="w-full flex gap-2 p-4 border border-[#EEEEEE] mb-2"
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
        </div>

        {/* Sticky Save Button */}
        <div className="sticky bottom-0 z-50 bg-white py-4 border-t">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 px-4">
            <button
              onClick={handleSave}
              className="bg-[#FEBC1D] text-red-600 font-semibold px-6 py-2 rounded-md hover:bg-yellow-500"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Save
            </button>
            {showSuccess && (
              <SuccessOverlay message="Customer info updated successfully!" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
