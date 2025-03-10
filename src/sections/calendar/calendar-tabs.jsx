import React, { useCallback, useMemo } from "react";
import { RadioGroup, Label, Radio } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

export function CalendarTabs({ selectedTab, onChangeTab, isOpenConnect }) {
  const searchParams = useSearchParams();

  const router = useRouter();

  const { t } = useTranslation();

  const tabsOptions = useMemo(
    () => [
      {
        name: t("tools:calendar:day"),
        id: "timeGridDay",
      },
      {
        name: t("tools:calendar:week"),
        id: "timeGridWeek",
      },
      {
        name: t("tools:calendar:month"),
        id: "dayGridMonth",
      },
      {
        name: t("tools:calendar:program"),
        id: "listMonth",
      },
    ],
    [t]
  );

  const onConnectCalendar = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("connect", "true");

    router.replace(`/tools/calendar?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex-none items-center justify-between  py-4 flex">
      <div className="flex gap-2 items-center">
        <RadioGroup
          value={selectedTab}
          onChange={onChangeTab}
          className="bg-zinc-300/40 rounded-full"
        >
          <div className="grid grid-cols-4 gap-1">
            {tabsOptions.map((option) => (
              <Radio
                key={option.id}
                value={option.id}
                className={clsx(
                  "data-[checked]:bg-primary data-[checked]:text-white data-[checked]:hover:bg-indigo-500",
                  "ring-1 ring-inset ring-transparent bg-transparent text-gray-900 hover:bg-indigo-200",
                  "flex items-center justify-center rounded-full font-medium py-2 px-3 text-sm capitalize sm:flex-1 cursor-pointer"
                )}
              >
                <Label as="span" className="text-xs">
                  {option.name}
                </Label>
              </Radio>
            ))}
          </div>
        </RadioGroup>
        <div className="flex gap-1 bg-zinc-300/40 hover:bg-zinc-300/50 px-2 rounded-full py-1 items-center cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium">
            {t("tools:calendar:invitations")}
          </p>
        </div>
      </div>
      <button
        type="button"
        className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        // onClick={onConnectCalendar}
        onClick={isOpenConnect.onToggle}
      >
        {t("tools:calendar:connect")}
      </button>
    </div>
  );
}
