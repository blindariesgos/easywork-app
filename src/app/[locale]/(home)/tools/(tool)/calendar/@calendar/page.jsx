"use client";
import useAppContext from "../../../../../../../context/app";
import CalendarHeader from "../components/CalendarHeader";
import CalendarConfig from "../components/CalendarConfig";
import CalendarConnect from "../components/CalendarConnect";
import CalendarDisconnect from "../components/CalendarDisconnect";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { yupResolver } from "@hookform/resolvers/yup";
import { RadioGroup, Label, Radio } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useCalendarContext from "../../../../../../../context/calendar";
import { getAllOauth } from "../../../../../../../lib/apis";
import { timezones } from "../../../../../../../lib/timezones";
import { useRouter, useSearchParams } from "next/navigation";
import interactionPlugin from "@fullcalendar/interaction";
import SelectMenu from "./../components/SelectMenu";
import ComboBox, { ComboBoxWithElement } from "./../components/ComboBox";
import ComboBoxMultiSelect from "@/src/components/form/ComboBoxMultiSelect";
import { Controller, useForm } from "react-hook-form";
import listPlugin from "@fullcalendar/list";
import { XCircleIcon } from "@heroicons/react/24/outline";
import * as yup from "yup";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  Transition,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

export default function CalendarHome({ children }) {
  const session = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { t } = useTranslation();
  const { events } = useCalendarContext();
  const calendarRef = useRef(null);
  const router = useRouter();
  const [calendarView, setCalendarView] = useState("timeGridWeek");
  const [selectOauth, setSelectOauth] = useState(null);
  const { lists } = useAppContext();
  const [isOpen, setIsOpen] = useState({
    state: false,
    start: null,
    end: null,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [timezoneStart, setTimezoneStart] = useState(false);
  const [timezoneEnd, setTimezoneEnd] = useState(false);
  const calendarViews = [
    {
      name: t("tools:calendar:day"),
      id: "timeGridDay",
    },
    {
      name: t("tools:calendar:week"),
      id: "timeGridWeek",
    },
    {
      name: t("tools:calendar:month"),
      id: "dayGridMonth",
    },
    {
      name: t("tools:calendar:program"),
      id: "listMonth",
    },
  ];

  const eventLocalizations = [
    { id: 1, name: "Ninguna", online: true },
    { id: 2, name: "Casa del cliente", online: true },
    { id: 3, name: "Central Meeting Room", online: false },
    { id: 4, name: "East Meeting Room", online: false },
    { id: 5, name: "Zoom Personal", online: true },
  ];

  const [formLocalization, setFormLocalization] = useState(
    eventLocalizations[0]
  );

  useEffect(() => {
    getAllOauth(session.data.user.id, "Google Calendar").then((res) => {
      setSelectOauth(res[0]);
    });
  }, []);

  useEffect(() => {
    const changeView = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(calendarView);
    };

    changeView();
  }, [calendarView]);

  const openConnect = () => {
    params.set("connect", true);
    router.replace(`/tools/calendar?${params.toString()}`);
  };

  const handleSelectDate = (info) => {
    console.log(info);
    setIsOpen({
      state: true,
      start: info.startStr,
      end: info.endStr,
    });
    setValue("start", info.startStr);
    setValue("end", info.endStr);
  };

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

  const handleClickEvent = (info) => {
    router.push(
      `/tools/calendar/event/${info.event.id}?show=true${selectOauth ? `&oauth=${selectOauth?.id}` : ""}`
    );
  };

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
    console.log(events);
  }, [events]);

  return (
    <div className="flex flex-col flex-grow">
      <CalendarHeader selectOauth={selectOauth} />
      <CalendarConfig selectOauth={selectOauth} />
      <CalendarConnect
        selectOauth={selectOauth}
        setSelectOauth={setSelectOauth}
      />
      <CalendarDisconnect
        selectOauth={selectOauth}
        setSelectOauth={setSelectOauth}
      />
      <div className="h-full">
        <div className="flex-none items-center justify-between  py-4 flex">
          <div className="flex gap-2 items-center">
            <RadioGroup
              value={calendarView}
              onChange={setCalendarView}
              className="bg-zinc-300/40 rounded-full"
            >
              <div className="grid grid-cols-4 gap-1">
                {calendarViews.map((option) => (
                  <Radio
                    key={option.id}
                    value={option.id}
                    className={clsx(
                      "data-[checked]:bg-primary data-[checked]:text-white data-[checked]:hover:bg-indigo-500",
                      "ring-1 ring-inset ring-transparent bg-transparent text-gray-900 hover:bg-indigo-200",
                      "flex items-center justify-center rounded-full font-medium py-2 px-3 text-sm capitalize sm:flex-1 cursor-pointer"
                    )}
                  >
                    <Label as="span" className="text-xs">
                      {option.name}
                    </Label>
                  </Radio>
                ))}
              </div>
            </RadioGroup>
            <div className="flex gap-1 bg-zinc-300/40 hover:bg-zinc-300/50 px-2 rounded-full py-1 items-center cursor-pointer">
              <span className="inline-flex items-center rounded-full bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
                0
              </span>
              <p className="text-xs text-gray-900 font-medium">
                {t("tools:calendar:invitations")}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              openConnect();
            }}
          >
            {t("tools:calendar:connect")}
          </button>
        </div>
        <FullCalendar
          locale={esLocale}
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          navLinks={true}
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev,today,next",
          }}
          events={events}
          initialView="dayGridMonth"
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleSelectDate}
          eventClick={handleClickEvent}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: "09:00",
            endTime: "18:00",
          }}
        />
        <Dialog
          open={isOpen.state}
          onClose={(prev) => setIsOpen({ ...prev, state: false })}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex items-center justify-center">
            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              className="flexl flex-col bg-zinc-100 opacity-100 w-2/5 shadow-xl p-5 rounded-[35px] flex-end"
            >
              <div className="flex flex-col sm:flex-row sm:items-center w-full bg-transparent">
                <input
                  type="text"
                  name="name"
                  id="event-name"
                  placeholder={t("tools:calendar:new-event:name")}
                  className={clsx(
                    "block w-full border-0 px-1 text-gray-900 rounded-xl focus:ring-0 placeholder:text-gray-400 text-base",
                    {
                      "placeholder:text-red-600":
                        errors?.name && errors?.name?.message,
                    }
                  )}
                  {...register("name")}
                  autoComplete="false"
                />
                <XCircleIcon
                  className="w-5 h-5 ml-2 text-easywork-main"
                  onClick={(prev) => setIsOpen({ ...prev, state: false })}
                />
              </div>
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
              <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                <div>
                  <h3 className="text-sm font-medium leading-6 text-gray-900">
                    {t("tools:calendar:new-event:ubication")}
                  </h3>
                </div>
                <div className="sm:col-span-2">
                  <div className="flex">
                    <SelectMenu
                      data={eventLocalizations}
                      value={formLocalization}
                      setValue={setFormLocalization}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Dialog>
        {children}
      </div>
    </div>
  );
}
