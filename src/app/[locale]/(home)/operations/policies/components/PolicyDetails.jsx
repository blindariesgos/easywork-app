"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
import General from "./tabs/General";
import Receipts from "./tabs/Receipts";
import { formatDate } from "@/src/utils/getFormatDate";
import Vehicle from "./tabs/Vehicle";
import Link from "next/link";
import clsx from "clsx";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { putPoliza } from "@/src/lib/apis";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";

export default function PolicyDetails({ data, id, mutate }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);
  const headerRef = useRef();
  const { mutate: mutateConfig } = useSWRConfig();
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
    ...(() => {
      return data?.type?.name === "VIDA"
        ? [
            {
              name: "Asegurados",
              disabled: true,
            },
            {
              name: "Beneficiarios",
              disabled: true,
            },
          ]
        : [
            {
              name: data?.type?.name === "GMM" ? "Asegurados" : "Vehiculos",
              disabled: data?.type?.name != "AUTOS",
            },
          ];
    })(),

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

  const updateStatus = async (status) => {
    setLoading(true);
    const body = {
      status,
    };
    try {
      const response = await putPoliza(id, body);

      if (response.hasError) {
        toast.error(
          "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
        );
        setLoading(false);
        return;
      }
      mutate();
      toast.success("Paliza actualizada correctamente.");
      mutateConfig("/sales/crm/polizas?page=1&limit=5&orderBy=name&order=DESC");
    } catch (error) {
      console.log({ error });
      toast.error(
        "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
      );
    }
    setLoading(false);
  };

  const policyStatus = [
    {
      id: "en_proceso",
      name: "En Trámite",
    },
    {
      id: "activa",
      name: "Vigente",
    },
    {
      id: "cancelada",
      name: "Cancelada",
    },
    {
      id: "vencida",
      name: "No Vigente",
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
                  <p className="text-sm">{getClientCode()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Menu>
                  <MenuButton>
                    <label
                      className={clsx(
                        "py-2 px-3 rounded-lg capitalize cursor-pointer",
                        {
                          "bg-[#86BEDF]": data?.status == "en_proceso",
                          "bg-[#A9EA44]": data?.status == "activa",
                          "bg-[#FFC4C2]": ["cancelada", "vencida"].includes(
                            data?.status
                          ),
                        }
                      )}
                    >
                      {policyStatus.find((x) => x.id == data?.status)?.name ??
                        "No Disponible"}
                    </label>
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 "
                  >
                    {data &&
                      policyStatus
                        ?.filter((x) => x.id !== data?.status)
                        .map((option, index) => (
                          <MenuItem
                            key={index}
                            as="div"
                            onClick={() => updateStatus(option.id)}
                            className="px-2 py-1 hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
                          >
                            {option.name}
                          </MenuItem>
                        ))}
                  </MenuItems>
                </Menu>
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
              <General data={data} id={id} mutate={mutate} headerHeight={200} />
            </TabPanel>
            {data?.type?.name === "VIDA" ? (
              <Fragment>
                <TabPanel className="w-full md:px-4"></TabPanel>
                <TabPanel className="w-full md:px-4"></TabPanel>
              </Fragment>
            ) : (
              <TabPanel className="w-full md:px-4">
                {data?.type?.name === "AUTOS" && (
                  <Vehicle vehicles={data.vehicles} />
                )}
              </TabPanel>
            )}

            <TabPanel className="w-full">
              <Receipts policyId={data?.id} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
