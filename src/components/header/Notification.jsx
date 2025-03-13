import { useNotifyContext } from "@/src/context/notify";
import { BellIcon } from "@heroicons/react/20/solid";
import React from "react";

export default function Notification() {
  const { setIsOpen, unread } = useNotifyContext();

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
          <p className="text-black text-xs">{unread}</p>
        </button>
      </div>
    </div>
  );
}
