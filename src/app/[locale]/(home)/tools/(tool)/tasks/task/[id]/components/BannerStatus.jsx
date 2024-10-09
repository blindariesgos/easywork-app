"use client";
import {
    ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import React from "react";
import { useTranslation } from "react-i18next";

const BannerStatus = ({ task }) => {
    const { t } = useTranslation();

    if (task?.status === "pending") {
        // Verificar si la tarea está vencida
        if (task?.deadline) {
            const today = new Date();
            const deadline = new Date(task.deadline);
            if (deadline < today) {
                return <div className="w-ful bg-red-100 rounded-md flex justify-center gap-2 p-1 my-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-800" />
                    <p className="text-red-800">{t("tools:tasks:edit:task-overdue")}</p>
                </div>
            }
        }
    }
}

export default BannerStatus;