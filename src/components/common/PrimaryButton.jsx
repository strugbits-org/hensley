import React from "react";

export const PrimaryButton = ({
  children = "",
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`border border-white text-white uppercase font-semibold px-6 py-2 tracking-wider bg-transparent hover:bg-white hover:text-black transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};