"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
import Link from "next/link";
import clsx from "clsx";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { putPoliza } from "@/src/lib/apis";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import moment from "moment";
import { LinkIcon } from "@heroicons/react/24/outline";
import usePolicyContext from "@/src/context/policies";
import CanceledReazons from "../../components/CanceledReazons";
import VinculateContact from "../../components/VinculateContact";
import { handleFrontError } from "@/src/utils/api/errors";
import { useSearchParams } from "next/navigation";

export default function PolicyDetailsHeader({ data, id, mutate }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);
  const [isOpenCanceledReazon, setIsOpenCanceledReazon] = useState(false);
  const [isOpenVinculateContact, setIsOpenVinculateContact] = useState(false);
  const { mutate: mutateConfig } = useSWRConfig();
  const { mutate: mutatePolicies } = usePolicyContext();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if (params.get("vinculate") === "true") {
      setIsOpenVinculateContact(true);
    }
  }, [params.get("vinculate")]);

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

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copiado en el Portapapeles");
  };

  return (
    <Fragment>
      {/* Formulario Principal */}
      {loading && <LoaderSpinner />}
      <CanceledReazons
        isOpen={isOpenCanceledReazon}
        setIsOpen={setIsOpenCanceledReazon}
        id={id}
        onUpdate={() => {
          mutateConfig(`/sales/crm/polizas/${id}/activities`);
          mutate();
          mutatePolicies();
        }}
      />
      <VinculateContact
        isOpen={isOpenVinculateContact}
        setIsOpen={setIsOpenVinculateContact}
        policyId={id}
        onUpdate={() => {
          mutateConfig(`/sales/crm/polizas/${id}/activities`);
          mutate();
          mutatePolicies();
        }}
      />
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
          {data?.contact?.id ? (
            <Link
              className="font-semibold text-easy-600 text-sm hover:underline"
              href={`/sales/crm/contacts/contact/${data?.contact?.id}?show=true`}
            >
              {data?.contact?.fullName}
            </Link>
          ) : (
            <p
              className="font-semibold text-easy-600 text-sm hover:underline"
              onClick={() => setIsOpenVinculateContact(true)}
            >
              No disponible, Vincular cliente
            </p>
          )}
          <div className="flex items-center gap-2">
            <p className="uppercase text-sm">
              {t("control:portafolio:receipt:details:client-code")}:
            </p>
            <p className="text-sm">{data?.clientCode ?? "No disponiple"}</p>
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
    </Fragment>
  );
}
