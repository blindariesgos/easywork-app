'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { format } from 'date-fns';

import { PaginationV2 } from '@/src/components/pagination/PaginationV2';
import LoaderSpinner from '@/src/components/LoaderSpinner';
import { TableHeaderItem } from '../../components/TableHeaderItem';
import { TableBodyItem } from '../../components/TableBodyItem';
import { Qualification } from './QualificationBar';

import { useEvaluations } from '../hooks/useEvaluations';

export const EvaluationAttemptsTable = () => {
  // Hooks
  const { getEvaluationAttempts } = useEvaluations();

  // States
  const [evaluationAttempts, setEvaluationAttempts] = useState({ pagesCount: 1, count: 0, data: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchEvaluationAttempts = useCallback(async () => {
    setLoading(true);

    try {
      const evaluationAttempts = await getEvaluationAttempts({ params: { page } });
      setEvaluationAttempts(evaluationAttempts || []);
    } catch (error) {
      toast.error('Algo no ha salido bien obteniendo los cursos. Intente más tarde');
    } finally {
      setLoading(false);
    }
  }, [getEvaluationAttempts, page]);

  useEffect(() => {
    fetchEvaluationAttempts();
  }, [fetchEvaluationAttempts, page]);

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
                  evaluationAttempts.data.map(evaluationAttempt => {
                    const { qualification, totalAttempts, attempt } = evaluationAttempt;

                    return (
                      <tr key={evaluationAttempt.id} className="hover:bg-indigo-100/40">
                        <TableBodyItem>
                          <Link target="_blank" href={`/agents-management/capacitations/e-learning/courses/${evaluationAttempt.courseId}`} className="text-easy-500 text-center w-full block text-sm">
                            <p className="text-center">{evaluationAttempt.courseName}</p>
                          </Link>
                        </TableBodyItem>
                        <TableBodyItem>
                          <p className="text-center">1</p>
                        </TableBodyItem>
                        <TableBodyItem>
                          <div className="text-center">
                            <Qualification stage={Math.floor(Number(qualification || 0) / 10)} />
                            <p className="text-sm">{qualification || 0}%</p>
                          </div>
                        </TableBodyItem>
                        <TableBodyItem>
                          <p className="text-center">{evaluationAttempt.startedAt ? format(new Date(evaluationAttempt.startedAt), 'dd/MM/yyyy hh:mm:ss a') : 'Sin iniciar'}</p>
                        </TableBodyItem>
                        <TableBodyItem>
                          <p className="text-center">{evaluationAttempt.finishedAt ? format(new Date(evaluationAttempt.finishedAt), 'dd/MM/yyyy hh:mm:ss a') : 'N/A'}</p>
                        </TableBodyItem>
                        <TableBodyItem>
                          <p className="text-center">{qualification === '100' ? 'Terminado' : 'En curso'}</p>
                        </TableBodyItem>
                        <TableBodyItem>
                          <p className="text-center">
                            {attempt}/{totalAttempts}
                          </p>
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
          <PaginationV2 totalPages={evaluationAttempts.pagesCount} currentPage={Number(page)} setPage={setPage} />
          <p className="text-xs">Cursos: {evaluationAttempts.count}</p>
        </div>
      </div>
    </Suspense>
  );
};
