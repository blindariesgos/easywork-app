import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useTranslation } from "react-i18next";
import FullCalendar from "@fullcalendar/react";
import { useSession } from "next-auth/react";
import listPlugin from "@fullcalendar/list";
import { useRouter } from "next/navigation";

import { HeadNav } from "@/src/components/news/header";
import { useBoolean, useSetState } from "@/src/hooks";

import { EventNewEditFormDialog } from "../dialog";
import { CalendarTabs } from "../calendar-tabs";
import { useGetEvent } from "../hooks";
import CalendarConnectDialog from "../dialog/calendar-connect.dialog";

export function CalendarView() {
  const { state, setState } = useSetState({
    dateCreation: {
      startTime: null,
      endTime: null,
    },
    startDate: null,
    endDate: null,
  });
  const [selectedTab, setSelectedTab] = useState("timeGridWeek");

  const session = useSession();

  const isOpenCreate = useBoolean();

  const isOpenConnect = useBoolean();

  const { events, isLoading, onUpdate } = useGetEvent({
    userId: session?.data?.user?.sub,
    ...state,
  });

  const calendarRef = useRef(null);

  const router = useRouter();

  const { t } = useTranslation();

  const currentEvents = useMemo(
    () =>
      events.map((event) => ({
        start: event.startTime,
        end: event.endTime,
        color: event.color,
        title: event.name,
        id: event.id,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events, isLoading]
  );

  const changeView = useCallback(() => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    changeView();
  }, [changeView]);

  useEffect(() => {
    setSelectedTab("timeGridWeek");
  }, []);

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();
    const handleDatesSet = (arg) => {
      const startDate = arg.start;
      const endDate = arg.end;
      setState({
        startDate,
        endDate,
      });
    };

    calendarApi.on("datesSet", handleDatesSet);

    return () => {
      calendarApi.off("datesSet", handleDatesSet);
    };
  }, [setState]);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek + 1); // Monday
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (7 - dayOfWeek)); // Sunday

    setState({
      startDate,
      endDate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(
    () => [
      {
        name: t("tools:calendar:event"),
        href: `/tools/calendar/event/create?show=true`,
      },
    ],
    [t]
  );

  const handleSelectDate = useCallback((info) => {
    setState({
      dateCreation: {
        startTime: info.start,
        endTime: info.end,
      },
    });
    isOpenCreate.onTrue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickEvent = useCallback(
    (info) => {
      router.push(`/tools/calendar/event/${info.event.id}?show=true`);
    },
    [router]
  );

  const handleChangeTab = useCallback((newTab) => {
    setSelectedTab(newTab);
  }, []);

  return (
    <>
      <div>
        <HeadNav
          title={t("tools:calendar:name")}
          labelSearch={t("tools:calendar:search")}
          btnLeftLabel={t("tools:calendar:create")}
          btnLeftOption={options}
        />

        <div className="h-full">
          <CalendarTabs
            onChangeTab={handleChangeTab}
            selectedTab={selectedTab}
            isOpenConnect={isOpenConnect}
          />

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
            events={currentEvents}
            initialView="dayGridMonth"
            nowIndicator={true}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleSelectDate}
            eventClick={handleClickEvent}
            on
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: "09:00",
              endTime: "18:00",
            }}
          />
        </div>
      </div>

      {isOpenConnect.value && (
        <CalendarConnectDialog
          isOpen={isOpenConnect.value}
          onClose={isOpenConnect.onFalse}
        />
      )}

      {isOpenCreate.value && (
        <EventNewEditFormDialog
          startTime={state.dateCreation.startTime}
          endTime={state.dateCreation.endTime}
          isOpen={isOpenCreate.value}
          onClose={() => {
            onUpdate();
            isOpenCreate.onFalse();
          }}
        />
      )}
    </>
  );
}
