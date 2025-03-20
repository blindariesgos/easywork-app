"use client";
import React from "react";

export default function Button({
  label,
  type,
  iconLeft,
  icon,
  onclick,
  buttonStyle,
  disabled,
  className,
  fontSize = "text-xs",
}) {
  const ButtonStyleFC = (ButtonStyleType) => {
    switch (ButtonStyleType) {
      case "primary":
        return "bg-primary hover:bg-easy-500 text-white disabled:opacity-50 hover:bg-easy-500 shadow-sm text-sm";
      case "secondary":
        return "text-primary bg-zinc-200 shadow-xs text-sm hover:text-white";
      case "error":
        return `text-white bg-[#CE0000] text-sm hover:bg-primary ${fontSize}`;
      case "text":
        return `text-gray-400 bg-transparent underline ${fontSize} `;
      case "outlined":
        return "text-primary border border-primary";
      case "green":
        return `text-black bg-green-primary hover:bg-green-100 ${fontSize}`;
      default:
        break;
    }
  };

  return (
    <button
      type={type}
      onClick={onclick}
      disabled={disabled}
      className={`flex items-center gap-x-2 rounded-md ${className} font-medium outline-none  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 justify-center ${
        buttonStyle && ButtonStyleFC(buttonStyle)
      }`}
    >
      {iconLeft}
      {label}
      {icon}
    </button>
  );
}
