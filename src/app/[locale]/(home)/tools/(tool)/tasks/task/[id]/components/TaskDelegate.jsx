"use client";
import React, { useRef, useState } from "react";
import * as yup from "yup";
import { putTaskId } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { handleApiError } from "@/src/utils/api/errors";
import { useSWRConfig } from "swr";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MultipleSelect from "@/src/components/form/MultipleSelect";

const TaskDelegate = ({ lists, t, setIsDelegating, responsibleId, taskId }) => {
    const { mutate } = useSWRConfig();
    const [isLoading, setIsLoading] = useState(false);

    const schema = yup.object().shape({
        participants: yup.array(),
    });

    const delegateTask = async (data) => {
        setIsLoading(true);

        const body = {};

        const responsibleIds = data.responsible.map((resp) => {
            return resp.id;
        });
        body.responsibleIds = responsibleIds || [];

        try {
            await putTaskId(taskId, body);
            toast.success(t("tools:tasks:update-msg"));
            await mutate(`/tools/tasks/${taskId}`);
            setIsDelegating(false);
        } catch (error) {
            handleApiError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const { register, handleSubmit, formState: { errors }, control, getValues, reset, setValue, watch } = useForm({
        defaultValues: {
            responsible: [],
        },
        resolver: yupResolver(schema),
    });

    const responsible = watch('responsible', []);

    // Filtrar usuarios para excluir el responsable actual
    const filteredUsers = lists?.users.filter(user => user.id !== responsibleId) || [];

    return (
        <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
            <p className="text-sm text-left shrink-0 w-auto">
                {t('tools:tasks:delegate-to')}
            </p>
            <div className="w-full shrink-0">
                <Controller
                    name="responsible"
                    control={control}
                    render={({ field }) => (
                        <MultipleSelect
                            {...field}
                            options={filteredUsers}
                            getValues={getValues}
                            setValue={setValue}
                            tagLabel="Seleccionar"
                            error={errors.responsible}
                            onlyOne
                        />
                    )}
                />
            </div>
            <button
                type="button"
                disabled={responsible.length === 0 || isLoading}
                className="rounded-md disabled:cursor-not-allowed bg-primary px-3 py-1.5 text-sm text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={handleSubmit((data) => delegateTask(data))}
            >
                {isLoading ? t('tools:tasks:delegating') : t('tools:tasks:delegate')}
            </button>
            <button
                type="button"
                className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => {
                    setIsDelegating(false);
                    reset();
                }}
            >
                Cancelar
            </button>
        </div>
    );
};

export default TaskDelegate;