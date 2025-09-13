import React from "react"; 
import { FaRegBell } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { LuUserPlus } from "react-icons/lu";
import { IoLogOut } from "react-icons/io5";
import { MdWarning } from "react-icons/md";

import logo from "../../assets/logo2.png";

// SVG icons from assets
import { ReactComponent as CustomerIcon } from "../../assets/customer.svg";
import { ReactComponent as PrivacyIcon } from "../../assets/privacy.svg";
import { ReactComponent as ShopIcon } from "../../assets/shop.svg";
import { ReactComponent as SupportIcon } from "../../assets/Support.svg";
import { ReactComponent as GullakIcon } from "../../assets/gullak.svg";
import { TbWallet } from "react-icons/tb";
import { MdPayment } from "react-icons/md";
import { FaGift } from "react-icons/fa";
import { FaBox } from "react-icons/fa";





const menuItems = [
  { label: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
  { label: "Customer", icon: <CustomerIcon />, path: "/customer", svg: true },
  { label: "Shop", icon: <ShopIcon />, path: "/shop", svg: true },
  { label: "Orders", icon: <HiOutlineShoppingCart />, path: "/order" },
  { label: "Referrals", icon: <LuUserPlus />, path: "/refer" },
  { label: "Products", icon: <FaBox />, path: "/product" },

  { label: "Gullak", icon: <GullakIcon />, path: "/Gullak", svg: true },
    { label: "Redeem Request", icon: <TbWallet />, path: "/redeem", svg: true },
{ label: "Offer", icon: <FaGift />, path: "/offer" },
  {
    label: "Send Notification",
    icon: <FaRegBell />,
    path: "/send-notification",
  },
  {
    label: "Help & Support",
    icon: <SupportIcon />,
    path: "/helpSupport",
    svg: true,
  },

  {

    label: "Risk Monitoring",
    icon: <MdWarning  />,
    path: "/monitoring",
  },
  {
    label: "Privacy Policy",
    icon: <PrivacyIcon />,
    path: "/privacy-policy",
    svg: true,
  },
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
          <img src={logo} alt="DukaanSe Logo" className="w-40 h-18" />

          <button className="text-white text-2xl md:hidden" onClick={onClose}>
            <FiMenu />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-hidden">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isLogout = item.label === "Logout";

            // Safely clone the icon element so we can inject className & style
            let renderedIcon = item.icon;
            if (React.isValidElement(item.icon)) {
              const existingClass = item.icon.props?.className ?? "";
              const className = `${existingClass} w-6 h-6`.trim();
              const baseStyle = { ...(item.icon.props?.style || {}) };

              if (item.svg) {
                // let the SVG handle its own fills/strokes
                const style = {
                  ...baseStyle,
                  color: isActive ? "#EC2D01" : "black",
                };
                renderedIcon = React.cloneElement(item.icon, { className, style });
              }
               else {
                // react-icons
                const style = {
                  ...baseStyle,
                  color: isActive ? "#EC2D01" : "black",
                };
                renderedIcon = React.cloneElement(item.icon, { className, style });
              }
            }

            return (
              <div
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  onClose(); // Close sidebar on navigation (mobile only)
                }}
                className={`flex items-center gap-5 px-4 py-2 rounded-xl cursor-pointer transition-colors
                  ${isActive ? "bg-brandYellow" : "hover:bg-brandYellow"}
                `}
                style={isLogout && !isActive ? { color: "red" } : {}}
              >
                <span className="text-lg flex items-center">
                  {renderedIcon}
                </span>
                <span
                  className="text-base font-medium"
                  style={{ color: isActive ? "#EC2D01" : "black" }}
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
