import React, { Suspense } from "react";
// import LayoutPage from './LayoutPage';
// import CapacitationsContextProvider from '@/src/context/capacitations/provider';
// import LoaderSpinner from '@/src/components/LoaderSpinner';
import Header from "@/src/components/header/Header";

export default async function Layout({ children }) {
  return (
    <div className="h-full rounded-xl relative">
      {children}

      {/* <CapacitationsContextProvider>
        <LayoutPage table={table}>
          <Suspense fallback={<LoaderSpinner />}>{children}</Suspense>
        </LayoutPage>
      </CapacitationsContextProvider> */}
    </div>
  );
}
