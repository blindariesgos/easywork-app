import Evaluation from './Evaluation';

export default function Page({ params: { id } }) {
  return <Evaluation evaluationId={id} />;
}
