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
  className,
  small,
  isRequired,
  ...props
}) {
  const registerProps = register && register(name);
  return (
    <div
      className={`flex flex-col gap-y-1  ${className ? className : "w-full"}`}
    >
      {label && (
        <label
          className={clsx(
            "block font-medium leading-6 text-gray-900 px-3 relative",
            {
              "text-xs": small,
              "text-sm": !small,
            }
          )}
        >
          {label}
          {isRequired && (
            <span className="text-sm text-red-600 absolute top-0 left-0">
              *
            </span>
          )}
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
              e?.target?.value?.length &&
                registerProps &&
                registerProps.onChange(e);
              e?.target?.value?.length && onChangeCustom && onChangeCustom(e);
            }}
            placeholder={placeholder}
            rows={5}
            {...props}
            className={clsx(
              "w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md placeholder:text-xs focus:ring-0",
              {
                "border border-gray-200 focus:ring-gray-200 focus:outline-0":
                  border,
                "border-none focus:ring-0 ": !border,
                "drop-shadow-md": !disabled,
                "text-sm": !small,
                "text-xs": small,
                "py-1.5": small,
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
              `w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md  placeholder:text-xs focus:ring-0 `,
              {
                "border border-gray-200 focus:ring-gray-200": border,
                "border-none focus:ring-0": !border,
                "drop-shadow-md": !disabled,
                "text-sm": !small,
                "text-xs": small,
                "py-1.5": small,
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
