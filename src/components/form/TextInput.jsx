import clsx from "clsx";
import React from "react";

function TextInput({
  label,
  placeholder,
  type = "text",
  error,
  onChangeCustom,
  disabled = false,
  name,
  register,
  value,
  multiple,
  border,
  ...props
}) {
  const registerProps = register && register(name);
  return (
    <div className="flex flex-col gap-y-1 w-full">
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900 px-3">
          {label}
        </label>
      )}
      <div className="">
        {multiple ? (
          <textarea
            autoComplete="off"
            {...registerProps}
            type={type}
            name={name}
            disabled={disabled}
            value={value}
            onChange={(e) => {
              registerProps && registerProps.onChange(e);
              onChangeCustom && onChangeCustom(e);
            }}
            placeholder={placeholder}
            rows={5}
            {...props}
            className={clsx(
              "w-full resize-none outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md placeholder:text-xs focus:ring-0 text-sm",
              {
                "border border-gray-200 focus:ring-gray-200 focus:outline-0":
                  border,
                "border-none focus:ring-0 ": !border,
                "drop-shadow-sm": !disabled,
              }
            )}
          />
        ) : (
          <input
            autoComplete="off"
            {...registerProps}
            type={type}
            name={name}
            disabled={disabled}
            value={value}
            onChange={(e) => {
              registerProps && registerProps.onChange(e);
              onChangeCustom && onChangeCustom(e);
            }}
            placeholder={placeholder}
            multiple={multiple}
            rows={5}
            {...props}
            className={clsx(
              `w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md  placeholder:text-xs text-sm focus:ring-0 `,
              {
                "border border-gray-200 focus:ring-gray-200": border,
                "border-none focus:ring-0": !border,
                "drop-shadow-sm": !disabled,
              }
            )}
          />
        )}

        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </div>
    </div>
  );
}

export default TextInput;
