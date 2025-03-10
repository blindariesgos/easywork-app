"use client";

import React from "react";

import { CalendarEventCreate } from "@/src/sections/calendar/view";
import SlideOver from "@/src/components/SlideOver";

export default function EventCreatePage() {
  return (
    <SlideOver colorTag="bg-easywork-main" samePage={`/tools/calendar`}>
      <CalendarEventCreate />
    </SlideOver>
  );
}
