import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "../form/TextInput";
import { LoadingSpinnerSmall } from "../LoaderSpinner";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Button from "../form/Button";
import { useTasks } from "../../lib/api/hooks/tasks";

const SelectTaskDialog = ({
  subtitle,
  taskId,
  handleSelect,
  isOpen,
  setIsOpen,
  dafaultValues,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const { tasks, isLoading, mutate } = useTasks({
    filters,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setFilters(query.length > 0 ? { name: query } : {});
  }, [query]);

  useEffect(() => {
    mutate();
  }, []);

  return (
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
                <div className="overflow-y-auto h-52 grid grid-cols-1 gap-1 pr-1">
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
                            dafaultValues &&
                            dafaultValues.some((res) => res.id === option.id)
                              ? "bg-primary"
                              : "hover:bg-primary/5"
                          }`}
                          onClick={() => handleSelect(option)}
                        >
                          <span
                            className={`text-xs ${
                              dafaultValues &&
                              dafaultValues.some((res) => res.id === option.id)
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            {option.name}
                          </span>
                        </div>
                      ))
                  )}
                </div>
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
  );
};
export default SelectTaskDialog;
