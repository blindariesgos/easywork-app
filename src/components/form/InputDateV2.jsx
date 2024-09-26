"use client";
import { useCommon } from "../../hooks/useCommon";
import React, { useEffect, useState, Fragment } from "react";
import DatePicker from "react-datepicker";
import { formatISO, getMonth, getYear } from "date-fns";
import range from "lodash/range";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
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
        <label className="text-sm font-medium text-gray-900">{label}</label>
      )}
      <div className={clsx("w-full", { "mt-1": label })}>
        <Menu>
          {({ close }) => (
            <Fragment>
              <MenuButton
                className={clsx(
                  `w-full rounded-md text-sm h-9 focus:ring-0 z-50 flex items-center gap-2 px-2.5`,
                  {
                    "border border-gray-200 focus:ring-gray-200 outline-none focus:outline-none":
                      border,
                    "border-none focus:ring-0 ": !border,
                    "bg-gray-100": disabled,
                    "shadow-sm bg-white": !disabled,
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
        {/* <DatePicker
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => {
            return (
              <div
                style={{
                  margin: 0,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                >
                  <ChevronLeftIcon className="h-4 w-4 text-primary" />
                </button>
                <select
                  value={getYear(date)}
                  onChange={({ target: { value } }) => {
                    return changeYear(value);
                  }}
                  className="h-8 flex justify-center text-xs rounded-lg shadow-sm border-none focus:ring-0"
                >
                  {years.map((option) => {
                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>

                <select
                  value={months[getMonth(date)]}
                  onChange={({ target: { value } }) => {
                    return changeMonth(months.indexOf(value));
                  }}
                  className="h-8 flex justify-center mx-2 text-xs rounded-lg shadow-sm border-none focus:ring-0"
                >
                  {months.map((option) => {
                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
                <button
                  type="button"
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                >
                  <ChevronRightIcon className="h-4 w-4 text-primary" />
                </button>
              </div>
            );
          }}
          showIcon={icon ? true : false}
          selected={selected}
          onChange={handleChange}
          // onBlur={onBlur}
          icon={icon ? icon : undefined}
          className={clsx(`w-full rounded-md text-sm h-9 focus:ring-0 z-50`, {
            "border border-gray-200 focus:ring-gray-200 outline-none focus:outline-none":
              border,
            "border-none focus:ring-0 ": !border,
            "bg-gray-100": disabled,
            "shadow-sm ": !disabled,
          })}
          isClearable={!disabled}
          disabled={disabled}
          filterDate={(date) => {
            return inactiveDate ? date <= inactiveDate : date;
          }}
          timeInputLabel={time && t("common:time")}
          dateFormat={time ? "dd/MM/yyyy h:mm aa" : "dd/MM/yyyy"}
          showTimeInput={time}
          {...props}
        /> */}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};

export default InputDateV2;
