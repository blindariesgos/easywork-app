"use client";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

export default function LoaderSpinner() {
  const { t } = useTranslation();
  return (
    <div className="fixed z-[100000000] inset-0 bg-easy-800/10 w-full h-screen top-0 left-0">
      <div className="flex items-center justify-center h-full flex-col gap-2 cursor-progress">
        {/* <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-easy-600" /> */}
        <Image
          src={"/icons/loader.gif"}
          alt="Cargando..."
          className="h-24 w-24"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}

export const LoadingSpinnerSmall = ({ color }) => (
  <div className="w-full h-full flex justify-center items-center">
    <div
      className={`w-5 h-5 animate-spin rounded-full border-t-2 border-b-2 border-${color}`}
    />
  </div>
);
