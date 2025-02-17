export const EvaluationText = ({ question }) => {
  return (
    <div>
      <h2 className="text-xl font-bold">{question.title}</h2>
      {question.description && <p className="text-sm">{question.description}</p>}
    </div>
  );
};
