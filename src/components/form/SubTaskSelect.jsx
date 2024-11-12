import React, { useState } from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import SelectTasks from "../modals/SelectTask";

const SubTaskSelect = ({
  getValues,
  setValue,
  name,
  label,
  error,
  subtitle,
  onlyOne,
  taskId,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    const currentValues = getValues(name) || [];

    const index = currentValues.findIndex((res) => res.id === option.id);

    if (index === -1) {
      if (onlyOne) {
        setValue(name, [option], { shouldValidate: true });
      } else {
        setValue(name, [...currentValues, option], { shouldValidate: true });
      }
    } else {
      const updatedValue = currentValues.filter((res) => res.id !== option.id);
      setValue(name, updatedValue, { shouldValidate: true });
    }
  };

  const handleRemove = (id) => {
    const updatedValue = getValues(name).filter((res) => res.id !== id);
    setValue(name, updatedValue, { shouldValidate: true });
  };

  return (
    <div className="">
      {label && (
        <label className="text-sm font-medium leading-6 text-gray-900 px-3">
          {label}
        </label>
      )}
      <div className="relative mt-1">
        <button
          type="button"
          className="text-left w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm bg-white py-2"
        >
          <div className="ml-2 text-gray-60 flex gap-1 flex-wrap items-center">
            {getValues(name)?.length > 0 &&
              getValues(name).map((task) => (
                <div
                  key={task?.id}
                  className="bg-primary p-1 rounded-md text-white flex gap-1 items-center text-xs"
                >
                  {task?.name || task?.id}
                  <div
                    type="button"
                    onClick={() => handleRemove(task.id)}
                    className="text-white"
                  >
                    <XMarkIcon className="h-3 w-3 text-white" />
                  </div>
                </div>
              ))}
            <div
              className="flex gap-1 border-b border-dashed ml-2 text-primary font-semibold"
              onClick={handleToggle}
            >
              <PlusIcon className="h-3 w-3" />
              <p className="text-xs">{t("common:buttons:add")}</p>
            </div>
          </div>
          <div
            className="absolute top-0 right-1 mt-2.5 flex items-center pr-2 pointer-events-none"
            onClick={handleToggle}
          >
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </button>
        <SelectTasks
          subtitle={subtitle}
          taskId={taskId}
          handleSelect={handleSelect}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dafaultValues={getValues(name)}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};
export default SubTaskSelect;
