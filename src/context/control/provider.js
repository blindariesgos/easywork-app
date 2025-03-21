'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ControlContext } from '..';
import { usePortfolioControl } from '../../lib/api/hooks/policies';
import { useTasksConfigs } from '@/src/hooks/useCommon';
import { useTranslation } from 'react-i18next';
import useAppContext from '../app';
import { useSession } from 'next-auth/react';
import { getAddListContacts, getPortafolioControlResume } from '@/src/lib/apis';

export default function ControlContextProvider({ children }) {
  const session = useSession();
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const [filters, setFilters] = useState({});
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [groupKey, setGroupKey] = useState('urgente_30');
  const [totalsByStage, setTotalByStage] = useState({
    urgente_30: 0,
    urgente_15: 0,
    urgente_7: 0,
    atencion_media: 0,
    a_tiempo: 0,
    cobrados: 0,
    basura_45: 0,
    basura_60: 0,
  });
  const { data, isLoading, isError, mutate } = usePortfolioControl({
    filters,
    config: {
      page,
      limit,
    },
    groupKey,
  });
  const [displayFilters, setDisplayFilters] = useState({});
  const [filterFields, setFilterFields] = useState();
  const defaultFilterFields = [
    {
      id: 1,
      name: t('control:portafolio:control:form:agent'),
      type: 'select-user',
      check: true,
      code: 'responsibleId',
    },
    {
      id: 2,
      name: t('control:portafolio:control:form:currency'),
      type: 'select',
      check: false,
      code: 'currencyId',
      options: lists?.receipts?.currencies,
    },
  ];
  useEffect(() => {
    setFilterFields([
      {
        id: 1,
        name: t('control:portafolio:control:form:agent'),
        type: 'select-user',
        check: true,
        code: 'responsibleId',
      },
      {
        id: 2,
        name: t('control:portafolio:control:form:currency'),
        type: 'select',
        check: true,
        code: 'currencyId',
        options: lists?.receipts?.currencies,
      },
    ]);
  }, [lists]);

  useEffect(() => {
    setPage(1);
  }, [limit]);

  const getTotalsByState = async () => {
    const response = await getPortafolioControlResume({ filters }).catch(error => ({
      hasError: true,
      error,
    }));
    if (response.hasError) {
      console.log('🚀 ~ getTotalsByState ~ response:', response);
      return;
    }
    setTotalByStage(
      response.reduce(
        (acc, item) => ({
          ...acc,
          [item.key]: {
            count: item?.count ?? 0,
            amount: item?.amount ?? 0,
          },
        }),
        totalsByStage
      )
    );
  };

  useEffect(() => {
    getTotalsByState();
  }, []);

  useEffect(() => {
    getTotalsByState();
  }, [filters]);

  const removeFilter = filterName => {
    const newFilters = Object.keys(filters)
      .filter(key => key !== filterName)
      .reduce((acc, key) => ({ ...acc, [key]: filters[key] }), {});

    setFilters(newFilters);
    setDisplayFilters(displayFilters.filter(filter => filter.code !== filterName));
    const newFilterFields = filterFields.map(field => {
      return filterName !== field.code ? field : { ...field, check: false };
    });
    setFilterFields(newFilterFields);
  };

  const values = useMemo(
    () => ({
      selectedTasks,
      setSelectedTasks,
      data,
      isLoading,
      isError,
      page,
      setPage,
      limit,
      setLimit,
      mutate,
      filters,
      setFilters,
      filterFields,
      setFilterFields,
      displayFilters,
      setDisplayFilters,
      removeFilter,
      setGroupKey,
      totalsByStage,
      defaultFilterFields,
    }),
    [selectedTasks, data, isLoading, isError, mutate, page, limit, filters, filterFields, displayFilters, totalsByStage]
  );

  return <ControlContext.Provider value={values}>{children}</ControlContext.Provider>;
}
