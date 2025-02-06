'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useCourses } from '../hooks/useCourses';

import { PaginationV2 } from '@/src/components/pagination/PaginationV2';
import LoaderSpinner from '@/src/components/LoaderSpinner';

import { TableHeaderItem } from '../../components/TableHeaderItem';
import { TableBodyItem } from '../../components/TableBodyItem';

import { LMS_PERMISSIONS } from '../../constants';
import Link from 'next/link';

export const Qualification = ({ stage }) => {
  const colorsByStage = {
    0: 'bg-red-600',
    1: 'bg-cyan-600',
    2: 'bg-cyan-600',
    3: 'bg-yellow-100',
    4: 'bg-yellow-100',
    5: 'bg-yellow-100',
    6: 'bg-yellow-100',
    7: 'bg-yellow-100',
    8: 'bg-yellow-100',
    9: 'bg-green-primary',
    10: 'bg-green-primary',
  };

  const bgColor = colorsByStage[stage];

  return Array(6)
    .fill(0)
    .map((_, i) => {
      const key = _ + i;

      return <div key={key} className={`${i + 1 > stage ? 'bg-gray-200' : bgColor} h-4 w-4 inline-block`} style={{ marginLeft: 0.5 }} />;
    });
};

export default function MyCourses() {
  // Hooks
  const router = useRouter();
  const { hasPermission } = useUserPermissions();
  const { getCourses, updateOrder } = useCourses();

  // States
  const [courses, setCourses] = useState({ pagesCount: 1, count: 0, data: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);

    try {
      const courses = await getCourses({ params: { page } });
      setCourses(courses || []);
    } catch (error) {
      toast.error('Algo no ha salido bien obteniendo los cursos. Intente más tarde');
    } finally {
      setLoading(false);
    }
  }, [getCourses, page]);

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.myCourses)) router.replace('/');
  }, [hasPermission, router]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, page]);

  return (
    <Suspense fallback={<LoaderSpinner />}>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="relative sm:rounded-lg h-[60vh]">
            <table className="min-w-full rounded-md bg-gray-100 table-auto relative">
              <thead className="text-sm bg-white drop-shadow-sm sticky top-0 z-10">
                <tr>
                  {['Curso', 'Prueba', 'Calificación', 'Fecha de inicio de la prueba', 'Fecha de culminación', 'Estado', 'Cantidad de intentos', 'Certificado'].map(thItem => (
                    <TableHeaderItem key={thItem} name={thItem} />
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                {!loading ? (
                  courses.data.map(course => {
                    const { progress } = course.assignedUsers[0];

                    return (
                      <tr key={course.id} className="hover:bg-indigo-100/40">
                        <TableBodyItem>
                          <Link href={`/agents-management/capacitations/e-learning/courses/${course.id}`} className="text-easy-500 text-center w-full block text-sm">
                            <p className="text-center">{course.name}</p>
                          </Link>
                        </TableBodyItem>
                        <TableBodyItem>
                          <p className="text-center">1</p>
                        </TableBodyItem>
                        <TableBodyItem>
                          <div className="text-center">
                            <Qualification stage={Math.floor(Number(progress || 0) / 10)} />
                            <p className="text-sm">{progress || 0}%</p>
                          </div>
                        </TableBodyItem>
                        <TableBodyItem>
                          <p className="text-center">10/10/2024</p>
                        </TableBodyItem>
                        <TableBodyItem>
                          <p className="text-center">10/10/2024</p>
                        </TableBodyItem>
                        <TableBodyItem>
                          <p className="text-center">{progress === '100' ? 'Terminado' : 'En curso'}</p>
                        </TableBodyItem>
                        <TableBodyItem>
                          <p className="text-center">1/3</p>
                        </TableBodyItem>
                        <TableBodyItem>
                          <Link href="/agents-management/capacitations/e-learning/my-courses" className="text-blue-400 text-center w-full block text-sm">
                            Ver certificado
                          </Link>
                        </TableBodyItem>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <div className="flex items-center justify-center flex-col gap-4 h-[500px] w-full">
                        <div className="w-10 h-10 animate-spin rounded-full border-t-2 border-b-2 border-easy-400" />
                        <p>Obteniendo cursos...</p>
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
          <PaginationV2 totalPages={courses.pagesCount} currentPage={Number(page)} setPage={setPage} />
          <p className="text-xs">Cursos: {courses.count}</p>
        </div>
      </div>
    </Suspense>
  );
}
