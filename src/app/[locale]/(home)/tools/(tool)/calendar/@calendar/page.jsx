'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

// Components
import CalendarHeader from '../components/CalendarHeader';
import CalendarConfig from '../components/CalendarConfig';
import CalendarConnect from '../components/CalendarConnect';
import { CalendarDisconnect } from '../components/CalendarDisconnect';
import { NewEventModal } from '../components/NewEventModal';
import { CalendarToolbar } from '../components/CalendarToolbar';
import { getGoogleCalendarStatus } from '@/src/lib/apis';
import { timezones } from '@/src/lib/timezones';

import { getCalendarEvents } from '@/src/lib/apis';
import { toast } from 'react-toastify';

const calendarViews = [
  { id: 'timeGridDay', name: 'tools:calendar:day' },
  { id: 'timeGridWeek', name: 'tools:calendar:week' },
  { id: 'dayGridMonth', name: 'tools:calendar:month' },
  { id: 'listMonth', name: 'tools:calendar:program' },
];

export default function CalendarHome({ children }) {
  // Hooks
  const calendarRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [calendarView, setCalendarView] = useState('timeGridWeek');
  const [selectOauth, setSelectOauth] = useState(null);

  // States
  const [calendarViewRangeSelected, setCalendarViewRangeSelected] = useState({ startDate: null, endDate: null });
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null });
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [timezone, setTimezone] = useState(null);
  const [googleCalendarStatus, setGoogleCalendarStatus] = useState({ connected: false, email: '' });
  const [events, setEvents] = useState({
    itemsFormatted: [],
    items: [],
    meta: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  // Definitions
  const params = new URLSearchParams(searchParams);

  const openNewEventModal = () => {
    setIsNewEventModalOpen(true);
  };

  const closeNewEventModal = () => {
    setIsNewEventModalOpen(false);
  };

  const openConnect = () => {
    params.set('connect', true);
    router.replace(`/tools/calendar?${params.toString()}`);
  };

  const handleSelectDate = info => {
    openNewEventModal();

    setSelectedDate({
      start: format(info?.start, "yyyy-MM-dd'T'HH:mm"),
      end: format(info?.end, "yyyy-MM-dd'T'HH:mm"),
    });

    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneValue = timezones.find(timezone => timezone.value === detectedTimezone);

    if (timezoneValue) setTimezone(timezoneValue);
  };

  const handleClickEvent = info => {
    router.push(`/tools/calendar/event/${info.event.id}?show=true${selectOauth ? `&oauth=${selectOauth?.id}` : ''}`);
  };

  const fetchCalendarEvents = useCallback(async () => {
    try {
      if (!calendarViewRangeSelected.startDate || !calendarViewRangeSelected.endDate) return;

      const response = await getCalendarEvents(calendarViewRangeSelected);
      setEvents(response);
    } catch (error) {
      toast.error('Ha ocurrido un error al intentar obtener los eventos del calendario. Por favor intente más tarde');
    }
  }, [calendarViewRangeSelected]);

  const fetchGoogleCalendarStatus = useCallback(async () => {
    try {
      const response = await getGoogleCalendarStatus();
      setGoogleCalendarStatus(response);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchGoogleCalendarStatus();
  }, [fetchGoogleCalendarStatus]);

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  useEffect(() => {
    const changeView = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(calendarView);
    };

    changeView();
  }, [calendarView]);

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();

    const handleDatesSet = arg =>
      setCalendarViewRangeSelected({
        startDate: format(new Date(arg.start), 'yyyy-MM-dd'),
        endDate: format(new Date(arg.end), 'yyyy-MM-dd'),
      });

    calendarApi.on('datesSet', handleDatesSet);

    return () => {
      calendarApi.off('datesSet', handleDatesSet);
    };
  }, [setCalendarViewRangeSelected]);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek + 1); // Monday
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (7 - dayOfWeek)); // Sunday

    setCalendarViewRangeSelected({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col flex-grow">
      <CalendarHeader selectOauth={selectOauth} />
      <CalendarConfig selectOauth={selectOauth} />

      <div className="h-full">
        <CalendarToolbar calendarViews={calendarViews} selectedCalendarView={calendarView} onChangeCalendarView={setCalendarView} onConnectRequested={openConnect} />

        <FullCalendar
          locale={esLocale}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          navLinks={true}
          headerToolbar={{
            left: 'title',
            center: '',
            right: 'prev,today,next',
          }}
          events={events.itemsFormatted}
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
            startTime: '09:00',
            endTime: '18:00',
          }}
        />

        {children}
      </div>

      {/* Dialogs and modals */}
      <CalendarConnect googleCalendarStatus={googleCalendarStatus} refetchGoogleCalendarStatus={fetchGoogleCalendarStatus} />
      <CalendarDisconnect />

      <NewEventModal open={isNewEventModalOpen} onClose={closeNewEventModal} selectedDate={selectedDate} defaultTimezone={timezone} />
    </div>
  );
}
