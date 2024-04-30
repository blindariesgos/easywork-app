// 'use client';

import Sidebar from "../../../components/Sidebar";

export default function HomeLayout({ children }) {
  return (
    <div className="w-full h-screen">
      <div className="flex">
        <Sidebar />
        <main className="h-screen overflow-auto w-full p-0.5 sm:p-2 md:p-4">
            <div className="h-full">{children}</div>
        </main>
      </div>
  </div>
  );
}
