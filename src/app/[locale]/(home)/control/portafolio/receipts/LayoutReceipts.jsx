"use client";
import React from "react";
import { useTranslation } from "react-i18next";

// import HeaderCrm from "../HeaderCrm";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LayoutReceipts({ children }) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (Number(params.get("page")) === 0 || !params.get("page")) {
      params.set("page", 1);
      replace(`${pathname}?${params.toString()}`);
    }
  }, [pathname, replace, searchParams]);

  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative flex flex-col gap-4">
      {children}
    </div>
  );
}
