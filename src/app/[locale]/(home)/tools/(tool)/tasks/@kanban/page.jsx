"use client";
import KanbanTasks from "./KanbanTasks";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="flow-root relative h-full">
      <KanbanTasks />
    </div>
  );
}
