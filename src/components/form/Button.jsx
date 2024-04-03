"use client"
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React from "react";

export default function Button({label, type, icon, onclick, buttonStyle, disabled}) {

  const ButtonStyleFC = (ButtonStyleType) => {
    switch (ButtonStyleType) {
      case "primary":
        return "bg-primary hover:bg-easy-500 text-white disabled:opacity-50";
      case "secondary":
        return "text-primary bg-gray-500";
      default:
        break;
    }
  };  

  return (
    <button
      type={type}
      onClick={onclick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold shadow-sm hover:bg-easy-500 outline-none focus:outline-none ${buttonStyle && ButtonStyleFC(buttonStyle)}`}
    >
      {label}
      {icon}      
    </button>
  );
}
