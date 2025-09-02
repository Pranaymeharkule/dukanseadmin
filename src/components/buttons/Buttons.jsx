import React from "react";

export default function Button({
  children,
  onClick,
  loading,
  variant = "filled",
  className = "",
}) {
  const baseClasses = "rounded-md font-medium transition duration-200";

  const filledStyle = "bg-[#FF8C12] text-white hover:brightness-110";
  const outlinedStyle =
    "bg-white text-[#FF8C12] border border-[#FF8C12] hover:bg-[#FFF4E6]";

  const finalStyle = variant === "outlined" ? outlinedStyle : filledStyle;

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${finalStyle} ${className}`}
      disabled={loading}
    >
      {children}
    </button>
  );
}
