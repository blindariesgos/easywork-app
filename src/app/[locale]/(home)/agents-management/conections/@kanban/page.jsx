"use client";
import KanbanConections from "./KanbanConections";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="flow-root relative h-full">
      <KanbanConections />
    </div>
  );
}
