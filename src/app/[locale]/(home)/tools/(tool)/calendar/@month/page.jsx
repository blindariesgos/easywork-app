"use client";
import { Fragment } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const events = [
  {
    id: 1,
    title: "Design review",
    time: "10AM",
    date: "2024-08-03",
    href: "#",
  },
  {
    id: 2,
    title: "Sales meeting",
    time: "2PM",
    date: "2024-08-03",
    href: "#",
  },
  {
    id: 3,
    title: "Date night",
    time: "6PM",
    date: "2024-08-08",
    href: "#",
  },

  {
    id: 6,
    title: "Sam's birthday party",
    time: "2PM",
    date: "2024-08-25",
    href: "#",
  },

  {
    id: 4,
    title: "Maple syrup museum",
    time: "3PM",
    date: "2024-08-22",
    href: "#",
  },
  {
    id: 5,
    title: "Hockey game",
    time: "7PM",
    date: "2024-08-22",
    href: "#",
  },
  {
    id: 7,
    title: "Cinema with friends",
    time: "9PM",
    date: "2024-08-04",
    href: "#",
  },
];

export default function MonthView() {
  const { t } = useTranslation();

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
}
