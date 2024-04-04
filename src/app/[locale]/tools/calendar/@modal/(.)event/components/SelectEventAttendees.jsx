import { PlusIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export default function SelectEventAttendees({ eventAttendees }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-1 flex flex-wrap sm:gap-1 sm:space-y-0 transition-all duration-500">
      {eventAttendees.map((attendee) => (
        <Link
          key={attendee.id}
          href="#"
          className="flex-shrink-0 max-w-48 hover:opacity-75 inline-flex gap-x-0.5 items-center bg-indigo-100 py-1 px-2 rounded-sm font-medium text-indigo-800"
        >
          <Image
            width={32}
            height={32}
            className="inline-block h-5 w-5 rounded-full"
            src={attendee.image}
            alt={"Rosmer"}
          />
          <p className="text-xs text-zinc-700 ml-1 truncate">{attendee.name}</p>
          <button
            type="button"
            className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-primary/20"
          >
            <span className="sr-only">{t('tools:calendar:new-event:remove')}</span>
            <svg
              viewBox="0 0 14 14"
              className="h-3.5 w-3.5 stroke-indigo-700/50 group-hover:stroke-indigo-700/75"
            >
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>
        </Link>
      ))}

      <button
        type="button"
        className="relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="absolute -inset-2" />
        <span className="sr-only">{t('tools:calendar:new-event:add-team')}</span>
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
