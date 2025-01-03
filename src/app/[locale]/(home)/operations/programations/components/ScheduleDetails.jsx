"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
import General from "./tabs/General";
import { formatDate } from "@/src/utils/getFormatDate";
import Link from "next/link";
import moment from "moment";

export default function ScheduleDetails({ data, id, mutate }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);
  const headerRef = useRef();
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

  useEffect(() => {
    console.log({ headerRef });
  }, [headerRef]);

  return (
    <div className="flex flex-col h-screen relative w-full">
      {/* Formulario Principal */}
      {loading && <LoaderSpinner />}
      <div className="flex flex-col flex-1 bg-gray-200 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px]">
        <div className="flex flex-col flex-1 gap-2 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl relative">
          {/* Encabezado del Formulario */}
          <div
            id="policy-header"
            className="pt-6 px-2 pb-2 md:px-4 sticky top-0 z-10 bg-gray-200 grid grid-cols-1 gap-2"
            ref={headerRef}
          >
            <div className="flex justify-between pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-2 md:gap-x-4 xl:gap-x-6 pl-4">
                <p className="text-lg md:text-xl 2xl:text-2xl font-semibold">
                  {`${data?.insurance?.name ?? ""} ${data?.poliza?.poliza ?? ""} ${data?.polizaType?.name ?? ""}`}
                </p>

                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:fechaEmision")}:
                  </p>
                  <p className="text-sm">
                    {moment(data?.poliza?.fechaEmision).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:product")}:
                  </p>
                  <p className="text-sm">{data?.category?.name ?? "N/D"}</p>
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
                  <p className="text-sm">{getClientCode()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:claim-number")}:
                  </p>
                  <p className="text-sm">{"N/D"}</p>
                </div>
                <div></div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:sheet")}:
                  </p>
                  <p className="text-sm">{"N/D"}</p>
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
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg py-2 px-4 w-full flex-wrap">
              <p>CONSULTA</p>
            </div>
          </div>
          <div className="px-4">
            <General data={data} id={id} mutate={mutate} />
          </div>
        </div>
      </div>
    </div>
  );
}
