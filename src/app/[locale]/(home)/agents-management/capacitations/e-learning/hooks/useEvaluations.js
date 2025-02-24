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

  const updateEvaluationBasicInfo = useCallback(
    async (data, options = {}) => {
      return await request(`/evaluations/basic-info`, { method: 'POST', data, ...options });
    },
    [request]
  );

  const updateEvaluation = useCallback(
    async (id, data, options = {}) => {
      return await request(`/evaluations/${id}`, { method: 'PATCH', data, ...options });
    },
    [request]
  );

  const startEvaluation = useCallback(
    async (id, options = {}) => {
      return await request(`/evaluations/start/${id}`, { method: 'PATCH', ...options });
    },
    [request]
  );

  const getEvaluationToTake = useCallback(
    async (id, options = {}) => {
      return await request(`/evaluations/to-take/${id}`, options);
    },
    [request]
  );

  const updateEvaluationAttempt = useCallback(
    async (id, data, options = {}) => {
      return await request(`/evaluations/attempt/${id}`, { method: 'PATCH', data, ...options });
    },
    [request]
  );

  const finalizeEvaluation = useCallback(
    async (id, data, options = {}) => {
      return await request(`/evaluations/finalize-attempt/${id}`, { method: 'PATCH', data, ...options });
    },
    [request]
  );

  const getEvaluationAttempts = useCallback(
    async (options = {}) => {
      return await request(`/evaluations/attempts`, options);
    },
    [request]
  );

  return {
    getEvaluations,
    getEvaluation,
    getEvaluationToTake,
    getEvaluationsByCourse,
    createEvaluation,
    updateEvaluation,
    startEvaluation,
    updateEvaluationAttempt,
    finalizeEvaluation,
    getEvaluationAttempts,
    updateEvaluationBasicInfo,
  };
};
