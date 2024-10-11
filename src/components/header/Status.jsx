import { useNotifyContext } from "@/src/context/notify";
import { BellIcon, FlagIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Status() {
  const { notifications, setIsOpen } = useNotifyContext();
  const { t } = useTranslation();

  // Filtrar las notificaciones leidas
  const unreadNotifications = notifications?.filter((notification) => !notification.readAt);

  return (
    <div className="md:flex flex-col gap-1 items-start hidden">
      <div className="flex gap-x-2">
        <div className="flex items-center gap-x-1">
          <FlagIcon className="h-3 w-3 text-black" aria-hidden="true" />
          <p className="text-black text-xs">0</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <PlayCircleIcon className="h-3 w-3 text-black" aria-hidden="true" />
        <p className="text-xs text-black">{t('common:header:working')}</p>
      </div>
    </div>
  );
}
