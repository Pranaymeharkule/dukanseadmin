import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Axios instance
const api = axios.create({
  baseURL: "https://dukanse-be-f5w4.onrender.com/api/admin",
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODM3N2Q5OTk2NGQ2ZmQ1OTJiNDVlMiIsImlhdCI6MTc1NjgxMTk1NywiZXhwIjoxNzU2ODk4MzU3fQ._bq7zlxZqZFTXTn8hdvER4DHSgtEThAmivnVN-t_1bs",
  },
});

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileFile, setProfileFile] = useState(null); // store actual file
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔹 Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/getProfile");

        if (!data.success) {
          alert(data.message);
          setLoading(false);
          return;
        }

        const admin = data.admin;
        setUser({
          fullName: admin.fullName || "",
          username: admin.userName || "",
          gender: admin.gender || "",
          email: admin.email || "",
          phone: admin.phoneNumber || "",
          profileImage: admin.profileImage || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        alert("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading || !user) return <div className="p-6 text-center">Loading...</div>;

  // 🔹 Handle input changes
  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  // 🔹 Handle image selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file); // store actual file for upload
      setUser({ ...user, profileImage: URL.createObjectURL(file) }); // preview
    }
  };

  // 🔹 Submit updated profile
  const handleSubmit = async () => {
    try {
      setUpdating(true);

      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("userName", user.username);
      formData.append("gender", user.gender);
      formData.append("email", user.email);
      formData.append("phoneNumber", user.phone);
      if (profileFile) formData.append("profileImage", profileFile); // actual file

      await api.put("/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black">
            <IoArrowBackCircleOutline size={30} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form Fields */}
          <div className="md:col-span-2 space-y-4">
            <InputField label="Full Name" name="fullName" value={user.fullName} onChange={handleChange} />
            <InputField label="Username" name="username" value={user.username} onChange={handleChange} />
            <InputField label="Gender" name="gender" value={user.gender} onChange={handleChange} />
            <InputField label="Email" name="email" value={user.email} onChange={handleChange} />
            <InputField label="Phone" name="phone" value={user.phone} onChange={handleChange} />
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover border-2 border-gray-300"
            />
            <label className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md cursor-pointer transition-colors duration-200">
              <FaUpload className="mr-2" />
              Upload
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* ✅ Save Profile Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={updating}
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200 ${
              updating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {updating ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔁 Reusable Input Component
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block font-medium text-gray-700 mb-1">{label}</label>
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
