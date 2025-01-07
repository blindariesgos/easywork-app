'use client';

import Image from 'next/image';
import Link from 'next/link';

import ModuleProgressBar from '../components/ModuleProgressBar';
import ModuleCardMoreMenu from '../components/ModuleCardMoreMenu';
import { usePathname } from 'next/navigation';

export default function ModuleCard({ course, onEditCourse, onMoveCourse, onDeleteCourse }) {
  const pathname = usePathname();

  if (!course.progress) course.progress = Math.ceil(Math.random() * 100);

  return (
    <div className="relative">
      {pathname === '/agents-management/capacitations/e-learning/config' && (
        <ModuleCardMoreMenu onEditCourse={() => onEditCourse(course)} onMoveCourse={() => onMoveCourse(course)} onDeleteCourse={() => onDeleteCourse(course)} />
      )}

      <div className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer h-96">
        <div className="h-48 relative rounded-t-xl overflow-hidden">
          {course.coverPhotoSrc ? (
            <>
              <Image src={course.coverPhotoSrc || ''} alt={course.name} className="w-full h-full object-cover" width={200} height={300} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-300">
              <p className="text-gray-400">No image</p>
            </div>
          )}
          {/* <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${statusColors[course.status]}`}>{course.status}</span> */}
        </div>
        <Link href={`/agents-management/capacitations/e-learning/courses/module/${course.id}`}>
          <div className="p-6">
            {/* <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[course.category]}`}>{course.category}</span>
        </div> */}

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{course.description}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Progreso</span>
                <span className="font-medium text-gray-900">{course.progress}%</span>
              </div>

              <ModuleProgressBar progress={course.progress} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
