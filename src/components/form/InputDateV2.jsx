"use client";
import React, { useEffect, useState, Fragment } from "react";
import { formatISO } from "date-fns";
import clsx from "clsx";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import InputDate from "./InputDate";
import Button from "./Button";
import { formatDate } from "@/src/utils/getFormatDate";

const InputDateV2 = ({
  label,
  value,
  onChange,
  icon,
  error,
  disabled,
  border,
  time,
  name,
  setValue,
  ...props
}) => {
  const [selected, setSelected] = useState(new Date());

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  const handleSaveDate = (close) => {
    onChange && onChange(formatISO(selected));
    setValue && setValue(name, formatISO(selected));
    close();
  };

  useEffect(() => {
    if (value && !selected) {
      setSelected(new Date(value));
    }
  }, [value]);

  return (
    <div className="flex flex-col w-full gap-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-900  px-3">
          {label}
        </label>
      )}
      <div className={clsx("w-full", { "mt-1": label })}>
        <Menu>
          {({ close }) => (
            <Fragment>
              <MenuButton
                className={clsx(
                  `w-full rounded-md text-sm h-9 focus:ring-0 z-50 flex items-center gap-2 px-2.5 bg-white `,
                  {
                    "border border-gray-200 focus:ring-gray-200 outline-none focus:outline-none":
                      border,
                    "border-none focus:ring-0 ": !border,
                    "bg-gray-100": disabled,
                    "drop-shadow-md ": !disabled,
                  }
                )}
              >
                {icon && icon}
                {value
                  ? formatDate(
                      value,
                      time ? "dd/MM/yyyy hh:mm aa" : "dd/MM/yyyy"
                    )
                  : ""}
              </MenuButton>
              <MenuItems
                anchor={{ to: "bottom start", gap: 4 }}
                className="bg-white shadow-lg p-2  w-[265px] flex flex-col items-center rounded-md"
              >
                <InputDate
                  onChange={handleChange}
                  value={selected}
                  time
                  inline
                  {...props}
                />
                <div className="flex item justify-end gap-2 p-2 w-full">
                  <Button
                    buttonStyle="secondary"
                    label="Cancelar"
                    className="px-2 py-1"
                    onclick={close}
                  />
                  <Button
                    buttonStyle="primary"
                    label="Guardar"
                    className="px-2 py-1"
                    onclick={() => handleSaveDate(close)}
                  />
                </div>
              </MenuItems>
            </Fragment>
          )}
        </Menu>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};

export default InputDateV2;
