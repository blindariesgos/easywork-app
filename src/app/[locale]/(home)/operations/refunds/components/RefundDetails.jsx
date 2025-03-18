"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
import General from "./tabs/General";
import Link from "next/link";
import moment from "moment";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { putRefund } from "@/src/lib/apis";
import clsx from "clsx";
import { toast } from "react-toastify";
import {
  polizaReimbursementStatus,
  polizaReimbursementStatusColor,
} from "@/src/utils/constants";
import useRefundContext from "@/src/context/refunds";
import AddDocumentButton from "./AddDocumentButton";

export default function RefundDetails({ data, id, mutate }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);
  const { mutate: mutateRefund } = useRefundContext();
  const [addFileProps, setAddFileProps] = useState({
    isOpen: false,
    cmrType: "reimbursement",
    id,
  });

  const updateStatus = async (status) => {
    setLoading(true);
    const body = {
      status,
    };
    try {
      const response = await putRefund(data.id, body);

      if (response.hasError) {
        toast.error(
          "Se ha producido un error al actualizar, inténtelo de nuevo."
        );
        setLoading(false);

        return;
      }
      mutate();
      mutateRefund();
      toast.success("Actualizado correctamente.");
    } catch (error) {
      console.log({ error });
      toast.error(
        "Se ha producido un error al actualizar la programacion, inténtelo de nuevo."
      );
    }
    setLoading(false);
  };

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
                    {moment(
                      data?.poliza?.fechaEmision ?? data?.poliza?.vigenciaDesde
                    ).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:product")}:
                  </p>
                  <p className="text-sm">
                    {data?.poliza?.category?.name ?? "N/D"}
                  </p>
                </div>
                <Link
                  className="hover:underline text-easy-600 text-sm"
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
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:claim-number")}:
                  </p>
                  <p className="text-sm">{data?.claimNumber ?? "N/D"}</p>
                </div>
                <div></div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:sheet")}:
                  </p>
                  <p className="text-sm">{data?.folioNumber ?? "N/D"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Menu>
                  <MenuButton>
                    <label
                      className={clsx(
                        "py-2 px-3 rounded-lg text-sm cursor-pointer max-w-[195px]"
                      )}
                      style={{
                        background: data?.status
                          ? polizaReimbursementStatusColor[data?.status]
                          : polizaReimbursementStatusColor.captura_documentos,
                      }}
                    >
                      {data?.status
                        ? polizaReimbursementStatus[data?.status]
                        : polizaReimbursementStatus.captura_documentos}
                    </label>
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 "
                  >
                    {data &&
                      Object?.keys(polizaReimbursementStatus)
                        ?.filter((key) => key !== data?.status)
                        .map((key, index) => (
                          <MenuItem
                            key={index}
                            as="div"
                            onClick={() => updateStatus(key)}
                            className="px-2 py-1 hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
                          >
                            {polizaReimbursementStatus[key]}
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
            <div className="flex items-center gap-4  bg-gray-100 rounded-lg p-2 w-full">
              <div className="px-4">
                <p className="px-3 text-gray-400 text-sm">
                  {t("control:portafolio:receipt:details:consult")}
                </p>
              </div>
              <AddDocumentButton id={id} />
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
