import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import AddModal from "./AddModal";
import clsx from "clsx";

const SelectSubAgent = ({ setValue, name, label, error, watch, disabled }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setValue(name, option, { shouldValidate: true });
    setSelected(option);
  };

  useEffect(() => {
    if (!watch || !watch(name) || selected) return;

    setSelected(watch(name));
  }, [watch && watch(name)]);

  return (
    <div className="">
      <label className="text-sm font-medium leading-6 text-gray-900  px-3">
        {label}
      </label>
      <div className="relative mt-1">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={clsx(
            "text-left min-h-[36px] w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md placeholder:text-xs focus:ring-0 text-sm py-2",
            {
              "bg-gray-100": disabled,
              "drop-shadow-sm bg-white ": !disabled,
            }
          )}
        >
          <span className="ml-2 flex gap-1 flex-wrap items-center">
            {selected?.name ?? ""}
          </span>
          {!disabled && (
            <span className="absolute top-0 right-1 mt-2.5 flex items-center pr-2 pointer-events-none">
              <ChevronDownIcon className="h-4 w-4" />
            </span>
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      <AddModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSelect={handleSelect}
        watch={watch}
        name={name}
      />
    </div>
  );
};
export default SelectSubAgent;
