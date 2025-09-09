import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 👉 Your JWT Token
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODM3N2Q5OTk2NGQ2ZmQ1OTJiNDVlMiIsImlhdCI6MTc1NzA2Njk2NiwiZXhwIjoxNzU3NjcxNzY2fQ.g2ie8SGnFDNvkayFkXh1-s9HE4ecGFPlMIL62V0QTxE";

  // 🔹 Fetch profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://dukanse-be-f5w4.onrender.com/api/admin/getProfile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (data.success && data.admin) {
          setUser({
            firstName: data.admin.fullName?.split(" ")[0] || "",
            lastName: data.admin.fullName?.split(" ")[1] || "",
            userName: data.admin.userName || "",
            gender: data.admin.gender || "",
            email: data.admin.email || "",
            phoneNumber: data.admin.phoneNumber || "",
            password: data.admin.password || "", // ✅ password from backend
            profileImage: data.admin.profileImage || "",
          });
        } else {
          console.error("Failed to fetch profile:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading || !user) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localURL = URL.createObjectURL(file);
      setUser({ ...user, profileImage: localURL });
      setImageFile(file); // keep file for API upload
    }
  };

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("userName", user.userName);
      formData.append("gender", user.gender);
      formData.append("email", user.email);
      formData.append("phoneNumber", user.phoneNumber);
      formData.append("password", user.password); // ✅ send password back
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const res = await fetch(
        "https://dukanse-be-f5w4.onrender.com/api/admin/updateProfile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Authorization
          },
          body: formData, // ✅ form-data
        }
      );

      const data = await res.json();
      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/profile");
        }, 2000);
      } else {
        alert("Failed to update: " + data.message);
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className=" bg-gray-100 min-h-screen relative">
      {/* ✅ Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center border border-gray-200">
            {/* Green Circle with Tick */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full border-4 border-green-500 mb-4">
              <span className="text-green-500 text-3xl">✔</span>
            </div>

            {/* Success Text */}
            <p className="text-gray-800 font-medium text-base">
              Your Information has been saved successfully !
            </p>
          </div>
        </div>
      )}

      {/* 📝 Edit Profile Card */}
      <div className="bg-gray-100 min-h-screen p-4 md:p-6">
        {/* Back Header */}
        <div className="flex items-center mb-4 bg-white p-4 md:p-5 rounded shadow">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <BsArrowLeftCircle
                size={25}
                className="text-gray-700 md:text-black"
              />
            </button>
            <h2 className="text-lg md:text-xl font-semibold"> Edit Admin Profile</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow min-h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 🧾 Form Fields */}
            <div className="md:col-span-2 space-y-4">
              <InputField
                label="First Name"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
              {/* ✅ Password Field with toggle */}
              <PasswordField
                label="Password"
                name="password"
                value={user.password}
                onChange={handleChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              <InputField
                label="Phone"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* 🖼️ Profile Image Upload */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <img
                src={user.profileImage || "/default-avatar.png"}
                alt="Profile"
                className="rounded-full w-32 h-32 object-cover border-2 border-gray-300"
              />

              <label className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-red-600 font-semibold px-4 py-2 rounded-md cursor-pointer transition-colors duration-200">
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
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={updating}
              className={`bg-yellow-400 hover:bg-yellow-500 text-red-600 font-semibold px-6 py-2 rounded-md mt-4 transition-colors duration-200 ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔁 Reusable Input Component
const InputField = ({ label, name, value, onChange }) => (
  <div className="flex items-center gap-4">
    <label htmlFor={name} className="w-32 font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
    />
  </div>
);

// 🔁 Password Field Component with Eye Toggle
const PasswordField = ({ label, name, value, onChange, showPassword, setShowPassword }) => (
  <div className="flex items-center gap-4">
    <label htmlFor={name} className="w-32 font-medium text-gray-700">
      {label}
    </label>
    <div className="flex-1 relative">
      <input
        type={showPassword ? "text" : "password"}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-3 flex items-center text-gray-600"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  </div>
);

export default ProfileEdit;
