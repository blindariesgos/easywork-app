import ModuleCard from '../components/ModuleCard';
import { projects } from './mocks';
import { getCourses } from './services/get-courses';

export default async function MainView() {
  const courses = await getCourses();

  console.log(courses);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-5 px-10">
        {courses.data.map(course => (
          <ModuleCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}
