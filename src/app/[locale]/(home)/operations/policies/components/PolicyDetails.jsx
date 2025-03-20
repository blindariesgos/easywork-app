"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import General from "./tabs/General";
import Receipts from "./tabs/Receipts";
import Vehicle from "./tabs/Vehicle";
import Beneficiaries from "./tabs/Beneficiaries";
import Insured from "./tabs/Insured";
import Refunds from "./tabs/Refunds";
import Schedules from "./tabs/Schedules";
import { useSWRConfig } from "swr";
import ReceiptEmpty from "./ReceiptEmpty";
import Versions from "./tabs/Versions";
import Claims from "./tabs/Claims";
import FundRecoveries from "./tabs/FundRecoveries";
import AddDocuments from "@/src/components/AddDocuments";
import PolicyDetailsHeader from "./PolicyDetailsHeader";

export default function PolicyDetails({ data, id, mutate, edit }) {
  const { t } = useTranslation();
  const { mutate: mutateConfig } = useSWRConfig();

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
                  ? !(data?.insureds && data?.insureds?.length > 0)
                  : !(data?.vehicles && data?.vehicles?.length > 0),
            },
          ];
    })(),
    {
      name: "Pagos/Recibos",
    },
    {
      name: "Renovaciones",
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

  return (
    <div className="flex flex-col h-screen relative w-full">
      {/* Formulario Principal */}
      <div className="flex flex-col flex-1 bg-gray-200 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px]">
        <TabGroup className="flex flex-col flex-1 gap-2 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl relative">
          {/* Encabezado del Formulario */}
          <div
            id="policy-header"
            className="pt-6 pb-4 px-2 md:px-4 sticky top-0 z-10 bg-gray-200 grid grid-cols-1 gap-2"
          >
            <PolicyDetailsHeader data={data} id={id} mutate={mutate} />
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
              <AddDocuments
                crmId={id}
                crmType="policy"
                options={[
                  {
                    name: "Finiquito",
                    type: "finiquito",
                    accept: null,
                  },
                ]}
                onUpdate={() => {
                  mutateConfig(`/sales/crm/polizas/${id}/activities`);
                }}
              />
            </TabList>
          </div>
          <TabPanels className="w-full">
            <TabPanel className={"w-full md:px-4"}>
              <General data={data} id={id} mutate={mutate} edit={edit} />
            </TabPanel>
            {data?.type?.name === "VIDA" ? (
              <Fragment>
                <TabPanel className="w-full md:px-4">
                  <Insured
                    items={data?.insureds ?? []}
                    typePoliza={data?.type?.name}
                  />
                </TabPanel>

                <TabPanel className="w-full md:px-4">
                  <Beneficiaries
                    items={data?.beneficiaries ?? []}
                    specifications={data?.specifications}
                  />
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
                    items={data?.insureds ?? []}
                    typePoliza={data?.type?.name}
                  />
                )}
              </TabPanel>
            )}

            <TabPanel className="w-full">
              <Receipts policyId={data?.id} />
            </TabPanel>
            <TabPanel className="w-full">
              <ReceiptEmpty type="Renovaciones registradas" />
            </TabPanel>
            <TabPanel className="w-full">
              <Claims policyId={data?.id} />
            </TabPanel>
            <TabPanel className="w-full">
              <Refunds polizaId={data?.id} />
            </TabPanel>
            <TabPanel className="w-full"></TabPanel>
            <TabPanel className="w-full">
              <Versions poliza={data?.poliza} />
            </TabPanel>
            <TabPanel className="w-full"></TabPanel>
            <TabPanel className="w-full"></TabPanel>
            <TabPanel className="w-full">
              <Schedules polizaId={data?.id} />
            </TabPanel>
            <TabPanel className="w-full">
              <FundRecoveries polizaId={data?.id} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
