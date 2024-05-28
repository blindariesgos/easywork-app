"use client";

import { useTranslation } from "react-i18next";

export default function TaskSubMenu() {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2">
      <div className="bg-zinc-300/40 rounded-full flex gap-1 items-center">
        <button className="text-xs h-full font-medium py-2 px-4 hover:bg-zinc-300/50 rounded-l-full hover:underline text-indigo-950">
          {t('tools:tasks:list')}
        </button>
        <button className="text-xs h-full font-medium py-2 px-4 hover:bg-zinc-300/50 rounded-r-full hover:underline text-indigo-950">
          {t('tools:tasks:limit-date')}
        </button>
      </div>
      <div className="bg-zinc-300/40 rounded-full flex gap-1 items-center">
        <p className="text-xs font-medium py-2 px-4 text-indigo-950">
          {t('tools:tasks:my-elements')}:
        </p>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">{t('tools:tasks:expires')}</p>
        </div>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">
            {t('tools:tasks:comments')}
          </p>
        </div>
        {/* Separator */}
        <div className="w-0.5 h-5 bg-gray-300" />
        <p className="text-xs font-medium py-2 px-4 text-indigo-950">{t('tools:tasks:others')}:</p>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">{t('tools:tasks:expires')}</p>
        </div>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">
            {t('tools:tasks:comments')}
          </p>
        </div>
        <div className="w-0.5 h-5 bg-gray-300" />
        <button className="text-xs h-full font-medium py-2 px-4 hover:bg-zinc-300/50 rounded-r-full hover:underline text-indigo-950">
          {t('tools:tasks:mark-all')}
        </button>
      </div>
    </div>
  );
}
