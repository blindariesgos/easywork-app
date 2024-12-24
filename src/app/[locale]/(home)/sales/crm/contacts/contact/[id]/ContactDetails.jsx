"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import ContactEditor from "../../components/create_contact/ContactEditor";
import { useContact } from "@/src/lib/api/hooks/contacts";
import LoaderSpinner from "@/src/components/LoaderSpinner";

export default function ContactDetails({ id }) {
  const { contact, isLoading, isError } = useContact(id);

  if (isError) {
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="contact"
      samePage={`/sales/crm/contacts?page=1`}
    >
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) return <LoaderSpinner />;

  return (
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="contact"
      samePage={`/sales/crm/contacts?page=1`}
    >
      <Suspense fallback={<LoaderSpinner />}>
        <ContactEditor contact={contact} id={id} />
      </Suspense>
    </SlideOver>
  );
}
