"use client";

import { useTranslation } from "react-i18next";

export default function TaskSubMenu() {
  const { t } = useTranslation();
  return (
    <div className="flex gap-6 text-sm text-easywork-main ml-4">
      <div>
        <p>Correos electrónicos</p>
      </div>
      <div>
        <p>
          <span className="bg-white rounded-full p-1">0</span> Marcar como no leídos
        </p>
      </div>
      <div>
        <p>Marcar como leídos</p>
      </div>
    </div>
  );
}
