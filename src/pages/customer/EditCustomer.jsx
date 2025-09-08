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

          // normalize gender value
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
      <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-md shadow mb-4 sticky top-0 z-20">
        <BsArrowLeftCircle
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Customer Info
        </h2>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-md shadow flex-1 flex flex-col min-h-0">
        {/* Scrollable Content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto min-w-[700px]">
          {/* Image Upload */}
          <div className="mb-4">
            <label className="font-poppins font-semibold text-[20px] align-middle text-[#262626]">
              Image (Optional)
            </label>
            <div className="flex items-center space-x-6">
              <div
                className="w-full h-[65px] flex items-center gap-2 p-4 border border-[#EEEEEE] bg-white opacity-100 
                 font-poppins font-normal text-[16px] leading-[100%] align-middle"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-[16px] font-poppins font-normal leading-[100%] align-middle text-[#EEEEEE]"
                />
                {uploading && (
                  <p className="text-[16px] text-gray-500 mt-1 font-poppins font-normal leading-[100%] align-middle">
                    Uploading...
                  </p>
                )}
              </div>
            </div>
            {/* Image Preview */}
            {formData.image ? (
              <img
                src={formData.image}
                alt="Profile"
                className="w-[160px] h-[160px] object-cover rounded-full border mt-3"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full border text-xs text-gray-500 mt-3">
                No Image
              </div>
            )}
          </div>

          {/* Inputs */}
          <div className="space-y-3 text-sm text-gray-800">
            <div>
              <label className="font-poppins font-semibold text-[20px] text-[#262626]">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-[40px] flex gap-2 p-4 border border-[#EEEEEE] opacity-100"
              />
            </div>
            <div>
              <label className="font-poppins font-semibold text-[20px] text-[#262626]">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-[40px] flex gap-2 p-4 border border-[#EEEEEE] opacity-100"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-poppins font-semibold text-[20px] text-[#262626]">
                Date Of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full h-[40px] flex gap-2 p-4 border border-[#EEEEEE] opacity-100"
              />
            </div>
            <div>
              <label className="font-poppins font-semibold text-[20px] text-[#262626]">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-[40px] flex gap-2 p-4 border border-[#EEEEEE] opacity-100"
              />
            </div>
            <div>
              <label className="font-poppins font-semibold text-[20px] text-[#262626]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-[40px] flex gap-2 p-4 border border-[#EEEEEE] opacity-100"
              />
            </div>

            {/* Addresses */}
            <div>
              <label className="font-poppins font-semibold text-[20px] text-[#262626]">
                Address
              </label>
              {formData.addresses.map((addr, i) => (
                <textarea
                  key={i}
                  value={addr}
                  onChange={(e) => handleAddressChange(i, e.target.value)}
                  rows={3}
                  className="w-full flex gap-2 p-4 border border-[#EEEEEE] opacity-100 mb-2"
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

        {/* Sticky Save Button inside card */}
        <div className="bg-white px-4 py-3 sticky bottom-0 z-10 border-t flex justify-center">
          <button
            className="w-[200px] h-[50px] bg-brandYellow rounded-[10px] px-[10px] py-[10px] flex items-center justify-center gap-2 hover:opacity-90 transition"
            onClick={handleSave}
          >
            <span className="font-[Poppins] text-[#EC2D01] font-semibold text-[20px] leading-[100%] tracking-normal text-center align-middle">
              Save
            </span>
          </button>
          {showSuccess && (
            <SuccessOverlay message="Customer info updated successfully!" />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
