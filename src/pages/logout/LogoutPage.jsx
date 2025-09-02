import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoSignOut } from "react-icons/go";
import Logo from "../../assets/logo.png"

export default function LogoutPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    setTimeout(() => {
      alert("Logout successful ");
      sessionStorage.removeItem("admin_token");
      // or use sessionStorage.clear() to clear all
      navigate("/");
      setLoading(false);
    }, 1000); // simulate delay
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="relative max-w-full min-h-screen overflow-y-auto">
      {/* Background image layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('../src/assets/images/Bg-logout.png')",
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Orange overlay to dull the background */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "#FF8C12", opacity: 0.9 }}
      />

      {/* Foreground content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center p-4">
        {/* Logo */}
        <img
          src={Logo}
          alt="Brand Logo"
          
        />

        {/* Logout icon */}
        <div className="text-white text-3xl md:text-4xl mb-4">
          <GoSignOut />
        </div>

        {/* Confirmation text */}
        <h2 className="text-white text-base md:text-2xl font-bold mb-6 text-center">
          Confirm Logout?
        </h2>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-[300px] md:max-w-none justify-center items-center">
          <button
            onClick={handleCancel}
            className="bg-white text-[#FF8C12] px-6 py-2 rounded-md font-semibold w-full md:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-[#FF8C12] px-6 py-2 rounded-md font-semibold w-full md:w-auto"
            disabled={loading}
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
