'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useEvaluations } from '../hooks/useEvaluations';
import { DeleteEvaluationModal } from './components/DeleteEvaluationModal';

import { LMS_PERMISSIONS } from '../../constants';

export default function Evaluations() {
  const router = useRouter();
  const { hasPermission } = useUserPermissions();
  const evaluationToDelete = useRef(null);
  const { getEvaluationsByCourse, deleteEvaluation } = useEvaluations();

  const [fetchingEvaluations, setFetchingEvaluations] = useState(true);
  const [isDeleteEvaluationModalOpen, setIsDeleteEvaluationModalOpen] = useState(false);
  const [coursesWithEvaluations, setCoursesWithEvaluations] = useState([]);

  const fetchEvaluations = useCallback(async () => {
    if (!fetchEvaluations) setFetchingEvaluations(true);

    try {
      const response = await getEvaluationsByCourse();
      setCoursesWithEvaluations(response);
    } catch (error) {
      toast.error('Ha ocurrido un error al obtener la información de la evaluación. Por favor intente más tarde');
    } finally {
      setFetchingEvaluations(false);
    }
  }, [getEvaluationsByCourse]);

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.editEvaluation)) router.replace('/agents-management/capacitations/e-learning/courses');

    fetchEvaluations();
  }, [hasPermission, router, fetchEvaluations]);

  return (
    <div className="max-w-xl mx-auto py-5">
      {fetchingEvaluations && (
        <div className="flex items-center justify-center flex-col gap-4 h-[700px] w-full">
          <div className={`w-10 h-10 animate-spin rounded-full border-t-2 border-b-2 border-easy-400`} />
          <p>Obteniendo evaluaciones...</p>
        </div>
      )}

      {!fetchingEvaluations && coursesWithEvaluations.length === 0 && (
        <div className="bg-white rounded-lg py-10 mt-4">
          <p className="text-center text-lg">No hay evaluaciones creadas aún</p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              className="bg-[#969696] px-3 py-2 text-white rounded-lg text-sm"
              onClick={() => {
                router.push('/agents-management/capacitations/e-learning/config');
              }}
            >
              Volver a cursos
            </button>
            <button
              type="button"
              className="bg-easy-400 px-3 py-2 text-white rounded-lg text-sm"
              onClick={() => {
                router.push('/agents-management/capacitations/e-learning/evaluations/create');
              }}
            >
              Crear nueva evaluación
            </button>
          </div>
        </div>
      )}

      {!fetchingEvaluations &&
        coursesWithEvaluations.map(course => {
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
                            <p className="pl-2 py-2">Evaluación: {evaluation.name}</p>
                            <div className="pr-4 flex items-center gap-2">
                              <button type="button" onClick={() => router.push(`/agents-management/capacitations/e-learning/evaluations/${evaluation.id}`)}>
                                <FiEdit size="18px" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  evaluationToDelete.current = evaluation;
                                  setIsDeleteEvaluationModalOpen(true);
                                }}
                              >
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

      <DeleteEvaluationModal
        isOpen={isDeleteEvaluationModalOpen}
        setIsOpen={setIsDeleteEvaluationModalOpen}
        onSuccess={() => {
          if (evaluationToDelete.current)
            deleteEvaluation(evaluationToDelete.current.id)
              .then(() => {
                evaluationToDelete.current = null;
                toast.success('Evaluación eliminada correctamente');
                fetchEvaluations();
              })
              .catch(error => {
                toast.error('Ha ocurrido un error al eliminar la evaluación. Por favor intente más tarde');
              });

          setIsDeleteEvaluationModalOpen(false);
        }}
      />
    </div>
  );
}
