import { useNotifyContext } from "@/src/context/notify";
import { BellIcon, FlagIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Status({ status }) {
  const { notifications, setIsOpen } = useNotifyContext();
  const { t } = useTranslation();

  console.log(notifications);

  // Filtrar las notificaciones leidas
  const unreadNotifications = notifications?.filter(
    (notification) => !notification.readAt
  );

  return (
    <div className="md:flex flex-col gap-1 items-start hidden">
      <div className="flex gap-x-2">
        <div className="flex items-center gap-x-1">
          <FlagIcon className="h-3 w-3 ml-0.5 text-black" aria-hidden="true" />
          <p className="text-black text-xs">0</p>
        </div>
      </div>
      <div className="flex items-center">
        {status.icon}
        <p className="text-xs text-black whitespace-nowrap">{status.label}</p>
      </div>
    </div>
  );
}
