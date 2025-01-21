import { EvaluationQuestionForm } from './EvaluationQuestionForm';

export const EvaluationForm = () => {
  return (
    <div className="mt-4">
      <div className="bg-white px-4 py-6 rounded-lg">
        <h2 className="text-xl font-bold">Título de la evaluación</h2>
        <p className="text-sm">Descripción de la evaluación</p>
      </div>

      <EvaluationQuestionForm />
    </div>
  );
};
