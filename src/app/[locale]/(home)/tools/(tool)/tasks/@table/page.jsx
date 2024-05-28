import React from "react";
import TableTask from "./TableTask";
import { getTasksUser } from "../../../../../../../lib/apis";

async function getAllTasks(page) {
  try {
    // const tasks = await getTasks(page, 6); //Rol admin
    const tasks = await getTasksUser(page, 6);
    return tasks;
  } catch (error) {
    console.log("error", error);
  }
}

export default async function page({ params, searchParams: { page } }) {
  const tasks = await getAllTasks(page);
  return (
    <div className="relative h-full">
      <TableTask data={tasks} />
    </div>
  );
}
