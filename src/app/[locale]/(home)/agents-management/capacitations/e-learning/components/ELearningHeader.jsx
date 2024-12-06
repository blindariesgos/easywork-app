'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ModulesSearchBox from '../components/ModulesSearchBox';
import EvaluationMenuDropdown from '../components/EvaluationMenuDropdown';

const BASE_ROUTE = '/agents-management/capacitations/e-learning';

export default function ELearningHeader() {
  const pathname = usePathname();

  const showModulesSearchBox = ['/e-learning/config', '/e-learning/courses/module', '/e-learning/evaluations'].some(pathToCompare => {
    return pathname.indexOf(pathToCompare) !== -1;
  });

  const NAV_LINKS = [
    { id: 1, name: 'Courses', href: `${BASE_ROUTE}/courses`, component: null },
    { id: 2, name: 'Configuración', href: `${BASE_ROUTE}/config`, component: null },
    { id: 3, name: 'Evaluaciones', href: ``, component: <EvaluationMenuDropdown /> },
    { id: 4, name: 'Mis cursos', href: `${BASE_ROUTE}/my-courses`, component: null },
  ];

  return (
    <div className="rounded-md bg-white shadow-sm">
      {showModulesSearchBox && (
        <div className="py-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-0">
          <div className="rounded-md bg-easy-400 text-white shadow-sm flex items-center justify-start pl-4 pt-1 gap-5 w-full">
            <div className="flex h-16 shrink-0 items-center">
              <Link href="/home">
                <Image width={72} height={72} src="/img/Layer_2.svg" alt="Your Company" />
              </Link>
            </div>
            <p className="font-bold">E-Learning</p>
          </div>
          <div className="w-full">
            <ModulesSearchBox />
          </div>
        </div>
      )}

      <div class="flex p-4 items-center gap-4">
        {NAV_LINKS.map(navLink => {
          const isLinkActive = navLink.href === pathname;

          return navLink.component ? (
            navLink.component
          ) : (
            <div key={navLink.id} class={`text-gray-${isLinkActive ? '100' : '700'} hover:text-blue-500 bg-gray-${isLinkActive ? '400' : '100'} rounded py-1 px-2 cursor-pointer`}>
              <Link href={navLink.href}>{navLink.name}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
