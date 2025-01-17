'use client';
import { Cog8ToothIcon } from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';

import FilterTable from '@/src/components/FilterTable';
import IconDropdown from '@/src/components/SettingsButton';

import useCrmContext from '@/src/context/crm';

import { useCommon } from '@/src/hooks/useCommon';

export const CapacitationsHeader = () => {
  const contextValues = {};
  const { trash, settingsReceipts: settings } = useCommon();
  const { selectedContacts } = useCrmContext();
  // const { displayFilters, removeFilter } = useCapacitationsContext();

  return (
    <header className="flex flex-col">
      <div className="px-4 flex flex-col gap-2  bg-white py-4 rounded-md shadow-sm w-full">
        <div className="flex gap-3 flex-wrap w-full items-center">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">Capacitaciones</h1>

          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <FilterTable contextValues={contextValues} />
            </div>
          </div>

          {/* <div className="flex-grow">
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
          </div> */}

          {selectedContacts[0]?.id && <IconDropdown icon={<TrashIcon className="h-8 w-8 text-primary" aria-hidden="true" />} options={trash} width="w-72" />}

          <IconDropdown icon={<Cog8ToothIcon className="h-8 w-8 text-primary" aria-hidden="true" />} options={settings} width="w-[180px]" />
        </div>
      </div>
    </header>
  );
};
