"use client";
import { RadioGroup } from "@headlessui/react";
import useAppContext from "../../../../../../../context/app";
import { useCommon } from "../../../../../../../hooks/useCommon";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function ViewsOptions() {
  const { calendarView, setCalendarView } = useAppContext();
  const { calendarViews } = useCommon()

  return (
    <div>
      <RadioGroup
        value={calendarView}
        onChange={setCalendarView}
        className="bg-zinc-300/40 rounded-full"
      >
        <RadioGroup.Label className="sr-only">Choose a view</RadioGroup.Label>
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-4">
          {calendarViews.map((option) => (
            <RadioGroup.Option
              key={option}
              value={option}
              className={({ active, checked }) =>
                classNames(
                  active ? "" : "",
                  checked
                    ? "bg-primary text-white hover:bg-indigo-500"
                    : "ring-1 ring-inset ring-transparent bg-transparent text-gray-900 hover:bg-indigo-200",
                  "flex items-center justify-center rounded-full font-medium py-2 px-3 text-sm capitalize sm:flex-1 cursor-pointer"
                )
              }
            >
              <RadioGroup.Label as="span" className="text-xs">
                {option}
              </RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
