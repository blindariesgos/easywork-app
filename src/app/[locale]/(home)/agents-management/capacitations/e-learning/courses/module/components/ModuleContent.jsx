// import { ArrowLeft, ArrowRight } from 'lucide-react';
// import { Project } from '../ProjectCard';
import Link from 'next/link';
import { projects } from '../../mocks';
import Image from 'next/image';

export const ModuleContent = ({ content }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.name}</h1>

      <div className="aspect-video relative rounded-xl overflow-hidden">
        <Image fill src={content.coverPhotoSrc || ''} alt={content.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <p className="text-gray-600">{content.description}</p>

      <div className="my-5">
        <Link href={`/agents-management/capacitations/e-learning/courses/module/${content.id}`} className="text-blue-100 font-bold text-">
          Evaluación final
        </Link>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <button onClick={() => null} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          Previous Project
        </button>

        <button onClick={() => null} className="bg-blue-300 p-2 rounded-lg flex items-center gap-2 text-sm text-white font-bold hover:text-gray-900">
          Lección completada
        </button>
      </div>
    </div>
  );
};
