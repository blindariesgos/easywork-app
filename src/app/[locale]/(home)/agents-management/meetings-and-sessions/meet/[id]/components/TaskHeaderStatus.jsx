"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";

const TaskHeaderStatus = ({ task }) => {
    const { t } = useTranslation();
    if (task.status === "pending") {
        return <p className="text-white font-medium text-sm">
            {t("tools:tasks:edit:pending-since", {
                date: moment(task?.createdAt).format("DD-MM-YYYY"),
            })}
        </p>
    } else if (task.status === "completed" || task?.status === "pending_review") {
        return <p className="text-white font-medium text-sm">{t("tools:tasks:edit:completed-since", {
            date: moment(task?.completedTime).format("DD-MM-YYYY"),
        })}</p>
    }
};

export default TaskHeaderStatus;