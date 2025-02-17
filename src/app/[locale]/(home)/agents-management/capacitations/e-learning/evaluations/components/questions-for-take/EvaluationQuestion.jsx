import { Select } from '@headlessui/react';
import { useState } from 'react';

export const EvaluationQuestion = ({ question, onSave, isFinalizing, isFinished }) => {
  const questionId = question.id;
  const questionType = question.type;

  const [values, setValues] = useState({
    isAnswered: Boolean(question.isAnswered),
    answer: question && question.answer ? question.answer : [],
  });

  const handleSelectOption = e => {
    const { value, checked } = e.target;

    const newAnswer = { optionId: value, answeredAt: new Date() };

    const newValues = {
      ...values,
      answer: [newAnswer],
    };

    if (!values.isAnswered) newValues.isAnswered = true;

    if (questionType === 'check-list') {
      newValues.answer = checked ? [...values.answer, newAnswer] : [...values.answer.filter(({ optionId }) => optionId !== value)];
    }

    onSave({ ...question, ...newValues });
    setValues(newValues);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">
        {!isFinished ? '' : question.isCorrect ? '✅' : '❌'} {question.title}
      </h2>
      {question.description && <p className="text-sm">{question.description}</p>}

      <div>
        <div className="mt-4">
          {['check-list', 'multiple-choice'].includes(questionType) && (
            <div className="mt-5 ml-8">
              {question.body.map((option, index) => {
                return (
                  <div key={option.id} className="mb-2">
                    <label className={isFinished || isFinalizing ? 'opacity-50' : ''}>
                      <input
                        type={questionType === 'multiple-choice' ? 'radio' : 'checkbox'}
                        name={`question-options-${questionId}`}
                        className="w-5 h-5 mr-2 cursor-pointer"
                        onChange={e => handleSelectOption(e, index)}
                        checked={values.answer.some(({ optionId }) => option.id === optionId)}
                        value={option.id}
                        disabled={isFinished || isFinalizing}
                      />
                      {option.label || 'Sin texto'}
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {questionType === 'selection' && (
            <div className="mt-5 w-full">
              <Select
                className={`${isFinished || isFinalizing ? 'opacity-50' : ''} rounded-lg w-60`}
                onChange={handleSelectOption}
                value={values.answer[0]?.optionId || ''}
                disabled={isFinished || isFinalizing}
              >
                {question.body.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
