// 'use client';

import Sidebar from "../../../components/Sidebar";

export default function HomeLayout({ children }) {
  return (
    <div className="w-full h-screen">
      <div className="flex">
        <Sidebar />
        <main className="h-screen overflow-auto w-full p-4">
            <div className="h-full">{children}</div>
        </main>
      </div>
  </div>
  );
}
