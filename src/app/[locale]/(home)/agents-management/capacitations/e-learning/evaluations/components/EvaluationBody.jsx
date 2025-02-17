import { EvaluationText } from './questions/EvaluationText';
import { EvaluationQuestion } from './questions/EvaluationQuestion';
import { EvaluationImage } from './questions/EvaluationImage';
import { EvaluationVideo } from './questions/EvaluationVideo';

export const EvaluationBody = ({ questions, onDeleteQuestion, onSaveQuestion, onDuplicateQuestion, onMoveQuestion }) => {
  const questionsCount = questions?.length || 0;

  const components = {
    text: EvaluationText,
    'multiple-choice': EvaluationQuestion,
    'true-false': EvaluationQuestion,
    selection: EvaluationQuestion,
    'check-list': EvaluationQuestion,
    'image-section': EvaluationImage,
    'video-section': EvaluationVideo,
  };

  const QuestionComponent = ({ question, index, isFirstQuestion, isLastQuestion }) => {
    const Component = components[question.type];

    return Component ? (
      <div className="bg-white p-5 rounded-lg">
        <Component
          index={index}
          question={question}
          onDelete={() => {
            if (onDeleteQuestion) onDeleteQuestion(question);
          }}
          onSave={newQuestion => {
            if (onSaveQuestion) onSaveQuestion(newQuestion);
          }}
          onDuplicate={() => {
            if (onDuplicateQuestion) onDuplicateQuestion(question);
          }}
          onMove={direction => {
            if (onMoveQuestion) onMoveQuestion(direction, question);
          }}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
        />
      </div>
    ) : (
      <div className="flex items-center">
        <span>Formato de pregunta no disponible: {question.type}</span>
        <span
          onClick={() => {
            if (onDeleteQuestion) onDeleteQuestion(question);
          }}
          className="text-blue-400 ml-2"
        >
          X
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 pb-4">
      {questions.map((question, index) => (
        <QuestionComponent key={question.id || index} question={question} index={index} isFirstQuestion={index === 0} isLastQuestion={index === questionsCount - 1} />
      ))}
    </div>
  );
};
