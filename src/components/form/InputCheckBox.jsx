import React from "react";

export default function InputCheckBox({
  setChecked,
  checked,
  label,
  className,
  disabled,
}) {
  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-primary focus:text-primary bg-gray-100 focus:ring-primary"
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          setChecked(e.target.checked);
        }}
      />
      {label && (
        <label className="text-sm font-normal leading-6 text-black">
          {label}
        </label>
      )}
    </div>
  );
}
