import Image from 'next/image';
import Link from 'next/link';

import ModuleProgressBar from '../components/ModuleProgressBar';

export default function ModuleCard({ project }) {
  const statusColors = {
    'In Progress': 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    'On Hold': 'bg-amber-100 text-amber-700',
  };

  const categoryColors = {
    Design: 'bg-purple-100 text-purple-700',
    Development: 'bg-indigo-100 text-indigo-700',
    Marketing: 'bg-pink-100 text-pink-700',
  };

  return (
    <Link href={`/agents-management/capacitations/e-learning/courses/module/${project.id}`}>
      <div className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="h-48 relative rounded-t-xl overflow-hidden">
          <Image src={project.image} alt={project.title} className="w-full h-full object-cover" width={200} height={300} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>{project.status}</span> */}
        </div>

        <div className="p-6">
          {/* <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[project.category]}`}>{project.category}</span>
        </div> */}

          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{project.description}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium text-gray-900">{project.progress}%</span>
            </div>

            <ModuleProgressBar progress={project.progress} />
          </div>
        </div>
      </div>
    </Link>
  );
}
