"use client";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "@/src/components/form/TextInput";
import SelectSubAgent from "@/src/components/form/SelectSubAgent/SelectSubAgent";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ActivityPanel from "../../../../../../../components/contactActivities/ActivityPanel";
import clsx from "clsx";
import { formatToDollars } from "@/src/utils/formatters";
import { PencilIcon } from "@heroicons/react/24/solid";
import useAppContext from "@/src/context/app";
import SelectInput from "@/src/components/form/SelectInput";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import InputDate from "@/src/components/form/InputDate";
import InputCurrency from "@/src/components/form/InputCurrency";
import Button from "@/src/components/form/Button";
import { postComment, putPoliza } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

export default function PolicyDetails({ data, id, mutate: updatePolicy }) {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { lists } = useAppContext();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const schema = Yup.object().shape({
    agenteIntermediario: Yup.string(),
    responsible: Yup.string(),
    rfc: Yup.string(),
    vigenciaDesde: Yup.string(),
    vigenciaHasta: Yup.string(),
    address: Yup.string(),
    status: Yup.string(),
    subbranch: Yup.string(),
    cobertura: Yup.string(),
    paymentMethod: Yup.string(),
    paymentFrequency: Yup.string(),
    paymentTerm: Yup.string(),
    primaNeta: Yup.string(),
    recargoFraccionado: Yup.string(),
    derechoPoliza: Yup.string(),
    iva: Yup.string(),
    importePagar: Yup.string(),
    plazoPago: Yup.string(),
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
    if (data?.vigenciaDesde)
      setValue("vigenciaDesde", data?.vigenciaDesde ?? "");
    if (data?.vigenciaHasta)
      setValue("vigenciaHasta", data?.vigenciaHasta ?? "");
    if (data?.status) setValue("status", data?.status);
    if (data?.subramo?.name) setValue("subramo", data?.subramo?.id);
    if (data?.cobertura) setValue("cobertura", data?.cobertura);
    if (data?.paymentMethod) setValue("paymentMethod", data?.paymentMethod);
    if (data?.paymentFrequency)
      setValue("paymentFrequency", data?.paymentFrequency);
    if (data?.paymentTerm) setValue("paymentTerm", data?.paymentTerm);
    if (data?.formaCobro?.name) setValue("formaCobro", data?.formaCobro?.id);
    if (data?.frecuenciaCobro?.name)
      setValue("frecuenciaCobro", data?.frecuenciaCobro?.id);
    if (data?.agenteIntermediario?.name)
      setValue("agenteIntermediario", data?.agenteIntermediario?.id);
    if (data?.comments) setValue("comments", data?.comments);
    if (data?.currency?.name) setValue("currency", data?.currency?.name);
    if (data?.plazoPago) setValue("plazoPago", data?.plazoPago);
    if (data?.responsible) setValue("responsible", data?.responsible?.id);
    if (data?.contact?.address) setValue("address", data?.contact?.address);
    if (data?.contact?.rfc) setValue("rcf", data?.contact?.rfc);
  }, [data]);

  const handleFormSubmit = async (data) => {
    const {
      primaNeta,
      recargoFraccionado,
      derechoPoliza,
      iva,
      importePagar,
      ...otherData
    } = data;

    const body = {
      ...otherData,
      primaNeta: +primaNeta,
      recargoFraccionado: +recargoFraccionado,
      derechoPoliza: +derechoPoliza,
      iva: +iva,
      importePagar: +importePagar,
    };
    try {
      const response = await putPoliza(id, body);
      if (response.hasError) {
        console.log(response);
        toast.error(
          "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
        );
        return;
      }
      setIsEdit(false);
      router.back();
      updatePolicy();
      toast.success("Poliza actualizada correctamente.");
      mutate("/sales/crm/polizas?page=1&limit=5&orderBy=name&order=DESC");
    } catch (error) {
      toast.error(
        "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`grid grid-cols-1 md:grid-cols-2 overflow-y-auto md:overflow-hidden bg-gray-100 rounded-2xl py-4 px-4 w-full h-[calc(100vh_-_220px)]`}
    >
      {/* Menu Derecha */}
      <div className="h-auto rounded-2xl overflow-y-auto pr-1">
        <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
          {t("operations:policies:general:title")}
          {data?.idBitrix && (
            <button
              type="button"
              onClick={() => setIsEdit(!isEdit)}
              title="Editar"
            >
              <PencilIcon className="h-6 w-6 text-primary" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 pt-8 rounded-lg w-full gap-y-3 px-5  pb-9">
          <TextInput
            type="text"
            label={t("operations:policies:general:address")}
            register={register}
            name="address"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:rfc")}
            name="rfc"
            disabled
          />
          <SelectInput
            label={t("control:portafolio:receipt:details:form:status")}
            options={[
              {
                id: "activa",
                name: "Activa",
              },
              {
                id: "expirada",
                name: "Expirada",
              },
              {
                id: "cancelada",
                name: "Cancelada",
              },
              {
                id: "en_proceso",
                name: "En proceso",
              },
            ]}
            name="status"
            register={register}
            setValue={setValue}
            disabled={!isEdit}
            watch={watch}
          />
          <SelectInput
            label={t("operations:policies:general:subbranch")}
            name="subramo"
            options={lists?.policies?.polizaSubRamo ?? []}
            disabled={!isEdit}
            register={register}
            setValue={setValue}
            watch={watch}
          />
          <Controller
            render={({ field: { value, onChange, ref, onBlur } }) => {
              return (
                <InputDate
                  label={t("operations:policies:general:init-date")}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errors.vigenciaDesde}
                  disabled={!isEdit}
                />
              );
            }}
            name="vigenciaDesde"
            control={control}
            defaultValue=""
          />
          <Controller
            render={({ field: { value, onChange, ref, onBlur } }) => {
              return (
                <InputDate
                  label={t("operations:policies:general:expiration")}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errors.vigenciaHasta}
                  disabled={!isEdit}
                />
              );
            }}
            name="vigenciaHasta"
            control={control}
            defaultValue=""
          />
          <SelectInput
            label={t("operations:policies:general:coverage")}
            options={[
              {
                id: "Nacional",
                name: "Nacional",
              },
              {
                id: "Internacional",
                name: "Internacional",
              },
            ]}
            name="cobertura"
            register={register}
            setValue={setValue}
            disabled={!isEdit}
            watch={watch}
          />
          <SelectInput
            label={t("operations:policies:general:payment-method")}
            name="formaCobro"
            options={lists?.policies?.polizaFormasCobro ?? []}
            disabled={!isEdit}
            register={register}
            setValue={setValue}
            watch={watch}
          />
          <SelectInput
            label={t("operations:policies:general:payment-frequency")}
            name="frecuenciaCobro"
            options={lists?.policies?.polizaFrecuenciasPago ?? []}
            disabled={!isEdit}
            register={register}
            setValue={setValue}
            watch={watch}
          />
          <SelectInput
            label={t("operations:policies:general:payment-term")}
            options={[
              {
                id: "15",
                name: "15 días",
              },
              {
                id: "30",
                name: "30 días",
              },
            ]}
            name="plazoPago"
            register={register}
            setValue={setValue}
            disabled={!isEdit}
            watch={watch}
          />
          <TextInput
            type="text"
            label={"Moneda"}
            register={register}
            name="currency"
            disabled={!isEdit}
          />
          <InputCurrency
            type="text"
            label={t("operations:policies:general:primaNeta")}
            setValue={setValue}
            name="primaNeta"
            disabled={!isEdit}
            defaultValue={data?.primaNeta.toFixed(2) ?? null}
          />
          <InputCurrency
            type="text"
            label={t("operations:policies:general:recargoFraccionado")}
            setValue={setValue}
            name="recargoFraccionado"
            disabled={!isEdit}
            defaultValue={data?.recargoFraccionado.toFixed(2) ?? null}
          />
          <InputCurrency
            type="text"
            label={t("operations:policies:general:derechoPoliza")}
            setValue={setValue}
            name="derechoPoliza"
            disabled={!isEdit}
            defaultValue={data?.derechoPoliza.toFixed(2) ?? null}
          />
          <InputCurrency
            type="text"
            label={t("operations:policies:general:iva")}
            setValue={setValue}
            name="iva"
            disabled={!isEdit}
            defaultValue={data?.iva.toFixed(2) ?? null}
          />
          <InputCurrency
            type="text"
            label={t("operations:policies:general:importePagar")}
            setValue={setValue}
            name="importePagar"
            disabled={!isEdit}
            defaultValue={data?.importePagar.toFixed(2) ?? null}
          />
          <SelectInput
            label={t("operations:policies:general:intermediary")}
            name="agenteIntermediario"
            options={lists?.policies?.agentesIntermediarios ?? []}
            disabled={!isEdit}
            register={register}
            setValue={setValue}
            watch={watch}
          />

          <SelectDropdown
            label={t("operations:policies:general:responsible")}
            name="responsible"
            options={lists?.users}
            register={register}
            disabled={!isEdit}
            error={!watch("responsible") && errors.responsible}
            setValue={setValue}
            watch={watch}
          />
          <TextInput
            type="text"
            label={t("control:portafolio:receipt:details:form:comments")}
            error={errors.comments && errors.comments.message}
            register={register}
            name="comments"
            disabled={!isEdit}
            multiple
          />
        </div>
        {data?.type?.name === "AUTOS" &&
          data?.vehicles.map((vehicle) => (
            <Fragment key={vehicle.id}>
              <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
                {"Datos del vehiculo asegurado"}
              </div>
              <div className="grid grid-cols-1 pt-8 rounded-lg w-full gap-y-3 px-5  pb-9">
                <TextInput
                  type="text"
                  label={"Descripción"}
                  value={vehicle?.description ?? "S/N"}
                  disabled
                />
                <TextInput
                  type="text"
                  label={"Serie"}
                  value={vehicle?.serial ?? "S/N"}
                  disabled
                />
                <TextInput
                  type="text"
                  label={"Placa"}
                  value={vehicle?.plates ?? "S/N"}
                  disabled
                />
                <TextInput
                  type="text"
                  label={"Modelo"}
                  value={vehicle?.model ?? "S/N"}
                  disabled
                />
                <TextInput
                  type="text"
                  label={"Motor"}
                  value={vehicle?.motor ?? "S/N"}
                  disabled
                />
                <TextInput
                  type="text"
                  label={"Uso"}
                  value={vehicle?.usage ?? "S/N"}
                  disabled
                />
                <TextInput
                  type="text"
                  label={"Circula en"}
                  value={vehicle?.circulatesIn ?? "S/N"}
                  disabled
                />
              </div>
            </Fragment>
          ))}
      </div>
      {/* Menu Izquierda */}
      <div className=" bg-gray-100 rounded-lg w-full">
        <ActivityPanel contactId={data?.contact?.id} />
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
