import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import * as yup from "yup";
import clsx from "clsx";
import {
  Disclosure,
  Transition,
  DialogTitle,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/react";
import {
  FireIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";

import { ComboBox, ComboBoxWithElement } from "@/src/components/news/combo-box";
import ComboBoxMultiSelect from "@/src/components/form/ComboBoxMultiSelect";
import { SelectMenu } from "@/src/components/news/forms/select-menu";
import SelectInput from "@/src/components/form/SelectInput";
import { timezones } from "@/src/lib/timezones";
import useAppContext from "@/src/context/app";
import { useBoolean } from "@/src/hooks";

import {
  CALENDARS,
  REPEAT_OPTIONS,
  EVENT_LOCATION,
  AVAILABILITY_OPTIONS,
} from "@/src/constants";
import CRMMultipleSelectV2 from "@/src/components/form/CRMMultipleSelectV2";
import RadioGroupColors from "@/src/app/[locale]/(home)/tools/(tool)/calendar/components/RadioGroupColors";
import { format, formatISO } from "date-fns";
import TextEditor from "@/src/components/TextEditor";
import { fetcherPost } from "@/src/lib/api/fetcher";
import { endpoints } from "@/src/utils/endpoints";
import { toast } from "react-toastify";

const schemaEvent = yup.object().shape({
  name: yup.string().required(),
  startTime: yup.date().required(),
  endTime: yup
    .date()
    .required()
    .min(
      yup.ref("startTime"),
      "La fecha de fin debe ser mayor que la fecha de inicio"
    ),
  participants: yup.array().of(yup.object().shape({})),
  crm: yup.array().of(
    yup.object().shape({
      type: yup.string(),
      id: yup.string(),
    })
  ),
});

export function EventNewEditForm({ currentEvent }) {
  console.log("🚀 ~ EventNewEditForm ~ currentEvent:", currentEvent);
  const [formLocalization, setFormLocalization] = useState(null);
  const [selectedCalendar, setSelectedCalendar] = useState(CALENDARS[0]);
  const [timezone, setTimezone] = useState(null);
  const { t } = useTranslation();

  const [reminder, setReminder] = useState({
    name: t("tools:calendar:reminder-options:now"),
    id: 1,
    value: 1 * 60000,
  });

  const { lists } = useAppContext();

  const router = useRouter();

  const fromTimezone = useBoolean();
  const isLoading = useBoolean();
  const allDay = useBoolean();
  const isEdit = useBoolean();

  const quillRef = useRef(null);
  const moreRef = useRef();

  const disabledFields = useMemo(
    () => (currentEvent ? !isEdit.value : false),
    [currentEvent, isEdit.value]
  );

  const reminderOptions = [
    {
      name: t("tools:calendar:reminder-options:now"),
      id: 1,
      value: 1 * 60000,
    },
    {
      name: t("tools:calendar:reminder-options:5m"),
      id: 2,
      value: 5 * 60000,
    },
    {
      name: t("tools:calendar:reminder-options:10m"),
      id: 3,
      value: 10 * 60000,
    },
    {
      name: t("tools:calendar:reminder-options:15m"),
      id: 4,
      value: 15 * 60000,
    },
    {
      name: t("tools:calendar:reminder-options:20m"),
      id: 5,
      value: 20 * 60000,
    },
    {
      name: t("tools:calendar:reminder-options:30m"),
      id: 6,
      value: 30 * 60000,
    },
    {
      name: t("tools:calendar:reminder-options:1h"),
      id: 7,
      value: 60 * 60000,
    },
    {
      name: t("tools:calendar:reminder-options:2h"),
      id: 8,
      value: 120 * 60000,
    },
    {
      name: t("tools:calendar:reminder-options:1d"),
      id: 9,
      value: 1440 * 60000,
    },
    {
      name: t("tools:calendar:reminder-options:-2d"),
      id: 11,
      value: 2880 * 60000,
    },
  ];

  const defaultValues = useMemo(
    () => ({
      name: currentEvent?.name ?? "",
      important: currentEvent?.important ?? false,
      startTime: currentEvent?.startTime
        ? format(currentEvent?.startTime, "yyyy-MM-dd'T'hh:mm")
        : new Date(),
      endTime: currentEvent?.endTime
        ? format(currentEvent?.endTime, "yyyy-MM-dd'T'hh:mm")
        : new Date(),
      repeat: currentEvent?.repeat ?? "none",
      localization: currentEvent?.localization ?? EVENT_LOCATION[0],
      participants: [],
      private: currentEvent?.private ?? false,
      reminder: currentEvent?.reminder ?? "",
      crm: currentEvent?.crm ?? [],
      color: currentEvent?.color ?? "#141052",
      availability: currentEvent?.availability ?? "Ocupado",

      description: currentEvent?.description ?? "",
    }),
    [currentEvent]
  );

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaEvent),
    defaultValues,
  });

  const {
    watch,
    control,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (
      currentEvent?.participants?.length > 0 &&
      values?.participants?.length === 0
    ) {
      const currentParticipants = currentEvent.participants.map((part) => {
        const user = lists?.users?.find((user) => user.id === part.id);
        return (
          user ?? {
            avatar: part.avatar ?? "",
            bio: part.bio ?? "",
            email: part.email ?? "",
            id: part.id ?? "",
            name: `${part.profile?.firstName ?? ""} ${part.profile?.lastName ?? ""}`,
            phone: part.phone ?? "",
            username: part.username ?? "",
          }
        );
      });

      setValue("participants", currentParticipants);
    }
  }, [currentEvent, lists?.users, setValue, values?.participants]);

  useEffect(() => {
    if (currentEvent && !values.reminder) {
      setValue(
        "reminder",
        currentEvent.reminder || {
          name: t("tools:calendar:reminder-options:now"),
          id: 1,
          value: 1 * 60000,
        }
      );
    }
  }, [currentEvent, setValue, t, values]);

  useEffect(() => {
    if (currentEvent && !values.availability) {
      setValue(
        "availability",
        AVAILABILITY_OPTIONS.find(
          (ava) =>
            ava.id.toLowerCase() === currentEvent.availability.toLowerCase()
        ) || AVAILABILITY_OPTIONS[0]
      );
    }
  }, [currentEvent, setValue, values]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        isLoading.onTrue();
        const payloadEvent = {
          name: data.name,
          startTime: formatISO(data.startTime),
          endTime: formatISO(data.endTime),
          participantsIds: data.participants.map((part) => part.id ?? ""),
          localization: formLocalization?.name ?? "",
          crm: data.crm.map((crm) => ({
            id: crm.id,
            type: crm.type,
          })),
          description: data.description || "<p></p>",
          //
          important: false,
          private: false,
          color: "#141052",
          availability: "Ocupado",
        };
        if (currentEvent) {
          // TODO: Falta actualizar evento
        } else {
          await fetcherPost(endpoints.calendar.create, payloadEvent);
          toast.success("Evento creado con éxito.");
        }
        handleClose();
      } catch (error) {
        toast.error("Se ha producido un error, inténtelo de nuevo más tarde.");
      } finally {
        isLoading.onFalse();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentEvent, formLocalization?.name]
  );

  const onDeleteEvent = useCallback(() => {}, []);

  const onClose = useCallback(() => {
    if (!currentEvent || !isEdit.value) {
      router.back();
    } else {
      isEdit.onFalse();
      // TODO: Falta resetear el formulario
    }
  }, [currentEvent, isEdit, router]);

  const renderHead = (
    <div className="bg-transparent py-6 sticky top-0 bg-zinc-100 z-20">
      <div className="flex items-start justify-between gap-x-3">
        <DialogTitle className="text-2xl font-medium leading-6 text-gray-900">
          {currentEvent
            ? t("tools:calendar:event")
            : t("tools:calendar:new-event:new")}
        </DialogTitle>
      </div>
    </div>
  );

  const renderEventName = (
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
              "placeholder:text-red-600": errors?.name && errors?.name?.message,
            }
          )}
          {...register("name")}
          autoComplete="false"
          disabled={disabledFields}
        />
      </div>

      <div className="relative flex items-start px-2 ml-2 sm:px-0">
        <div className="flex h-6 items-center">
          <input
            id="important"
            aria-describedby="important-description"
            name="important"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            {...register("important")}
            disabled={disabledFields}
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
                values.important ? "text-orange-600" : "text-gray-400",
                "h-5 w-5 "
              )}
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderEventDate = (
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
              type={allDay.value ? "date" : "datetime-local"}
              name="startTime"
              id="startTime"
              className={clsx(
                "block rounded-md border py-1.5 text-gray-900 w-full shadow-sm border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                { "border-red-600": errors && errors.startTime }
              )}
              {...register("startTime")}
              disabled={disabledFields}
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
              type={allDay.value ? "date" : "datetime-local"}
              name="endTime"
              id="endTime"
              className={clsx(
                "block rounded-md border py-1.5 text-gray-900 w-full shadow-sm border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                { "border-red-600": errors && errors.endTime }
              )}
              {...register("endTime")}
              disabled={disabledFields}
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
                checked={allDay.value}
                onChange={allDay.onToggle}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                disabled={disabledFields}
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
            <DisclosureButton
              onClick={() => !disabledFields && fromTimezone.onToggle}
              className="py-2 text-primary underline decoration-dashed underline-offset-4 text-xs hover:decoration-solid"
            >
              {t("tools:calendar:new-event:time-zone")}
            </DisclosureButton>
            <Transition
              show={fromTimezone.value}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DisclosurePanel className="text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComboBox
                  data={timezones}
                  selected={timezone}
                  setSelected={setTimezone}
                  disabled={disabledFields}
                />
              </DisclosurePanel>
            </Transition>
          </Disclosure>
        </div>
      </div>
    </div>
  );

  const renderCalendars = (
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
          data={CALENDARS}
          disabled={disabledFields}
          selected={selectedCalendar}
          setSelected={setSelectedCalendar}
        />
      </div>
    </div>
  );

  const renderRepeatEvent = (
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
                options={REPEAT_OPTIONS}
                getValues={getValues}
                setValue={setValue}
                name="repeat"
                error={errors.repeat}
                selectedOption={REPEAT_OPTIONS[0]}
                disabled={disabledFields}
              />
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderLocation = (
    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
      <div>
        <h3 className="text-sm font-medium leading-6 text-gray-900">
          {t("tools:calendar:new-event:ubication")}
        </h3>
      </div>
      <div className="sm:col-span-2 flex">
        <SelectMenu
          data={EVENT_LOCATION}
          value={values.localization}
          disabled={disabledFields}
          setValue={(location) => setValue("localization", location)}
        />
      </div>
    </div>
  );

  const renderParticipants = (
    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
      <div>
        <h3 className="text-sm font-medium leading-6 text-gray-900">
          {t("tools:calendar:new-event:wizards")}
        </h3>
      </div>
      <div className="sm:col-span-2 flex items-center">
        {currentEvent &&
          !currentEvent?.participants?.find(
            (part) => part?.id !== currentEvent?.createdBy?.id
          ) && (
            <div className="flex-shrink-0 max-w-48 hover:opacity-75 inline-flex gap-x-0.5 items-center bg-indigo-100 py-1 px-2 rounded-sm font-medium text-indigo-800">
              {currentEvent?.createdBy?.avatar && (
                <Image
                  width={32}
                  height={32}
                  className="inline-block h-5 w-5 rounded-full"
                  src={currentEvent?.createdBy?.avatar || "/img/avatar.svg"}
                  alt={"avatar"}
                />
              )}
              <p className="text-xs text-zinc-700 ml-1 truncate">
                {currentEvent?.createdBy?.profile?.firstName}{" "}
                {currentEvent?.createdBy?.profile?.lastName}
              </p>
            </div>
          )}
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
                disabled={disabledFields}
              />
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderActions = (
    <div className="flex flex-shrink-0 justify-start px-8 py-4">
      {(!currentEvent || isEdit.value) && (
        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {t("common:buttons:save")}
        </button>
      )}

      {currentEvent && !isEdit.value && (
        <button
          type="button"
          className="inline-flex ml-4 justify-center rounded-md bg-easywork-main px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-easywork-mainhover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={isEdit.onTrue}
        >
          {t("common:buttons:edit")}
        </button>
      )}

      <button
        type="button"
        className="ml-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
        onClick={onClose}
      >
        {t("common:buttons:cancel")}
      </button>

      {currentEvent && isEdit.value && (
        <button
          type="button"
          className="inline-flex ml-4 justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={onDeleteEvent}
        >
          {t("common:buttons:delete")}
        </button>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col bg-zinc-100 opacity-100 shadow-xl rounded-tl-[35px] rounded-bl-[35px] w-full flex-end"
    >
      <div
        className={clsx("flex-1 min-h-0 flex-col overflow-y-scroll px-6", {
          "pb-4": !isEdit,
        })}
      >
        {renderHead}

        <div className="gap-y-6 py-1 sm:gap-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 bg-white rounded-xl grid grid-cols-1 ">
          {renderEventName}

          {renderEventDate}

          {renderCalendars}

          {renderRepeatEvent}

          {renderLocation}

          {renderParticipants}
        </div>

        <Disclosure defaultOpen={!!currentEvent}>
          {({ open }) => (
            <>
              <DisclosureButton
                className="py-2 text-zinc-700 flex items-center text-sm font-medium gap-0.5"
                ref={moreRef}
              >
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
                  {/* Description */}
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
                      {disabledFields ? (
                        <TextEditor
                          quillRef={quillRef}
                          className="w-full"
                          setValue={(e) => {
                            setValue("description", e);
                          }}
                          value={values.description}
                          disabled
                        />
                      ) : (
                        <TextEditor
                          quillRef={quillRef}
                          className="w-full"
                          setValue={(e) => {
                            setValue("description", e);
                          }}
                          value={values.description}
                        />
                      )}
                    </div>
                  </div>

                  {/* CRM */}
                  <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                    <p className="text-sm text-left w-full md:w-36">
                      {t("tools:tasks:new:crm")}
                    </p>
                    <div className="w-full">
                      <CRMMultipleSelectV2
                        watch={watch}
                        disabled={disabledFields}
                        getValues={getValues}
                        setValue={setValue}
                        error={errors.crm}
                        name="crm"
                        border
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                    <div>
                      <label
                        htmlFor="project-description"
                        className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                      >
                        {t("tools:calendar:reminder")}
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex bg-white justify-start">
                      <ComboBox
                        disabled={disabledFields}
                        data={reminderOptions}
                        selected={reminder}
                        setSelected={(newReminder) =>
                          setValue("reminder", newReminder)
                        }
                      />
                    </div>
                  </div>

                  {/* color */}
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
                        disabled={disabledFields}
                      />
                    </div>
                  </div>

                  {/* Availability */}
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
                              options={AVAILABILITY_OPTIONS}
                              selectedOption={AVAILABILITY_OPTIONS[0]}
                              getValues={getValues}
                              setValue={setValue}
                              name="availability"
                              error={errors.availability}
                              disabled={disabledFields}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* private */}
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
                            name="private"
                            type="checkbox"
                            onChange={() =>
                              setValue("private", !values.private)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            disabled={disabledFields}
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
      {renderActions}
    </form>
  );
}
