import ModuleCard from '../components/ModuleCard';
import { projects } from './mocks';

export default function MainView() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-5 px-10">
        {projects.map(project => (
          <ModuleCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
