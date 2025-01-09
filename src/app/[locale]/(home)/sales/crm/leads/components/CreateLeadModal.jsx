"use client";
import SlideOver from "../../../../../../../components/SlideOver";
import React from "react";
import CreateLead from "./CreateLead";

export default function CreateLeadModal() {
  return (
    <SlideOver
      colorTag="bg-primary"
      labelTag="lead"
      maxWidthClass={"max-w-[46rem]"}
    >
      <CreateLead />
    </SlideOver>
  );
}
