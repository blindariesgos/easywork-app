import { Input, Textarea } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { EvaluationQuestionHeader } from '../EvaluationQuestionHeader';
import { EvaluationQuestionToolbar } from '../EvaluationQuestionToolbar';

export const EvaluationText = ({ question, onSave, onDelete, onDuplicate, onMove, isFirstQuestion, isLastQuestion }) => {
  const defaultValues = { title: question && question.title ? question.title : 'Título...', description: question && question.description ? question.description : 'Descripción...' };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ defaultValues });
  const [isEditing, setIsEditing] = useState(false);

  const values = watch();

  const onCancel = () => {
    reset(defaultValues);
    setIsEditing(false);
  };

  return !isEditing ? (
    <EvaluationQuestionHeader
      title={values.title}
      description={values.description}
      onEdit={() => setIsEditing(true)}
      onMove={onMove}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
    />
  ) : (
    <form
      onSubmit={handleSubmit(values => {
        onSave({ ...question, ...values });

        setIsEditing(false);
      })}
    >
      <Input disabled={isSubmitting} {...register('title', { required: 'El nombre es obligatorio.' })} className={`rounded-lg w-full ${errors.title ? 'focus:border-red-300 border-red-300' : ''}`} />
      {errors.title && <p className="text-xs text-red-400 ml-2 mt-1 mb-2">{errors.title.message}</p>}

      <Textarea disabled={isSubmitting} rows={3} {...register('description')} className={`rounded-lg w-full mt-2 ${errors.description ? 'focus:border-red-300 border-red-300' : ''}`} />

      <div className="mt-6">
        <EvaluationQuestionToolbar hasAnswers={false} onCancel={onCancel} onDuplicate={onDuplicate} onDelete={onDelete} />
      </div>
    </form>
  );
};
