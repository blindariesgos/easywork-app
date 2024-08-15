import useUserContext from "@/src/context/users";
import useAppContext from "../../../../../../../../context/app";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MenuItem } from "@headlessui/react";
import useReceiptContext from "../../../../../../../../context/receipts";

const NewFields = ({ append, remove, fields: selectFields }) => {
  const { lists } = useAppContext();
  const { filterFields, setFilterFields } = useReceiptContext();
  const { t } = useTranslation();

  // useEffect(() => {
  // 	const updatedFields = fields.map((field) => {
  // 		const correspondingItem = selectFields.find((select) => select.name === field.name);
  // 		return correspondingItem ? { ...field, check: true } : field;
  // 	});
  // 	setFields(updatedFields);
  // }, [fields, selectFields]);

  useEffect(() => {
    const updatedFields = filterFields.map((field) => {
      const correspondingItem = selectFields.find(
        (select) => select.name === field.name
      );
      if (correspondingItem) return { ...field, check: true };
      return field;
    });

    // Verificar si hay cambios antes de actualizar 'fields'
    if (
      !filterFields.every(
        (field, index) => field.check === updatedFields[index].check
      )
    ) {
      setFilterFields(updatedFields);
    }
  }, [selectFields, filterFields]);

  const handleAddField = (e) => {
    const { value, checked } = e.target;
    const field =
      filterFields.filter((fld) => fld.id === parseInt(value))[0] ||
      filterFields[0];
    if (checked) append({ ...field, value: "" });
    else {
      const fieldIndex = selectFields.indexOf((item) => item.id == value);
      if (fieldIndex) remove(fieldIndex);
    }
    const updatedFields = filterFields.map((field) => {
      return field.id == value ? { ...field, check: !field.check } : field;
    });
    setFilterFields(updatedFields);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 flex-col">
        {filterFields.map((field, index) => (
          <MenuItem key={index} className="flex gap-2" as="div">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:text-primary"
              value={field.id}
              checked={selectFields.some((x) => x.code == field.code)}
              onChange={(e) => handleAddField(e)}
            />
            <p className="text-sm">{field.name}</p>
          </MenuItem>
        ))}
      </div>
    </div>
  );
};

export default NewFields;
