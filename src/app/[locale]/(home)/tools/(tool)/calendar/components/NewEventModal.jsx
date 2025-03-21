'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { add, formatISO } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { XCircleIcon } from '@heroicons/react/20/solid';
import { Dialog, DialogPanel, Disclosure, Transition, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

import useAppContext from '@/src/context/app';
import SelectMenu from './SelectMenu';
import ComboBox from './ComboBox';
import ComboBoxMultiSelect from '@/src/components/form/ComboBoxMultiSelect';
import CRMMultipleSelectV2 from '@/src/components/form/CRMMultipleSelectV2';

import { timezones } from '@/src/lib/timezones';
import { addCalendarEvent } from '@/src/lib/apis';

const eventLocalizations = [
  { id: 1, name: 'Ninguna', online: true },
  { id: 2, name: 'Casa del cliente', online: true },
  { id: 3, name: 'Central Meeting Room', online: false },
  { id: 4, name: 'East Meeting Room', online: false },
  { id: 5, name: 'Zoom Personal', online: true },
];

export const NewEventModal = ({ open, onClose, selectedDate, defaultTimezone }) => {
  // Hooks
  const { lists } = useAppContext();
  const { t } = useTranslation();

  // States
  const [allDay, setAllDay] = useState(false);
  const [timezone, setTimezone] = useState(defaultTimezone);
  const [loading, setLoading] = useState(false);
  const [formLocalization, setFormLocalization] = useState(eventLocalizations[0]);

  const schema = yup.object().shape({
    name: yup.string().required(),
    important: yup.boolean(),
    isPrivate: yup.boolean(),
    startTime: yup.date().required(),
    endTime: yup.date().required().min(yup.ref('startTime'), 'La fecha de fin debe ser mayor que la fecha de inicio'),
    participants: yup.array().of(yup.object().shape({})),
    description: yup.string(),
    reminder: yup.object().shape({}),
    color: yup.string(),
    repeat: yup.string(),
    availability: yup.string(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = async data => {
    setLoading(true);

    const { participants, reminder, startTime, endTime, reminderCustom, availability, color, important, isPrivate, repeat, name, crm } = data;

    let reminderValue;

    if (reminder && reminder?.value) {
      if (reminder?.value?.custom) {
        reminderValue = reminderCustom;
      } else {
        reminderValue = add(otherData.startTime, reminder.value);
      }
    }

    const body = {
      participantsIds: participants?.map(participant => participant.id) ?? [],
      reminder: formatISO(reminderValue ?? startTime),
      startTime: formatISO(startTime),
      endTime: formatISO(endTime),
      timeZone: timezone.value,
      localization: formLocalization.name,
      color: color ?? '#141052',
      description: '<p></p>',
      availability: 'Ocupado',
      name,
      crm: crm?.map(item => ({ id: item.id, type: item.type })) || [],
    };

    if (selectOauth) body.oauth = selectOauth?.id;
    body.user = session?.data?.user?.sub;

    try {
      const response = await addCalendarEvent(body);
      console.log(response);
      if (response.hasError) {
        toast.error('Se ha producido un error al crear el evento, inténtelo de nuevo más tarde.');
      } else {
        toast.success('Evento creado con éxito.');
        mutate();
        close();
      }
    } catch {
      toast.error('Se ha producido un error, inténtelo de nuevo más tarde.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedDate.start) setValue('startTime', selectedDate.start);
    if (selectedDate.end) setValue('endTime', selectedDate.end);
  }, [setValue, selectedDate]);

  return (
    <Dialog open={open} onClose={onClose} as="div" className="relative z-50 focus:outline-none">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true"></div>

      {/* Contenido del diálogo */}
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel transition className="w-3/5 rounded-[35px] bg-zinc-100 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
          <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col p-5 relative z-50" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col sm:flex-row sm:items-center w-full bg-transparent">
              <input
                type="text"
                name="name"
                id="event-name"
                placeholder={t('tools:calendar:new-event:name')}
                className={clsx('block w-full border-0 px-1 text-gray-900 rounded-xl focus:ring-0 placeholder:text-gray-400 text-base', {
                  'placeholder:text-red-600': errors?.name && errors?.name?.message,
                })}
                {...register('name')}
                autoComplete="false"
              />
              <XCircleIcon className="w-8 h-8 ml-2 text-red-500 hover:text-red-700 cursor-pointer" onClick={() => close()} />
            </div>
            <div className="gap-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:gap-y-0 sm:px-6 sm:py-5 transition-all duration-500">
              <div className="my-auto">
                <label htmlFor="project-description" className="block text-sm font-medium leading-6 text-gray-900 my-auto">
                  {t('tools:calendar:new-event:hour')}
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="w-full">
                    <label htmlFor="startTime" className="block text-xs font-light leading-6 text-gray-900">
                      Fecha y hora inicio del evento
                    </label>
                    <input
                      type={allDay ? 'date' : 'datetime-local'}
                      name="startTime"
                      id="startTime"
                      className={clsx(
                        'block rounded-md border py-1.5 text-gray-900 w-full shadow-sm border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                        { 'border-red-600': errors && errors.startTime }
                      )}
                      {...register('startTime')}
                    />
                    {errors && errors?.startTime && <p className="mt-1 text-xs text-red-600">{errors?.startTime?.message}</p>}
                  </div>
                  <div className="w-full">
                    <label htmlFor="endTime" className="block text-xs font-light leading-6 text-gray-900">
                      Fecha y hora fin del evento
                    </label>
                    <input
                      type={allDay ? 'date' : 'datetime-local'}
                      name="endTime"
                      id="endTime"
                      className={clsx(
                        'block rounded-md border py-1.5 text-gray-900 w-full shadow-sm border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                        { 'border-red-600': errors && errors.endTime }
                      )}
                      {...register('endTime')}
                    />
                    {errors && errors?.endTime && <p className="mt-1 text-xs text-red-600">{errors?.endTime?.message}</p>}
                  </div>
                  <div className="relative flex items-start mt-2 sm:mt-6 w-full">
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        id="all-day"
                        aria-describedby="all-day-description"
                        name="all-day"
                        type="checkbox"
                        checked={allDay}
                        onChange={() => setAllDay(!allDay)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label htmlFor="all-day" className="font-light text-gray-900 text-sm leading-6">
                        {t('tools:calendar:new-event:all-day')}
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <Disclosure>
                    <DisclosureButton className="py-2 text-primary underline decoration-dashed underline-offset-4 text-xs hover:decoration-solid">
                      {t('tools:calendar:new-event:time-zone')}
                    </DisclosureButton>
                    <Transition enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <DisclosurePanel className="text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ComboBox data={timezones} selected={timezone} setSelected={setTimezone} />
                      </DisclosurePanel>
                    </Transition>
                  </Disclosure>
                </div>
              </div>
            </div>
            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 flex items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
              <div>
                <h3 className="text-sm font-medium leading-6 text-gray-900">{t('tools:calendar:new-event:wizards')}</h3>
              </div>
              <div className="sm:col-span-2">
                <div className="flex flex-col gap-x-2">
                  <Controller
                    name="participants"
                    control={control}
                    render={({ field }) => (
                      <ComboBoxMultiSelect {...field} options={lists?.users || []} getValues={getValues} setValue={setValue} name="participants" error={errors.participants} showAvatar />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 flex items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
              <p className="text-sm text-left w-full md:w-36">{t('tools:tasks:new:crm')}</p>
              <div className="w-full">
                <CRMMultipleSelectV2 watch={watch} setValue={setValue} name="crm" error={errors.crm} />
              </div>
            </div>
            <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 flex items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
              <div>
                <h3 className="text-sm font-medium leading-6 text-gray-900">{t('tools:calendar:new-event:ubication')}</h3>
              </div>
              <div className="sm:col-span-2">
                <div className="flex">
                  <SelectMenu data={eventLocalizations} value={formLocalization} setValue={setFormLocalization} />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button type="button" className="mr-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400" onClick={onClose}>
                {t('common:buttons:cancel')}
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {t('common:buttons:save')}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
