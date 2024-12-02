// import { ArrowLeft, ArrowRight } from 'lucide-react';
// import { Project } from '../ProjectCard';
import Link from 'next/link';
import { projects } from '../../mocks';

export const ModuleContent = ({ project, onNavigate }) => {
  const currentIndex = projects.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>

      <div className="aspect-video relative rounded-xl overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <p className="text-gray-600">{project.description}</p>

      <div className="my-5">
        <Link href={`/agents-management/capacitations/e-learning/courses/module/${project.id}`} className="text-blue-100 font-bold text-">
          Evaluación final
        </Link>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        {prevProject ? (
          <button onClick={() => onNavigate(prevProject.id)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            {/* <ArrowLeft className="w-4 h-4" /> */}
            Previous Project
          </button>
        ) : (
          <div />
        )}

        {nextProject && (
          <button onClick={() => onNavigate(nextProject.id)} className="bg-blue-300 p-2 rounded-lg flex items-center gap-2 text-sm font-medium text-white font-bold hover:text-gray-900">
            Lección completada
            {/* <ArrowRight className="w-4 h-4" /> */}
          </button>
        )}
      </div>
    </div>
  );
};
