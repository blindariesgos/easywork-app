'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useEvaluations } from '../hooks/useEvaluations';

import { LMS_PERMISSIONS } from '../../constants';

export default function Evaluations() {
  const router = useRouter();
  const { hasPermission } = useUserPermissions();
  const { getEvaluationsByCourse } = useEvaluations();

  const [coursesWithEvaluations, setCoursesWithEvaluations] = useState([]);

  const fetchEvaluations = useCallback(async () => {
    try {
      const response = await getEvaluationsByCourse();
      setCoursesWithEvaluations(response);
    } catch (error) {
      toast.error('Ha ocurrido un error al obtener la información de la evaluación. Por favor intente más tarde');
    }
  }, [getEvaluationsByCourse]);

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.evaluations)) router.replace('/agents-management/capacitations/e-learning/courses');

    fetchEvaluations();
  }, [hasPermission, router, fetchEvaluations]);

  return (
    <div className="max-w-7xl mx-auto py-5">
      {coursesWithEvaluations.map(course => {
        return (
          <div key={course.id}>
            <div className="bg-white p-2">
              <p className="font-bold">Curso: {course.name}</p>
            </div>

            {course.pages.map(page => {
              return (
                <div key={page.id} className="bg-[#f5f5f5]">
                  <div className="pl-4 py-2">
                    <p className="font-bold">Página: {page.name}</p>
                  </div>

                  <div className="pl-4">
                    {page.evaluations.map(evaluation => {
                      return (
                        <div key={evaluation.id} className="bg-[#e0e0e0] flex items-center justify-between">
                          <p className="pl-2 py-2">Evaluación: {evaluation.id}</p>
                          <div className="pr-4 flex items-center gap-2">
                            <button type="button" onClick={() => router.push(`/agents-management/capacitations/e-learning/evaluations/${evaluation.id}`)}>
                              <FiEdit size="18px" />
                            </button>
                            <button type="button">
                              <FiTrash2 size="18px" className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
