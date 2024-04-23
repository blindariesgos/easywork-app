import SlideOver from "@/components/SlideOver";
import React from "react";
import AddEvent from "./AddEvent";

export default function Modal() {
  return (
    <SlideOver colorTag="bg-green-100" samePage={`/tools/calendar`}>
      <AddEvent />
    </SlideOver>
  );
}
