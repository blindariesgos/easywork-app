import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { EvaluationBodyToTake } from './EvaluationBodyToTake';
import { EvaluationFinalized } from './EvaluationFinalized';

import { useEvaluations } from '../../hooks/useEvaluations';

export const EvaluationToTake = ({ evaluationId }) => {
  const router = useRouter();
  const { getEvaluation, startEvaluation, getEvaluationToTake, updateEvaluationAttempt, finalizeEvaluation } = useEvaluations();

  // States
  const [evaluation, setEvaluation] = useState({ questions: [] });
  const [evaluationAttempt, setEvaluationAttempt] = useState({ isStarted: false, isFinished: false, questionsAnswered: [] });
  const [isStarting, setIsStarting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isFetchingEvaluationInfo, setIsFetchingEvaluationInfo] = useState(true);

  const markEvaluationAsStarted = async () => {
    setIsStarting(true);

    try {
      const newEvaluationAttempt = await startEvaluation(evaluationId);
      setEvaluationAttempt(newEvaluationAttempt);
      toast.info('Su evaluación ha comenzado');
    } catch (error) {
      console.log(error);
      toast.error('Ha ocurrido un error al iniciar la evaluación. Por favor intente más tarde');
    } finally {
      setIsStarting(false);
    }
  };

  const findQuestionIndexById = id => evaluationAttempt.questionsAnswered.findIndex(q => q.id === id);

  const updateQuestionsAnswered = question => {
    if (!question) return;

    let attemptUpdated = {};

    const questionsAnswered = [...evaluationAttempt.questionsAnswered];

    const questionIndexToUpdate = findQuestionIndexById(question.id);
    if (questionIndexToUpdate === -1) return evaluationAttempt;

    questionsAnswered[questionIndexToUpdate] = question;

    attemptUpdated = { ...evaluationAttempt, questionsAnswered };

    setEvaluationAttempt(attemptUpdated);

    return attemptUpdated;
  };

  const onSaveQuestion = async newQuestion => {
    if (!newQuestion) return;

    const attemptUpdated = { ...updateQuestionsAnswered(newQuestion) };

    updateEvaluationAttempt(evaluationAttempt.id, attemptUpdated);
  };

  const onFinishEvaluation = async () => {
    setIsFinalizing(true);

    try {
      const result = await finalizeEvaluation(evaluationAttempt.id, evaluationAttempt);
      console.log('🚀 ~ onFinishEvaluation ~ result:', result);
      setEvaluationAttempt({ ...result });
    } catch (error) {
    } finally {
      setIsFinalizing(false);
    }
  };

  const fetchEvaluationInfo = useCallback(async () => {
    try {
      if (!evaluationId) return;

      const response = await getEvaluation(evaluationId);
      setEvaluation(response);

      const responseToTake = await getEvaluationToTake(evaluationId);
      if (responseToTake) setEvaluationAttempt({ ...responseToTake });
    } catch (error) {
      toast.error('Ha ocurrido un error al obtener la información de la evaluación. Por favor intente más tarde');
    } finally {
      setIsFetchingEvaluationInfo(false);
    }
  }, [evaluationId, getEvaluation, getEvaluationToTake]);

  useEffect(() => {
    fetchEvaluationInfo();
  }, [fetchEvaluationInfo]);

  if (isFetchingEvaluationInfo) {
    return (
      <div className="flex items-center justify-center flex-col gap-4 h-[700px] w-full">
        <div className={`w-10 h-10 animate-spin rounded-full border-t-2 border-b-2 border-easy-400`} />
        <p>Obteniendo evaluación...</p>
      </div>
    );
  }

  if (!evaluation?.name) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <p className="text-center">La evaluación no está disponible por el momento</p>
        <button
          type="button"
          className="bg-easy-400 px-3 py-2 text-white rounded-lg font-bold flex items-center justify-between gap-2 mt-4 mx-auto"
          onClick={() => {
            router.push('/agents-management/capacitations/e-learning/courses');
          }}
        >
          Volver a cursos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {!evaluationAttempt.isStarted ? (
        <div className="bg-white p-5 rounded-lg">
          <p className="font-bold text-lg">{evaluation.name}</p>
          {evaluation.description && <p className="mt-1">{evaluation.description}</p>}

          <button type="button" className="bg-easy-400 px-3 py-2 text-white rounded-lg font-bold flex items-center justify-between gap-2 mt-4" onClick={markEvaluationAsStarted}>
            {isStarting ? 'Comenzando...' : 'Comenzar evaluación'}
          </button>
        </div>
      ) : !evaluationAttempt.isFinished ? (
        <EvaluationBodyToTake evaluationAttempt={evaluationAttempt} onSaveQuestion={onSaveQuestion} onFinishEvaluation={onFinishEvaluation} isFinalizing={isFinalizing} />
      ) : (
        <EvaluationFinalized evaluation={evaluation} evaluationAttempt={evaluationAttempt} />
      )}
    </div>
  );
};
