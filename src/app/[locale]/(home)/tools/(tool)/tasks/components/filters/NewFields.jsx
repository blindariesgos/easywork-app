import React, { useEffect } from "react";
import { MenuItem } from "@headlessui/react";
import useTasksContext from "@/src/context/tasks";

const NewFields = ({ append, remove, fields: selectFields }) => {
  const { filterFields, setFilterFields } = useTasksContext();

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
    const { value, checked, name } = e.target;

    const field =
      filterFields.filter((fld) => fld.id === parseInt(value))[0] ||
      filterFields[0];

    if (checked) append({ ...field, value: "", newValue: "" });
    else {
      const fieldIndex = selectFields.map((item) => item.code).indexOf(name);
      if (fieldIndex) remove(fieldIndex);
    }
    const updatedFields = filterFields.map((field) => {
      return field.id == value ? { ...field, check: !field.check } : field;
    });
    setFilterFields(updatedFields);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filterFields.map((field, index) => (
          <MenuItem key={index} className="flex gap-2" as="div">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:text-primary"
              value={field.id}
              checked={field.check}
              name={field.code}
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
