'use client';
import useSWR from 'swr';
import axios from 'axios';

const getQueries = (filters, userId) => {
  const getRepitKeys = (key, arr) => arr.map(item => `${key}=${item?.id ?? item}`).join('&');
  if (Object.keys(filters).length == 0) return '';

  const getValue = (key, userId) => {
    switch (key) {
      case 'role':
        return `${filters[key]}=${userId}`;
      default:
        return `${key}=${filters[key]}`;
    }
  };

  return Object.keys(filters)
    .filter(key => filters[key] && filters[key].length > 0)
    .map(key => (Array.isArray(filters[key]) ? getRepitKeys(key, filters[key]) : getValue(key, userId)))
    .join('&');
};

export const useCapacitations = ({ filters = {}, config = {}, userId = '' }) => {
  const queries = getQueries(filters, userId);
  const configParams = Object.keys(config)
    .map(key => `${key}=${config[key]}`)
    .join('&');
  const url = `/capacitations?${configParams}${queries.length > 0 ? `&${queries}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, async (endpoint, options = {}) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_CAPACITATIONS_HOST}${endpoint}`).catch(error => error);
    return response.data;
  });

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};
