'use client'
import React from "react";
import { useTranslation } from "react-i18next";
//is a component that must recieve its props
export default function CardWhatsapp() {
  const { t } = useTranslation();
  return (
    <div className="bg-white px-4 py-3 rounded-lg w-full flex gap-2 flex-col">
      <div className="flex gap-3">
        <p className="text-xs text-primary font-medium">{t("contacts:panel:whatsapp")}</p>
        <p className="text-xs text-primary font-medium">{t("contacts:panel:date")}: 02/02/2024 13:33 pm</p>
      </div>
      <div>
         <p>Mensaje de whatsapp</p>
      </div>
      <div className="flex w-full justify-between items-center">
         <p>+523423423423</p>
         <p>Lorem lorem lorem</p>
      </div>
    </div>
  );
}
