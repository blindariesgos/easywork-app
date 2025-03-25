'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';

import Tag from '@/src/components/Tag';
import SliderOverShort from '@/src/components/SliderOverShort';
import { getGoogleCalendarList, revokeGoogleCredentials, toggleGoogleCalendarItem } from '@/src/lib/apis';

export const CalendarDisconnect = () => {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [googleCalendarsList, setGoogleCalendarsList] = useState([]);
  const [revoking, setRevoking] = useState(false);

  // Definitions
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

  const revokeAuth = async () => {
    setRevoking(true);

    try {
      await revokeGoogleCredentials();
      toast.success('Calendario de Google desconectado');
      router.push('/tools/calendar');
    } catch (error) {
      toast.error('Ha ocurrido un error al intentar obtener la lista de calendarios de Google');
    } finally {
      setRevoking(false);
    }
  };

  const fetchGoogleCalendarList = useCallback(async () => {
    try {
      const response = await getGoogleCalendarList();
      setGoogleCalendarsList(response);
    } catch (error) {
      toast.error('Ha ocurrido un error al intentar obtener la lista de calendarios de Google');
    }
  }, []);

  const onSelectGoogleCalendar = async (event, calendarId) => {
    const { checked } = event.target;

    try {
      await toggleGoogleCalendarItem({ id: calendarId, selected: checked });
      await fetchGoogleCalendarList();
    } catch (error) {
      toast.error('Ha ocurrido un error al marcar el calendario como seleccionado. Por favor intente más tarde');
    }
  };

  useEffect(() => {
    if (params.get('disconnect') === 'true') fetchGoogleCalendarList();
  }, [fetchGoogleCalendarList, params]);

  const closeConfig = () => {
    params.delete('disconnect');

    const newSearch = params.toString();
    router.push(`?${newSearch}`, undefined, { shallow: true });
  };

  return (
    <SliderOverShort openModal={params.get('disconnect')}>
      <Tag onclick={() => closeConfig()} className="bg-easywork-main" />
      <div className="bg-gray-300 max-md:w-screen w-96 rounded-l-2xl overflow-y-auto h-screen">
        <div className="m-3 font-medium text-lg flex justify-between">
          <h1>Calendario de Google</h1>
        </div>
        <div className="m-3 py-5 bg-gray-100 rounded-2xl">
          <div className="bg-white p-2 m-3">
            <div className="bg-white m-3 flex justify-between">
              <div className="flex items-center">
                <div className="rounded-full p-3 flex items-center bg-slate-100">
                  <Image className="h-7 w-7" width={36} height={36} src={'/icons/googleCalendarIcon.svg'} alt="" />
                </div>
                <div>
                  <div className="mb-3 p-1">
                    <h1 className="text-sm">Calendario de Google</h1>
                    <p className="text-xs"></p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="rounded-md bg-gray-50 px-3 mr-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={revokeAuth}
                  disabled={revoking}
                >
                  {revoking ? 'Desconectando...' : 'Desconectar'}
                </button>
              </div>
            </div>
            <p className="text-xs mb-3 pt-2 border-t-2">
              Lo calendarios seleccionados se sincronizarán con el calendario de EasyWork. Los eventos de los calendarios de origen afectarán sus horarios. Los intervalos de tiempo asignados se
              mostrarán como no disponibles para los otros empleados.
            </p>
            <div className="text-sm">
              {googleCalendarsList.map(item => (
                <div className="flex items-center gap-2 mt-1" key={item.id}>
                  <input type="checkbox" defaultChecked={item.selected} onChange={event => onSelectGoogleCalendar(event, item.id)} />
                  <p className="ml-1 text-xs">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SliderOverShort>
  );
};

export default CalendarDisconnect;
