"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
import General from "./tabs/General";
import Receipts from "./tabs/Receipts";
import { formatDate } from "@/src/utils/getFormatDate";

export default function PolicyDetails({ data, id, mutate }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);

   // Función para extraer el código de cliente basado en el id de la compañía
  const getClientCode = () => {
    const companyId = data?.company?.id; // ID de la compañía de la póliza
    const codigos = data?.contact?.codigos || []; // Obtener los códigos del contacto

    // Buscar el código de cliente asociado a la compañía
    const matchingCodigo = codigos.find(
      (codigo) => codigo?.insurance?.id === companyId
    );

    return matchingCodigo ? matchingCodigo.codigo : "N/D"; // Devolver el código o "N/D" si no hay coincidencia
  };

  const tabs = [
    {
      name: t("control:portafolio:receipt:details:consult"),
    },
    {
      name: "Beneficiarios",
      disabled: true,
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
          >
            <div className="flex justify-between pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 xl:gap-4">
                <p className="text-xl sm:text-2xl xl:text-3xl">
                  {data?.contact?.fullName}
                </p>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs sm:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:date")}:
                  </p>
                  <p className="text-xs sm:text-sm xl:text-base">
                    {formatDate(data?.fechaEmision, "dd/MM/yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs sm:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:product")}:
                  </p>
                  <p className="text-xs sm:text-sm xl:text-base">
                    {data?.category?.name ?? "S/N"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs sm:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:policy")}:
                  </p>
                  <p className="text-xs sm:text-sm xl:text-base">
                    {data?.poliza}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs md:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:company")}:
                  </p>
                  <p className="text-xs md:text-sm xl:text-base">
                    {data?.company?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs md:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:client-code")}:
                  </p>
                  <p className="text-xs md:text-sm xl:text-base">
                    {getClientCode()}
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
            <TabList className="flex items-center gap-2 bg-gray-100 rounded-2xl py-2 px-4 w-full flex-wrap">
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
            <TabPanel className="w-full md:px-4">
              <General data={data} id={id} mutate={mutate} />
            </TabPanel>
            <TabPanel className="w-full md:px-4"></TabPanel>
            <TabPanel className="w-full">
              <Receipts policyId={data?.id} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
