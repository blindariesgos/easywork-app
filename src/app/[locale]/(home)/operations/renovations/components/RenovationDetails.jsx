"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
import General from "./tabs/General";
import Receipts from "./tabs/Receipts";
import Vehicle from "./tabs/Vehicle";
import Link from "next/link";
import moment from "moment";
import ReceiptEmpty from "./ReceiptEmpty";
import Beneficiaries from "./tabs/Beneficiaries";
import Insured from "./tabs/Insured";
import Versions from "./tabs/Versions";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { renovationStages } from "@/src/utils/constants";
import { putPoliza } from "@/src/lib/apis";
import useRenovationContext from "@/src/context/renovations";
import { toast } from "react-toastify";
import { LinkIcon } from "@heroicons/react/24/outline";
import CanceledReazons from "../../components/CanceledReazons";
import { handleFrontError } from "@/src/utils/api/errors";
import { useSWRConfig } from "swr";
import clsx from "clsx";

export default function RenovationDetails({ data, id, mutate }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);
  const { mutate: mutateRenovation } = useRenovationContext();
  const [isOpenCanceledReazon, setIsOpenCanceledReazon] = useState(false);
  const { mutate: mutateConfig } = useSWRConfig();

  // Función para extraer el código de cliente basado en el id de la compañía
  const getClientCode = () => {
    const companyId = data?.company?.id; // ID de la compañía de la póliza
    const codigos = data?.contact?.codigos || []; // Obtener los códigos del contacto

    // Buscar el código de cliente asociado a la compañía
    const matchingCodigo = codigos.find(
      (codigo) => codigo?.insuranceId === companyId
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
              disabled: !(data?.insureds && data?.insureds?.length > 0),
            },
            {
              name: "Beneficiarios",
              disabled: !(
                data?.beneficiaries && data?.beneficiaries?.length > 0
              ),
            },
          ]
        : [
            {
              name: data?.type?.name === "GMM" ? "Asegurados" : "Vehiculos",
              disabled:
                data?.type?.name === "GMM"
                  ? !(data?.insured && data?.insureds?.length > 0)
                  : !(data?.vehicles && data?.vehicles?.length > 0),
            },
          ];
    })(),

    {
      name: "Pagos/Recibos",
    },
    {
      name: "Siniestros",
    },
    {
      name: "Reembolsos",
    },
    {
      name: "Facturas",
      disabled: true,
    },
    {
      name: "Versiones",
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
    },
    {
      name: "Rescate de fondos",
    },
  ];

  const updateStage = async (status) => {
    setLoading(true);
    const body = {
      renewalStageId: status,
    };
    try {
      const response = await putPoliza(id, body);

      if (response.hasError) {
        handleFrontError(response);
        setLoading(false);
        return;
      }
      mutate();
      mutateRenovation();
      toast.success(t("operations:policies:update"));
    } catch (error) {
      console.log({ error });
      toast.error(
        "Se ha producido un error al actualizar, inténtelo de nuevo."
      );
    }
    setLoading(false);
  };

  const updateStatus = async (status) => {
    if (status === "cancelada") {
      setIsOpenCanceledReazon(true);
      return;
    }
    setLoading(true);
    const body = {
      status,
    };
    try {
      const response = await putPoliza(id, body);

      if (response.hasError) {
        handleFrontError(response);
        setLoading(false);
        return;
      }
      mutate();
      mutatePolicies();
      toast.success(t("operations:policies:update"));
    } catch (error) {
      console.log({ error });
      toast.error(
        "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
      );
    }
    setLoading(false);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copiado en el Portapapeles");
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
      <CanceledReazons
        isOpen={isOpenCanceledReazon}
        setIsOpen={setIsOpenCanceledReazon}
        id={id}
        onUpdate={() => {
          mutateConfig(`/sales/crm/polizas/${id}/activities`);
          mutate();
          mutateRenovation();
        }}
      />
      <div className="flex flex-col flex-1 bg-gray-200 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px]">
        <TabGroup className="flex flex-col flex-1 gap-2 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl relative">
          {/* Encabezado del Formulario */}
          <div
            id="policy-header"
            className="pt-6 pb-4 px-2 md:px-4 sticky top-0 z-10 bg-gray-200 grid grid-cols-1 gap-2"
          >
            <div className="flex justify-between pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-2 md:gap-x-4 xl:gap-x-6 pl-4">
                <div className="flex gap-3 items-center">
                  <p className="text-lg md:text-xl 2xl:text-2xl font-semibold">
                    {`${data?.company?.name ?? ""} ${data?.poliza ?? ""} ${data?.type?.name ?? ""}`}
                  </p>
                  <LinkIcon
                    className="h-4 w-4 text-[#4f4f4f] opacity-50 hover:opacity-100 cursor-pointer"
                    title="Copiar enlace en Portapapeles"
                    aria-hidden="true"
                    onClick={handleCopyUrl}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:date")}:
                  </p>
                  <p className="text-sm">
                    {moment(data?.vigenciaHasta).utc().format("DD/MM/YYYY")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:product")}:
                  </p>
                  <p className="text-sm">{data?.category?.name ?? "S/N"}</p>
                </div>
                <Link
                  className="font-semibold text-easy-600 text-sm hover:underline"
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
                <div className="flex flex-col gap-2 items-end">
                  <Menu>
                    <MenuButton>
                      <label
                        className={clsx(
                          "py-2 px-3 text-sm rounded-lg capitalize cursor-pointer",
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
                  <Menu>
                    <MenuButton
                      className={
                        "py-2 px-3 rounded-lg cursor-pointer text-sm text-white"
                      }
                      style={{
                        background:
                          renovationStages.find(
                            (x) => x.id == data?.renewalStage?.id
                          )?.color ?? renovationStages[0]?.color,
                      }}
                    >
                      {data?.renewalStage?.name ?? renovationStages[0]?.name}
                    </MenuButton>
                    <MenuItems
                      transition
                      anchor="bottom end"
                      className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 "
                    >
                      {data &&
                        renovationStages
                          ?.filter((x) => x.id !== data?.renewalStage?.id)
                          .map((option, index) => (
                            <MenuItem
                              key={index}
                              as="div"
                              onClick={() => updateStage(option.id)}
                              className="px-2 py-1 hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
                            >
                              {option.name}
                            </MenuItem>
                          ))}
                    </MenuItems>
                  </Menu>
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
              <General data={data} id={id} mutate={mutate} />
            </TabPanel>
            {data?.type?.name === "VIDA" ? (
              <Fragment>
                <TabPanel className="w-full md:px-4">
                  <Insured
                    items={data?.insured ?? []}
                    typePoliza={data?.type?.name}
                  />
                </TabPanel>

                <TabPanel className="w-full md:px-4">
                  <Beneficiaries items={data?.beneficiaries ?? []} />
                </TabPanel>
              </Fragment>
            ) : (
              <TabPanel className="w-full md:px-4">
                {data?.type?.name === "AUTOS" ? (
                  <Vehicle
                    vehicles={data.vehicles}
                    typePoliza={data?.type?.name}
                  />
                ) : (
                  <Insured
                    items={data?.insured ?? []}
                    typePoliza={data?.type?.name}
                  />
                )}
              </TabPanel>
            )}

            <TabPanel className="w-full">
              <Receipts policyId={data?.id} />
            </TabPanel>
            <TabPanel className="w-full">
              <ReceiptEmpty type="Siniestros registrados" />
            </TabPanel>
            <TabPanel className="w-full">
              <ReceiptEmpty type="Reembolsos registrados" />
            </TabPanel>
            <TabPanel className="w-full"></TabPanel>
            <TabPanel className="w-full">
              <Versions poliza={data?.poliza} />
            </TabPanel>
            <TabPanel className="w-full"></TabPanel>
            <TabPanel className="w-full"></TabPanel>
            <TabPanel className="w-full">
              <ReceiptEmpty type="Programaciones registradas" />
            </TabPanel>
            <TabPanel className="w-full">
              <ReceiptEmpty type="Rescate de fondos registrados" />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
