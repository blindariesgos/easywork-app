"use client";
import SlideOver from "../../../../../../../components/SlideOver";
import React from "react";
import CreateLead from "./CreateLead";

export default function CreateLeadModal() {
  return (
    <SlideOver colorTag="bg-primary" labelTag="lead">
      <CreateLead />
    </SlideOver>
  );
}
