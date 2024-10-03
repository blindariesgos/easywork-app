"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { itemsByPage } from "@/src/lib/common";
import { PaginationV2 } from "@/src/components/pagination/PaginationV2";
import clsx from "clsx";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";

const FooterTable = ({ limit, setLimit, totalPages, page, setPage, total }) => {
  const { t } = useTranslation();
  const [elementsCount, setElementsCount] = useState({
    down: 0,
    up: 10,
  });

  useEffect(() => {
    setElementsCount({
      down: limit * (page - 1) + 1,
      up: totalPages === page ? total : limit * page,
    });
  }, [totalPages, page, total, limit]);

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-sm text-gray-700">
        <Trans
          i18nKey="common:table:footer:elements"
          values={{
            down: elementsCount.down,
            up: elementsCount.up,
            total,
          }}
        />
      </p>
      <div className="flex justify-center items-center">
        <div className="flex gap-1 items-center">
          <p className="text-sm text-gray-700">
            {t("common:table:footer:show")}
          </p>
          <Listbox value={limit} onChange={setLimit} as="div">
            <ListboxButton
              className={clsx(
                "relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
              )}
            >
              {limit}
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
          totalPages={totalPages || 0}
          currentPage={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default FooterTable;
