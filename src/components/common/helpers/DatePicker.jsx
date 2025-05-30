"use client";
import React, { useEffect } from "react";
import AirDatepicker from "air-datepicker";
import localeEn from "air-datepicker/locale/en";

export const DatePicker = ({
  id,
  label,
  placeholder,
  error,
  disabled,
  onSelect,
  deps = {},
}) => {
  useEffect(() => {
    const today = new Date();
    const instance = new AirDatepicker(`#${id}`, {
      minDate: today,
      dateFormat: "MM/dd/yyyy",
      autoClose: true,
      locale: localeEn,
      onSelect: ({ date }) => {
        if (onSelect && date) {
          onSelect(date);
        }
      },
    });

    if (deps.setInstance) {
      deps.setInstance(id, instance);
    }

    return () => instance.destroy();
  }, [id, onSelect]);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[16px] font-haasBold uppercase font-medium text-secondary-alt mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className={`w-full border-b font-haasLight border-secondary-alt p-3 bg-white rounded-sm focus:outline-none shadow-sm text-secondary-alt placeholder-secondary ${
          error ? "border-b-red-500" : ""
        }`}
        autoComplete="off"
        readOnly
        disabled={disabled}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const formatDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};
