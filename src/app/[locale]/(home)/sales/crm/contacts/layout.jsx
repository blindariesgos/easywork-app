import React, { Suspense } from "react";
import LayoutContact from "./LayoutContact";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ContactContextProvider from "@/src/context/contacts/provider";

export default async function ContactLayout({ children, table }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <ContactContextProvider>
        <LayoutContact>
          <Suspense fallback={<LoaderSpinner />}>
            {table}
            {children}
          </Suspense>
        </LayoutContact>
      </ContactContextProvider>
    </div>
  );
}
