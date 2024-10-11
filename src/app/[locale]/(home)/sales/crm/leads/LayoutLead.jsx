"use client";
import Header from "../../../../../../components/header/Header";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LeadsHeader from "./components/LeadsHeader";
import LoaderSpinner from "../../../../../../components/LoaderSpinner";

export default function LayoutLeads({ table, children }) {
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
  }, [searchParams, replace, pathname]);

  return (
    <div className="bg-gray-100 h-full p-4 rounded-xl relative flex flex-col w-full gap-4">
      <Header />
      <LeadsHeader />
      <Suspense fallback={<LoaderSpinner />}>{table}</Suspense>
      {children}
    </div>
  );
}
