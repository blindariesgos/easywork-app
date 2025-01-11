'use client';
import React from 'react';
import { Cog8ToothIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { TrashIcon } from '@heroicons/react/24/outline';
// import FilterCapacitation from './FilterCapacitation';
import { useCommon } from '@/src/hooks/useCommon';
import IconDropdown from '@/src/components/SettingsButton';
import useCrmContext from '@/src/context/crm';
import ActiveFiltersDrawer from '@/src/components/ActiveFiltersDrawer';
// import useCapacitationContext from '@/src/context/capacitations';
import { Menu, MenuItem, MenuItems } from '@headlessui/react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoIosArrowDown } from 'react-icons/io';

export default function ELearningHeader() {
  const { t } = useTranslation();
  const { trash, settingsReceipts: settings } = useCommon();
  const { selectedContacts } = useCrmContext();
  // const { displayFilters, removeFilter } = useCapacitationContext();

  const displayFilters = () => {};
  const removeFilter = () => {};

  const options = [
    { name: 'Agente', disabled: true },
    { name: 'Actividades', disabled: true },
    { name: 'Cita con Prospectos o Contactos', disabled: true },
    { name: 'Reuniones de Coaching', disabled: true },
    { name: 'Asingnar GDD', disabled: true },
    { name: 'Reasignar GDD', disabled: true },
  ];

  return (
    <header className="flex flex-col">
      <div className="px-4 flex flex-col gap-2  bg-white py-4 rounded-md shadow-sm w-full">
        <div className="flex gap-3 flex-wrap w-full items-center">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">{t('agentsmanagement:e-learning:title')}</h1>
          <Menu>
            <MenuItems transition anchor="bottom start" className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 ">
              {options.map((option, index) => (
                <MenuItem
                  key={index}
                  as="div"
                  onClick={option.onclick && option.onclick}
                  disabled={option.disabled}
                  className="px-2 py-1 hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
                >
                  {option.name}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <div className="w-full flex justify-between items-center gap-2 h-[34px]">
                <div className="flex items-center w-full">
                  <FaMagnifyingGlass className="h-4 w-4 text-primary" />
                  <input
                    type="search"
                    name="search"
                    id="search-cal"
                    className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 bg-gray-300"
                    placeholder={t('contacts:header:search')}
                    onChange={e => console.log(e.target.value)}
                    // value={searchInput}
                  />
                </div>
                <button className="pr-2" onClick={() => null}>
                  <IoIosArrowDown className="h-4 w-4 text-primary" />
                </button>
              </div>
            </div>
          </div>
          {selectedContacts[0]?.id && <IconDropdown icon={<TrashIcon className="h-8 w-8 text-primary" aria-hidden="true" />} options={trash} width="w-72" />}

          <IconDropdown icon={<Cog8ToothIcon className="h-8 w-8 text-primary" aria-hidden="true" />} options={settings} width="w-[180px]" />
        </div>
        <ActiveFiltersDrawer displayFilters={displayFilters} removeFilter={removeFilter} />
      </div>
    </header>
  );
}
