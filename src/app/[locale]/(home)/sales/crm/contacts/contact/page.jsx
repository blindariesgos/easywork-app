import React from "react";
import SlideOver from "@/src/components/SlideOver";
import ContactEditor from "../components/create_contact/ContactEditor";

export default async function page() {
  return (
    <SlideOver
      colorTag="bg-easywork-main"
      labelTag="contact"
      samePage={`/sales/crm/contacts?page=1`}
      maxWidthClass={"max-w-[46rem]"}
    >
      <ContactEditor />
    </SlideOver>
  );
}
