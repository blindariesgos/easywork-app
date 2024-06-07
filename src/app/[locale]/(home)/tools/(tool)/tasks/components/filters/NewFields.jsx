import { useTasksConfigs } from "@/src/hooks/useCommon";
import useAppContext from "../../../../../../../../context/app";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const NewFields = ({ append, remove, fields: selectFields }) => {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const { status } = useTasksConfigs();
  const [fields, setFields] = useState([
    {
      id: 1,
      name: t("tools:tasks:filters:fields:role"),
      options: [],
      type: "select",
      check: true,
      code: "role",
    },
    {
      id: 2,
      name: t("tools:tasks:filters:fields:status"),
      options: status,
      type: "multipleSelect",
      check: false,
      code: "status",
    },
    {
      id: 3,
      name: t("tools:tasks:filters:fields:responsible"),
      type: "dropdown",
      options: lists?.users,
      check: false,
      code: "typeContact",
    },
    {
      id: 4,
      name: t("tools:tasks:filters:fields:limit-date"),
      type: "date",
      check: false,
      code: "limitDate",
      date: "newDate",
      state: 1,
    },
    {
      id: 11,
      name: t("tools:tasks:filters:fields:createdThe"),
      type: "date",
      check: false,
      code: "createdThe",
      date: "newDate1",
      state: 2,
    },
    {
      id: 5,
      name: t("tools:tasks:filters:fields:createdBy"),
      type: "dropdown",
      check: false,
      code: "createdBy",
      options: lists?.users,
    },
    {
      id: 6,
      name: t("tools:tasks:filters:fields:tag"),
      type: "multipleSelect",
      check: false,
      code: "labels",
      options: status,
    },
    {
      id: 7,
      name: t("tools:tasks:filters:fields:closed"),
      type: "date",
      check: false,
      code: "closedThe",
      date: "newDate2",
      state: 3,
    },
    {
      id: 8,
      name: t("tools:tasks:filters:fields:name"),
      type: "input",
      check: false,
      code: "name",
    },
    {
      id: 9,
      name: t("tools:tasks:filters:fields:participant"),
      type: "dropdown",
      check: false,
      code: "participant",
      options: lists?.users,
    },
    {
      id: 10,
      name: t("tools:tasks:filters:fields:observer"),
      type: "dropdown",
      check: false,
      code: "observer",
      options: lists?.users,
    },
  ]);

  useEffect(() => {
    const updatedFields = fields.map((field) => {
      const correspondingItem = selectFields.find(
        (select) => select.name === field.name
      );
      if (correspondingItem) return { ...field, check: true };
      return field;
    });

    // Verificar si hay cambios antes de actualizar 'fields'
    if (
      !fields.every(
        (field, index) => field.check === updatedFields[index].check
      )
    ) {
      setFields(updatedFields);
    }
  }, [selectFields, fields]);

  const handleAddField = (e) => {
    const { value, checked } = e.target;
    const field =
      fields.filter((fld) => fld.id === parseInt(value))[0] || fields[0];
    if (checked) append({ ...field, value: "", newValue: "" });
    else {
      const fieldIndex = selectFields.indexOf((item) => item.id == value);
      if (fieldIndex) remove(fieldIndex);
    }
    const updatedFields = fields.map((field) => {
      return field.id == value ? { ...field, check: !field.check } : field;
    });
    setFields(updatedFields);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:text-primary"
              value={field.id}
              checked={field.check}
              onChange={(e) => handleAddField(e)}
            />
            <p className="text-sm">{field.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewFields;
