"use client";
import useAppContext from "../../../../../../../context/app";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";
import CalendarButton from "./CalendarButton";
import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import CreateEventButton from "./CreateEventButton";
import ViewsOptions from "./ViewsOptions";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useCommon } from "../../../../../../../hooks/useCommon";
import { useSearchParams, useRouter } from "next/navigation";

export default function CalendarHeader() {
  const { calendarView, setCalendarView } = useAppContext();
  const { calendarViews } = useCommon();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();

  const openConnect = () => {
    params.set("connect", true);
    replace(`/tools/calendar?${params.toString()}`);
  };

  return (
    <header className="flex flex-col">
      <div className="lg:px-6 px-2 flex gap-3 items-center bg-white py-4 rounded-md">
        <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
          {t("tools:calendar:name")}
        </h1>
        <CreateEventButton />
        <div className="flex-grow">
          <label htmlFor="search" className="sr-only">
            {t("tools:calendar:search")}
          </label>
          <input
            type="search"
            name="search"
            id="search-cal"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={t("tools:calendar:search")}
          />
        </div>
        <CalendarButton />
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Cog8ToothIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
