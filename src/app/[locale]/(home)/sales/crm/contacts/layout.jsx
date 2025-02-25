import React, { Suspense } from "react";
import LayoutContact from "./LayoutContact";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ContactContextProvider from "@/src/context/contacts/provider";

export default async function ContactLayout({ children, table }) {
  return (
    <ContactContextProvider>
      <LayoutContact>
        <Suspense fallback={<LoaderSpinner />}>
          {table}
          {children}
        </Suspense>
      </LayoutContact>
    </ContactContextProvider>
  );
}
