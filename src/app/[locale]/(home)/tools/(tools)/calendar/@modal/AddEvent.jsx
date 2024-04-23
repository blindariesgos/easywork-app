"use client";
import useAppContext from "@/context/app";
import { onDismissModal } from "@/lib/common";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FireIcon,
  LinkIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ComboBox, { ComboBoxWithElement } from "../components/ComboBox";
import { timezones } from "@/lib/timezones";
import Dropdown from "@/components/Dropdown";
import RepeatOptions from "./components/RepeatOptions";
import SelectMenu from "./components/SelectMenu";
import SelectEventAttendees from "./components/SelectEventAttendees";
import { useTranslation } from "react-i18next";

const repeatValues = [
  ...Array.from({ length: 35 }, (_, index) => ({
    name: index + 1,
    value: index + 1,
  })),
];

const listEventAttendees = [
  {
    id: 1,
    name: "Rosmer Campos",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 2,
    name: "Manuel Turizo",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 3,
    name: "Amelia Rodriguez",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 4,
    name: "Marco Antonio Pérez",
    image:
      "https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

const calendarios = [{ name: "Mi calendario", value: 1 }];

const eventLocalizations = [
  { id: 1, name: "Ninguna", online: true },
  { id: 2, name: "Casa del cliente", online: true },
  { id: 3, name: "Central Meeting Room", online: false },
  { id: 4, name: "East Meeting Room", online: false },
  { id: 5, name: "Zoom Personal", online: true },
];

export default function AddEvent() {
  const { t } = useTranslation();
  const repeatOptions = [
    { name: "No repetir", value: 1, label: "" },
    { name: "Diario", value: 2, label: t("tools:calendar:day") },
    { name: "Semanal", value: 3, label: t("tools:calendar:week") },
    { name: "Mensual", value: 4, label: t("tools:calendar:month") },
    { name: "Anual", value: 5, label: t("tools:calendar:year") },
  ];
  const [eventImportant, setEventImportant] = useState(false);
  const [timezoneStart, setTimezoneStart] = useState(false);
  const [timezoneEnd, setTimezoneEnd] = useState(false);
  const [calendary, setCalendary] = useState(calendarios[0]);
  const [repeatOption, setRepeatOption] = useState(repeatOptions[0]);
  const [repeatFrecuency, setRepeatFrecuency] = useState(repeatValues[0]);
  const [formLocalization, setFormLocalization] = useState(
    eventLocalizations[0]
  );

  const [allDay, setAllDay] = useState(false);
  const router = useRouter();
  const { setOpenModal } = useAppContext();

  return (
    <form className="flex h-full flex-col bg-zinc-100 opacity-100 shadow-xl">
      <div className="flex-1 min-h-0 flex-col overflow-y-scroll px-4">
        {/* Header */}
        <div className="bg-transparent py-6">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              <Dialog.Title className="text-2xl font-medium leading-6 text-gray-900">
                {t("tools:calendar:new-event:new")}
              </Dialog.Title>
            </div>
            <div className="flex h-7 items-center">
              <button
                type="button"
                className="relative text-gray-400 hover:text-gray-500"
                onClick={() => onDismissModal(router, setOpenModal)}
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">
                  {t("tools:calendar:new-event:close")}
                </span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider container */}
        <div className="space-y-6 py-1 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 bg-white rounded-xl">
          {/* Event name */}
          <div className="flex flex-col sm:flex-row sm:items-center w-full bg-transparent sm:pr-6">
            <label
              htmlFor="event-name"
              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5 sr-only"
            >
              {t("tools:calendar:new-event:name")}
            </label>
            <div className="sm:col-span-2 flex-grow rounded-t-xl">
              <input
                type="text"
                name="event-name"
                id="event-name"
                placeholder={t("tools:calendar:new-event:name")}
                className="block w-full border-0 sm:py-4 px-2 sm:px-6 text-gray-900 rounded-xl focus:ring-0 placeholder:text-gray-400 sm:text-xl sm:leading-6"
              />
            </div>
            <div className="relative flex items-start px-2 sm:px-0">
              <div className="flex h-6 items-center">
                <input
                  id="important"
                  aria-describedby="important-description"
                  name="important"
                  type="checkbox"
                  checked={eventImportant}
                  onChange={() => setEventImportant(!eventImportant)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label
                  htmlFor="important"
                  className="font-light text-gray-900 flex items-center space-x-1.5"
                >
                  {t("tools:calendar:new-event:important")}
                  <FireIcon
                    className={clsx(
                      eventImportant ? "text-orange-600" : "text-gray-400",
                      "h-5 w-5 "
                    )}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Event Time */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5 transition-all duration-500">
            <div className="my-auto">
              <label
                htmlFor="project-description"
                className="block text-sm font-medium leading-6 text-gray-900 my-auto"
              >
                {t("tools:calendar:new-event:hour")}
              </label>
            </div>
            <div className="sm:col-span-2 flex flex-col">
              <div className="flex sm:items-center gap-2 sm:flex-row flex-col">
                <div>
                  <label
                    htmlFor="timestart"
                    className="block text-xs font-light leading-6 text-gray-900"
                  >
                    {t("tools:calendar:new-event:date")}
                  </label>
                  <input
                    type={allDay ? "date" : "datetime-local"}
                    name="timestart"
                    id="timestart"
                    className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {/* Guión horizontal */}
                <div className="h-0.5 w-6 mt-6 bg-gray-200 hidden sm:block" />
                <div>
                  <label
                    htmlFor="timeend"
                    className="block text-xs font-light leading-6 text-gray-900"
                  >
                    {t("tools:calendar:new-event:date-end")}
                  </label>
                  <input
                    type={allDay ? "date" : "datetime-local"}
                    name="timeend"
                    id="timeend"
                    className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="relative flex items-start mt-2 sm:mt-6">
                  <div className="flex h-6 items-center">
                    <input
                      id="all-day"
                      aria-describedby="all-day-description"
                      name="all-day"
                      type="checkbox"
                      checked={allDay}
                      onChange={() => setAllDay(!allDay)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-1 text-sm leading-6">
                    <label
                      htmlFor="all-day"
                      className="font-light text-gray-900"
                    >
                      {t("tools:calendar:new-event:all-day")}
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <Disclosure>
                  <Disclosure.Button className="py-2 text-blue-600 underline decoration-dashed underline-offset-4 hover:decoration-solid">
                    {t("tools:calendar:new-event:time-zone")}
                  </Disclosure.Button>
                  <Transition
                    enter="transition-opacity duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Disclosure.Panel className="text-gray-500 flex gap-2 sm:flex-row flex-col">
                      <ComboBox
                        data={timezones}
                        selected={timezoneStart}
                        setSelected={setTimezoneStart}
                      />
                      <div className="h-0.5 w-6 mt-6 bg-gray-200 hidden sm:block" />
                      <ComboBox
                        data={timezones}
                        selected={timezoneEnd}
                        setSelected={setTimezoneEnd}
                      />
                    </Disclosure.Panel>
                  </Transition>
                </Disclosure>
              </div>
            </div>
          </div>

          {/* Event calendario */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="project-description"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
              >
                {t("tools:calendar:name")}
              </label>
            </div>
            <div className="sm:col-span-2 flex">
              <ComboBoxWithElement
                data={calendarios}
                selected={calendary}
                setSelected={setCalendary}
              />
            </div>
          </div>

          {/* Event Repeat */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="project-description"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
              >
                {t("tools:calendar:new-event:repeat")}
              </label>
            </div>
            <div className="sm:col-span-2 flex flex-col sm:divide-y sm:divide-gray-200 space-y-4">
              <div className="flex items-center gap-2">
                <Dropdown
                  elements={repeatOptions}
                  value={repeatOption}
                  setValue={setRepeatOption}
                />
                {repeatOption.value !== 1 && (
                  <div className="flex gap-1 items-center">
                    <p className="text-sm text-gray-800">Cada</p>
                    <Dropdown
                      elements={repeatValues}
                      value={repeatFrecuency}
                      setValue={setRepeatFrecuency}
                      width={"w-16"}
                    />
                    <p className="text-sm text-gray-800">
                      {repeatOption.label}
                    </p>
                  </div>
                )}
              </div>
              <RepeatOptions frequency={repeatOption} />
            </div>
          </div>

          {/* Event localization */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium leading-6 text-gray-900">
                {t("tools:calendar:new-event:ubication")}
              </h3>
            </div>
            <div className="sm:col-span-2">
              <div className="flex space-x-2">
                <SelectMenu
                  data={eventLocalizations}
                  value={formLocalization}
                  setValue={setFormLocalization}
                />
              </div>
            </div>
          </div>

          {/* Event Asistants. */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <h3 className="text-sm font-medium leading-6 text-gray-900">
                {t("tools:calendar:new-event:wizards")}
              </h3>
            </div>
            <div className="sm:col-span-2">
              <div className="flex space-x-2">
                <SelectEventAttendees eventAttendees={listEventAttendees} />
              </div>
            </div>
          </div>
        </div>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="py-2 text-zinc-700 flex items-center text-sm font-medium gap-0.5">
                {open ? (
                  <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                )}
                <p>{t("tools:calendar:new-event:more")}</p>
                <p className="font-light ml-2">
                  (
                  <span className="hover:underline">
                    {t("tools:calendar:new-event:description")}
                  </span>
                  ,{" "}
                  <span className="hover:underline">
                    {t("tools:calendar:new-event:reminder")}
                  </span>
                  ,{" "}
                  <span className="hover:underline">
                    {t("tools:calendar:new-event:event-color")}
                  </span>
                  ,{" "}
                  <span className="hover:underline">
                    {t("tools:calendar:new-event:availability")}
                  </span>
                  ,{" "}
                  <span className="hover:underline">
                    {t("tools:calendar:new-event:private")}
                  </span>
                  )
                </p>
              </Disclosure.Button>
              <Transition
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Disclosure.Panel className="text-gray-500 flex gap-2 sm:flex-row flex-col"></Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>

      {/* Action buttons */}
      <div className="flex flex-shrink-0 justify-start px-4 py-4">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {t("common:buttons:save")}
        </button>
        <button
          type="button"
          className="ml-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
          onClick={() => setOpen(false)}
        >
          {t("common:buttons:cancel")}
        </button>
      </div>
    </form>
  );
}
