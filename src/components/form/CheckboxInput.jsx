import clsx from "clsx";
import React, { useState } from "react";
import { ImCheckmark } from "react-icons/im";
function CheckboxInput({
  label,
  error,
  disabled = false,
  name,
  register,
  setValue,
  defaultValue,
}) {
  const registerProps = register && register(name);
  const [checked, setChecked] = useState(!!defaultValue);

  return (
    <div className="flex flex-col gap-y-1 w-full">
      <label htmlFor={name} className="flex items-center gap-2">
        <div className="w-5 h-5 rounded flex justify-center items-center border border-gray-200">
          {checked && <ImCheckmark className="w-4 h-4 text-primary" />}
        </div>
        {label && (
          <p className="block text-sm font-medium leading-6 text-gray-900 px-3">
            {label}
          </p>
        )}
      </label>
      <input
        type="checkbox"
        {...registerProps}
        onChange={(e) => {
          setValue && setValue(name, e.target.checked);
          setChecked(e.target.checked);
        }}
        className="hidden"
        name={name}
        id={name}
        disabled={disabled}
      />

      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}

export default CheckboxInput;
