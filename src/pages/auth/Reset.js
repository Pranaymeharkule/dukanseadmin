import React, { useState } from "react";
import logo from "../../assets/logo.png"; // Adjust if path differs
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useResetPasswordMutation } from "../../redux/apis/authApi";

export default function Reset() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // const handleReset = () => {
  //   toast.success("Password reset successful");
  //   navigate("/"); // Update the route as needed
  // };
  const location = useLocation();
  const email = location.state?.email; // email from previous page

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleReset = async () => {
    if (!email) {
      toast.error("Email not found. Please go back.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ email, newPassword, confirmPassword }).unwrap();
      toast.success("Password reset successful");
      navigate("/");
    } catch (err) {
      console.error("Reset error:", err);
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-brandYellow flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="DukaanSe Logo" className="w-40  h-auto" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your new password below, <br />
          and you're all set to go!
        </p>

        {/* New Password */}
        <div className="mb-4 relative">
          <label className="text-sm text-gray-700">Enter Password</label>
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="..........."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEBC1D]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="mb-6 relative">
          <label className="text-sm text-gray-700">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="..........."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEBC1D]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="w-full bg-[#FEBC1D] text-white font-semibold py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Continue"}
        </button>

      </div>
    </div>
  );
}
