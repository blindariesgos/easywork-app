import clsx from "clsx";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const InputPhone = ({
  error,
  label,
  defaultValue,
  field,
  disabled,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-900">{label}</label>
      )}
      <div className="focus:ring-0">
        <div className="relative">
          <PhoneInput
            {...field}
            country={"mx"}
            autoFormat={false}
            inputStyle={{
              paddingTop: "12px",
              paddingBottom: "12px",
              height: "36px",
              width: "100%",
              border: "none",
              borderRadius: "0.5rem",
              outline: "none",
              fontSize: "14px",
            }}
            inputClass={clsx({
              "bg-gray-100": disabled,
              "drop-shadow-md": !disabled,
            })}
            buttonStyle={{
              borderRadius: "0.5rem 0 0 0.5rem",
              border: "none",
            }}
            buttonClass="!border !border-[#98a2b3] first:hover:!bg-primary"
            containerStyle={{
              borderRadius: "0.5rem",
            }}
            dropdownStyle={{
              borderRadius: "0.5rem",
            }}
            searchStyle={{
              borderRadius: "0.5rem",
              padding: 10,
            }}
            enableSearch
            disableSearchIcon
            value={defaultValue}
            disabled={disabled}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </div>
    </div>
  );
};

export default InputPhone;
