"use client";
import useDriveContext from "@/src/context/drive";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { PaginationV2 } from "@/src/components/pagination/PaginationV2";

import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { itemsByPage } from "@/src/lib/common";

const DriveFooter = ({ selectedFiles }) => {
  const { totals, config, setConfig } = useDriveContext();
  const [selected, setSelected] = useState(itemsByPage[0].id);

  const handleChangePage = (page) => {
    setConfig({
      ...config,
      page,
    });
  };

  useEffect(() => {
    setConfig({
      ...config,
      limit: selected,
      page: 1,
    });
  }, [selected]);

  return (
    <Fragment>
      {selectedFiles > 0 && (
        <div>
          Seleccionado: {selectedFiles}/{totals.totalItems}
        </div>
      )}
      <div className="flex justify-center items-center flex-wrap gap-2">
        <div className="flex gap-1 items-center">
          <p>Mostrar:</p>
          <Listbox value={selected} onChange={setSelected} as="div">
            <ListboxButton
              className={clsx(
                "relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
              )}
            >
              {selected}
              <ChevronDownIcon
                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 "
                aria-hidden="true"
              />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              transition
              className={clsx(
                "rounded-xl border border-white p-1 focus:outline-none bg-white shadow-2xl",
                "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
              )}
            >
              {itemsByPage.map((page) => (
                <ListboxOption
                  key={page.name}
                  value={page.id}
                  className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-primary data-[focus]:text-white"
                >
                  <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
                  <div className="text-sm/6">{page.name}</div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>
        <PaginationV2
          totalPages={totals.totalPages || 0}
          currentPage={config.page}
          setPage={handleChangePage}
        />
      </div>
    </Fragment>
  );
};

export default DriveFooter;
