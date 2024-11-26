"use client";
import useAppContext from "../../../../../../../context/app";
import {
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
} from "@heroicons/react/20/solid";
import { PencilIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ComboBox, { ComboBoxWithElement } from "./ComboBox";
import { timezones } from "../../../../../../../lib/timezones";
import SelectMenu from "./SelectMenu";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { add, addHours, format, formatISO, parseISO } from "date-fns";
import ComboBoxMultiSelect from "@/src/components/form/ComboBoxMultiSelect";
import SelectInput from "@/src/components/form/SelectInput";
import TextEditor from "@/src/components/TextEditor";
import CRMMultipleSelectV2 from "@/src/components/form/CRMMultipleSelectV2";
import RadioGroupColors from "./RadioGroupColors";
import {
  getContactId,
  getLeadById,
  getPolicyById,
  getReceiptById,
  addCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/src/lib/apis";
import { toast } from "react-toastify";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import useCalendarContext from "@/src/context/calendar";
import { useSession } from "next-auth/react";

const calendarios = [{ name: "Mi calendario", value: 1 }];

const eventLocalizations = [
  { id: 1, name: "Ninguna", online: true },
  { id: 2, name: "Casa del cliente", online: true },
  { id: 3, name: "Central Meeting Room", online: false },
  { id: 4, name: "East Meeting Room", online: false },
  { id: 5, name: "Zoom Personal", online: true },
];

export default function EventDetails({ data, id }) {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const { mutate } = useCalendarContext();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValueText] = useState("<p></p>");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const session = useSession();

  const repeatOptions = [
    { name: "No repetir", value: 1, id: "none" },
    { name: "Diario", value: 2, id: "diario" },
    { name: "Semanal", value: 3, id: "semanal" },
    { name: "Mensual", value: 4, id: "mensual" },
    { name: "Anual", value: 5, id: "anual" },
  ];

  const availabilityOptions = [
    { name: "Ocupado", value: 1, id: "Ocupado" },
    { name: "Inseguro", value: 2, id: "inseguro" },
    { name: "Disponible", value: 3, id: "semanal" },
    { name: "Fuera (Agregar al grafico de ausencias)", value: 4, id: "fuera" },
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

  const [timezoneStart, setTimezoneStart] = useState(false);
  const [timezoneEnd, setTimezoneEnd] = useState(false);
  const [calendary, setCalendary] = useState(calendarios[0]);
  const [formLocalization, setFormLocalization] = useState(
    eventLocalizations[0]
  );
  const [allDay, setAllDay] = useState(false);
  const router = useRouter();

  const schema = yup.object().shape({
    name: yup.string().required(),
    important: yup.boolean(),
    isPrivate: yup.boolean(),
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
    availability: yup.string(),
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

  const handleSubmitForm = async (data) => {
    setLoading(true);
    const {
      participants,
      reminder,
      startTime,
      endTime,
      reminderCustom,
      availability,
      color,
      important,
      isPrivate,
      repeat,
      name,
      crm,
    } = data;
    let reminderValue;
    if (reminder && reminder?.value) {
      if (reminder?.value?.custom) {
        reminderValue = reminderCustom;
      } else {
        reminderValue = add(otherData.startTime, reminder.value);
      }
    }

    const body = {
      participantsIds: participants?.map((participant) => participant.id) ?? [],
      reminder: formatISO(reminderValue ?? startTime),
      startTime: formatISO(startTime),
      endTime: formatISO(endTime),
      availability: availability ? availability : availabilityOptions[0].id,
      description: value ?? "<p></p>",
      color: color ?? "#141052",
      important: !!important,
      private: !!isPrivate,
      repeat: repeat ?? "none",
      name,
      crm: crm?.map((item) => ({ id: item.id, type: item.type })) || [],
    };
    console.log(body);
    if (params.get("oauth")) body.oauth = params.get("oauth");
    body.user = session?.data?.user?.id;
    try {
      if (id) {
        const response = await updateCalendarEvent(body, id);
        if (response.hasError) {
          toast.error(
            "Se ha producido un error al editar el evento, inténtelo de nuevo más tarde."
          );
        } else {
          toast.success("Evento editado con éxito.");
          mutate();
          router.back();
        }
      } else {
        const response = await addCalendarEvent(body);
        console.log(response);
        if (response.hasError) {
          toast.error(
            "Se ha producido un error al crear el evento, inténtelo de nuevo más tarde."
          );
        } else {
          toast.success("Evento creado con éxito.");
          mutate();
          router.back();
        }
      }
    } catch {
      toast.error("Se ha producido un error, inténtelo de nuevo más tarde.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const subscription = watch((data, { name }) => {
      if (name === "startTime") {
        console.log(
          data.startTime,
          addHours(data.startTime, 1),
          format(addHours(data.startTime, 1), "yyyy-MM-dd'T'HH:mm")
        );
        setValue(
          "endTime",
          allDay
            ? format(data.startTime, "yyyy-MM-dd")
            : format(addHours(data.startTime, 1), "yyyy-MM-dd'T'HH:mm")
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    console.log(data?.crm);
    if (!data) {
      setIsEdit(true);
      return;
    }

    if (data?.name) setValue("name", data?.name);
    if (data?.startTime)
      setValue("startTime", format(data?.startTime, "yyyy-MM-dd'T'hh:mm"));
    if (data?.endTime)
      setValue("endTime", format(data?.endTime, "yyyy-MM-dd'T'hh:mm"));
    if (data?.color) setValue("color", data?.color);
    if (data?.important) setValue("important", data?.important);
    if (data?.private) setValue("isPrivate", data?.private);
    if (data?.crm)
      setValue(
        "crm",
        data?.crm
          ? data?.crm.map((item) => ({
              id: item.id,
              name: item.crmEntity.name,
              type: item.type,
              title: item.crmEntity.title ? item.crmEntity.title : undefined,
              username: undefined,
            }))
          : []
      );
    if (data?.description)
      setValueText(data?.description ? data?.description : "<p></p>");
    if (data?.participants)
      setValue(
        "participants",
        data?.participants
          ? data?.participants.map((participant) => ({
              avatar: participant.avatar,
              bio: participant.bio,
              email: participant.email,
              id: participant.id,
              name: `${participant.profile.firstName} ${participant.profile.lastName}`,
              phone: participant.phone,
              username: participant.username,
            }))
          : []
      );

    // const subscription = watch((data, { name }) => {
    //   setIsEdit(true);
    // });

    // return () => subscription.unsubscribe();
  }, [data]);

  const setCrmContact = async (contactId) => {
    const response = await getContactId(contactId);
    setValue("crm", [
      {
        id: response?.id,
        type: "contact",
        name: response?.fullName || response?.name,
      },
    ]);
    setValue("name", "CRM - Cliente: ");
    // setOpenOptions((prev) => ({ ...prev, more: true }));
    setLoading(false);
  };

  const setCrmLead = async (leadId) => {
    console.log("paso por lead");
    const response = await getLeadById(leadId);
    setValue("crm", [
      {
        id: response?.id,
        type: "lead",
        name: response?.fullName || response?.name,
      },
    ]);
    setValue("name", "CRM - Prospecto: ");
    // setOpenOptions((prev) => ({ ...prev, more: true }));
    setLoading(false);
  };

  const setCrmReceipt = async (receiptId) => {
    const response = await getReceiptById(receiptId);
    setValue("crm", [
      {
        id: response?.id,
        type: "receipt",
        name: response?.title,
      },
    ]);
    console.log("receipt", response);
    setValue("name", "CRM - Recibo: ");
    // setOpenOptions((prev) => ({ ...prev, more: true }));
    setLoading(false);
  };

  const setCrmPolicy = async (policyId) => {
    const response = await getPolicyById(policyId);
    setValue("crm", [
      {
        id: response?.id,
        type: "poliza",
        name: `${response?.company?.name ?? ""} ${response?.poliza ?? ""} ${response?.type?.name ?? ""}`,
      },
    ]);
    setValue("name", "CRM - Póliza: ");
    // setOpenOptions((prev) => ({ ...prev, more: true }));
    setLoading(false);
  };

  useEffect(() => {
    const prevId = params.get("prev_id");

    if (params.get("prev") === "contact") {
      setLoading(true);
      setCrmContact(prevId);
      return;
    }

    if (params.get("prev") === "lead") {
      setLoading(true);
      setCrmLead(prevId);
      return;
    }

    if (params.get("prev") === "policy") {
      setLoading(true);
      setCrmPolicy(prevId);
      return;
    }

    if (params.get("prev") === "receipt") {
      setLoading(true);
      setCrmReceipt(prevId);
      return;
    }
  }, [params.get("prev")]);

  const deleteEvent = async () => {
    try {
      const response = await deleteCalendarEvent(
        id,
        session?.data?.user?.id,
        params.get("oauth")
      );
      if (response.hasError) {
        toast.error(
          "Se ha producido un error al eliminar el evento, inténtelo de nuevo más tarde."
        );
      } else {
        toast.success("Evento eliminado.");
        mutate();
        router.back();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex h-full flex-col bg-zinc-100 opacity-100 shadow-xl rounded-tl-[35px] rounded-bl-[35px] w-full flex-end"
    >
      {loading && <LoaderSpinner />}
      <div
        className={clsx("flex-1 min-h-0 flex-col overflow-y-scroll px-6", {
          "pb-4": !isEdit,
        })}
      >
        {/* Header */}
        <div className="bg-transparent py-6 sticky top-0 bg-zinc-100 z-20">
          <div className="flex items-start justify-between gap-x-3">
            <DialogTitle className="text-2xl font-medium leading-6 text-gray-900">
              {data
                ? t("tools:calendar:event")
                : t("tools:calendar:new-event:new")}
            </DialogTitle>
          </div>
        </div>

        {/* Divider container */}
        <div className="gap-y-6 py-1 sm:gap-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 bg-white rounded-xl grid grid-cols-1 ">
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
                disabled={!isEdit}
              />
            </div>
            {data && (
              <button
                type="button"
                onClick={() => setIsEdit(!isEdit)}
                title="Editar"
              >
                <PencilIcon className="h-6 w-6 text-primary" />
              </button>
            )}

            <div className="relative flex items-start px-2 ml-2 sm:px-0">
              <div className="flex h-6 items-center">
                <input
                  id="important"
                  aria-describedby="important-description"
                  name="important"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  {...register("important")}
                  disabled={!isEdit}
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
                    disabled={!isEdit}
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
                    disabled={!isEdit}
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
                      disabled={!isEdit}
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
                        disabled={!isEdit}
                      />
                      <ComboBox
                        data={timezones}
                        selected={timezoneEnd}
                        setSelected={setTimezoneEnd}
                        disabled={!isEdit}
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
                disabled={!isEdit}
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
                      disabled={!isEdit}
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
                  disabled={!isEdit}
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
                      disabled={!isEdit}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <Disclosure defaultOpen={!!data}>
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
                    {t("tools:tasks:new:crm")}
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
                          setValueText(e);
                        }}
                        value={value}
                        // disabled={!isEdit}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                    <p className="text-sm text-left w-full md:w-36">
                      {t("tools:tasks:new:crm")}
                    </p>
                    <div className="w-full">
                      <CRMMultipleSelectV2
                        getValues={getValues}
                        setValue={setValue}
                        name="crm"
                        error={errors.crm}
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
                      <div className="border rounded-md w-full md:w-[300px]">
                        <Controller
                          name="reminder"
                          control={control}
                          render={({ field }) => (
                            <SelectInput
                              {...field}
                              options={reminderOptions}
                              selectedOption={reminderOptions[0]}
                              getValues={getValues}
                              setValue={setValue}
                              name="reminder"
                              error={errors.reminder}
                              object
                              disabled={!isEdit}
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
                      <RadioGroupColors
                        setValue={setValue}
                        name="color"
                        watch={watch}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                    <div>
                      <label
                        htmlFor="project-description"
                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                      >
                        {t("tools:calendar:new-event:availability")}
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex  bg-white justify-start">
                      <div className="border rounded-md">
                        <Controller
                          name="availability"
                          control={control}
                          render={({ field }) => (
                            <SelectInput
                              {...field}
                              options={availabilityOptions}
                              selectedOption={availabilityOptions[0]}
                              getValues={getValues}
                              setValue={setValue}
                              name="availability"
                              error={errors.availability}
                              disabled={!isEdit}
                            />
                          )}
                        />
                      </div>
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
                            id="isPrivate"
                            aria-describedby="important-description"
                            name="isPrivate"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            {...register("isPrivate")}
                            disabled={!isEdit}
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="isPrivate"
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
      {isEdit && (
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
            onClick={() => (data ? setIsEdit(false) : router.back())}
          >
            {t("common:buttons:cancel")}
          </button>
          {data && (
            <button
              type="button"
              className="inline-flex ml-4 justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={() => deleteEvent()}
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </form>
  );
}
