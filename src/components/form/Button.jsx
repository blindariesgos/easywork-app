"use client"
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React from "react";

export default function Button({label, type, icon, onclick}) {


  return (
    <button
      type={type}
      onClick={onclick}
      className="flex rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-easy-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      { label }
      {icon}      
    </button>
  );
}
