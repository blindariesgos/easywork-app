"use client";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "@/src/components/form/TextInput";
import SelectSubAgent from "@/src/components/form/SelectSubAgent/SelectSubAgent";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ActivityPanel from "@/src/components/activities/ActivityPanel";
import clsx from "clsx";
import { formatToCurrency } from "@/src/utils/formatters";
import { PencilIcon } from "@heroicons/react/24/solid";
import useAppContext from "@/src/context/app";
import SelectInput from "@/src/components/form/SelectInput";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import InputDate from "@/src/components/form/InputDate";
import InputCurrency from "@/src/components/form/InputCurrency";
import Button from "@/src/components/form/Button";
import { postComment, putPoliza, putSchedule } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";

export default function ScheduleDetails({ data, id, mutate: updateSchedule }) {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { lists } = useAppContext();
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();

  const schema = Yup.object().shape({
    agenteIntermediarioId: Yup.string(),
    assignedById: Yup.string(),
    rfc: Yup.string(),
    vigenciaDesde: Yup.string(),
    vigenciaHasta: Yup.string(),
    address: Yup.string(),
    status: Yup.string(),
    subramoId: Yup.string(),
    cobertura: Yup.string(),
    frecuenciaCobroId: Yup.string(),
    paymentTerm: Yup.string(),
    primaNeta: Yup.string(),
    recargoFraccionado: Yup.string(),
    derechoPoliza: Yup.string(),
    iva: Yup.string(),
    importePagar: Yup.string(),
    plazoPago: Yup.string(),
    formaCobroId: Yup.string(),
    currencyId: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (params.get("edit") === "true") {
      setIsEdit(true);
    }
  }, [params.get("edit")]);

  useEffect(() => {
    if (data?.status) setValue("status", data?.status);
    if (data?.subramo?.name) setValue("subramoId", data?.subramo?.id);
    if (data?.agenteIntermediario?.name)
      setValue("agenteIntermediarioId", data?.agenteIntermediario?.id);
    if (data?.observations) setValue("observations", data?.observations);
    if (data?.assignedBy) setValue("assignedById", data?.assignedBy?.id);
    if (data?.ot) setValue("ot", data?.ot);
    if (data?.sigre) setValue("sigre", data?.sigre);
    if (data?.type) setValue("type", data?.type);
    if (data?.polizaType?.id) setValue("polizaTypeId", data?.polizaType?.id);
  }, [data]);

  const handleFormSubmit = async (data) => {
    try {
      const response = await putSchedule(id, data);
      if (response.hasError) {
        console.log(response);
        toast.error(
          "Se ha producido un error al actualizar la programacion, inténtelo de nuevo."
        );
        return;
      }
      setIsEdit(false);
      router.back();
      updateSchedule();
      toast.success("Programacion actualizada correctamente.");
    } catch (error) {
      toast.error(
        "Se ha producido un error al actualizar la programacion, inténtelo de nuevo."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={clsx(
        `grid grid-cols-1 lg:grid-cols-12 lg:overflow-y-auto md:overflow-hidden bg-gray-100 rounded-lg py-4 px-4 w-full lg:h-[calc(100vh_-_220px)]`
      )}
    >
      {/* Menu Derecha */}
      <div className="h-auto rounded-lg overflow-y-auto pr-2 lg:col-span-5">
        <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
          {t("operations:programations:general:title")}
          {data && (
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
          <Controller
            render={({ field: { value, onChange, ref, onBlur } }) => {
              return (
                <InputDate
                  label={t("operations:programations:general:init-date")}
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
          <SelectInput
            label={t("operations:programations:general:type-request")}
            name="type"
            options={[
              {
                id: "medicamentos",
                name: "Medicamentos",
              },
              {
                id: "cirugias",
                name: "Cirugias",
              },
              {
                id: "servicios-auxiliares",
                name: "Servicios auxiliares",
              },
            ]}
            disabled={!isEdit}
            register={register}
            setValue={setValue}
            watch={watch}
          />
          <TextInput
            type="text"
            label={t("operations:programations:general:claim-number")}
            name="claim-number"
            disabled={!isEdit}
          />
          <TextInput
            type="text"
            label={"SIGRE"}
            name="sigre"
            register={register}
            disabled={!isEdit}
          />
          <TextInput
            type="text"
            label={"OT"}
            name="ot"
            register={register}
            disabled={!isEdit}
          />
          <SelectInput
            label={t("operations:managements:add:schedule:procedure")}
            options={[
              {
                id: "nuevo",
                name: "Nuevo",
              },
              {
                id: "pre-existente",
                name: "Pre existente",
              },
            ]}
            name="type"
            disabled={!isEdit}
            setValue={setValue}
            watch={watch}
            error={errors?.type}
            register={register}
          />
          <SelectInput
            label={t("operations:policies:general:type")}
            name="polizaTypeId"
            options={lists?.policies?.polizaTypes ?? []}
            disabled
            register={register}
            setValue={setValue}
            watch={watch}
          />
          {data?.type?.name === "VIDA" && (
            <SelectInput
              label={t("operations:policies:general:subbranch")}
              name="subramoId"
              options={lists?.policies?.polizaSubRamo ?? []}
              disabled
              register={register}
              setValue={setValue}
              watch={watch}
            />
          )}
          <TextInput
            type="text"
            label={t("operations:programations:general:sheet-number")}
            name="sheet-number"
            disabled={!isEdit}
          />
          <TextInput
            type="text"
            label={t("operations:programations:general:diagnosis")}
            name="diagnosis"
            disabled={!isEdit}
          />

          <SelectInput
            label={t("operations:policies:general:intermediary")}
            name="agenteIntermediarioId"
            options={lists?.policies?.agentesIntermediarios ?? []}
            disabled={!isEdit}
            register={register}
            setValue={setValue}
            watch={watch}
          />

          <SelectDropdown
            label={t("operations:policies:general:responsible")}
            name="assignedById"
            options={lists?.users}
            register={register}
            disabled={!isEdit}
            error={!watch("assignedById") && errors.assignedById}
            setValue={setValue}
            watch={watch}
          />
          <TextInput
            type="text"
            label={t("control:portafolio:receipt:details:form:comments")}
            error={errors.observations && errors.observations.message}
            register={register}
            name="observations"
            disabled={!isEdit}
            multiple
          />
        </div>
      </div>
      {/* Menu Izquierda */}
      <ActivityPanel
        entityId={id}
        crmType="policy"
        className="lg:col-span-7"
        disabled
      />
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
