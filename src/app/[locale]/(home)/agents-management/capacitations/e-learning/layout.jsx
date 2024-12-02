import ELearningHeader from './components/ELearningHeader';

export default function layout({ children }) {
  return (
    <>
      <ELearningHeader />
      {children}
    </>
  );
}
