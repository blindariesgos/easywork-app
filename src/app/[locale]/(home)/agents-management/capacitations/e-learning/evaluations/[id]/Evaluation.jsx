'use client';

import CreateEditEvaluation from '../components/CreateEditEvaluation';
import { EvaluationToTake } from '../components/EvaluationToTake';

import { useUserPermissions } from '../../../hooks/useUserPermissions';

import { LMS_PERMISSIONS } from '../../../constants';

const Evaluation = ({ evaluationId }) => {
  const { hasPermission } = useUserPermissions();

  return hasPermission(LMS_PERMISSIONS.takeEvaluation) ? <EvaluationToTake evaluationId={evaluationId} /> : <CreateEditEvaluation evaluationId={evaluationId} />;
};

export default Evaluation;
