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
    address: "",
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
            address: profile.address || "",
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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Upload image to Imgur
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formDataImg = new FormData();
      formDataImg.append("image", file);

      const { data } = await axios.post(
        "https://api.imgur.com/3/image",
        formDataImg,
        {
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          },
        }
      );

      if (data.success && data.data.link) {
        setFormData((prev) => ({ ...prev, image: data.data.link }));
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.gender ||
      !formData.dob ||
      !formData.phone ||
      !formData.email ||
      !formData.address
    ) {
      return alert("Please fill all fields");
    }

    if (!/^\d{10,13}$/.test(formData.phone)) {
      return alert("Phone number must be 10-13 digits");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return alert("Invalid email format");
    }

    const dobFormatted = formData.dob.split("-").reverse().join("/"); // DD/MM/YYYY

    const payload = {
      customerName: formData.name,
      gender: formData.gender,
      dateOfBirth: dobFormatted,
      phoneNumber: Number(formData.phone),
      email: formData.email,
      address: formData.address,
      profileImage: formData.image || "https://example.com/default-profile.png",
    };

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/adminCustomer/updateCustomerInfo/${customerId}?_=${Date.now()}`,
        payload,
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (data.success && data.updatedCustomer) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate(`/customer/profile/${customerId}`);
        }, 2500);
      } else {
        alert("Failed to update customer info");
      }
    } catch (err) {
      console.error(err);
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
        <div className="flex flex-col items-center mb-4">
          {formData.image ? (
            <img
              src={formData.image}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full mb-2 border"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full mb-2 border">
              No Image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
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

        <div>
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
      </div>

      <div className="bg-white shadow border-t p-2 sticky bottom-0 flex justify-center gap-5">
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
