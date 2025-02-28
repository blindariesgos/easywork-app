import { Fragment, useEffect, useState } from "react";
import TextInput from "./TextInput";
import clsx from "clsx";
import { useDebouncedCallback } from "use-debounce";
import { getAddListConnections } from "@/src/lib/apis";

const AddressInput = ({
  label,
  error,
  register,
  name,
  placeholder,
  disabled,
  setValue,
  small,
  isRequired,
}) => {
  const [postalCode, setPostalCode] = useState("");

  const getAddress = async () => {
    const response = await getAddListConnections;
  };

  const handleSearch = useDebouncedCallback(() => {}, 500);

  useEffect(() => {
    handleSearch();
  }, [query]);

  return (
    <div className="grid grid-cols-1 gap-y-1">
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
      <div className="grid grid-cols-2">
        <TextInput
          onChangeCustom={(p) => console.log({ p })}
          placeholder={"Ingrese codigo postal"}
        />
      </div>
      <TextInput
        error={error}
        register={register}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default AddressInput;
