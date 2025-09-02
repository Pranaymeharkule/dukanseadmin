import React from "react";
import {
  FaUser,

  FaShieldAlt,
  FaRegBell,
 
  FaBox,
 
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import {
  MdDashboard,
  MdPayment,
  MdOutlineHeadsetMic,
  MdNewspaper,
} from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

import { BsTagFill } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

import { FaShop } from "react-icons/fa6";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { LuUserPlus } from "react-icons/lu";
import { GiReceiveMoney } from "react-icons/gi";
import logo from "../../assets/logo2.png";


const menuItems = [
  { label: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
  { label: "Customer", icon: <FaUser />, path: "/customer" },
  { label: "Shop", icon: <FaShop />, path: "/shop" },
  { label: "Products", icon: <FaBox />, path: "/product" },
  { label: "Orders", icon: <HiOutlineShoppingCart />, path: "/order" },
  { label: "Referrals", icon: <LuUserPlus />, path: "/refer" },
{ label: "Gullak", icon: <GiReceiveMoney />, path: "/Gullak" },
  { label: "Payment", icon: <MdPayment />, path: "/payment" },
  { label: "Offer", icon: <BsTagFill />, path: "/offer" },
   {
    label: "Send Notification",
    icon: <FaRegBell />,
    path: "/send-notification",
  },
  
  {
    label: "Help & Support",
    icon: <MdOutlineHeadsetMic />,
    path: "/helpSupport",
  },
 
  { label: "Privacy Policy", icon: <FaShieldAlt />, path: "/privacy-policy" },
  {
    label: "Terms & Conditions",
    icon: <IoMdSettings />,
    path: "/terms-condition",
  },
  
  
 
  // { label: "Logout", icon: <IoLogOut />, path: "/logout" },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur bg-opacity-100 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed z-40 top-0 left-0 h-full w-72 bg-white flex flex-col transform transition-transform duration-300 
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:z-0`}
      >
        {/* Logo */}
        <div className="bg-brandYellow  h-16 px-4 flex items-center justify-between">
           <img src={logo} alt="DukaanSe Logo" className="w-40 h-18"></img>

          <button className="text-white text-2xl md:hidden" onClick={onClose}>
            <FiMenu />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-hidden">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isLogout = item.label === "Logout";

            return (
              <div
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  onClose(); // Close sidebar on navigation (mobile only)
                }}
                className={`flex items-center gap-5 px-4 py-2 rounded-xl cursor-pointer transition-colors
                  ${
                    isActive
                      ? "bg-brandYellow text-[#EC2D01]"
                      : "bg- hover:bg-brandYellow "
                  }
                `}
                style={isLogout && !isActive ? { color: "red" } : {}}
              >
                <span
                  className="text-lg"
                  style={isLogout ? { color: "red" } : {}}
                >
                  {item.icon}
                </span>
                <span
                  className="text-base font-medium"
                  style={isLogout ? { color: "red" } : {}}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
