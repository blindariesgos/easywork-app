import React from "react";
import SlideOver from "@/src/components/SlideOver";
import UserEditor from "../components/create/UserEditor";

export default async function page() {
  return (
    <SlideOver
      colorTag="bg-easywork-main"
      labelTag="contact"
      samePage={`/sales/crm/contacts?page=1`}
    >
      <UserEditor />
    </SlideOver>
  );
}
