import { useCallback } from 'react';

import { useRequest } from '../../hooks/useRequest';

export const useEvaluations = () => {
  const request = useRequest();

  const getEvaluations = useCallback(
    async (options = {}) => {
      return await request(`/evaluations`, options);
    },
    [request]
  );

  return { getEvaluations };
};
