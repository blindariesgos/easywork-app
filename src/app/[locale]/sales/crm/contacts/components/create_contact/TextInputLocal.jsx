// TextInput.js
import { TextInput } from "@tremor/react";
import clsx from "clsx";
import React from "react";

function TextInputLocal({ label, id, placeholder, value, type = "text", hidden = false, errors, required = false, onChange, disabled=false }) {
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
          <TextInput
            type={type}
            name={id}
            id={id}
            value={value}
            required={required}
            disabled={disabled}
            onChange={onChange}
            placeholder={placeholder}
          />

          {errors && errors[id] && (
            <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
              {errors[id][0]}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default TextInputLocal;
