import SlideOver from "@/src/components/SlideOver";
import React from "react";
import MeetEditor from "../../meet/MeetEditor";

export default function page() {
  return (
    <SlideOver colorTag="bg-primary">
      <MeetEditor />
    </SlideOver>
  );
}
