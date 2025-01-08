"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { putTaskId } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MultiSelectTags from "../../../components/MultiSelectTags";
import Button from "@/src/components/form/Button";
import useTasksContext from "@/src/context/tasks";

const TaskTags = ({ task }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef(null);
  const { mutate } = useSWRConfig();
  const { mutate: mutateTasks } = useTasksContext();

  const schema = yup.object().shape({
    tags: yup.array(),
  });

  const {
    formState: { errors },
    control,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      tags: task.tags,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!isEditing) return;
    const handleChangeTag = async (tags) => {
      const tagsIds = tags.map((resp) => {
        return resp.id;
      });

      if (tagsIds.length == 0) {
        setIsEditing(false);
        return;
      }

      const body = {
        tagsIds,
      };

      try {
        const response = await putTaskId(task.id, body);
        if (response?.hasError) {
          toast.error(
            response?.error?.message ??
              "Ocurrio un error al editar la tarea, intente mas tarde"
          );
          return;
        }
        toast.success(t("tools:tasks:update-msg"));
        mutate(`/tools/tasks/${task.id}`);
        mutateTasks();
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsEditing(false);
      }
    };

    handleChangeTag(watch("tags"));
  }, [watch && watch("tags")]);

  return (
    <div className="relative mb-4" ref={containerRef}>
      <div className="flex justify-between border-b-[1px] border-slate-300/40 pt-2 pb-1">
        <p className="text-sm text-black">{t("tools:tasks:edit:tags")}</p>
        <p
          className="text-xs text-slate-400 cursor-pointer hover:text-slate-500"
          onClick={() => setIsEditing(true)}
        >
          {t("tools:tasks:edit:addTag")}
        </p>
      </div>
      {isEditing ? (
        <Controller
          name="tags"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <MultiSelectTags
              {...field}
              getValues={getValues}
              setValue={setValue}
              name="tags"
              error={errors.tags}
            />
          )}
        />
      ) : (
        <div className="flex flex-wrap gap-2 mt-2">
          {task?.tags?.length > 0 &&
            task.tags.map((tag, index) => (
              <div key={index} className="px-2 py-1 rounded-md bg-gray-200">
                <p className="text-sm">#{tag.name}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TaskTags;
