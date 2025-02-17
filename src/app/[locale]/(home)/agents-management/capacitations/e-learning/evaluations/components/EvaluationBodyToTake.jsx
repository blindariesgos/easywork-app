import { EvaluationText } from './questions-for-take/EvaluationText';
import { EvaluationQuestion } from './questions-for-take/EvaluationQuestion';
import { EvaluationImage } from './questions-for-take/EvaluationImage';
import { EvaluationVideo } from './questions-for-take/EvaluationVideo';

const components = {
  text: EvaluationText,
  'multiple-choice': EvaluationQuestion,
  'true-false': EvaluationQuestion,
  selection: EvaluationQuestion,
  'check-list': EvaluationQuestion,
  'image-section': EvaluationImage,
  'video-section': EvaluationVideo,
};

const QuestionComponent = props => {
  const { question, isFinished } = props;
  const { isCorrect, type } = question;

  const Component = components[question.type];

  const correctStyles = 'bg-[#e8f5e9] border border-[#a5d6a7]';
  const incorrectStyles = 'bg-[#ffebee] border border-[#ef9a9a]';
  const basicStyles = 'bg-white';

  const styles = !isFinished || !['selection', 'check-list', 'multiple-choice'].includes(type) ? basicStyles : isCorrect ? correctStyles : incorrectStyles;

  return (
    Component && (
      <div className={`${styles} p-5 rounded-lg`}>
        <Component {...props} />
      </div>
    )
  );
};

export const EvaluationBodyToTake = ({ evaluationAttempt, onSaveQuestion, onFinishEvaluation, isFinalizing }) => {
  const questions = evaluationAttempt.questionsAnswered;
  const questionsCount = questions?.length || 0;

  return (
    <div className="flex flex-col gap-2 pb-4">
      {questions.map((question, index) => (
        <QuestionComponent
          key={question.id || index}
          question={question}
          {...(!evaluationAttempt.isFinished && { onSave: onSaveQuestion })}
          isFinalizing={isFinalizing}
          isFinished={evaluationAttempt.isFinished}
        />
      ))}

      {!evaluationAttempt.isFinished && (
        <div className="text-right">
          <button type="button" className="bg-easy-400 px-3 py-2 text-white rounded-lg font-bold" onClick={onFinishEvaluation}>
            {isFinalizing ? 'Finalizando...' : 'Finalizar evaluación'}
          </button>
        </div>
      )}
    </div>
  );
};
