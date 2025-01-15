import { CourseDetails } from './CourseDetails';

export default function page({ params: { id } }) {
  return <CourseDetails courseId={id} />;
}
