"use client";
import useAppContext from "../../../../../../../context/app";
import { onDismissModal } from "../../../../../../../lib/common";
import {
  Dialog,
  DialogTitle,
  Disclosure,
  Transition,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
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
import React, { useRef, useState } from "react";
import ComboBox, { ComboBoxWithElement } from "../components/ComboBox";
import { timezones } from "../../../../../../../lib/timezones";
import Dropdown from "../../../../../../../components/Dropdown";
import RepeatOptions from "./components/RepeatOptions";
import SelectMenu from "./components/SelectMenu";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { add, formatISO, parseISO } from "date-fns";
import ComboBoxMultiSelect from "@/src/components/form/ComboBoxMultiSelect";
import MultipleSelect from "@/src/components/form/MultipleSelect";
import SelectInput from "@/src/components/form/SelectInput";
import TextEditor from "@/src/components/TextEditor";
import RadioGroupColors from "./components/RadioGroupColors";

const repeatValues = [
  ...Array.from({ length: 35 }, (_, index) => ({
    name: index + 1,
    value: index + 1,
  })),
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
  const { lists } = useAppContext();
  const repeatOptions = [
    { name: "No repetir", value: 1, id: "none" },
    { name: "Diario", value: 2, id: "diario" },
    { name: "Semanal", value: 3, id: "semanal" },
    { name: "Mensual", value: 4, id: "mensual" },
    { name: "Anual", value: 5, id: "anual" },
  ];

  const reminderOptions = [
    {
      name: t("tools:calendar:reminder-options:now"),
      id: 1,
      value: null,
    },
    {
      name: t("tools:calendar:reminder-options:5m"),
      id: 2,
      value: { minutes: -5 },
    },
    {
      name: t("tools:calendar:reminder-options:10m"),
      id: 3,
      value: { minutes: -10 },
    },
    {
      name: t("tools:calendar:reminder-options:20m"),
      id: 4,
      value: { minutes: -20 },
    },
    {
      name: t("tools:calendar:reminder-options:30m"),
      id: 5,
      value: { minutes: -30 },
    },
    {
      name: t("tools:calendar:reminder-options:1h"),
      id: 6,
      value: { hours: -1 },
    },
    {
      name: t("tools:calendar:reminder-options:2h"),
      id: 7,
      value: { hours: -2 },
    },
    {
      name: t("tools:calendar:reminder-options:1d"),
      id: 8,
      value: { days: -1 },
    },
    {
      name: t("tools:calendar:reminder-options:-1d"),
      id: 9,
      value: { days: -1 },
    },
    {
      name: t("tools:calendar:reminder-options:-2d"),
      id: 10,
      value: { days: -2 },
    },
    {
      name: t("tools:calendar:reminder-options:custom"),
      id: 11,
      value: { custom: true },
    },
  ];
  const quillRef = useRef(null);

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

  const schema = yup.object().shape({
    name: yup.string().required(),
    important: yup.boolean(),
    private: yup.boolean(),
    startTime: yup.date().required(),
    endTime: yup
      .date()
      .required()
      .min(
        yup.ref("startTime"),
        "La fecha de fin debe ser mayor que la fecha de inicio"
      ),
    participants: yup.array().of(yup.object().shape({})),
    description: yup.string(),
    reminder: yup.object().shape({}),
    color: yup.string(),
    repeat: yup.string(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = (data) => {
    const {
      participants,
      reminder,
      startTime,
      endTime,
      reminderCustom,
      ...otherData
    } = data;
    console.log({ data });
    let reminderValue = "";
    if (reminder && reminder?.value) {
      if (reminder?.value?.custom) {
        reminderValue = reminderCustom;
      } else {
        reminderValue = add(otherData.startTime, reminder.value);
      }
    }
    const body = {
      ...otherData,
      participantsIds: participants?.map((participant) => participant.id) ?? [],
      reminder: reminderValue,
    };
    console.log({ body });
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex h-full flex-col bg-zinc-100 opacity-100 shadow-xl rounded-tl-[35px] rounded-bl-[35px] max-w-[calc(80vw)] w-full"
    >
      <div className="flex-1 min-h-0 flex-col overflow-y-scroll px-4">
        {/* Header */}
        <div className="bg-transparent py-6">
          <div className="flex items-start justify-between gap-x-3">
            <DialogTitle className="text-2xl font-medium leading-6 text-gray-900">
              {t("tools:calendar:new-event:new")}
            </DialogTitle>
          </div>
        </div>

        {/* Divider container */}
        <div className="gap-y-6 py-1 sm:gap-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 bg-white rounded-xl">
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
                name="name"
                id="event-name"
                placeholder={t("tools:calendar:new-event:name")}
                className={clsx(
                  "block w-full sm:py-4 border-0 px-2 sm:px-6 text-gray-900 rounded-xl focus:ring-0 placeholder:text-gray-400 sm:text-xl sm:leading-6",
                  {
                    "placeholder:text-red-600":
                      errors?.name && errors?.name?.message,
                  }
                )}
                {...register("name")}
                autoComplete="false"
              />
            </div>
            <div className="relative flex items-start px-2 sm:px-0">
              <div className="flex h-6 items-center">
                <input
                  id="important"
                  aria-describedby="important-description"
                  name="important"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  {...register("important")}
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
                      watch("important") ? "text-orange-600" : "text-gray-400",
                      "h-5 w-5 "
                    )}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Event Time */}
          <div className="gap-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:gap-y-0 sm:px-6 sm:py-5 transition-all duration-500">
            <div className="my-auto">
              <label
                htmlFor="project-description"
                className="block text-sm font-medium leading-6 text-gray-900 my-auto"
              >
                {t("tools:calendar:new-event:hour")}
              </label>
            </div>
            <div className="sm:col-span-2 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="w-full">
                  <label
                    htmlFor="startTime"
                    className="block text-xs font-light leading-6 text-gray-900"
                  >
                    {t("tools:calendar:new-event:date")}
                  </label>
                  <input
                    type={allDay ? "date" : "datetime-local"}
                    name="startTime"
                    id="startTime"
                    className={clsx(
                      "block rounded-md border py-1.5 text-gray-900 w-full shadow-sm border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                      { "border-red-600": errors && errors.startTime }
                    )}
                    {...register("startTime")}
                  />
                  {errors && errors?.startTime && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors?.startTime?.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="endTime"
                    className="block text-xs font-light leading-6 text-gray-900"
                  >
                    {t("tools:calendar:new-event:date-end")}
                  </label>
                  <input
                    type={allDay ? "date" : "datetime-local"}
                    name="endTime"
                    id="endTime"
                    className={clsx(
                      "block rounded-md border py-1.5 text-gray-900 w-full shadow-sm border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                      { "border-red-600": errors && errors.endTime }
                    )}
                    {...register("endTime")}
                  />
                  {errors && errors?.endTime && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors?.endTime?.message}
                    </p>
                  )}
                </div>
                <div className="relative flex items-start mt-2 sm:mt-6 w-full">
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="all-day"
                      aria-describedby="all-day-description"
                      name="all-day"
                      type="checkbox"
                      checked={allDay}
                      onChange={() => setAllDay(!allDay)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="all-day"
                      className="font-light text-gray-900 text-sm leading-6"
                    >
                      {t("tools:calendar:new-event:all-day")}
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <Disclosure>
                  <DisclosureButton className="py-2 text-primary underline decoration-dashed underline-offset-4 text-xs hover:decoration-solid">
                    {t("tools:calendar:new-event:time-zone")}
                  </DisclosureButton>
                  <Transition
                    enter="transition-opacity duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <DisclosurePanel className="text-gray-500 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ComboBox
                        data={timezones}
                        selected={timezoneStart}
                        setSelected={setTimezoneStart}
                      />
                      <ComboBox
                        data={timezones}
                        selected={timezoneEnd}
                        setSelected={setTimezoneEnd}
                      />
                    </DisclosurePanel>
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
            <div className="sm:col-span-2 flex  sm:divide-y sm:divide-gray-200 justify-start">
              <div className="border rounded-md">
                <Controller
                  name="repeat"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      {...field}
                      options={repeatOptions}
                      getValues={getValues}
                      setValue={setValue}
                      name="repeat"
                      error={errors.repeat}
                      selectedOption={repeatOptions[0]}
                    />
                  )}
                />
              </div>
              {/* <div className="flex items-center gap-2">
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
              <RepeatOptions frequency={repeatOption} /> */}
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
              <div className="flex flex-col gap-x-2">
                <Controller
                  name="participants"
                  control={control}
                  render={({ field }) => (
                    <ComboBoxMultiSelect
                      {...field}
                      options={lists?.users || []}
                      getValues={getValues}
                      setValue={setValue}
                      name="participants"
                      error={errors.participants}
                      showAvatar
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton className="py-2 text-zinc-700 flex items-center text-sm font-medium gap-0.5">
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
              </DisclosureButton>
              <Transition
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <DisclosurePanel className="grid grid-cols-1 gap-2  gap-y-6 py-1 sm:gap-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 bg-white rounded-xl">
                  <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                    <div>
                      <label
                        htmlFor="project-description"
                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                      >
                        {t("tools:calendar:description")}
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex border rounded-md bg-white">
                      <TextEditor
                        quillRef={quillRef}
                        className="w-full"
                        setValue={(e) => {
                          setValue("description", e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                    <div>
                      <label
                        htmlFor="project-description"
                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                      >
                        {t("tools:calendar:reminder")}
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex  bg-white justify-start">
                      <div className="border rounded-md">
                        <Controller
                          name="reminder"
                          control={control}
                          render={({ field }) => (
                            <SelectInput
                              {...field}
                              options={reminderOptions}
                              getValues={getValues}
                              setValue={setValue}
                              name="reminder"
                              error={errors.reminder}
                              object
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                    <div>
                      <label
                        htmlFor="project-description"
                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                      >
                        {t("tools:calendar:new-event:event-color")}
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex bg-white">
                      <RadioGroupColors setValue={setValue} />
                    </div>
                  </div>
                  <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                    <label
                      htmlFor="project-description"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                    >
                      {t("tools:calendar:new-event:private")}
                    </label>
                    <div className="sm:col-span-2 flex flex-col pb-4  bg-white justify-start">
                      <div className="relative flex items-start px-2 sm:px-0">
                        <div className="flex h-6 items-center">
                          <input
                            id="private"
                            aria-describedby="important-description"
                            name="private"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            {...register("private")}
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="private"
                            className="font-light flex items-center space-x-1.5"
                          >
                            {t("tools:calendar:new-event:private-label")}
                          </label>
                        </div>
                      </div>
                      {t("tools:calendar:new-event:private-label-2")}
                    </div>
                  </div>
                </DisclosurePanel>
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