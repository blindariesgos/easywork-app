'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { useEvaluations } from '../../hooks/useEvaluations';

import { EvaluationHeader } from './EvaluationHeader';
import { EvaluationBody } from './EvaluationBody';
import { EvaluationFloatingMenu } from './EvaluationFloatingMenu';
import { DeleteQuestionModal } from './DeleteQuestionModal';

const newQuestionTemplate = {
  id: '',
  title: 'Título',
  description: 'Descripción o subtítulo',
  body: [],
  type: '',
  required: false,
  isAnswered: false,
  answer: [],
  isCorrect: false,
};

export default function CreateEditEvaluation({ evaluationId }) {
  const isEdit = !!evaluationId;
  const router = useRouter();

  const { getEvaluation, createEvaluation, updateEvaluation } = useEvaluations();

  // Refs
  const questionToDeleteRef = useRef(null);

  // States
  const [isDeleteQuestionModalOpen, setIsDeleteQuestionModalOpen] = useState(false);
  const [evaluation, setEvaluation] = useState({ id: '', name: '', description: '', coverPhotoSrc: '', questions: [] });

  const findQuestionIndexById = id => evaluation.questions.findIndex(q => q.id === id);

  const updateQuestion = question => {
    if (!question) return;

    let newEvaluation = {};

    const questions = [...evaluation.questions];

    const questionIndexToUpdate = findQuestionIndexById(question.id);
    if (questionIndexToUpdate === -1) return evaluation;

    questions[questionIndexToUpdate] = question;

    newEvaluation = { ...evaluation, questions };

    setEvaluation(newEvaluation);

    return newEvaluation;
  };

  const appendQuestion = question => {
    if (!question) return;
    setEvaluation(prev => ({ ...prev, questions: [...prev.questions, { ...question, id: prev.questions.length + 1 }] }));
  };

  const setQuestions = questions => setEvaluation(prev => ({ ...prev, questions }));

  const onAddQuestion = question => {
    // if (!selectedCourse.courseId) {
    //   toast.error('Debe seleccionar un curso para poder avanzar', { position: 'top-center' });
    //   return;
    // }

    // if (!selectedCourse.pageId) {
    //   toast.error('Debe seleccionar una página para poder avanzar', { position: 'top-center' });
    //   return;
    // }

    appendQuestion({ ...newQuestionTemplate, ...question });
  };

  const onDuplicateQuestion = question => {
    if (!question) return;

    const questions = [...evaluation.questions];
    const questionIndexToDuplicate = findQuestionIndexById(question.id);
    if (questionIndexToDuplicate === -1) return;

    const questionToDuplicate = { ...questions[questionIndexToDuplicate] };
    appendQuestion(questionToDuplicate);
  };

  const onDeleteQuestion = question => {
    if (!question) return;
    questionToDeleteRef.current = question;

    setIsDeleteQuestionModalOpen(true);
  };

  const deleteQuestion = () => {
    const question = { ...questionToDeleteRef.current };

    const questionsFiltered = evaluation.questions.filter(q => q.id !== question.id);
    setQuestions(questionsFiltered);
  };

  const onCloseDeleteQuestionModal = () => {
    questionToDeleteRef.current = null;
  };

  const onMoveQuestion = (direction, question) => {
    if (!question) return;

    const questionIndex = findQuestionIndexById(question.id);
    if (questionIndex === -1) return;

    const questions = [...evaluation.questions];

    if (direction === 'up') {
      if (questionIndex > 0) {
        [questions[questionIndex], questions[questionIndex - 1]] = [questions[questionIndex - 1], questions[questionIndex]];
      } else {
        return;
      }
    } else if (direction === 'down') {
      if (questionIndex < questions.length - 1) {
        [questions[questionIndex], questions[questionIndex + 1]] = [questions[questionIndex + 1], questions[questionIndex]];
      } else {
        return;
      }
    }

    setQuestions(questions);
  };

  const onCreateEvaluation = async ({ name, description, coverPhotoSrc, courseId, pageId }) => {
    if (!name) return;

    try {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('courseId', courseId);

      if (description) formData.append('description', description);
      if (coverPhotoSrc) formData.append('coverPhoto', coverPhotoSrc);
      if (pageId) formData.append('pageId', pageId);

      const evaluationCreated = await createEvaluation(formData);

      router.push(`/agents-management/capacitations/e-learning/evaluations/${evaluationCreated.id}`);

      toast.info('Guardando cambios');
    } catch (error) {
      console.log(error);
      toast.error('Ha ocurrido un error al intentar crear la evaluación. Por favor intente más tarde');
    }
  };

  const onSaveQuestion = async newQuestion => {
    if (!newQuestion) return;

    const newEvaluation = { courseId: evaluation.courseId, pageId: evaluation.pageId, ...updateQuestion(newQuestion) };

    // Guardamos la pregunta
    updateEvaluation(newEvaluation.id, newEvaluation);
    // if (isEdit) {
    // } else {
    //   const evaluationCreated = await createEvaluation({
    //     courseId: newEvaluation.courseId,
    //     pageId: newEvaluation.pageId,
    //     questions: newEvaluation.questions,
    //   });
    //   router.push(`/agents-management/capacitations/e-learning/evaluations/${evaluationCreated.id}`);
    // }

    toast.info('Guardando cambios');
  };

  const fetchEvaluation = useCallback(async () => {
    try {
      if (!evaluationId) return;

      const response = await getEvaluation(evaluationId);
      setEvaluation(response);
    } catch (error) {
      toast.error('Ha ocurrido un error al obtener la información de la evaluación. Por favor intente más tarde');
    }
  }, [getEvaluation, evaluationId]);

  useEffect(() => {
    fetchEvaluation();
  }, [fetchEvaluation]);

  return (
    <div className="max-w-7xl mx-auto pt-2">
      <div className="max-w-3xl mx-auto px-2">
        <EvaluationHeader evaluation={evaluation} onCreateEvaluation={onCreateEvaluation} />
      </div>

      {evaluation.name && (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-4 mt-4 pt-4">
          <div className="hidden md:block" />
          <div className="order-last md:order-none [&::-webkit-scrollbar]:hidden md:h-[calc(100vh-400px)] overflow-y-auto">
            <EvaluationBody
              questions={evaluation.questions}
              onDeleteQuestion={onDeleteQuestion}
              onSaveQuestion={onSaveQuestion}
              onDuplicateQuestion={onDuplicateQuestion}
              onMoveQuestion={onMoveQuestion}
            />
          </div>

          <div className="order-first md:order-none">
            <EvaluationFloatingMenu onAddQuestion={onAddQuestion} />
          </div>
        </div>
      )}

      <DeleteQuestionModal isOpen={isDeleteQuestionModalOpen} setIsOpen={setIsDeleteQuestionModalOpen} onClose={onCloseDeleteQuestionModal} onSuccess={deleteQuestion} />
    </div>
  );
}
