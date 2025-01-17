import { ELearningHeader } from './components/ELearningHeader';

export default function ELearningLayout({ children }) {
  return (
    <div className="mt-2">
      <ELearningHeader />
      {children}
    </div>
  );
}
