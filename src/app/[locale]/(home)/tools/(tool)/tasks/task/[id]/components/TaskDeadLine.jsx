"use client";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { putTaskId } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { handleApiError } from "@/src/utils/api/errors";
import { useSWRConfig } from "swr";
import { formatDate, getFormatDate } from "@/src/utils/getFormatDate";
import DatePicker from 'react-datepicker';
import { parseISO } from "date-fns";
import { Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
import clsx from "clsx";

const TaskDeadLine = ({ task, onDateChange, onDateRemove }) => {
    const { t } = useTranslation()
    const [isEditing, setIsEditing] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [selectedDate, setSelectedDate] = useState(task?.deadline ? parseISO(task.deadline) : new Date());
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const { mutate } = useSWRConfig();
    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const schema = yup.object().shape({
        deadline: yup.string().nullable(),
    });

    const handleDateChange = async (date) => {
        setIsLoading(true);
        const body = {
            deadline: getFormatDate(date),
        };

        try {
            await putTaskId(task?.id, body);
            toast.success(t("tools:tasks:update-msg"));
            await mutate(`/tools/tasks/${task?.id}`);
        } catch (error) {
            handleApiError(error.message);
        } finally {
            setIsLoading(false);
            setIsEditing(false);
        }
    };

    const handleDateRemove = async () => {
        setIsLoading(true);

        const body = {
            deadline: null,
        };

        try {
            await putTaskId(task?.id, body);
            toast.success(t("tools:tasks:update-msg"));
            await mutate(`/tools/tasks/${task?.id}`);
        } catch (error) {
            handleApiError(error.message);
        } finally {
            setIsLoading(false);
            setIsEditing(false);
        }

        setSelectedDate(null);
    };


    const handleDateClick = (e) => {
        if (task.completedTime) return;
        setIsEditing(true);
        const containerRect = containerRef.current.getBoundingClientRect();
        setPosition({ top: e.clientY - containerRect.top, left: e.clientX - containerRect.left });
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="flex justify-between mb-2 border-b-[1px] border-slate-300/40 py-2">
                <p className="text-sm text-black">
                    {t("tools:tasks:edit:limit-date")}:
                </p>
                <div className="flex items-center"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}>
                    <p
                        className={clsx(!task.completedTime && "underline decoration-dotted cursor-pointer font-semibold", "text-sm text-black")}
                        onClick={handleDateClick}
                    >
                        {task?.deadline ? formatDate(task?.deadline, 'dd/MM/yyyy hh:mm a') : 'Ninguna'}
                    </p>
                    {task?.deadline && (
                        <FaTimes
                            className={`ml-2 text-indigo-500 hover:text-indigo-700 cursor-pointer ${isHovering ? 'visible' : 'invisible'}`}
                            onClick={handleDateRemove}
                        />
                    )}
                </div>
            </div>
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
                    className="absolute z-10 bg-white shadow-lg rounded-md"
                    style={{ top: position.top + 20, left: 'auto', right: `calc(90% - ${position.left}px)` }}
                >
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        onClickOutside={() => setIsEditing(false)}
                        inline
                    />
                </div>
            </Transition>
        </div>
    );
}

export default TaskDeadLine;