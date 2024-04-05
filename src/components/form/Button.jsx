"use client"
import React from "react";

export default function Button({label, type, iconLeft, icon, onclick, buttonStyle, disabled, className}) {

  const ButtonStyleFC = (ButtonStyleType) => {
    switch (ButtonStyleType) {
      case "primary":
        return "bg-primary hover:bg-easy-500 text-white disabled:opacity-50 hover:bg-easy-500 shadow-sm text-sm";
      case "secondary":
        return "text-primary bg-gray-500 shadow-sm text-sm";
      case "text":
        return "text-gray-60 bg-transparent text-xs";
      default:
        break;
    }
  };  

  return (
    <button
      type={type}
      onClick={onclick}
      disabled={disabled}
      className={`flex items-center gap-x-2 rounded-md ${className} font-semibold outline-none focus:outline-none ${buttonStyle && ButtonStyleFC(buttonStyle)}`}
    >
      {iconLeft} 
      {label}
      {icon}      
    </button>
  );
}
