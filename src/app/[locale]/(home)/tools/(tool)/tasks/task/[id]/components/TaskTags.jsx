"use client";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { putTaskId } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MultiSelectTags from "../../../components/MultiSelectTags";
import Button from "@/src/components/form/Button";

const TaskTags = ({ task }) => {
    const { t } = useTranslation()
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef(null);
    const { mutate } = useSWRConfig();

    const schema = yup.object().shape({
        tags: yup.array(),
    });

    const { formState: { errors }, control, getValues, setValue, handleSubmit } = useForm({
        defaultValues: {
            tags: task.tags,
        },
        resolver: yupResolver(schema),
    });

    const handleTagsChange = async () => {

        await handleSubmit(async (data) => {
            const tagsIds = data.tags.map((resp) => {
                return resp.id;
            });

            if (tagsIds.length == 0) {
                setIsEditing(false)
                return
            };

            const body = {
                tagsIds
            };

            try {
                await putTaskId(task.id, body);
                toast.success(t("tools:tasks:update-msg"));
                await mutate(`/tools/tasks/${task.id}`);
            } catch (error) {
                console.log(error);
            } finally {
                setIsEditing(false);
            }
        })({ preventDefault: () => { } });
    };


    return (
        <div className="relative mb-4" ref={containerRef}>
            <div className="flex justify-between border-b-[1px] border-slate-300/40 pt-2 pb-1">
                <p className="text-sm text-black">
                    {t("tools:tasks:edit:tags")}
                </p>
                <p className="text-xs text-slate-400 cursor-pointer hover:text-slate-500" onClick={() => setIsEditing(true)}>
                    {t('tools:tasks:edit:addTag')}
                </p>
            </div>
            {
                isEditing
                    ? (
                        <Controller
                            name="tags"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <div>
                                    <MultiSelectTags
                                        {...field}
                                        getValues={getValues}
                                        setValue={setValue}
                                        name="tags"
                                        error={errors.tags}
                                    />
                                    <div className="flex justify-end mt-1 gap-1">
                                        <Button
                                            label={t("common:buttons:cancel")}
                                            buttonStyle="secondary"
                                            className="px-2 py-1 "
                                            fontSize="text-xs"
                                            onclick={() => setIsEditing(false)}
                                        />
                                        <Button
                                            label={t("common:buttons:save")}
                                            buttonStyle="secondary"
                                            className="px-2 py-1 "
                                            fontSize="text-xs"
                                            onclick={handleTagsChange}
                                        />
                                    </div>
                                </div>
                            )}
                        />
                    )
                    : (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {task?.tags?.length > 0 &&
                                task.tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="px-2 py-1 rounded-md bg-gray-200"
                                    >
                                        <p className="text-sm">#{tag.name}</p>
                                    </div>
                                ))}
                        </div>
                    )
            }
        </div >
    );
}

export default TaskTags;