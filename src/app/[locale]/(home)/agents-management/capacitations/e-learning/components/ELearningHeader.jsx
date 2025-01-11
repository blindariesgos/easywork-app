'use client';

import FilterTable from '@/src/components/FilterTable';
import { ELearningNavMenu } from './ELearningNavMenu';

export const ELearningHeader = () => {
  const contextValues = {};

  return (
    <header>
      <div className="bg-white p-4 rounded-md shadow-sm w-full">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-3 flex-wrap w-full items-center">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">E-Learning</h1>

            <div className="flex-grow">
              <div className="flex border px-1 py-1 bg-gray-300 items-center gap-x-2 rounded-md">
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
          </div>
        </div>

        <ELearningNavMenu />
      </div>
    </header>
  );
};
