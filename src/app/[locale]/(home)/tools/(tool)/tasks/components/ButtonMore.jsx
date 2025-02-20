"use client";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  PlusIcon,
  UserPlusIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { DocumentDuplicateIcon, PencilIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { putTaskRestart, convertToSubtaskOf } from "@/src/lib/apis";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { handleApiError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { TbExchange } from "react-icons/tb";
import SelectTasks from "@/src/components/modals/SelectTask";
import useTasksContext from "@/src/context/tasks";
import { useSWRConfig } from "swr";

export default function ButtonMore({
  setOpenEdit,
  data,
  setIsDelegating,
  canEdit,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { mutate: mutateTasks } = useTasksContext();
  const [isOpenParentTaskModal, setIsOpenParentTaskModal] = useState(false);
  const { mutate } = useSWRConfig();
  const [options, setOptions] = useState([
    {
      id: 1,
      name: t("tools:tasks:edit:copy"),
      icon: DocumentDuplicateIcon,
      onclick: () => setOpenEdit({ mode: "copy" }),
    },
    {
      id: 2,
      name: t("tools:tasks:edit:subtask"),
      icon: PlusIcon,
      onclick: () => setOpenEdit({ mode: "subtask" }),
      // hidden: !!data.parentTask,
    },
    {
      id: 4,
      name: t("tools:tasks:edit:to-subtask"),
      icon: TbExchange,
      onclick: () => setIsOpenParentTaskModal(true),
      hidden: !!data.parentTask || data?.subTasks?.length > 0,
    },
    {
      id: 3,
      name: t("tools:tasks:edit:delegate"),
      icon: UserPlusIcon,
      onclick: () => setIsDelegating(true),
      hidden: !canEdit,
    },
  ]);

  const handleRestart = async () => {
    try {
      setLoading(true);
      await putTaskRestart(data.id);
      toast.success(t("tools:tasks:restart-success"));
      mutate(`/tools/tasks/${data?.id}`);
      mutateTasks();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleApiError(error.message);
    }
  };

  const handleSelectParentTask = async (parent) => {
    setIsOpenParentTaskModal(false);
    setLoading(true);
    const response = await convertToSubtaskOf(data.id, parent.id).catch(
      (error) => ({ hasError: true, ...error })
    );
    if (response.hasError) {
      toast.error(
        "Se ha producido un error al convertir a subtarea, inténtelo de nuevo más tarde."
      );
      setLoading(false);
      return;
    }
    toast.success("La tarea fue convertida con éxito.");
    mutate(`/tools/tasks/${data?.id}`);
    mutateTasks();
    setLoading(false);
  };

  useEffect(() => {
    if (
      data &&
      !data.isCompleted &&
      !options.find((option) => option.name === t("tools:tasks:edit:edit")) &&
      canEdit
    ) {
      setOptions([
        ...options,
        {
          id: 4,
          name: t("tools:tasks:edit:edit"),
          icon: PencilIcon,
          onclick: () => setOpenEdit({ mode: "edit" }),
        },
      ]);
    }

    if (
      data &&
      data.isCompleted &&
      !options.find((option) => option.name === t("tools:tasks:edit:restart"))
    ) {
      setOptions([
        ...options,
        {
          id: 5,
          name: t("tools:tasks:edit:restart"),
          icon: PlayIcon,
          onclick: () => handleRestart(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className="flex items-center justify-center w-full rounded-md text-xs font-medium text-black focus:outline-none bg-gray-200 py-2 px-3">
          {t("tools:tasks:edit:more")}
          <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-800" />
        </MenuButton>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems
            anchor="bottom start"
            className=" mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 "
          >
            <div className="px-1 py-1 ">
              {options
                .filter((opt) => !opt.hidden)
                .map((opt, index) => (
                  <MenuItem key={index}>
                    {() => (
                      <button
                        onClick={opt.onclick}
                        className={`group flex w-full text-gray-400 data-[focus]:bg-primary data-[focus]:text-white items-center gap-1 rounded-md px-2 py-2 text-xs`}
                      >
                        <opt.icon
                          className={`h-4 w-4 data-[focus]:text-white text-black"}`}
                        />
                        <p className="text-left">{opt.name}</p>
                      </button>
                    )}
                  </MenuItem>
                ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
      <SelectTasks
        subtitle={"Seleccionar tarea padre"}
        taskId={data.id}
        handleSelect={handleSelectParentTask}
        isOpen={isOpenParentTaskModal}
        setIsOpen={setIsOpenParentTaskModal}
      />
    </Fragment>
  );
}
