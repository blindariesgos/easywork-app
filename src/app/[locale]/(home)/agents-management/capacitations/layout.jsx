import React, { Suspense } from 'react';
// import LayoutPage from './LayoutPage';
// import CapacitationsContextProvider from '@/src/context/capacitations/provider';
// import LoaderSpinner from '@/src/components/LoaderSpinner';
import Header from '@/src/components/header/Header';

export default async function Layout({ children }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <Header />
      {children}

      {/* <CapacitationsContextProvider>
        <LayoutPage table={table}>
          <Suspense fallback={<LoaderSpinner />}>{children}</Suspense>
        </LayoutPage>
      </CapacitationsContextProvider> */}
    </div>
  );
}
