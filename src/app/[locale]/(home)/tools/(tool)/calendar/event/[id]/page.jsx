"use client";

import React from "react";

import { CalendarEventDetails } from "@/src/sections/calendar/view";
import SlideOver from "@/src/components/SlideOver";

export default function Page({ params: { id } }) {
  return (
    <SlideOver colorTag="bg-easywork-main" samePage={`/tools/calendar`}>
      <CalendarEventDetails eventId={id} />
    </SlideOver>
  );
}
