import React, { useEffect, useState } from "react";
import clsx from "clsx";

const InputCurrency = ({
  label,
  placeholder,
  type = "text",
  error,
  onChangeCustom,
  disabled = false,
  name,
  register,
  border,
  setValue,
  watch,
  defaultValue,
  prefix = "",
  ...props
}) => {
  const [currentValue, setCurrentValue] = useState();
  const registerProps = register && register(name);

  const handleChange = (e) => {
    console.log({ e });
    if (!e?.target?.value || typeof e?.target?.value != "string") return;
    const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no numéricos
    setValue && setValue(name, inputValue / 100);
    const formattedValue = formatCurrency(inputValue);
    setCurrentValue(formattedValue);
  };

  const formatCurrency = (val) => {
    // Eliminar caracteres no numéricos
    const numericValue = val.replace(/[^0-9]/g, "");
    // Convertir a número y formatear
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue / 100);
    return `${prefix} ${formattedValue}`;
  };

  useEffect(() => {
    if (!currentValue) return;
    setCurrentValue(formatCurrency(currentValue));
  }, [prefix]);

  useEffect(() => {
    if (!defaultValue || currentValue) return;
    handleChange({
      target: {
        value: defaultValue,
      },
    });
  }, [defaultValue]);

  useEffect(() => {
    if (!watch || !watch(name)) return;
    if (watch(name) == "") {
      handleChange({
        target: {
          value: "",
        },
      });
      return;
    }
    if (currentValue) return;
    handleChange({
      target: {
        value: watch(name),
      },
    });
  }, [watch && watch(name)]);

  return (
    <div className="flex flex-col gap-y-1 w-full">
      <label className="block text-sm font-medium leading-6 text-gray-900 px-3">
        {label}
      </label>
      <div className="">
        <input
          autoComplete="off"
          {...registerProps}
          type={type}
          name={name}
          disabled={disabled}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          {...props}
          className={clsx(
            `w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md  placeholder:text-xs text-sm focus:ring-0 `,
            {
              "border border-gray-200 focus:ring-gray-200": border,
              "border-none focus:ring-0": !border,
              // "bg-gray-100": disabled,
              "drop-shadow-md": !disabled,
            }
          )}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </div>
    </div>
  );
};

export default InputCurrency;
