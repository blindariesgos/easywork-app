'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { EvaluationMenuDropdown } from '../components/EvaluationMenuDropdown';
import { E_LEARNING_BASE_ROUTE } from '../constants';

export const ELearningHeader = () => {
  const pathname = usePathname();

  const NAV_LINKS = [
    { id: 1, name: 'Courses', href: `${E_LEARNING_BASE_ROUTE}/courses`, component: null },
    { id: 2, name: 'Configuración', href: `${E_LEARNING_BASE_ROUTE}/config`, component: null },
    { id: 3, name: 'Evaluaciones', href: ``, component: <EvaluationMenuDropdown /> },
    { id: 4, name: 'Mis cursos', href: `${E_LEARNING_BASE_ROUTE}/my-courses`, component: null },
  ];

  return (
    <div className="rounded-md bg-white shadow-sm">
      {/* Header */}

      {/* Navegación */}
      <div className="flex p-4 items-center gap-4">
        {NAV_LINKS.map(navLink => {
          const isLinkActive = navLink.href === pathname;

          return navLink.component ? (
            <div key={navLink.id}>{navLink.component}</div>
          ) : (
            <div key={navLink.id} className={`text-gray-${isLinkActive ? '100' : '700'} bg-gray-${isLinkActive ? '400' : '100'} rounded py-1 px-2 cursor-pointer`}>
              <Link href={navLink.href}>{navLink.name}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
