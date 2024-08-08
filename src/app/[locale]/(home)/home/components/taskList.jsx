import { formatDate } from "@/src/utils/getFormatDate";
import Link from "next/link";

const TaskList = ({ tasks }) => {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto w-full">
      {tasks.map((task) => (
        <Link
          key={task.id}
          href={`/tools/tasks/task/${task.id}?show=true`}
          className="flex flex-col gap-1 p-2 rounded-md hover:bg-easy-100 w-full cursor-pointer"
        >
          <p className="text-sm">{task.name}</p>
          <p className="text-xs">
            Vencimiento: {formatDate(task.deadline, "dd/MM/yyyy")}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default TaskList;
