import SlideOver from "../../../../../../../../components/SlideOver";
import React, { Suspense } from "react";
import TaskEdit from "./TaskEdit";
import { getComments, getTaskId } from "../../../../../../../../lib/apis";

async function getTasksId(id) {
  try {
    const tasks = await getTaskId(id);
    return tasks;
  } catch (error) {
    throw new Error(error);
  }
}

async function getCommentsTaskId(id) {
  try {
    const comments = await getComments(id);
    return comments;
  } catch (error) {
    throw new Error(error);
  }
}
export default async function page({ params: { id } }) {
  const data = await getTasksId(id);
  const comments = await getCommentsTaskId(id);
  data.comments = comments;
  return (
    <SlideOver colorTag="bg-green-primary" samePage={`/tools/tasks?page=1`}>
      <TaskEdit data={data} />
    </SlideOver>
  );
}
