import clsx from "clsx";
import Link from "next/link";
import {
  formatDate,
  isDateOverdue,
  isDateTomorrowOverdue,
  isDateTodayOverdue,
  isDateMoreFiveDayOverdue,
  isDateMoreTenDayOverdue,
} from "@/src/utils/getFormatDate";
import InputCheckBox from "@/src/components/form/InputCheckBox";
import { useEffect, useState } from "react";
import { putTaskCompleted } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const TaskList = ({ tasks, mutate }) => {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto w-full pr-1">
      {tasks.map((task) => (
        <Task task={task} key={task.id} mutate={mutate} />
      ))}
    </div>
  );
};

const Task = ({ task, mutate }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(task.isCompleted);
  }, [task]);

  const handleChange = async (e, task) => {
    setChecked(e);
    await putTaskCompleted(task.id);
    mutate();
    toast.success(t("tools:tasks:completed-success"));
  };

  return (
    <div
      className={clsx(
        "flex gap-2 p-2 rounded-md w-full items-center hover:bg-easy-300",
        {
          "bg-red-200 ": task.status == "overdue" && !task.isCompleted,
          "bg-green-200 ":
            isDateTomorrowOverdue(task.deadline) && !task.isCompleted,
          "bg-orange-300 ":
            isDateTodayOverdue(task.deadline) && !task.isCompleted,
          "bg-blue-300":
            isDateMoreFiveDayOverdue(task.deadline) && !task.isCompleted,
          "bg-gray-300":
            !task.deadline ||
            (isDateMoreTenDayOverdue(task.deadline) && !task.isCompleted),
          "text-gray-800/45 line-through": task.isCompleted,
        }
      )}
    >
      <InputCheckBox
        checked={checked}
        setChecked={(e) => handleChange(e, task)}
      />
      <Link
        className="flex flex-col gap-1 cursor-pointer"
        href={`/tools/tasks/task/${task.id}?show=true`}
      >
        <p className="text-sm">{task.name}</p>
        <p className="text-xs">
          Vencimiento: {formatDate(task.deadline, "dd/MM/yyyy")}
        </p>
      </Link>
    </div>
  );
};

export default TaskList;
