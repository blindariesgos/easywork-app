"use client";
import useAppContext from "@/src/context/app";
import { PencilIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import TextInput from "@/src/components/form/TextInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputPhone from "@/src/components/form/InputPhone";
import SelectInput from "@/src/components/form/SelectInput";
import InputDate from "@/src/components/form/InputDate";
import { FaCalendarDays } from "react-icons/fa6";
import ActivityPanel from "../../../../../../../components/contactActivities/ActivityPanel";
import { handleApiError } from "@/src/utils/api/errors";
import {
  createContact,
  updateContact,
  updatePhotoContact,
} from "@/src/lib/apis";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import { DocumentSelector } from "@/src/components/DocumentSelector";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import { useRouter } from "next/navigation";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useSWRConfig } from "swr";
import Image from "next/image";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
import { formatToDollars } from "@/src/utils/formatters";
import { formatDate } from "@/src/utils/getFormatDate";

export default function ReceiptEditor({ data, id }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    responsible: Yup.string(),
    status: Yup.string(),
    frecuencyPayment: Yup.string(),
    "init-date": Yup.string(),
    expiration: Yup.string(),
    amount: Yup.string(),
    currency: Yup.string(),
    comments: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (data?.responsible?.profile)
      setValue(
        "responsible",
        `${data?.responsible?.profile?.firstName} ${data?.responsible?.profile?.lastName}`
      );
    if (data?.status) setValue("status", data?.status);
    if (data?.methodCollection?.name)
      setValue("frecuencyPayment", data?.methodCollection?.name);
    if (data?.metadata["Fecha de inicio"])
      setValue("init-date", data?.metadata["Fecha de inicio"]);
    if (data?.dueDate)
      setValue("expiration", formatDate(data?.dueDate, "dd/MM/yyyy"));
    if (data?.paymentAmount)
      setValue("amount", formatToDollars(data?.paymentAmount));
    if (data?.currency?.name) setValue("currency", data?.currency?.name);
    if (data?.description) setValue("comments", data?.description);
  }, [data, id]);

  return (
    <div className="flex flex-col h-screen relative w-full">
      {/* Formulario Principal */}
      {loading && <LoaderSpinner />}
      <div className="flex flex-col flex-1 bg-gray-200 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
        <form
          onSubmit={handleSubmit((e) => e.preventDefault())}
          className="flex flex-col flex-1 gap-2 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl relative"
        >
          {/* Encabezado del Formulario */}
          <div className="bg-transparent py-6 mx-4">
            <div className="flex justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 xl:gap-4">
                <p className="text-xl sm:text-2xl xl:text-3xl">
                  {data?.poliza?.contact?.fullName ??
                    data?.poliza?.contact?.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs sm:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:date")}:
                  </p>
                  <p className="text-xs sm:text-sm xl:text-base">
                    {formatDate(data?.poliza?.fechaEmision, "dd/MM/yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs sm:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:product")}:
                  </p>
                  <p className="text-xs sm:text-sm xl:text-base">
                    {data?.poliza?.category?.name ?? "S/N"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs sm:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:policy")}:
                  </p>
                  <p className="text-xs sm:text-sm xl:text-base">
                    {data?.poliza?.poliza ?? "S/N"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs md:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:company")}:
                  </p>
                  <p className="text-xs md:text-sm xl:text-base">
                    {data?.poliza?.company?.name ?? "S/N"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="uppercase text-xs md:text-sm xl:text-base">
                    {t("control:portafolio:receipt:details:client-code")}:
                  </p>
                  <p className="text-xs md:text-sm xl:text-base">
                    {data?.poliza?.metadata["Código de Cliente"] ?? "N/D"}
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
          </div>
          <div className="flex items-center gap-4  bg-gray-100 rounded-2xl p-4 w-full">
            <p className="uppercase text-gray-50">
              {t("control:portafolio:receipt:details:consult")}
            </p>
            <Button
              buttonStyle="primary"
              label={t("common:buttons:add")}
              icon={<PlusIcon className="h-4 w-4 text-white" />}
              className="py-2 px-3"
            />
          </div>

          {/* Panel Principal */}

          <div className="grid grid-cols-1 md:grid-cols-2  overflow-y-scroll bg-gray-100 rounded-2xl p-4 w-full">
            {/* Menu Derecha */}
            <div className="h-auto rounded-2xl ">
              <div className="grid grid-cols-1 gap-x-6  rounded-lg w-full gap-y-3 px-5  pb-9">
                <TextInput
                  type="text"
                  label={t(
                    "control:portafolio:receipt:details:form:responsible"
                  )}
                  register={register}
                  name="responsible"
                  disabled
                />
                <TextInput
                  type="text"
                  label={t("control:portafolio:receipt:details:form:status")}
                  register={register}
                  name="status"
                  disabled
                />
                <TextInput
                  type="text"
                  label={t(
                    "control:portafolio:receipt:details:form:payment-methods"
                  )}
                  register={register}
                  name="frecuencyPayment"
                  disabled
                />
                <TextInput
                  type="text"
                  label={t("control:portafolio:receipt:details:form:init-date")}
                  register={register}
                  name="init-date"
                  disabled
                />
                <TextInput
                  type="text"
                  label={t(
                    "control:portafolio:receipt:details:form:expiration"
                  )}
                  register={register}
                  name="expiration"
                  disabled
                />
                <TextInput
                  type="text"
                  label={t("control:portafolio:receipt:details:form:amount")}
                  register={register}
                  name="amount"
                  disabled
                />
                <TextInput
                  type="text"
                  label={t("control:portafolio:receipt:details:form:currency")}
                  register={register}
                  name="currency"
                  disabled
                />
                <TextInput
                  type="text"
                  label={t("control:portafolio:receipt:details:form:comments")}
                  register={register}
                  name="comments"
                  disabled
                />
              </div>
            </div>
            {/* Menu Izquierda */}
            <div className=" bg-gray-100 rounded-lg w-full">
              {data?.poliza?.contact?.id && (
                <ActivityPanel contactId={data?.poliza?.contact?.id} />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
