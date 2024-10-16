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
import CompleteModalTask from "./CompleteModalTask";

const TaskList = ({ tasks, mutate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState();

  const handleComplete = (taskId) => {
    setSelectedTask(taskId);
    setIsOpen(true);
  };
  return (
    <div className="flex flex-col gap-2 overflow-y-auto w-full pr-1">
      {tasks.map((task) => (
        <Task
          task={task}
          key={task.id}
          mutate={mutate}
          handleComplete={handleComplete}
        />
      ))}
      <CompleteModalTask
        mutate={mutate}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        taskId={selectedTask}
      />
    </div>
  );
};

const Task = ({ task, mutate, handleComplete }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(task.isCompleted);

  useEffect(() => {
    setChecked(task.isCompleted);
  }, [task]);

  const handleChange = async (e, task) => {
    handleComplete(task.id);
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
