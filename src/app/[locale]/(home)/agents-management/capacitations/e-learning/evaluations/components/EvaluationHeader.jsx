import { useCallback, useEffect, useState } from 'react';
import { Input, Select, Textarea } from '@headlessui/react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { useCourses } from '../../hooks/useCourses';
import Image from 'next/image';

export const EvaluationHeader = ({ evaluation, onCreateEvaluation, onUpdateEvaluation }) => {
  const isEdit = !!evaluation.name;
  const { getCourseById, getCourses } = useCourses();

  const [courses, setCourses] = useState([]);
  const [coursePages, setCoursePages] = useState([]);
  const [fetchingCourseDetails, setFetchingCourseDetails] = useState(false);
  const [isEditingDisabled, setIsEditingDisabled] = useState(true);
  const [preview, setPreview] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ ...evaluation });

  const values = watch();

  const handleSelectCourse = async e => {
    const courseId = e.target.value;
    if (!courseId) return;

    setFetchingCourseDetails(true);

    try {
      setValue('courseId', courseId);
      toast.info('Obteniendo información del curso');

      await fetchPages(courseId);
    } catch (error) {
      toast.error('Tenemos problemas para obtener el detalle del curso seleccionado. Por favor intenta más tarde');
      setValue('courseId', '');
    } finally {
      setFetchingCourseDetails(false);
    }
  };

  const handleSelectPage = async e => {
    const pageId = e.target.value;
    if (!pageId) return;

    setValue('pageId', pageId);
  };

  const fetchCourses = useCallback(async () => {
    setFetchingCourseDetails(true);

    try {
      const courses = await getCourses();
      setCourses(courses.data);
    } catch (error) {
      toast.error('Ha ocurrido un error al obtener la información de los cursos. Por favor intente más tarde');
    } finally {
      setFetchingCourseDetails(false);
    }
  }, [getCourses]);

  const fetchPages = useCallback(
    async courseId => {
      if (!courseId) return;

      try {
        const course = await getCourseById(courseId);
        if (!course) {
          setValue('courseId', '');
          return;
        }

        const pages = course.folders.flatMap(folder => folder.pages);
        setCoursePages(pages);
      } catch (error) {
        toast.error('Ha ocurrido un error al obtener las lecciones del curso. Por favor intente más tarde');
      }
    },
    [getCourseById, setValue]
  );

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (evaluation) {
      fetchPages(evaluation.course?.id).then(() => {
        reset({
          ...evaluation,
          courseId: evaluation.course?.id,
          ...(evaluation.page ? { pageId: evaluation.page.id } : {}),
        });
      });
    }
  }, [reset, evaluation, fetchPages]);

  return (
    <div className="w-full">
      <h2 className="font-bold mb-2">Vincular evaluación a:</h2>

      <form
        onSubmit={handleSubmit(values => {
          if (!values.courseId) {
            toast.info('Debe seleccionar al menos un curso para poder crear la evaluación');
            return;
          }

          if (isEdit) {
            onUpdateEvaluation(values);
          } else {
            onCreateEvaluation(values);
          }
        })}
      >
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <p>Curso</p>

            <Select
              id="course-options-evaluations"
              className={`rounded-lg w-full ${fetchingCourseDetails || (isEditingDisabled && isEdit) ? 'opacity-30' : ''}`}
              disabled={isSubmitting || fetchingCourseDetails || (isEditingDisabled && isEdit)}
              onChange={handleSelectCourse}
              value={values.courseId}
            >
              <option value="">Selecciona una opción</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <p>Página</p>
            <Select
              id="course-page-options-evaluations"
              className={`rounded-lg w-full ${fetchingCourseDetails || (isEditingDisabled && isEdit) ? 'opacity-30' : ''}`}
              disabled={isSubmitting || fetchingCourseDetails || (isEditingDisabled && isEdit)}
              onChange={handleSelectPage}
              value={values.pageId}
            >
              <option value="">Selecciona una opción</option>
              {coursePages.map(page => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {isEdit && isEditingDisabled && (
          <div className="pl-1">
            <button type="button" className="text-blue-400 mt-2" onClick={() => setIsEditingDisabled(false)}>
              Editar portada
            </button>
          </div>
        )}

        <div className={`mt-4 ${isEditingDisabled && isEdit && 'hidden'}`}>
          <p>Título *</p>
          <Input
            disabled={isSubmitting || fetchingCourseDetails}
            {...register('name', { required: 'El nombre es obligatorio.' })}
            className={`rounded-lg w-full ${errors.name ? 'focus:border-red-300 border-red-300' : ''}`}
          />
          {errors.name && <p className="text-xs text-red-400 ml-2 mt-1 mb-2">{errors.name.message}</p>}
        </div>

        <div className={`mt-4 ${isEditingDisabled && isEdit && 'hidden'}`}>
          <p>Descripción</p>
          <Textarea
            disabled={isSubmitting || fetchingCourseDetails}
            rows={3}
            {...register('description')}
            className={`rounded-lg w-full mt-2 ${errors.description ? 'focus:border-red-300 border-red-300' : ''}`}
          />
        </div>

        <div className={`mt-4 ${isEditingDisabled && isEdit && 'hidden'}`}>
          <label htmlFor="modulePhoto" type="button" className="cursor-pointer text-sm text-black">
            {preview || evaluation?.coverPhotoSrc ? (
              <Image width={96} height={96} src={preview || evaluation?.coverPhotoSrc} alt="Evaluation lading image" className="h-auto w-full" loading="eager" />
            ) : (
              <div className="h-48 bg-[#eeeeee] border-[#e0e0e0] border rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Cargar imagen</p>
              </div>
            )}
          </label>

          <input
            id="modulePhoto"
            name="modulePhoto"
            type="file"
            className="peer hidden inset-0 h-full w-full  rounded-md opacity-0"
            onChange={e => {
              const files = e.target.files;

              if (files[0]) setPreview(URL.createObjectURL(files[0]));
              setValue('coverPhotoSrc', files[0]);
            }}
            accept="image/jpg,image/jpeg,image/png,image/gif,image/svg"
            disabled={isSubmitting || fetchingCourseDetails}
          />
        </div>

        <button type="button" className={`bg-[#969696] px-3 py-2 text-white rounded-lg font-bold mt-4 mr-2 ${(isEditingDisabled || !isEdit) && 'hidden'}`} onClick={() => setIsEditingDisabled(true)}>
          Cancelar
        </button>
        <button type="submit" className={`bg-easy-400 px-3 py-2 text-white rounded-lg font-bold mt-4 ${isEditingDisabled && isEdit && 'hidden'}`}>
          {isEdit ? 'Guardar cambios' : 'Crear evaluación'}
        </button>
      </form>
    </div>
  );
};
