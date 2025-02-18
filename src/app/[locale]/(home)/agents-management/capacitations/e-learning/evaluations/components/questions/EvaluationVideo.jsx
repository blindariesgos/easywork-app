import { Field, Label, Input, Textarea } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { EvaluationQuestionHeader } from '../EvaluationQuestionHeader';
import { EvaluationQuestionToolbar } from '../EvaluationQuestionToolbar';

import { videoUrlFormatter } from '../../../helpers/video-url-formatter';

export const EvaluationVideo = ({ question, onSave, onDelete, onDuplicate, onMove, isFirstQuestion, isLastQuestion }) => {
  const defaultValues = {
    title: question && question.title ? question.title : '',
    description: question && question.description ? question.description : '',
    videoSrc: question && question.videoSrc ? question.videoSrc : '',
  };

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
    <div>
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

      <div className="mt-8">
        {values.videoSrc ? (
          <div className="w-full h-[500px]">
            <iframe className="w-full h-full" src={videoUrlFormatter(values.videoSrc)} title={values.title} allowFullScreen frameborder="0"></iframe>
          </div>
        ) : (
          <div className="w-full h-[500px] flex items-center justify-center rounded-lg bg-gray-100">
            <p>No se ha cargado el video</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit(values => {
        onSave({ ...question, ...values });

        setIsEditing(false);
      })}
    >
      <Field>
        <Label>Título</Label>
        <Input
          placeholder="Portada..."
          disabled={isSubmitting}
          {...register('title', { required: 'El nombre es obligatorio.' })}
          className={`rounded-lg w-full mt-1 ${errors.title ? 'focus:border-red-300 border-red-300' : ''}`}
        />
      </Field>
      {errors.title && <p className="text-xs text-red-400 ml-2 mt-1 mb-2">{errors.title.message}</p>}

      <Field className="mt-4">
        <Label>Descripción</Label>
        <Textarea placeholder="" disabled={isSubmitting} rows={3} {...register('description')} className="mt-1 rounded-lg w-full" />
      </Field>

      <Field className="mt-4">
        <Label>URL del video</Label>
        <Input placeholder="https://youtube.com/video" disabled={isSubmitting} {...register('videoSrc')} className="mt-1 rounded-lg w-full p-1" />
      </Field>

      <div className="mt-6">
        <EvaluationQuestionToolbar hasAnswers={false} onCancel={onCancel} onDuplicate={onDuplicate} onDelete={onDelete} />
      </div>
    </form>
  );
};
