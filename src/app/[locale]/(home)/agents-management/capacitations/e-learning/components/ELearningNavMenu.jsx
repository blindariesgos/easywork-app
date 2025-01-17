'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { EvaluationMenuDropdown } from './EvaluationMenuDropdown';
import { E_LEARNING_BASE_ROUTE } from '../constants';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import { LMS_PERMISSIONS } from '../../constants';

export const ELearningNavMenu = () => {
  const pathname = usePathname();
  const { hasPermission } = useUserPermissions();

  const NAV_LINKS = [
    { id: LMS_PERMISSIONS.courses, name: 'Courses', href: `${E_LEARNING_BASE_ROUTE}/courses`, component: null },
    { id: LMS_PERMISSIONS.config, name: 'Configuración', href: `${E_LEARNING_BASE_ROUTE}/config`, component: null },
    { id: LMS_PERMISSIONS.evaluations, name: 'Evaluaciones', href: ``, component: <EvaluationMenuDropdown /> },
    { id: LMS_PERMISSIONS.myCourses, name: 'Mis cursos', href: `${E_LEARNING_BASE_ROUTE}/my-courses`, component: null },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {NAV_LINKS.map(navLink => {
        if (!hasPermission(navLink.id)) return null;

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
  );
};
