"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
// import General from "./tabs/General";
// import Receipts from "./tabs/Receipts";
// import Vehicle from "./tabs/Vehicle";
import { formatDate } from "@/src/utils/getFormatDate";
import Link from "next/link";

export default function RenovationDetails({ data, id, mutate }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);
  const headerRef = useRef();

  const tabs = [
    {
      name: t("control:portafolio:receipt:details:consult"),
    },
    {
      name:
        data?.type?.name === "GMM"
          ? "Asegurados"
          : data?.type?.name === "VIDA"
            ? "Beneficiarios"
            : "Vehiculos",
      disabled: data?.type?.name != "AUTOS",
    },
    {
      name: "Pagos/Recibos",
    },
    {
      name: "Renovaciones",
      disabled: true,
    },
    {
      name: "Siniestros",
      disabled: true,
    },
    {
      name: "Reembolsos",
      disabled: true,
    },
    {
      name: "Facturas",
      disabled: true,
    },
    {
      name: "Versiones",
      disabled: true,
    },
    {
      name: "Comisiones",
      disabled: true,
    },
    {
      name: "Cotizaciones",
      disabled: true,
    },
    {
      name: "Programaciones",
      disabled: true,
    },
    {
      name: "Rescate de fondos",
      disabled: true,
    },
  ];

  return (
    <div className="flex flex-col h-screen relative w-full">
      {/* Formulario Principal */}
      {loading && <LoaderSpinner />}
      <div className="flex flex-col flex-1 bg-gray-200 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px]">
        <TabGroup className="flex flex-col flex-1 gap-2 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl relative">
          {/* Encabezado del Formulario */}
          <div
            id="policy-header"
            className="pt-6 pb-4 px-2 md:px-4 sticky top-0 z-10 bg-gray-200 grid grid-cols-1 gap-2"
            ref={headerRef}
          >
            <div className="flex justify-between pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-2 md:gap-x-4 xl:gap-x-6 pl-4">
                <p className="text-lg md:text-xl 2xl:text-2xl font-semibold">
                  {`${data?.company?.name ?? ""} ${data?.poliza ?? ""} ${data?.type?.name ?? ""}`}
                </p>

                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:date")}:
                  </p>
                  <p className="text-sm">
                    {formatDate(data?.vigenciaDesde, "dd/MM/yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:product")}:
                  </p>
                  <p className="text-sm">{data?.category?.name ?? "S/N"}</p>
                </div>
                <Link
                  className="hover:text-easy-600 text-sm"
                  href={`/sales/crm/contacts/contact/${data?.contact?.id}?show=true`}
                >
                  {data?.contact?.fullName}
                </Link>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:client-code")}:
                  </p>
                  <p className="text-sm">
                    {data?.poliza?.clientCode ?? "No disponible"}
                  </p>
                </div>
              </div>
              <IconDropdown
                icon={
                  <Cog8ToothIcon
                    className="h-8 w-8 text-primary"
                    aria-hidden="true"
                  />
                }
                options={settingsPolicy}
                width="w-[140px]"
              />
            </div>
            <TabList className="flex items-center gap-2 bg-gray-100 rounded-lg py-2 px-4 w-full flex-wrap">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  disabled={tab.disabled}
                  className="data-[selected]:bg-blue-100 disabled:opacity-60 data-[hover]:bg-blue-400 outline-none text-xs uppercase focus:outline-none data-[selected]:text-white data-[hover]:text-white rounded-md p-2.5"
                >
                  {tab.name}
                </Tab>
              ))}
            </TabList>
          </div>
          <TabPanels className="w-full">
            <TabPanel className={"w-full md:px-4"}>
              {/* <General data={data} id={id} mutate={mutate} headerHeight={200} /> */}
            </TabPanel>
            <TabPanel className="w-full md:px-4">
              {/* {data?.type?.name === "AUTOS" && (
                <Vehicle vehicles={data.vehicles} />
              )} */}
            </TabPanel>
            <TabPanel className="w-full">
              {/* <Receipts policyId={data?.id} /> */}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
