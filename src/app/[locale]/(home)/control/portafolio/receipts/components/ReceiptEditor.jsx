"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import TextInput from "@/src/components/form/TextInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ActivityPanel from "../../../../../../../components/contactActivities/ActivityPanel";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
import { formatToDollars } from "@/src/utils/formatters";
import { formatDate } from "@/src/utils/getFormatDate";
import { PencilIcon } from "@heroicons/react/20/solid";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import InputCurrency from "@/src/components/form/InputCurrency";
import useAppContext from "@/src/context/app";
import SelectInput from "@/src/components/form/SelectInput";
import InputDate from "@/src/components/form/InputDate";
import clsx from "clsx";
import { putPoliza, putReceipt } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { formatISO } from "date-fns";

export default function ReceiptEditor({ data, id, updateReceipt }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { lists } = useAppContext();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const schema = Yup.object().shape({
    responsible: Yup.string(),
    status: Yup.string(),
    methodCollection: Yup.string(),
    "init-date": Yup.string(),
    dueDate: Yup.string(),
    paymentAmount: Yup.string(),
    currency: Yup.string(),
    description: Yup.string(),
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
    if (data?.responsible?.id) setValue("responsible", data?.responsible?.id);
    if (data?.status) setValue("status", data?.status);
    if (data?.methodCollection?.name)
      setValue("methodCollection", data?.methodCollection?.id);
    if (data?.metadata["Fecha de inicio"])
      setValue("init-date", data?.metadata["Fecha de inicio"]);
    if (data?.dueDate) setValue("dueDate", data?.dueDate);
    if (data?.currency?.id) setValue("currency", data?.currency?.id);
    if (data?.description) setValue("description", data?.description);
  }, [data]);

  const onSubmit = async (data) => {
    console.log({ data });
    const { paymentAmount, dueDate, ...otherData } = data;

    const body = {
      ...otherData,
      paymentAmount: +paymentAmount,
      dueDate: formatISO(dueDate),
    };
    try {
      const response = await putReceipt(id, body);
      console.log({ response });
      if (response.hasError) {
        toast.error(
          "Se ha producido un error al actualizar el recibo, inténtelo de nuevo."
        );
        return;
      }
      setIsEdit(false);
      router.back();
      updateReceipt();
      toast.success("Recibo actualizado correctamente.");
      mutate(
        "/sales/crm/polizas/receipts?page=1&limit=5&orderBy=name&order=DESC"
      );
    } catch (error) {
      toast.error(
        "Se ha producido un error al actualizar el recibo, inténtelo de nuevo."
      );
    }
  };

  return (
    <form
      className="flex flex-col h-screen relative w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Formulario Principal */}
      {loading && <LoaderSpinner />}
      <div className="flex flex-col flex-1 bg-gray-200 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4 ">
        <div className="flex flex-col flex-1 gap-2 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl relative">
          {/* Encabezado del Formulario */}
          <div className="bg-transparent">
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
              <div className="flex items-center gap-2">
                <label
                  className={clsx(
                    "py-2 px-3 rounded-lg capitalize font-semibold",
                    {
                      "bg-[#67FFAE]": data?.status == "vigente",
                      "bg-[#FFD092]": data?.status == "anulado",
                      "bg-[#FFC4C2]": data?.status == "vencido",
                      "bg-[#C2E6FF]": data?.status == "liquidado",
                    }
                  )}
                >
                  {data?.status}
                </label>
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
          </div>
          <div className="flex items-center gap-4  bg-gray-100 rounded-2xl p-2 w-full">
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

          <div
            className={clsx(
              "grid grid-cols-1 md:grid-cols-2  overflow-y-scroll bg-gray-100 rounded-2xl px-4 w-full py-4 ",
              {
                "pb-8": isEdit,
              }
            )}
          >
            {/* Menu Derecha */}

            <div className="h-auto rounded-2xl ">
              <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
                Datos generales del recibo
                {data?.idBitrix &&
                  !["anulado", "liquidado"].includes(data?.status) && (
                    <button
                      type="button"
                      onClick={() => setIsEdit(!isEdit)}
                      title="Editar"
                    >
                      <PencilIcon className="h-6 w-6 text-primary" />
                    </button>
                  )}
              </div>
              <div className="grid grid-cols-1 gap-x-6  rounded-lg w-full gap-y-3 px-5  py-9">
                <SelectDropdown
                  label={t(
                    "control:portafolio:receipt:details:form:responsible"
                  )}
                  name="responsible"
                  options={lists?.users}
                  register={register}
                  disabled={!isEdit}
                  error={!watch("responsible") && errors.responsible}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={t("control:portafolio:receipt:details:form:status")}
                  options={[
                    {
                      id: "vigente",
                      name: "Vigente",
                    },
                    {
                      id: "anulado",
                      name: "Anulado",
                    },
                    {
                      id: "vencido",
                      name: "Vencido",
                    },
                    {
                      id: "liquidado",
                      name: "Liquidado",
                    },
                  ]}
                  name="status"
                  register={register}
                  setValue={setValue}
                  disabled={!isEdit}
                  watch={watch}
                />
                <SelectInput
                  label={t(
                    "control:portafolio:receipt:details:form:payment-methods"
                  )}
                  name="methodCollection"
                  options={lists?.policies?.polizaFormasCobro ?? []}
                  disabled={!isEdit}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <TextInput
                  type="text"
                  label={t("control:portafolio:receipt:details:form:init-date")}
                  register={register}
                  name="init-date"
                  disabled
                />
                <Controller
                  render={({ field: { value, onChange, ref, onBlur } }) => {
                    return (
                      <InputDate
                        label={t(
                          "control:portafolio:receipt:details:form:expiration"
                        )}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={errors.dueDate}
                        disabled={!isEdit}
                      />
                    );
                  }}
                  name="dueDate"
                  control={control}
                />
                <InputCurrency
                  type="text"
                  label={t("control:portafolio:receipt:details:form:amount")}
                  setValue={setValue}
                  name="paymentAmount"
                  disabled={!isEdit}
                  defaultValue={
                    data?.paymentAmount && data?.paymentAmount?.length
                      ? (+data?.paymentAmount)?.toFixed(2)
                      : null
                  }
                />
                <SelectInput
                  label={t("control:portafolio:receipt:details:form:currency")}
                  name="currency"
                  options={lists?.policies?.currencies ?? []}
                  disabled={!isEdit}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <TextInput
                  type="text"
                  label={t("control:portafolio:receipt:details:form:comments")}
                  register={register}
                  name="description"
                  disabled={!isEdit}
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
        </div>
      </div>
      {isEdit && (
        <div
          className={clsx(
            "flex justify-center px-4 w-full py-4 gap-4 bottom-0 lg:rounded-bl-[35px] rounded-none left-0 right-0 fixed lg:absolute bg-white shadow-[0px_-2px_6px_4px_#00000017] "
          )}
        >
          <Button
            type="submit"
            label={
              loading ? t("common:buttons:saving") : t("common:buttons:save")
            }
            disabled={loading}
            buttonStyle="primary"
            className="px-3 py-2"
            // onclick={() => handleSubmit(handleFormSubmit)}
          />
          <Button
            type="button"
            label={t("common:buttons:cancel")}
            disabled={loading}
            buttonStyle="secondary"
            onclick={() => router.back()}
            className="px-3 py-2"
          />
        </div>
      )}
    </form>
  );
}
