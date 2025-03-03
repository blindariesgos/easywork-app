"use client";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { useCommon } from "../../hooks/useCommon";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";

export default function InputDateRange({
  label,
  watch,
  setValue,
  register,
  nameDate,
  name,
  ...field
}) {
  const { createdDate } = useCommon();
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (watch(name)) setValue(nameDate, "");
  }, [watch, name, nameDate, setValue]);

  return (
    <div className="flex gap-2 items-end">
      <div className={`${watch(name)?.date ? "w-2/5" : "w-full"}`}>
        <SelectInput
          label={label}
          name={name}
          options={createdDate}
          setValue={setValue}
          object={true}
        />
      </div>
      {watch(name)?.date === "input" && (
        <div className="w-3/5">
          <TextInput
            type="number"
            onChange={(e) => setValue(nameDate, e.target.value)}
          />
        </div>
      )}
      {watch(name)?.date === "month" && (
        <div className="w-3/5 flex gap-2">
          <ReactDatePicker
            selected={watch(nameDate)}
            onChange={(date) => setValue(nameDate, date)}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            className="w-full border-none drop-shadow-md h-9 rounded-md text-sm focus:ring-0"
          />
        </div>
      )}
      {watch(name)?.date === "quarter" && (
        <div className="w-3/5 flex gap-2">
          <ReactDatePicker
            selected={watch(nameDate)}
            onChange={(date) => setValue(nameDate, date)}
            showQuarterYearPicker
            dateFormat="yyyy, QQQ"
            className="w-full border-none drop-shadow-md h-9 rounded-md text-sm focus:ring-0"
          />
        </div>
      )}
      {watch(name)?.date === "year" && (
        <div className="w-3/5 flex gap-2">
          <ReactDatePicker
            selected={watch(nameDate)}
            onChange={(date) => setValue(nameDate, date)}
            showYearPicker
            dateFormat="yyyy"
            className="w-full border-none drop-shadow-md h-9 rounded-md text-sm focus:ring-0"
          />
        </div>
      )}
      {watch(name)?.date === "exactDate" && (
        <div className="w-3/5 flex gap-2">
          <ReactDatePicker
            selected={watch(nameDate)}
            onChange={(date) => setValue(nameDate, date)}
            className="w-full border-none drop-shadow-md h-9 rounded-md text-sm focus:ring-0"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      )}
      {watch(name)?.date === "range" && (
        <div className="w-3/5 flex gap-2">
          <ReactDatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setValue(nameDate, update);
              setDateRange(update);
            }}
            isClearable={true}
            className="w-full border-none drop-shadow-md h-9 rounded-md text-sm focus:ring-0"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      )}
    </div>
  );
}
