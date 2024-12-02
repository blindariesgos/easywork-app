'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BASE_ROUTE = '/agents-management/capacitations/e-learning';

export default function ELearningHeader() {
  const pathname = usePathname();

  const NAV_LINKS = [
    { id: 1, name: 'Courses', href: `${BASE_ROUTE}/courses` },
    { id: 2, name: 'Configuración', href: `${BASE_ROUTE}/config` },
    { id: 3, name: 'Evaluaciones', href: `${BASE_ROUTE}/xxx` },
    { id: 4, name: 'Mis cursos', href: `${BASE_ROUTE}/xxx2` },
  ];

  return (
    <nav class="rounded-md flex h-16 shrink-0 items-center gap-x-4 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 w-full">
      <ul class="flex space-x-4">
        {NAV_LINKS.map(navLink => {
          const isLinkActive = navLink.href === pathname;

          return (
            <li key={navLink.id} class={`text-gray-${isLinkActive ? '100' : '700'} hover:text-blue-500 bg-gray-${isLinkActive ? '400' : '100'} rounded py-1 px-2 cursor-pointer`}>
              <Link href={navLink.href}>{navLink.name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
