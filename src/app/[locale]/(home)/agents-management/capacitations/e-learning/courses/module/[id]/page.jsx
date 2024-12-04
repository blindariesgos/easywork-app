import { ModuleDetails } from './ModuleDetails';

export default function page({ params: { id } }) {
  return <ModuleDetails moduleId={id} />;
}
