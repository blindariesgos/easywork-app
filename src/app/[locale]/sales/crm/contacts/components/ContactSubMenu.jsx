"use client";
import { RadioGroup } from "@headlessui/react";
import { calendarViews, contactSubmenuOptions } from "@/lib/common";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function ContactSubMenu() {
  return (
    <div className="flex">
      <div className="bg-zinc-300/40 rounded-full flex gap-1 items-center">
        <button className="text-xs h-full font-medium py-2 px-4 hover:bg-zinc-300/50 rounded-l-full hover:underline text-indigo-950">
          Míos
        </button>
        <p className="text-xs font-medium py-2 px-1 text-indigo-950">
          Mis Elementos:
        </p>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">Planeados</p>
        </div>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">
            Invitaciones
          </p>
        </div>
        {/* Separator */}
        <div className="w-0.5 h-5 bg-gray-300" />
        <p className="text-xs font-medium py-2 px-4 text-indigo-950">Otros:</p>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">Vencida</p>
        </div>
        <div className="flex items-center h-full py-2 gap-1 hover:bg-zinc-300/50 px-2 cursor-pointer">
          <span className="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-indigo-700/10">
            0
          </span>
          <p className="text-xs text-gray-900 font-medium my-auto">
            Comentarios
          </p>
        </div>
        <div className="w-0.5 h-5 bg-gray-300" />
        <button className="text-xs h-full font-medium py-2 px-4 hover:bg-zinc-300/50 rounded-r-full hover:underline text-indigo-950">
          Marcar todo como leído
        </button>
      </div>
    </div>
  );
}
