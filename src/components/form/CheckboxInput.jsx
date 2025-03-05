import clsx from "clsx";
import { Checkbox, Field, Label } from "@headlessui/react";
import React, { use, useEffect, useState } from "react";
import { ImCheckmark } from "react-icons/im";
function CheckboxInput({
  label,
  error,
  disabled,
  name,
  setValue,
  defaultValue,
  fullWidth,
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setValue && setValue(name, checked);
  }, [checked]);

  useEffect(() => {
    setChecked(defaultValue);
  }, [defaultValue]);

  return (
    <div
      className={clsx("flex flex-col gap-y-1", {
        "w-full": fullWidth,
      })}
    >
      <Field className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          onChange={setChecked}
          disabled={disabled}
          className="w-5 h-5 rounded flex justify-center items-center border border-gray-200"
        >
          {checked && <ImCheckmark className="w-4 h-4 text-primary" />}
        </Checkbox>
        {label && (
          <Label className="block text-sm font-medium leading-6 text-gray-900">
            {label}
          </Label>
        )}
      </Field>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}

export default CheckboxInput;
