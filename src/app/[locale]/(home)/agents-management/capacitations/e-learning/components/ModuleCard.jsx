'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ModuleProgressBar } from '../components/ModuleProgressBar';
import { ModuleCardMoreMenu } from '../components/ModuleCardMoreMenu';

import { E_LEARNING_BASE_ROUTE } from '../constants';

export const ModuleCard = ({ course, onEditCourse, onMoveCourse, onDeleteCourse }) => {
  const pathname = usePathname();

  if (!course.progress) course.progress = 0;

  return (
    <div className="relative">
      {pathname === `${E_LEARNING_BASE_ROUTE}/config` && (
        <ModuleCardMoreMenu onEditCourse={() => onEditCourse(course)} onMoveCourse={() => onMoveCourse(course)} onDeleteCourse={() => onDeleteCourse(course)} />
      )}

      <div className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer h-[430px]">
        <Link href={`${E_LEARNING_BASE_ROUTE}/courses/${course.id}`}>
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
          </div>

          <div className="p-5 h-[238px] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
              <p className="text-sm text-gray-500 mb-4 max-h-96 overflow-hidden line-clamp-4">{course.description}</p>
            </div>
            <div>
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
};
