import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { Select, Textarea, Input } from '@headlessui/react';
import { FiPlusCircle, FiTrash } from 'react-icons/fi';
import { EvaluationQuestionHeader } from '../EvaluationQuestionHeader';
import { EvaluationQuestionToolbar } from '../EvaluationQuestionToolbar';

const EvaluationQuestionOptionsViewType = ({ type, questions }) => {
  if (['check-list', 'multiple-choice'].includes(type)) {
    return (
      <div className="mt-5 ml-8">
        {questions.map((question, index) => {
          return (
            <div key={`${question.label}-${index}`} className="mb-2">
              <label>
                <input type={type === 'multiple-choice' ? 'radio' : 'checkbox'} name="question-options" className="w-5 h-5 mr-2" />
                {question.label || 'Sin texto'}
              </label>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === 'selection') {
    return (
      <div className="mt-5 w-full">
        <Select className="rounded-lg w-60">
          {questions.map((question, index) => (
            <option key={`${question.label}-${index}`} value={`${question.label}-${index}`}>
              {question.label}
            </option>
          ))}
        </Select>
      </div>
    );
  }

  return <p>Tipo {type} en proceso de implementación</p>;
};

const EvaluationQuestionFormOptionsType = ({ type, fields, remove, register, isSubmitting }) => {
  if (['check-list', 'multiple-choice'].includes(type)) {
    return fields.map((field, index) => (
      <div key={field.id} className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-2">
          <label>
            {type === 'multiple-choice' ? (
              <input type="radio" value={field.id} name="question-options" className="w-6 h-6" />
            ) : (
              <input type="checkbox" value={field.id} name="question-options" className="w-5 h-5 rounded-sm" />
            )}
          </label>

          <Textarea rows={1} {...register(`questions.${index}.label`)} className="w-60 rounded-lg text-sm p-1" disabled={isSubmitting} />
        </div>

        <div>
          <Input type="number" {...register(`questions.${index}.score`)} className="w-10 border-t-0 border-l-0 border-r-0 text-center text-sm p-1 mr-1" />
          <span>punto(s)</span>
        </div>

        <button type="button" onClick={() => remove(index)}>
          <FiTrash size="18px" className="text-red-400" />
        </button>
      </div>
    ));
  }

  if (type === 'selection') {
    return fields.map((field, index) => (
      <div key={field.id} className="flex items-center gap-4 mb-2">
        <Textarea rows={1} {...register(`questions.${index}.label`)} className="w-60 rounded-lg text-sm p-1" disabled={isSubmitting} />

        <div>
          <Input type="number" {...register(`questions.${index}.score`)} className="w-10 border-t-0 border-l-0 border-r-0 text-center text-sm p-1 mr-1" />
          <span>punto(s)</span>
        </div>

        <button type="button" onClick={() => remove(index)}>
          <FiTrash size="18px" className="text-red-400" />
        </button>
      </div>
    ));
  }

  return <p>Tipo {type} en proceso de implementación</p>;
};

const EvaluationQuestionForm = ({ values, fieldArray, register, formState, setValue, handleSubmit, onCancel, onDuplicate, onDelete }) => {
  const { errors, isSubmitting } = formState;
  const { fields, append, prepend, remove, swap, move, insert } = fieldArray;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <Input
            {...register('title', { required: 'El nombre es obligatorio.' })}
            className={`rounded-lg w-full ${errors.title ? 'focus:border-red-300 border-red-300' : ''}`}
            disabled={isSubmitting}
          />
          {errors.title && <p className="text-xs text-red-400 ml-2 mt-1 mb-2">{errors.title.message}</p>}
        </div>

        <div>
          <Select
            {...register('type', { required: 'El tipo de pregunta es obligatorio.' })}
            className={`rounded-lg w-full ${errors.type ? 'focus:border-red-300 border-red-300' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Selecciona una opción</option>
            <option value="multiple-choice">Opción múltiple</option>
            <option value="check-list">Casilla de verificación</option>
            <option value="selection">Lista desplegable</option>
          </Select>
          {errors.type && <p className="text-xs text-red-400 ml-2 mt-1 mb-2">{errors.type.message}</p>}
        </div>
      </div>

      {/* Opciones */}
      {values.type ? (
        <div className="mt-10 mb-16">
          <EvaluationQuestionFormOptionsType type={values.type} fields={fields} remove={remove} register={register} isSubmitting={isSubmitting} />

          <button className="flex items-center justify-start gap-2 mt-4" type="button" onClick={() => append({ label: `Opción ${fields.length + 1}`, score: 0 })}>
            <FiPlusCircle size="18px" className="text-easy-400" />
            <p className="text-easy-400">Agregar opción</p>
          </button>
        </div>
      ) : (
        <div className="my-8 flex items-center">
          <p className="text-red-300">Seleccione un tipo de pregunta</p>
        </div>
      )}

      {/* Actions */}
      <div>
        <EvaluationQuestionToolbar
          isRequired={values.required}
          pointsCount={fields.reduce((a, b) => a + Number(b.score), 0)}
          setIsRequired={isRequired => setValue('required', isRequired)}
          onCancel={onCancel}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      </div>
    </form>
  );
};

const EvaluationQuestionView = ({ values, onEdit, onDuplicate, onDelete, onMove, isFirstQuestion, isLastQuestion }) => {
  return (
    <div>
      <EvaluationQuestionHeader
        title={values.title}
        description={values.description}
        onEdit={onEdit}
        onMove={onMove}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
      />

      {/* Opciones */}
      {values.questions.length > 0 && (
        <EvaluationQuestionOptionsViewType type={values.type} questions={values.questions} />
        // <div className="mt-5 ml-8">
        //   {values.questions.map((question, index) => {
        //     return (
        //       <div key={`${question.label}-${index}`} className="mb-2">
        //         <label>
        //           <input type="radio" name="question-options" className="w-5 h-5 mr-2" />
        //           {question.label || 'Sin texto'}
        //         </label>
        //       </div>
        //     );
        //   })}
        // </div>
      )}
    </div>
  );
};

export const EvaluationQuestion = ({ question, onSave, onDelete, onDuplicate, onMove, isFirstQuestion, isLastQuestion }) => {
  const defaultValues = {
    title: question && question.title ? question.title : 'Pregunta',
    description: question && question.description ? question.description : '',
    type: question && question.type ? question.type : '',
    questions: question && question.questions ? question.questions : [],
    required: question && question.required ? question.required : '',
    answer: '',
  };

  const [isEditing, setIsEditing] = useState(false);

  const { control, register, setValue, handleSubmit, reset, formState, watch } = useForm({ defaultValues });
  const fieldArray = useFieldArray({
    control,
    name: 'questions',
  });

  const values = watch();

  const onCancel = () => {
    reset(defaultValues);
    setIsEditing(false);
  };

  return isEditing ? (
    <EvaluationQuestionForm
      register={register}
      control={control}
      fieldArray={fieldArray}
      values={values}
      formState={formState}
      setValue={setValue}
      handleSubmit={handleSubmit(values => {
        onSave({ ...question, ...values });
      })}
      onCancel={onCancel}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    />
  ) : (
    <EvaluationQuestionView
      values={values}
      onEdit={() => setIsEditing(true)}
      onMove={onMove}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
    />
  );
};
