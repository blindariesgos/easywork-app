'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CalendarContext } from '..';

import useAppContext from '../app';
import { useCalendar } from '@/src/lib/api/hooks/calendar';

export default function CalendarContextProvider({ children }) {
  const { t } = useTranslation();
  const { lists } = useAppContext();

  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [config, setConfig] = useState({
    page: 1,
    limit: 20,
    orderBy: 'name',
    order: 'DESC',
  });

  const { data, isLoading, isError, mutate } = useCalendar({ config, filters });

  const [filterFields, setFilterFields] = useState();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [displayFilters, setDisplayFilters] = useState({});
  const [events, setEvents] = useState();

  const defaultFilterFields = [
    {
      id: 0,
      name: t('control:portafolio:receipt:filters:responsible'),
      type: 'select-user',
      check: true,
      code: 'responsible',
    },
    {
      id: 1,
      name: t('control:portafolio:receipt:filters:expiration-date'),
      type: 'date',
      check: true,
      code: 'createdAt',
    },
  ];

  const handleChangeConfig = (key, value) => {
    let newConfig = {
      ...config,
      [key]: value,
    };
    if (value === config.orderBy) {
      newConfig = {
        ...newConfig,
        order: value !== config.orderBy ? 'DESC' : config.order === 'ASC' ? 'DESC' : 'ASC',
      };
    }
    setConfig(newConfig);
  };

  useEffect(() => {
    setEvents(
      (data &&
        data.items &&
        data.items.length > 0 &&
        data.items.map(event => ({
          title: event.name,
          start: event.startTime,
          end: event.endTime,
          color: event.color,
          id: event.id,
        }))) ??
        []
    );
  }, [data]);

  useEffect(() => {
    setFilterFields([
      {
        id: 0,
        name: t('control:portafolio:receipt:filters:responsible'),
        type: 'select-user',
        check: true,
        code: 'responsible',
      },
      {
        id: 1,
        name: t('control:portafolio:receipt:filters:expiration-date'),
        type: 'date',
        check: true,
        code: 'createdAt',
      },
      {
        id: 2,
        name: t('control:portafolio:receipt:filters:client'),
        type: 'select-user',
        check: false,
        code: 'client',
      },
      {
        id: 3,
        name: t('control:portafolio:receipt:filters:rfc'),
        type: 'input',
        check: false,
        code: 'rfc',
      },
    ]);
  }, [lists?.listContact]);

  useEffect(() => {
    handleChangeConfig('page', 1);
  }, [config.limit]);

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
      data,
      isLoading,
      isError,
      mutate,
      page: config.page, // Usa la configuración de la paginación
      setPage: value => handleChangeConfig('page', value),
      limit: config.limit, // Usa la configuración del límite
      setLimit: value => handleChangeConfig('limit', value),
      orderBy: config.orderBy,
      setOrderBy: value => handleChangeConfig('orderBy', value),
      order: config.order,
      removeFilter,
      selectedContacts,
      setSelectedContacts,
      displayFilters,
      setDisplayFilters,
      filterFields,
      setFilterFields,
      filters,
      setFilters,
      defaultFilterFields,
      events,
    }),
    [data, isLoading, isError, config, selectedContacts, displayFilters, filterFields, filters, defaultFilterFields, events]
  );

  return <CalendarContext.Provider value={values}>{children}</CalendarContext.Provider>;
}
