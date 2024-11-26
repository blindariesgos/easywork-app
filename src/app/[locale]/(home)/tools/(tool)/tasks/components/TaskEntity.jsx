import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSWRConfig } from "swr";
import { FaTimes } from "react-icons/fa";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import DropdownSelect from "./DropdownSelect";
import { toast } from "react-toastify";
import * as yup from "yup";
import { putTaskId } from "@/src/lib/apis";
import { useTranslation } from "react-i18next";
import { useTasks } from "@/src/lib/api/hooks/tasks";

const schema = yup.object().shape({
  entities: yup.array(),
});

export default function TaskEntiy({
  task,
  lists,
  entityKey,
  label,
  field,
  getFilteredUsers,
  updateTaskBody,
}) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { mutate } = useSWRConfig();
  const { mutate: mutateTasks } = useTasks({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      entities: [],
    },
    resolver: yupResolver(schema),
  });

  const handleEditClick = (e) => {
    setIsEditing(true);
    const containerRect = containerRef.current.getBoundingClientRect();
    setPosition({
      top: e.clientY - containerRect.top,
      left: e.clientX - containerRect.left,
    });
  };

  const handleChangeEntity = async (name, value) => {
    setIsLoading(true);
    setValue("entities", value, { shouldValidate: true });

    await handleSubmit(async (data) => {
      const entityIds = data.entities.map((entity) => entity.id);
      const taskEntityIds = task[entityKey].map((entity) => entity.id);

      const body = updateTaskBody([...entityIds, ...taskEntityIds]);

      try {
        const response = await putTaskId(task.id, body);
        if (response?.hasError) {
          toast.error(
            response?.error?.message ??
              "Ocurrio un error al editar la tarea, intente mas tarde"
          );
          setIsLoading(false);
          return;
        }
        console.log({ response });
        toast.success(t("tools:tasks:update-msg"));
        await mutate(`/tools/tasks/${task.id}`);
      } catch (error) {
        console.log(error);
      } finally {
        reset();
        setIsLoading(false);
        setIsEditing(false);
        mutateTasks();
      }
    })({ preventDefault: () => {} });
  };

  const handleRemoveEntity = async (id) => {
    const updatedEntities = task[entityKey].filter(
      (entity) => entity.id !== id
    );
    setValue("entities", updatedEntities, { shouldValidate: true });

    const entityIds = updatedEntities.map((entity) => entity.id);
    const body = updateTaskBody(entityIds);

    try {
      const response = await putTaskId(task.id, body);
      if (response?.hasError) {
        toast.error(
          response?.error?.message ??
            "Ocurrio un error al editar la tarea, intente mas tarde"
        );
        setIsLoading(false);
        return;
      }
      console.log({ response });
      toast.success(t("tools:tasks:update-msg"));
      await mutate(`/tools/tasks/${task.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      reset();
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const filteredUsers = getFilteredUsers(lists, task);

  return (
    <div className="relative mb-4" ref={containerRef}>
      <div className="flex justify-between border-b-[1px] border-slate-300/40 pt-2 pb-1">
        <p className="text-sm text-black">{t(label)}</p>
        <p
          className="text-xs text-slate-400 cursor-pointer hover:text-slate-500"
          onClick={isLoading ? () => {} : handleEditClick}
        >
          {isLoading ? t("common:loading") : t("tools:tasks:edit:add")}
        </p>
      </div>
      {task[entityKey]?.length > 0 &&
        task[entityKey].map((entity, index) => (
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
              src={entity?.avatar || "/img/avatar.svg"}
              alt=""
              objectFit="cover"
            />
            <p className="font-semibold text-blue-800 text-sm">
              {entity?.name || entity?.username}
            </p>
            {isHovering === index && (
              <FaTimes
                className="ml-2 text-indigo-500 cursor-pointer"
                onClick={() => handleRemoveEntity(entity.id)}
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
          style={{ top: position.top + 20, left: "auto", right: "auto" }}
        >
          <DropdownSelect
            {...field}
            options={filteredUsers}
            getValues={getValues}
            setValue={handleChangeEntity}
            name="entities"
            error={errors.entities}
            isOpen={isEditing}
            setIsOpen={setIsEditing}
          />
        </div>
      </Transition>
    </div>
  );
}
