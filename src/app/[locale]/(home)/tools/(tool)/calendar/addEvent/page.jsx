"use client";
import SlideOver from "../../../../../../../components/SlideOver";
import React from "react";
import AddEvent from "./AddEvent";

export default function Page() {
  return (
    <SlideOver colorTag="bg-easywork-main" samePage={`/tools/calendar`}>
      <AddEvent />
    </SlideOver>
  );
}
