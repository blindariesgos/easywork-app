import clsx from "clsx";
import React from "react";

export default function TextareaLabel({
  label,
  id,
  placeholder,
  value,
  edit = false,
  hidden = false,
}) {
  return (
    <div className={clsx("col-span-full", hidden && "hidden")}>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          id={id}
          name={id}
          rows={3}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
          value={value}
        />
      </div>
      {/* <p className="mt-1 text-sm leading-6 text-gray-400">
        {`Escriba la ${label.toLowerCase()} del cliente.`}
      </p> */}
    </div>
  );
}
