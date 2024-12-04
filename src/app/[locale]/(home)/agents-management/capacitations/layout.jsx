import React, { Suspense } from 'react';
import LayoutPage from './LayoutPage';
import CapacitationsContextProvider from '@/src/context/capacitations/provider';
import LoaderSpinner from '@/src/components/LoaderSpinner';

export default async function Layout({ children, table }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <CapacitationsContextProvider>
        <LayoutPage table={table}>
          <Suspense fallback={<LoaderSpinner />}>{children}</Suspense>
        </LayoutPage>
      </CapacitationsContextProvider>
    </div>
  );
}
