"use client";
import CalendarHeader from "../components/CalendarHeader";
import CalendarConfig from "../components/CalendarConfig";
import CalendarConnect from "../components/CalendarConnect";
import CalendarDisconnect from "../components/CalendarDisconnect";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import clsx from "clsx";
import { RadioGroup, Label, Radio } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useCalendarContext from "../../../../../../../context/calendar";
export default function CalendarHome({ children }) {
  const { t } = useTranslation();
  const { data } = useCalendarContext();
  const calendarRef = useRef(null);
  const [calendarView, setCalendarView] = useState("timeGridDay");
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
    // t("tools:calendar:program"),
  ];

  useEffect(() => {
    const changeView = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(calendarView);
    };

    changeView();
  }, [calendarView]);

  useEffect(() => {
    console.log({ data });
  }, [data]);

  return (
    <div className="flex flex-col flex-grow">
      <CalendarHeader />
      <CalendarConfig />
      <CalendarConnect />
      <CalendarDisconnect />
      <div className="h-full">
        <div className="flex-none items-center justify-between  py-4 flex">
          <div className="flex gap-2 items-center">
            <RadioGroup
              value={calendarView}
              onChange={setCalendarView}
              className="bg-zinc-300/40 rounded-full"
            >
              <div className="grid grid-cols-3 gap-1">
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
          plugins={[dayGridPlugin, timeGridPlugin]}
          navLinks={true}
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev,today,next",
          }}
          initialView="dayGridMonth"
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          initialEvents={
            data && data.items && data.items.length > 0
              ? data.items.map((x) => ({
                  ...x,
                  start: x.startTime,
                  end: x.endTime,
                }))
              : []
          }
        />
        {children}
      </div>
    </div>
  );
}
