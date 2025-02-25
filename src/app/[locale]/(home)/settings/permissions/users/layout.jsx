import React, { Suspense } from "react";
import LayoutUser from "./LayoutUser";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import UserContextProvider from "@/src/context/users/provider";

export default async function ContactLayout({ children, table }) {
  return (
    <UserContextProvider>
      <LayoutUser>
        <Suspense fallback={<LoaderSpinner />}>
          {table}
          {children}
        </Suspense>
      </LayoutUser>
    </UserContextProvider>
  );
}
