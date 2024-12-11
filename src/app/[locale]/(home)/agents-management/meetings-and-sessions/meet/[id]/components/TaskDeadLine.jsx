"use client";
import React, { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { putTaskId } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { handleApiError } from "@/src/utils/api/errors";
import { useSWRConfig } from "swr";
import { formatDate, getFormatDate } from "@/src/utils/getFormatDate";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import clsx from "clsx";
import InputDate from "@/src/components/form/InputDate";
import { useTasks } from "@/src/lib/api/hooks/tasks";
import useTasksContext from "@/src/context/tasks";
import Button from "@/src/components/form/Button";
import moment from "moment";
import LoaderSpinner from "@/src/components/LoaderSpinner";

const TaskDeadLine = ({ task }) => {
  const { t } = useTranslation();
  const { mutate: mutateTasks } = useTasksContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    task?.deadline ? parseISO(task.deadline) : new Date()
  );
  const { mutate } = useSWRConfig();

  const schema = yup.object().shape({
    deadline: yup.string().nullable(),
  });

  const handleDateChange = async (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSaveDate = async (close) => {
    setIsLoading(true);
    const body = {
      deadline: getFormatDate(selectedDate),
    };
    try {
      close();
      const response = await putTaskId(task?.id, body);
      if (response?.hasError) {
        toast.error(
          response?.error?.message ??
            "Ocurrio un error al editar la tarea, intente mas tarde"
        );
        setIsLoading(false);
        return;
      }
      mutate(`/tools/tasks/${task?.id}`);
      mutateTasks();
    } catch (error) {
      handleApiError(error.message);
    }
  };

  const handleDateRemove = async () => {
    setIsLoading(true);
    const body = {
      deadline: null,
    };

    try {
      const response = await putTaskId(task?.id, body);
      if (response?.hasError) {
        toast.error(
          response?.error?.message ??
            "Ocurrio un error al editar la tarea, intente mas tarde"
        );
        setIsLoading(false);
        return;
      }
      toast.success(t("tools:tasks:update-msg"));
      await mutate(`/tools/tasks/${task?.id}`);
    } catch (error) {
      handleApiError(error.message);
    } finally {
      setIsEditing(false);
    }

    setSelectedDate(null);
  };

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      <Menu>
        {({ close }) => (
          <Fragment>
            <div className="flex justify-between items-center group">
              <p className="text-sm text-black">
                {t("tools:tasks:edit:limit-date")}:
              </p>
              <div className="flex items-center">
                <MenuButton
                  className={clsx(
                    !task.completedTime &&
                      "underline decoration-dotted cursor-pointer font-semibold",
                    "text-sm text-black"
                  )}
                >
                  {task?.deadline
                    ? moment(task?.deadline).format("DD/MM/YYYY hh:mm a")
                    : "Ninguna"}
                </MenuButton>
                {task?.deadline && (
                  <FaTimes
                    className={`ml-2 text-indigo-500 hover:text-indigo-700 cursor-pointer group-hover:visible invisible`}
                    onClick={handleDateRemove}
                  />
                )}
              </div>
            </div>
            <MenuItems
              anchor="bottom end"
              className="bg-white shadow-lg p-2 w-[265px] flex flex-col items-center rounded-md"
            >
              <InputDate
                onChange={handleDateChange}
                value={selectedDate}
                time
                inline
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
    </Fragment>
  );
};

export default TaskDeadLine;
