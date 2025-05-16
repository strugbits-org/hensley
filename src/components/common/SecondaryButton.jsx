import React from "react";

export const SecondaryButton = ({
  children = "",
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-48 lg:min-w-72 p-5 border border-white text-white uppercase tracking-widest [word-spacing:3px] text-sm hover:font-semibold hover:bg-secondary-alt transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};