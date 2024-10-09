"use client";
import SlideOver from "../../../../../../../components/SlideOver";
import React from "react";
import EventDetails from "../components/EventDetails";

export default function Page() {
  return (
    <SlideOver colorTag="bg-easywork-main" samePage={`/tools/calendar`}>
      <EventDetails />
    </SlideOver>
  );
}
