"use client";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
import { useState } from "react";
import CrmItems from "./CrmItems";
import Button from "@/src/components/form/Button";
import { useTranslation } from "react-i18next";

const ModalCrm = ({ conections }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const getIndividualRedirect = (data) => {
    if (!data || !data.type || !data.crmEntity) return null;

    const typeConfig = {
      contact: {
        href: `/sales/crm/contacts/contact/${data.crmEntity.id}?show=true`,
        bgClass: "bg-[#241F61] text-white",
        labelKey: "tools:tasks:edit:contact",
        name: data?.crmEntity?.fullName ?? data?.crmEntity?.name ?? "",
      },
      poliza: {
        href: `/operations/policies/policy/${data.crmEntity.id}?show=true`,
        bgClass: "bg-[#86BEDF] text-[#241F61]",
        labelKey: "tools:tasks:edit:policy",
        name:
          `${data?.crmEntity?.company?.name} ${data?.crmEntity?.poliza} ${data?.crmEntity?.type?.name}` ??
          "",
      },
      lead: {
        href: `/sales/crm/leads/lead/${data.crmEntity.id}?show=true`,
        bgClass: "bg-[#A9EA44] text-[#241F61]",
        labelKey: "tools:tasks:edit:lead",
        name: data?.crmEntity?.fullName ?? data?.crmEntity?.name ?? "",
      },
      receipt: {
        href: `/sales/crm/leads/lead/${data.crmEntity.id}?show=true`,
        bgClass: "bg-[#DFE3E6] text-[#241F61]",
        labelKey: "Recibo",
        name: data?.crmEntity?.title ?? data?.crmEntity?.name ?? "",
      },
      renewal: {
        href: `/operations/renovations/renovation/${data.crmEntity.id}?show=true`,
        bgClass: "bg-[#fff79d] text-[#241F61]",
        labelKey: "Renovación",
        name: data?.crmEntity?.name,
      },
      agent: {
        href: `/agents-management/accompaniment/agent/${data.crmEntity.id}?show=true`,
        bgClass: "bg-easy-400 text-white",
        labelKey: "Agente",
        name: data?.crmEntity?.name,
      },
    };

    const config = typeConfig[data.type];

    if (!config) return null;

    return (
      <Link href={config.href} className="px-1 w-full flex justify-center">
        <div
          className={`${config.bgClass}  group p-1.5 rounded-lg gap-2 hover:shadow-[-2px_2px_5px_1px_#00000082] w-[200px]`}
        >
          <p className="hidden group-hover:block text-xs w-full">{`${t(`${config.labelKey}`)}: ${config.name}`}</p>
          <p className="group-hover:hidden text-xs whitespace-nowrap text-ellipsis overflow-hidden text-center">
            {config.name}
          </p>
        </div>
      </Link>
    );
  };

  if (!conections?.length) {
    return "No Especificado";
  }

  return (
    <Fragment>
      {conections.length == 1 && getIndividualRedirect(conections[0])}
      {conections.length > 1 && (
        <Fragment>
          <button
            className=" cursor-pointer bg-gray-500 rounded-full w-[40px] h-[40px] hover:shadow-[-2px_2px_5px_1px_#00000082]"
            onClick={() => setIsOpen(true)}
          >
            +1
          </button>
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <DialogBackdrop className="fixed inset-0 bg-black/30" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              {/* The actual dialog panel  */}
              <DialogPanel className="max-w-lg w-full space-y-4 bg-white p-6 rounded-xl">
                <DialogTitle className="font-bold">Conexiones CRM</DialogTitle>
                <Description>
                  <div className="flex flex-col gap-2 px-2 md:px-4">
                    <CrmItems conections={conections} />
                  </div>
                </Description>
                <div className="flex justify-center">
                  <Button
                    label={"Cerrar"}
                    buttonStyle="primary"
                    className="px-3 py-2"
                    onclick={() => setIsOpen(false)}
                  />
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ModalCrm;
