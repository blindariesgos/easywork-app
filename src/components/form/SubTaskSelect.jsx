import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import TextInput from "./TextInput";
import clsx from "clsx";
import { useContacts } from "../../lib/api/hooks/contacts";
import { usePolicies } from "../../lib/api/hooks/policies";
import { useLeads } from "../../lib/api/hooks/leads";
import { LoadingSpinnerSmall } from "../LoaderSpinner";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Button from "./Button";
import { useTasks } from "../../lib/api/hooks/tasks";

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
  const [query, setQuery] = useState("");
  const { tasks, isLoading, isError } = useTasks({
    filters: { name: query },
    page: 1,
    limit: 10,
    srcConfig: {
      revalidateIfStale: false,
    },
  });

  const handleToggle = () => {
    setQuery("");
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
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative w-full  z-[10000] py-2"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg w-full space-y-4 border bg-white p-4 h-[380px] rounded-md shadow-lg flex flex-col justify-between">
              <div className="w-full">
                {subtitle && (
                  <DialogTitle className="font-bold">{subtitle}</DialogTitle>
                )}
                <Description>
                  <div
                    className="py-1 flex flex-col gap-2 px-2 flex-1"
                    aria-labelledby="options-menu"
                  >
                    <div className="w-full mt-2">
                      <TextInput
                        onChangeCustom={(e) => setQuery(e.target.value)}
                        border
                      />
                    </div>
                    {tasks &&
                    tasks?.items?.length === 0 &&
                    query !== "" &&
                    !isLoading ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
                        {t("common:not-found")}
                      </div>
                    ) : (
                      tasks &&
                      tasks?.items?.length &&
                      tasks?.items
                        ?.filter((task) => task.id !== taskId)
                        ?.map((option) => (
                          <div
                            key={option.id}
                            className={`flex items-center px-4 py-2 text-sm cursor-pointer rounded-md ${
                              getValues(name) &&
                              getValues(name).some(
                                (res) => res.id === option.id
                              )
                                ? "bg-primary"
                                : "hover:bg-primary/5"
                            }`}
                            onClick={() => handleSelect(option)}
                          >
                            <span
                              className={`text-xs ${
                                getValues(name) &&
                                getValues(name).some(
                                  (res) => res.id === option.id
                                )
                                  ? "text-white"
                                  : "text-black"
                              }`}
                            >
                              {option.name}
                            </span>
                          </div>
                        ))
                    )}
                    {isLoading && <LoadingSpinnerSmall />}
                  </div>
                </Description>
              </div>

              <div className="flex justify-end">
                <Button
                  label={"Cerrar"}
                  buttonStyle="primary"
                  onclick={() => setIsOpen(false)}
                  className="px-2 py-1"
                />
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};
export default SubTaskSelect;