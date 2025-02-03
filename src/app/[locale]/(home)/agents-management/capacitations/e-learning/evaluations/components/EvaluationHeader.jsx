import { Select } from '@headlessui/react';
import { useState } from 'react';
import { useCourses } from '../../hooks/useCourses';
import { toast } from 'react-toastify';

export const EvaluationHeader = ({ courses, selectedCourse, setSelectedCourse }) => {
  const { getCourseById } = useCourses();
  const [fetchingCourseDetails, setFetchingCourseDetails] = useState(false);

  const handleSelectCourse = async e => {
    const courseId = e.target.value;
    if (!courseId) {
      setSelectedCourse(prev => ({ ...prev, courseId: '', pages: [] }));
      return;
    }

    setFetchingCourseDetails(true);

    try {
      setSelectedCourse(prev => ({ ...prev, courseId, pages: [] }));
      toast.info('Obteniendo información del curso');

      const course = await getCourseById(courseId);
      if (!course) return;

      const pages = course.folders.flatMap(folder => folder.pages);
      setSelectedCourse({ courseId, pages, pageId: pages[0]?.id || '' });
    } catch (error) {
      toast.error('Tenemos problemas para obtener el detalle del curso seleccionado. Por favor intenta más tarde');
      setSelectedCourse(prev => ({ ...prev, courseId, pages: [] }));
    } finally {
      setFetchingCourseDetails(false);
    }
  };

  const handleSelectPage = async e => {
    const pageId = e.target.value;
    if (!pageId) return;

    setSelectedCourse(prev => ({ ...prev, pageId }));
  };

  return (
    <div className="w-full">
      <h2 className="font-bold mb-2">Vincular evaluación a:</h2>

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <p>Curso</p>

          <Select
            id="course-options-evaluations"
            className={`rounded-lg w-full ${fetchingCourseDetails ? 'opacity-30' : ''}`}
            disabled={fetchingCourseDetails}
            onChange={handleSelectCourse}
            value={selectedCourse.courseId}
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
            className={`rounded-lg w-full ${fetchingCourseDetails ? 'opacity-30' : ''}`}
            disabled={fetchingCourseDetails}
            onChange={handleSelectPage}
            value={selectedCourse.pageId}
          >
            <option value="">Selecciona una opción</option>
            {selectedCourse.pages.map(page => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};
