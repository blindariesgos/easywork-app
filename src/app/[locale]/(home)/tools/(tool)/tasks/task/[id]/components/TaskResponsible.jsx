"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { putTaskId } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import { Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DropdownSelect from "../../../components/DropdownSelect";
import { useTasks } from "@/src/lib/api/hooks/tasks";

const TaskResponsible = ({ task, lists, field }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { mutate } = useSWRConfig();
  const { mutate: mutateTasks } = useTasks({});

  const schema = yup.object().shape({
    responsible: yup.array(),
  });

  const handleEditClick = (e) => {
    setIsEditing(true);
    const containerRect = containerRef.current.getBoundingClientRect();
    setPosition({
      top: e.clientY - containerRect.top,
      left: e.clientX - containerRect.left,
    });
  };

  const {
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      responsible: [],
    },
    resolver: yupResolver(schema),
  });

  const handleDateChange = async (name, value) => {
    setIsLoading(true);
    setValue("responsible", value, { shouldValidate: true });

    await handleSubmit(async (data) => {
      const responsibleIds = data.responsible.map((resp) => {
        return resp.id;
      });

      if (responsibleIds.length !== 1) return;

      const body = {
        responsibleIds,
      };

      try {
        await putTaskId(task.id, body);
        toast.success(t("tools:tasks:update-msg"));
        await mutate(`/tools/tasks/${task.id}`);
        mutateTasks();
      } catch (error) {
        console.log(error);
      } finally {
        reset();
        setIsLoading(false);
        setIsEditing(false);
      }
    })({ preventDefault: () => {} });
  };

  // Filtrar usuarios para excluir el responsable actual
  const filteredUsers = task?.responsible
    ? lists?.users.filter((user) => user.id !== task?.responsible[0]?.id)
    : [];

  const handleDateRemove = (id) => {
    const updatedResponsible = getValues("responsible").filter(
      (res) => res.id !== id
    );
    setValue("responsible", updatedResponsible, { shouldValidate: true });
  };

  return (
    <div className="relative mb-4" ref={containerRef}>
      <div className="flex justify-between border-b-[1px] border-slate-300/40 pt-2 pb-1">
        <p className="text-sm text-black">
          {t("tools:tasks:edit:responsible")}
        </p>
        <p
          className="text-xs text-slate-400 cursor-pointer hover:text-slate-500"
          onClick={isLoading ? () => {} : handleEditClick}
        >
          {isLoading
            ? t("tools:tasks:delegating")
            : t("tools:tasks:edit:change")}
        </p>
      </div>
      {task?.responsible?.length > 0 &&
        task.responsible.map((resp, index) => (
          <div
            className="flex gap-2 items-center mt-3"
            key={index}
            onMouseEnter={() => setIsHovering(index)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Image
              className="h-8 w-8 rounded-full object-cover"
              width={50}
              height={50}
              src={resp?.avatar || "/img/avatar.svg"}
              alt=""
              objectFit="cover"
            />
            <p className="font-semibold text-blue-800 text-sm">
              {resp?.name || resp?.username}
            </p>
            {isHovering === index && (
              <FaTimes
                className="ml-2 text-red-500 cursor-pointer"
                onClick={() => handleDateRemove(resp.id)}
              />
            )}
          </div>
        ))}
      <Transition
        show={isEditing}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div
          className="absolute w-full z-50 bg-white shadow-lg rounded-md"
          style={{ top: position.top + 20, left: "auto", right: `auto` }}
        >
          <DropdownSelect
            {...field}
            options={filteredUsers}
            getValues={getValues}
            setValue={handleDateChange}
            name="responsible"
            error={errors.responsible}
            isOpen={isEditing}
            setIsOpen={setIsEditing}
          />
        </div>
      </Transition>
    </div>
  );
};

export default TaskResponsible;
