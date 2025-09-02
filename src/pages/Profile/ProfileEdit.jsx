import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import {
  useGetAdminProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/apis/authApi";

const ProfileEdit = () => {
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const {
    data: profileData,
    isLoading: profileLoading,
    refetch,
  } = useGetAdminProfileQuery();

  useEffect(() => {
    if (profileData) {
      setUser({
        fullName: profileData.fullName || "",
        username: profileData.userName || "",
        gender: profileData.gender || "",
        email: profileData.email || "",
        phone: profileData.phoneNumber || "",
        profileImage: profileData.profileImage || "",
      });
    }
  }, [profileData]);

  // 🔄 Show loading state
  if (profileLoading || !user) return <div className="p-6 text-center">Loading...</div>;

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localURL = URL.createObjectURL(file);
      setUser({ ...user, profileImage: localURL });
    }
  };

  const handleSubmit = async () => {
    try {
      await updateProfile(user).unwrap();
      refetch();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* ✅ Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center w-80">
            <div className="text-green-600 text-5xl mb-4">✅</div>
            <p className="text-lg font-semibold">
              Your information has been saved successfully!
            </p>
          </div>
        </div>
      )}

      {/* 📝 Edit Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
  <button
    onClick={() => navigate(-1)}
    className="text-gray-600 hover:text-black"
  >
    <IoArrowBackCircleOutline size={30} />
  </button>

  <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 🧾 Form Fields */}
          <div className="md:col-span-2 space-y-4">
            <InputField
              label="Full Name"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
            />
            <InputField
              label="Username"
              name="username"
              value={user.username}
              onChange={handleChange}
            />
            <InputField
              label="Gender"
              name="gender"
              value={user.gender}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            <InputField
              label="Phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />

            <button
              onClick={handleSubmit}
              disabled={updating}
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md mt-4 transition-colors duration-200 ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Saving..." : "Save Profile"}
            </button>
          </div>

          {/* 🖼️ Profile Image Upload */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover border-2 border-gray-300"
            />

            <label className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md cursor-pointer transition-colors duration-200">
              <FaUpload className="mr-2" />
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔁 Reusable Input Component
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

export default ProfileEdit;
