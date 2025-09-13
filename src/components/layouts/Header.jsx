import React, { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import Dummy_pic from "../../assets/dammy User Image.png";
import { useLogoutAdminMutation } from "../../redux/apis/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const dispatch = useDispatch();
  const [logoutAdmin] = useLogoutAdminMutation();

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);

  // Search state
  const [query, setQuery] = useState("");        // ✅ Make sure this exists
  const [suggestions, setSuggestions] = useState([]);  // ✅ Make sure this exists

  const routes = [
    { keyword: "dashboard", path: "/dashboard" },
    { keyword: "customer", path: "/customer" },
    { keyword: "shop", path: "/shop" },
    { keyword: "product", path: "/product" },
    { keyword: "order", path: "/order" },
    { keyword: "refer", path: "/refer" },
    { keyword: "gullak", path: "/gullak" },
    { keyword: "payment", path: "/payment" },
    { keyword: "offer", path: "/offer" },
    { keyword: "send-notification", path: "/send-notification" },
    { keyword: "helpsupport", path: "/helpSupport" },
    { keyword: "privacy-policy", path: "/privacy-policy" },
    { keyword: "terms-condition", path: "/terms-condition" },
  ];

  const handleSearch = (value) => {
    const lower = value.toLowerCase();
    setQuery(value);

    if (lower.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = routes.filter((r) => r.keyword.includes(lower));
    setSuggestions(filtered);

    const match = routes.find((r) => r.keyword === lower);
    if (match) {
      navigate(match.path);
      setSuggestions([]);
    }
  };

  // Hardcoded token
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODM3N2Q5OTk2NGQ2ZmQ1OTJiNDVlMiIsImlhdCI6MTc1Nzc1NTQ5NywiZXhwIjoxNzU4MzYwMjk3fQ.Qn5LzbMFJD4TSvnnGWGcU-JQGZVsEw6XzUeSJaYTqEA";

  // Fetch profile image from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://dukanse-be-f5w4.onrender.com/api/admin/getProfile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok && data?.admin?.profileImage) {
          setProfileImage(data.admin.profileImage);
        } else {
          console.error("Failed to fetch profile:", data?.message);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin().unwrap();
      dispatch(logout());
      toast.success("Logout successful");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  };

  const handleGoToProfile = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-brandYellow border-b flex items-center px-6 md:px-6">
      {/* ☰ Button (mobile only) */}
      <button
        className="md:hidden text-[#FF8C12] text-2xl"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <FiMenu />
      </button>

      {/* Search Bar */}
      <form
        className="flex-1 max-w-80 ml-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={query}
            className="w-full pl-12 pr-4 py-2 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-10">
              {suggestions.map((s) => (
                <li
                  key={s.path}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate(s.path);
                    setQuery("");
                    setSuggestions([]);
                  }}
                >
                  {s.keyword}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      {/* Right Section */}
      <div
        className="ml-auto flex items-center gap-6 text-black-600"
        ref={dropdownRef}
      >
        {/* Bell Icon */}
        <button
          aria-label="Notifications"
          onClick={() => navigate("/send-notification")}
          className="relative flex items-center justify-center text-2xl"
        >
          <FaRegBell />
        </button>

        {/* Profile + Dropdown */}
        <div className="relative">
          <div
            onClick={handleToggleDropdown}
            className="flex items-center gap-2"
          >
            <img
              src={profileImage || Dummy_pic}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
            <FaChevronDown className="text-sm text-gray-600" />
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-50">
              <button
                onClick={handleGoToProfile}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
