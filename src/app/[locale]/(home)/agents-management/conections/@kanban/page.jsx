"use client";
import KanbanRecruitment from "./KanbanRecruitment";
import { useTranslation } from "react-i18next";

export default function Page({ searchParams }) {
  const { t } = useTranslation();

  return (
    <div className="flow-root relative h-full">
      <KanbanRecruitment />
    </div>
  );
}
