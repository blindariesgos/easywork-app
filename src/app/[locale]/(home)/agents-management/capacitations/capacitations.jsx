'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useUserPermissions } from './hooks/useUserPermissions';
import { useCapacitations } from './hooks/useCapacitations';

import LoaderSpinner from '@/src/components/LoaderSpinner';
import { PaginationV2 } from '@/src/components/pagination/PaginationV2';
import { CapacitationsHeader } from './components/CapacitationsHeader';
import { TableHeaderItem } from './components/TableHeaderItem';
import { TableBodyItem } from './components/TableBodyItem';

import { LMS_PERMISSIONS } from './constants';

export default function CapacitationsPage() {
  const router = useRouter();
  const { hasPermission } = useUserPermissions();
  const { getCapacitations } = useCapacitations();

  // States
  const [capacitations, setCapacitations] = useState({ pagesCount: 1, count: 0, data: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.capacitations)) router.replace('/');
  }, [hasPermission, router]);

  return (
    <Suspense fallback={<LoaderSpinner />}>
      <CapacitationsHeader />
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="relative sm:rounded-lg h-[60vh]">
            <table className="min-w-full rounded-md bg-gray-100 table-auto relative">
              <thead className="text-sm bg-white drop-shadow-sm sticky top-0 z-10">
                <tr>
                  {['Agente', 'Etapa de avance', 'Fecha de inicio del proceso', 'Fecha de final del proceso', 'Proceso cerrado', 'Responsable'].map(thItem => (
                    <TableHeaderItem key={thItem} name={thItem} />
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                {!loading ? (
                  <tr>
                    <td colSpan={8}>
                      <p className="text-center py-5">Sin resultados</p>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <div className="flex items-center justify-center flex-col gap-4 h-[500px] w-full">
                        <div className="w-10 h-10 animate-spin rounded-full border-t-2 border-b-2 border-easy-400" />
                        <p>Buscando...</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center py-5 flex-col">
          <PaginationV2 totalPages={capacitations.pagesCount} currentPage={Number(page)} setPage={setPage} />
          <p className="text-xs">Cursos: {capacitations.count}</p>
        </div>
      </div>{' '}
    </Suspense>
  );
}
