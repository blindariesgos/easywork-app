'use client';

import Header from "../../../../../components/header/Header";
import { usePathname } from 'next/navigation';

export default function ToolsLayout({ children }) {
  const pathname = usePathname();
  const showHeader = pathname !== '/tools'; // Mostrar Header en todas las rutas excepto '/tools'

  return (
    <div className="bg-gray-100 p-4 rounded-xl h-auto grid grid-cols-1 gap-y-5">
      {showHeader && <Header />} {/* Renderizar Header condicionalmente */}
      <div className="h-[90%]">{children}</div>
    </div>
  );
}
