import { useNotifyContext } from "@/src/context/notify";
import { BellIcon, FlagIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Notification() {
  const { notifications, setIsOpen } = useNotifyContext();
  const { t } = useTranslation();

  // Filtrar las notificaciones leidas
  const unreadNotifications = notifications?.filter((notification) => !notification.readAt);

  return (
    <div className="md:flex flex-col gap-1 items-start hidden">
      <div className="flex gap-x-1">
        <button className="flex items-center gap-x-1" onClick={() => {
          setIsOpen(true);
        }}>
          <BellIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
          <p className="text-black text-xs">{unreadNotifications?.length ?? 0}</p>
        </button>
      </div>
    </div>
  );
}
