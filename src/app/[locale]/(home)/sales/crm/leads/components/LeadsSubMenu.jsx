"use client";
import { useTranslation } from "react-i18next";

export default function LeadsSubMenu() {
  const { t } = useTranslation();
  return (
    <div className="flex">
      <div className="bg-zinc-300/40 rounded-full flex gap-1 items-center px-4">
        <p className="text-xs font-semibold py-2 px-1 text-indigo-950">
          {t("leads:header:elements")}:
        </p>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">
            {t("leads:header:entrees")}
          </p>
        </div>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">
            {t("leads:header:planned")}
          </p>
        </div>
        {/* Separator */}
        <div className="w-0.5 h-5 bg-gray-300" />
        <p className="text-xs font-semibold py-2 px-4 text-indigo-950">
          {t("leads:header:others")}:
        </p>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">
            {t("leads:header:expired")}
          </p>
        </div>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">
            {t("leads:header:comments")}
          </p>
        </div>
        {/* <div className="w-0.5 h-5 bg-gray-300" /> */}
        {/* <button className="text-xs h-full font-medium py-2 px-4 hover:bg-zinc-300/50 rounded-r-full hover:underline text-indigo-950">
          {t('contacts:header:mark-all')}
        </button> */}
      </div>
    </div>
  );
}
