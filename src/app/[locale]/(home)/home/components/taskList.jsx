"use client";
import { useState } from "react";
import CompleteModalTask from "./CompleteModalTask";
import TaskCard from "./TaskCard";

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
        <TaskCard
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

export default TaskList;
