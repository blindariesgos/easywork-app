import { useCallback } from 'react';

import { useRequest } from './useRequest';

export const useCapacitations = () => {
  const request = useRequest();

  const getCapacitations = useCallback(
    async (options = {}) => {
      return await request(`/capacitations`, options);
    },
    [request]
  );

  return { getCapacitations };
};
