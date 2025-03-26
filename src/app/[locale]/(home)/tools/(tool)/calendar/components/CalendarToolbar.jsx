"use client";

import clsx from "clsx";
import { RadioGroup, Label, Radio } from "@headlessui/react";
import { useTranslation } from "react-i18next";

export const CalendarToolbar = ({
  calendarViews,
  selectedCalendarView,
  onChangeCalendarView,
  onConnectRequested,
}) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <div className="flex-none items-center justify-between  py-2 flex pr-2 lg:pr-6">
      <div className="flex gap-2 items-center">
        <RadioGroup
          value={selectedCalendarView}
          onChange={(value) => {
            onChangeCalendarView(value);
          }}
          className="bg-zinc-300/40 rounded-full flex gap-1 items-center p-1 "
        >
          <div className="flex gap-2">
            {calendarViews.map((option) => (
              <Radio
                key={option.id}
                value={option.id}
                className={clsx(
                  "data-[checked]:bg-white cursor-pointer hover:bg-indigo-200 py-2 px-3 rounded-full text-xs outline-none focus:outline-none hover:outline-none"
                )}
              >
                <Label as="span" className="text-xs">
                  {t(option.name)}
                </Label>
              </Radio>
            ))}
          </div>
        </RadioGroup>
        <div className="flex gap-1 bg-zinc-300/40 hover:bg-zinc-300/50 px-2 rounded-full py-2 items-center cursor-pointer">
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
        onClick={onConnectRequested}
      >
        {t("tools:calendar:connect")}
      </button>
    </div>
  );
};
