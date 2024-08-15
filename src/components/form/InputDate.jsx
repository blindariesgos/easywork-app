"use client";
import { useCommon } from "../../hooks/useCommon";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { getMonth, getYear } from "date-fns";
import range from "lodash/range";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

const InputDate = ({
  label,
  value,
  onChange,
  icon,
  error,
  disabled,
  inactiveDate,
  border,
  time,
  ...props
}) => {
  const { t } = useTranslation();
  const { months } = useCommon();
  const years = range(1924, getYear(new Date()) + 1, 1);
  const [selected, setSelected] = useState(value);

  const handleChange = (e) => {
    setSelected(e);
    onChange &&
      onChange({
        target: {
          value: e,
        },
      });
  };

  useEffect(() => {
    if (value && !selected) {
      setSelected(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-medium text-gray-900">{label}</label>
      )}
      <div className={clsx("w-full", { "mt-1": label })}>
        <DatePicker
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
          // dateFormat={time ? "MM/dd/yyyy h:mm aa" : "MM/dd/yyyy"}
          showTimeInput={time}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};

export default InputDate;
