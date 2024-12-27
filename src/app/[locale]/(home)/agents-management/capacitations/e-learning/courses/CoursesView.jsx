import { getCourses } from './services/get-courses';
import CoursesGridView from '../components/CoursesGridView';

export default async function MainView() {
  const courses = await getCourses();

  return (
    <div>
      <div className="mb-2 flex items-center justify-end px-10 text-sm text-gray-60">
        <p>
          {courses.count || 0} curso{courses.count && courses.count > 1 ? 's' : ''}
        </p>
      </div>
      <CoursesGridView courses={courses.data} />
    </div>
  );
}
