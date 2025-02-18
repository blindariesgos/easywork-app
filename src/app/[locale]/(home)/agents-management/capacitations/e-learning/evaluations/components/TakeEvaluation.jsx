import { useState } from 'react';

import { EvaluationBody } from './EvaluationBody';
import { useEvaluations } from '../../hooks/useEvaluations';
import { toast } from 'react-toastify';

export const TakeEvaluation = ({ evaluationId }) => {
  const { getEvaluation } = useEvaluations();

  const [evaluation, setEvaluation] = useState({ id: '', questions: [] });

  const fetchEvaluation = useCallback(async () => {
    try {
      if (!evaluationId) return;

      const response = await getEvaluation(evaluationId);
      setEvaluation(response);
    } catch (error) {
      toast.error('Ha ocurrido un error al obtener la información de la evaluación. Por favor intente más tarde');
    }
  }, [getEvaluation, evaluationId]);

  useEffect(() => {
    fetchEvaluation();
  }, [fetchEvaluation]);

  return <EvaluationBody questions={evaluation.questions} />;
};
