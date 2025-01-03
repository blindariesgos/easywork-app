"use client";
import React, { useEffect, useState } from "react";
import SelectInput from "./form/SelectInput";
import Button from "./form/Button";
import { useTranslation } from "react-i18next";
import MenuAddUser from "./MenuAddUser";
import { useAlertContext } from "../context/common/AlertContext";
import InputDateV2 from "./form/InputDateV2";

export default function SelectedOptionsTable({ options: data }) {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedOptionList, setSelectedOptionList] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(data);
  }, [data]);

  useEffect(() => {
    setSelectedTime(null);
  }, [selectedOption]);

  return (
    <div className="flex gap-2 items-start flex-wrap sm:flex-nowrap">
      <SelectInput
        label=""
        options={options}
        name="options"
        border
        setSelectedOption={setSelectedOption}
      />
      {selectedOption?.selectUser && (
        <MenuAddUser
          selectedOption={selectedOption}
          setSelection={setSelectedUser}
        />
      )}
      {selectedOption?.selectDate && (
        <InputDateV2 value={selectedTime} onChange={setSelectedTime} time />
      )}
      {selectedOption?.selectOptions && (
        <SelectInput
          label=""
          options={selectedOption?.selectOptions}
          name="options"
          border
          setSelectedOption={setSelectedOptionList}
        />
      )}
      <Button
        label={t("common:buttons:apply")}
        type="button"
        className="px-3 py-2"
        buttonStyle="primary"
        disabled={
          !selectedOption ||
          (selectedOption.selectUser && !selectedUser) ||
          (selectedOption.selectOptions && !selectedOptionList)
        }
        onclick={() => {
          selectedOption &&
            selectedOption.onclick(
              selectedUser || selectedTime || selectedOptionList
            );
          setSelectedUser(null);
          setSelectedTime(null);
          setSelectedOptionList(null);
        }}
      />
    </div>
  );
}
