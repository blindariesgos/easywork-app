import React, { Suspense } from "react";
import LayoutUser from "./LayoutUser";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import UserContextProvider from "@/src/context/users/provider";

export default async function ContactLayout({ children, table }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <UserContextProvider>
        <LayoutUser>
          <Suspense fallback={<LoaderSpinner />}>
            {table}
            {children}
          </Suspense>
        </LayoutUser>
      </UserContextProvider>
    </div>
  );
}
