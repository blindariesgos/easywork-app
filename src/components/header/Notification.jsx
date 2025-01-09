import { useNotifyContext } from "@/src/context/notify";
import { BellIcon, FlagIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Notification() {
  const { notifications, setIsOpen } = useNotifyContext();
  const { t } = useTranslation();

  // Filtrar las notificaciones no leidas
  const unreadNotifications = notifications?.reduce(
    (acc, notification) => (!notification.readAt ? acc + 1 : acc),
    0
  );

  useEffect(() => {
    console.log(unreadNotifications, notifications);
  }, [notifications]);

  return (
    <div className="md:flex flex-col gap-1 items-start hidden">
      <div className="flex gap-x-1">
        <button
          className="flex items-center gap-x-1"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <BellIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
          <p className="text-black text-xs">{unreadNotifications}</p>
        </button>
      </div>
    </div>
  );
}
