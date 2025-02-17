import { Field, Label, Input, Textarea } from '@headlessui/react';
import { FiCopy } from 'react-icons/fi';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { EvaluationQuestionHeader } from '../EvaluationQuestionHeader';
import { EvaluationQuestionToolbar } from '../EvaluationQuestionToolbar';

export const EvaluationImage = ({ question, onSave, onDelete, onDuplicate, onMove, isFirstQuestion, isLastQuestion }) => {
  const defaultValues = {
    title: question && question.title ? question.title : '',
    description: question && question.description ? question.description : '',
    imageSrc: question && question.imageSrc ? question.imageSrc : '',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({ defaultValues });
  const [isEditing, setIsEditing] = useState(false);
  const inputImageRef = useRef(null);

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
        {values.imageSrc ? (
          // <Image alt="portrait" src={values.imageSrc} width={500} height={300} />
          <div className="relative w-full h-[500px]">
            <Image src={values.imageSrc} alt="Descripción de la imagen" layout="fill" objectFit="cover" />
          </div>
        ) : (
          <div className="w-full h-[500px] flex items-center justify-center rounded-lg bg-gray-100">
            <p>No image</p>
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

      {/* // TODO: Este bloque aun no está estable para subir \\ */}
      {false && (
        <>
          <p className="mt-4">Subir imagen</p>
          <div
            className="px-4 mt-1 w-full h-40 flex items-center justify-center rounded-lg bg-gray-100 cursor-pointer"
            onClick={() => {
              inputImageRef.current?.click();
            }}
          >
            <p className="text-[#757575]">Seleccionar +</p>
            <input
              ref={inputImageRef}
              type="file"
              className="peer hidden inset-0 h-full w-full  rounded-md opacity-0"
              onChange={e => {
                const files = Array.from(e.target.files);
                setValue('imageSrc', files[0]);
              }}
              disabled={isSubmitting}
            />
          </div>
        </>
      )}

      <Field className="mt-4">
        <Label>URL</Label>
        <Input placeholder="https://example.com/imagen.jpg" disabled={isSubmitting} {...register('imageSrc')} className="mt-1 rounded-lg w-full p-1" />
      </Field>

      <div className="mt-6">
        <EvaluationQuestionToolbar hasAnswers={false} onCancel={onCancel} onDuplicate={onDuplicate} onDelete={onDelete} />
      </div>
    </form>
  );
};
