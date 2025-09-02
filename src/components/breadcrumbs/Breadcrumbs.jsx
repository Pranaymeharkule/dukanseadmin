import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowCircleLeft } from "react-icons/hi";

export default function Breadcrumb({ titles = [], showBack = true, backTo }) {
  const navigate = useNavigate();
  const lastIndex = titles.length - 1;

  return (
    <div className="flex items-center space-x-3 text-gray-800 mb-7">
      {showBack && (
        <button
          onClick={() => {
            backTo ? navigate(backTo) : navigate(-1);
          }}
          className=" text-3xl cursor-pointer "
        >
          <HiOutlineArrowCircleLeft />
        </button>
      )}

      <h2 className="text-xl flex items-center flex-wrap">
        {titles.map((title, index) => (
          <span
            key={index}
            className={`${
              titles.length > 1 && index === lastIndex
                ? "font-semibold"
                : "font-semibold"
            }`}
          >
            {title}
            {index < lastIndex && <span className="mx-1">{">"}</span>}
          </span>
        ))}
      </h2>
    </div>
  );
}
