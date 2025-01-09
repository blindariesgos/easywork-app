import { getCourses } from '../courses/services/get-courses';
import CoursesGridView from '../components/CoursesGridView';

export default async function ConfigView() {
  const courses = await getCourses();

  return <CoursesGridView courses={courses.data} showCreateButton />;
}
