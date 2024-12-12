'use client';
import useSWR from 'swr';
import fetcher from '../fetcher';
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

  const { data: _, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data: {
      items: [
        {
          id: 1,
          name: 'Armando Graterol',
          stage: 4,
          startDate: '2024-02-01',
          endDate: '2024-03-01',
          processClosed: false,
          responsible: 'Ryan Vetrovs',
        },
        {
          id: 2,
          name: 'Armando Graterol',
          stage: 5,
          startDate: '2024-02-01',
          endDate: '2024-03-01',
          processClosed: false,
          responsible: 'Ryan Vetrovs',
        },
        {
          id: 3,
          name: 'Armando Graterol',
          stage: 2,
          startDate: '2024-02-01',
          endDate: '2024-03-01',
          processClosed: true,
          responsible: 'Ryan Vetrovs',
        },
        {
          id: 3,
          name: 'Armando Graterol',
          stage: 6,
          startDate: '2024-02-01',
          endDate: '2024-03-01',
          processClosed: false,
          responsible: 'Ryan Vetrovs',
        },
      ],
      meta: {
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: 5,
        totalPages: 0,
        currentPage: 1,
      },
    },
    isLoading,
    isError: error,
    mutate,
  };
};
