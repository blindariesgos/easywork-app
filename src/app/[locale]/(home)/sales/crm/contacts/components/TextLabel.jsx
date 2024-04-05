import React from "react";

export default function TextLabel({
  label,
  id,
  value,
  type = "text",
  edit = false,
  hidden = false,
}) {
  return (
    <div className={clsx("col-span-full", hidden && "hidden")}>
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
        <div className="mt-2">
          <input
            type={type}
            name={id}
            id={id}
            disabled={!edit}
            value={value}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
}
