"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import TextInput from "@/src/components/form/TextInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ActivityPanel from "@/src/components/activities/ActivityPanel";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";
import { formatDate } from "@/src/utils/getFormatDate";
import { PencilIcon } from "@heroicons/react/20/solid";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import AddDocumentDialog from "@/src/components/modals/AddDocument";
import InputCurrency from "@/src/components/form/InputCurrency";
import useAppContext from "@/src/context/app";
import SelectInput from "@/src/components/form/SelectInput";
import AgentSelectAsync from "@/src/components/form/AgentSelectAsync";
import InputDate from "@/src/components/form/InputDate";
import clsx from "clsx";
import { putReceipt } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { formatISO } from "date-fns";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import useReceiptContext from "@/src/context/receipts";

export default function ReceiptEditor({ data, id, updateReceipt }) {
  const { t } = useTranslation();
  const { settingsPolicy } = useCommon();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { lists } = useAppContext();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { mutate: mutateReceipts } = useReceiptContext();
  const [addFileProps, setAddFileProps] = useState({
    isOpen: false,
    cmrType: "receipt",
    id,
  });

  const schema = Yup.object().shape({
    responsibleId: Yup.string(),
    status: Yup.string(),
    methodCollection: Yup.string(),
    startDate: Yup.string(),
    dueDate: Yup.string(),
    paymentAmount: Yup.string(),
    currencyId: Yup.string(),
    description: Yup.string(),
    observerId: Yup.string(),
    methodPayment: Yup.string(),
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
    if (data?.responsible?.id) setValue("responsibleId", data?.responsible?.id);
    if (data?.status) setValue("status", data?.status);
    if (data?.methodCollection?.name)
      setValue("methodCollectionId", data?.methodCollection?.id);
    if (data?.frecuencyPayment?.name)
      setValue("frecuencyPaymentId", data?.frecuencyPayment?.id);
    if (data?.startDate) setValue("startDate", data?.startDate);
    if (data?.dueDate) setValue("dueDate", data?.dueDate);
    if (data?.paymentDate) setValue("paymentDate", data?.paymentDate);
    if (data?.currency?.id) setValue("currencyId", data?.currency?.id);
    if (data?.description) setValue("description", data?.description);
    if (data?.methodPayment) setValue("methodPayment", data?.methodPayment);
    if (data?.subAgente) setValue("subAgenteId", data?.subAgente?.id);
    if (data?.observer) setValue("observerId", data?.observer?.id);
    if (data?.conductoPago) setValue("conductoPagoId", data?.conductoPago?.id);
  }, [data]);

  const onSubmit = async (data) => {
    const { paymentAmount, dueDate, startDate, ...otherData } = data;

    const body = {
      ...otherData,
      paymentAmount: +paymentAmount,
      dueDate: dueDate ? formatISO(dueDate) : null,
      startDate: startDate ? formatISO(startDate) : null,
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
      updateReceipt();
      toast.success("Recibo actualizado correctamente.");
      mutateReceipts();
      router.back();
    } catch (error) {
      toast.error(
        "Se ha producido un error al actualizar el recibo, inténtelo de nuevo."
      );
    }
  };

  const updateStatus = async (status) => {
    setLoading(true);
    const body = {
      status,
    };
    try {
      const response = await putReceipt(id, body);
      console.log({ response });

      if (response.hasError) {
        toast.error(
          "Se ha producido un error al actualizar el recibo, inténtelo de nuevo."
        );
        setLoading(false);

        return;
      }
      updateReceipt();
      toast.success("Recibo actualizado correctamente.");
      mutate(
        "/sales/crm/polizas/receipts?page=1&limit=5&orderBy=name&order=DESC"
      );
    } catch (error) {
      console.log({ error });
      toast.error(
        "Se ha producido un error al actualizar el recibo, inténtelo de nuevo."
      );
    }
    setLoading(false);
  };

  const options = [
    {
      name: "Soporte de pago",
      type: "pago",
      onFinished: () => {
        toast.warning(
          "El soporte de pago ha sido cargado, debe actualizar el estado del recibo a 'Pagado'"
        );
      },
    },
    { name: "Factura", type: "factura" },
  ];

  const receiptStatus = [
    {
      id: "vigente",
      name: "Vigente",
    },
    {
      id: "cancelado",
      name: "Cancelado",
    },
    {
      id: "vencido",
      name: "Vencido",
    },
    {
      id: "pagado",
      name: "Pagado",
    },
  ];

  const handleAddDocument = (documentToAdd) => {
    setAddFileProps({
      ...addFileProps,
      isOpen: true,
      documentType: documentToAdd?.type,
      title: t("common:add-document", { document: documentToAdd?.name }),
      onFinished: documentToAdd?.onFinished,
    });
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 xl:gap-6 pl-4 pb-4">
                <div className="flex flex-col gap-2">
                  <p className="text-lg md:text-xl 2xl:text-2xl font-semibold">
                    {data?.title}
                  </p>
                  <Link
                    className="hover:text-easy-600 text-sm"
                    href={`/sales/crm/contacts/contact/${data?.poliza?.contact?.id}?show=true`}
                  >
                    {data?.poliza?.contact?.fullName ??
                      data?.poliza?.contact?.name}
                  </Link>
                </div>
                <div className="flex gap-2 pt-1">
                  <p className="uppercase text-sm">
                    {t("control:portafolio:receipt:details:date")}:
                  </p>
                  <p className="text-sm">
                    {formatDate(data?.dueDate, "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Menu>
                  <MenuButton>
                    <label
                      className={clsx(
                        "py-2 px-3 rounded-lg capitalize font-semibold cursor-pointer",
                        {
                          "bg-[#A9EA44]": data?.status == "pagado",
                          "bg-[#86BEDF]": data?.status == "vigente",
                          "bg-[#FFC4C2]": ["vencido", "cancelado"].includes(
                            data?.status
                          ),
                        }
                      )}
                    >
                      {data?.status}
                    </label>
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 "
                  >
                    {data &&
                      receiptStatus
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
          </div>
          <div className="flex items-center gap-4  bg-gray-100 rounded-lg p-2 w-full">
            <div className="px-4">
              <p className="px-3 text-gray-400 text-sm">
                {t("control:portafolio:receipt:details:consult")}
              </p>
            </div>
            <Menu>
              <MenuButton>
                <Button
                  label={t("common:buttons:add-2")}
                  buttonStyle="primary"
                  icon={<PlusIcon className="h-4 w-4 text-white" />}
                  className="py-2 px-3"
                />
              </MenuButton>
              <MenuItems
                transition
                anchor="bottom start"
                className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-2 "
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={index}
                    as="div"
                    onClick={() => handleAddDocument(option)}
                    disabled={option.disabled}
                    className="px-2 py-1 hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-sm cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>

          {/* Panel Principal */}

          <div
            className={clsx(
              "grid grid-cols-1 lg:grid-cols-12 lg:h-full bg-gray-100 rounded-lg px-4 w-full py-4 "
            )}
          >
            {/* Menu Derecha */}

            <div className="rounded-lg pb-8 lg:overflow-y-scroll lg:col-span-5 ">
              <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
                Datos generales del recibo
                {!["anulado", "liquidado"].includes(data?.status) && (
                  <button
                    type="button"
                    onClick={() => setIsEdit(!isEdit)}
                    title="Editar"
                  >
                    <PencilIcon className="h-6 w-6 text-primary" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-x-6  rounded-lg w-full gap-y-3 px-5  pt-9 pb-48">
                <SelectInput
                  label={t("control:portafolio:receipt:details:form:status")}
                  options={receiptStatus}
                  name="status"
                  register={register}
                  setValue={setValue}
                  disabled={!isEdit}
                  watch={watch}
                />

                <SelectInput
                  label={t(
                    "control:portafolio:receipt:details:form:method-collection"
                  )}
                  name="methodCollectionId"
                  options={lists?.policies?.polizaFormasCobro ?? []}
                  disabled={!isEdit}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={t(
                    "control:portafolio:receipt:details:form:method-payment"
                  )}
                  name="methodPayment"
                  options={[
                    { id: "efectivo", name: "Efectivo" },
                    { id: "tarjeta_credito", name: "Tarjeta de crédito" },
                    { id: "tarjeta_debito", name: "Tarjeta de débito" },
                  ]}
                  disabled={!isEdit}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={t(
                    "control:portafolio:receipt:details:form:conducto-pago"
                  )}
                  name="conductoPagoId"
                  options={lists?.policies?.polizaConductoPago}
                  disabled={!isEdit}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={t(
                    "control:portafolio:receipt:details:form:payment-methods"
                  )}
                  name="frecuencyPaymentId"
                  options={lists?.policies?.polizaFrecuenciasPago ?? []}
                  disabled={!isEdit}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <Controller
                  render={({ field: { value, onChange, ref, onBlur } }) => {
                    return (
                      <InputDate
                        label={t(
                          "control:portafolio:receipt:details:form:init-date"
                        )}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={errors.startDate}
                        disabled={!isEdit}
                      />
                    );
                  }}
                  name="startDate"
                  control={control}
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
                <Controller
                  render={({ field: { value, onChange, ref, onBlur } }) => {
                    return (
                      <InputDate
                        label={t(
                          "control:portafolio:receipt:details:form:payment-date"
                        )}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={errors.paymentDate}
                        disabled={!isEdit}
                      />
                    );
                  }}
                  name="paymentDate"
                  control={control}
                />
                <SelectInput
                  label={t("control:portafolio:receipt:details:form:currency")}
                  name="currencyId"
                  options={lists?.policies?.currencies ?? []}
                  disabled={!isEdit}
                  register={register}
                  setValue={setValue}
                  watch={watch}
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
                  prefix={
                    lists?.policies?.currencies?.find(
                      (x) => x.id == watch("currencyId")
                    )?.symbol ?? ""
                  }
                />
                <SelectDropdown
                  label={t(
                    "control:portafolio:receipt:details:form:responsible"
                  )}
                  name="responsibleId"
                  options={lists?.users}
                  register={register}
                  disabled={!isEdit}
                  error={!watch("responsibleId") && errors.responsible}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectDropdown
                  label={t("control:portafolio:receipt:details:form:observer")}
                  name="observerId"
                  options={lists?.users}
                  register={register}
                  disabled={!isEdit}
                  error={!watch("observerId") && errors.observerId}
                  setValue={setValue}
                  watch={watch}
                />
                <AgentSelectAsync
                  label={t("contacts:create:sub-agent")}
                  name="subAgenteId"
                  register={register}
                  disabled={!isEdit}
                  error={errors.subAgenteId}
                  setValue={setValue}
                  watch={watch}
                />
                <TextInput
                  type="text"
                  label={t("control:portafolio:receipt:details:form:comments")}
                  register={register}
                  name="description"
                  disabled={!isEdit}
                  multiple
                />
              </div>
            </div>
            {/* Menu Izquierda */}
            {/* <div className=" bg-gray-100 rounded-lg w-full"> */}
            {id && (
              <ActivityPanel
                entityId={id}
                className="lg:col-span-7"
                crmType="receipt"
              />
            )}
            {/* </div> */}
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
      <AddDocumentDialog
        {...addFileProps}
        setIsOpen={(open) => setAddFileProps({ ...addFileProps, isOpen: open })}
        update={() => {
          updateReceipt();
          mutate(`/sales/crm/polizas/receipts/${id}/activities`);
        }}
      />
    </form>
  );
}
