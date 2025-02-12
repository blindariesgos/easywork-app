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

  const getEvaluation = useCallback(
    async (id, options = {}) => {
      return await request(`/evaluations/${id}`, options);
    },
    [request]
  );

  const getEvaluationsByCourse = useCallback(
    async (options = {}) => {
      return await request(`/evaluations/by-course`, options);
    },
    [request]
  );

  const createEvaluation = useCallback(
    async (data, options = {}) => {
      return await request(`/evaluations`, { method: 'POST', data, ...options });
    },
    [request]
  );

  const updateEvaluation = useCallback(
    async (id, data, options = {}) => {
      return await request(`/evaluations/${id}`, { method: 'PATCH', data, ...options });
    },
    [request]
  );

  return { getEvaluations, getEvaluation, getEvaluationsByCourse, createEvaluation, updateEvaluation };
};
