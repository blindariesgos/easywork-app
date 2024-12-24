"use client";
import KanbanLeads from "./KanbanLeads";
import { useTranslation } from "react-i18next";

export default function Page({ searchParams }) {
  const { t } = useTranslation();

  return (
    <div className="flow-root relative h-full">
      <KanbanLeads />
    </div>
  );
}
