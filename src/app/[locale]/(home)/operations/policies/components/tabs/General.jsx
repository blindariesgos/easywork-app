"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "@/src/components/form/TextInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ActivityPanel from "@/src/components/activities/ActivityPanel";
import clsx from "clsx";
import { PencilIcon } from "@heroicons/react/24/solid";
import useAppContext from "@/src/context/app";
import SelectInput from "@/src/components/form/SelectInput";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import InputDate from "@/src/components/form/InputDate";
import InputCurrency from "@/src/components/form/InputCurrency";
import Button from "@/src/components/form/Button";
import { putPoliza } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import MultipleSelect from "@/src/components/form/MultipleSelect";
import IntermediarySelectAsync from "@/src/components/form/IntermediarySelectAsync";
import moment from "moment";
import AgentSelectAsync from "@/src/components/form/AgentSelectAsync";
import Insureds from "@/src/components/policyAdds/Insureds";
import Beneficiaries from "@/src/components/policyAdds/Beneficiaries";
import Vehicles from "@/src/components/policyAdds/Vehicles";
import { handleFrontError } from "@/src/utils/api/errors";

export default function PolicyDetails({
  data,
  id,
  edit,
  mutate: updatePolicy,
}) {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(!!edit);
  const [loading, setLoading] = useState(false);
  const { lists } = useAppContext();
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();
  const utcOffset = moment().utcOffset();
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
    observers: Yup.array(),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
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
    if (data?.vigenciaDesde)
      setValue(
        "vigenciaDesde",
        data?.vigenciaDesde
          ? moment(data?.vigenciaDesde).subtract(utcOffset, "minutes").format()
          : ""
      );
    if (data?.vigenciaHasta)
      setValue(
        "vigenciaHasta",
        data?.vigenciaHasta
          ? moment(data?.vigenciaHasta).subtract(utcOffset, "minutes").format()
          : ""
      );
    if (data?.status) setValue("status", data?.status);
    if (data?.subramo?.name) setValue("subramoId", data?.subramo?.id);
    if (data?.cobertura) setValue("cobertura", data?.cobertura);
    if (data?.paymentMethod) setValue("paymentMethod", data?.paymentMethod);
    if (data?.paymentFrequency)
      setValue("paymentFrequency", data?.paymentFrequency);
    if (data?.paymentTerm) setValue("paymentTerm", data?.paymentTerm);
    if (data?.formaCobro?.name) setValue("formaCobroId", data?.formaCobro?.id);
    if (data?.frecuenciaCobro?.name)
      setValue("frecuenciaCobroId", data?.frecuenciaCobro?.id);
    if (data?.agenteIntermediario?.name)
      setValue("agenteIntermediarioId", data?.agenteIntermediario?.id);
    if (data?.observations) setValue("observations", data?.observations);
    if (data?.currency?.name) setValue("currencyId", data?.currency?.id);
    if (data?.plazoPago) setValue("plazoPago", data?.plazoPago);
    if (data?.assignedBy) setValue("assignedById", data?.assignedBy?.id);
    if (data?.contact?.address) setValue("address", data?.contact?.address);
    if (data?.contact?.rfc) setValue("rfc", data?.contact?.rfc);
    if (data?.type?.id) setValue("typeId", data?.type?.id);
    if (data?.category) setValue("categoryId", data?.category?.id);
    if (data?.specifications) setValue("specifications", data?.specifications);
    if (data?.observers && data?.observers?.length > 0)
      setValue("observers", data?.observers);
    if (data?.subAgente?.name) setValue("subAgenteId", data?.subAgente?.id);

    if (
      [
        "01072927-e48a-4fd0-9b06-5288ff7bc23d", //GMM
        "e1794ba3-892d-4c51-ad62-32dcf836873b", //VIDA
      ].includes(data?.type?.id)
    ) {
      if (data?.insured && data?.insured?.length > 0) {
        setValue("insureds", data?.insured);
      } else {
        setValue("insureds", [
          {
            metadata: {
              edadContratacion: "",
              fechaNacimiento: "",
              tipoRiesgo: "",
              fumador: false,
            },
            insured: { codigo: "", fullName: "" },
          },
        ]);
      }
      if (data?.type?.id == "e1794ba3-892d-4c51-ad62-32dcf836873b") {
        if (data?.beneficiaries && data?.beneficiaries?.length > 0) {
          setValue("beneficiaries", data?.beneficiaries);
        } else {
          setValue("beneficiaries", [
            {
              nombre: "",
              parentesco: "",
              porcentaje: "",
              type: "Principal",
            },
          ]);
        }
      }
    }
    if (data?.type?.id == "e4e2f26f-8199-4e82-97f0-bdf1a6b6701c") {
      if (data?.vehicles) {
        setValue("vehicles", data?.vehicles);
      } else {
        setValue("vehicles", [
          {
            description: "",
            serial: "",
            model: "",
            motor: "",
            plates: "",
            usage: "",
            circulatesIn: "",
            regularDriver: "",
            regularDriverAge: "",
          },
        ]);
      }
    }
  }, [data]);

  const handleFormSubmit = async (data) => {
    const {
      primaNeta,
      recargoFraccionado,
      derechoPoliza,
      iva,
      importePagar,
      observers,
      insureds,
      ...otherData
    } = data;

    const body = {
      ...otherData,
      primaNeta: +primaNeta,
      recargoFraccionado: +recargoFraccionado,
      derechoPoliza: +derechoPoliza,
      iva: +iva,
      importePagar: +importePagar,
      observersIds: observers?.map((x) => x.id) ?? [],
    };

    if (insureds.length > 0 && insureds[0]?.insured?.codigo?.length > 0) {
      body.insureds = insureds
        .filter((x) => x?.insured?.codigo?.length > 0)
        .map((x) => ({
          codigo: x?.insured?.codigo,
          fullName: x?.insured?.fullName,
          metadata: x.metadata,
        }));
    }
    try {
      const poliza = Object.keys(body).reduce(
        (acc, key) =>
          Boolean(body[key])
            ? {
                ...acc,
                [key]: body[key],
              }
            : acc,
        {}
      );
      console.log({ poliza });
      const response = await putPoliza(id, poliza);

      if (response.hasError) {
        handleFrontError(response);
        return;
      }
      setIsEdit(false);
      updatePolicy();
      toast.success("Poliza actualizada correctamente.");
    } catch (error) {
      console.log({ error });
      toast.error(
        "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
      );
    }
  };

  const handleCancelEdit = () => {
    setIsEdit(false);

    if (params.get("editPolicy")) {
      params.delete("editPolicy");
      router.replace(`${pathname}?${params.toString()}`);
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
          {t("operations:policies:general:title")}
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
        <div className="grid grid-cols-1 pt-8 rounded-lg w-full gap-y-3 px-5 pb-20">
          <SelectInput
            label={t("control:portafolio:receipt:details:product")}
            name="categoryId"
            options={lists?.policies?.polizaCategories ?? []}
            register={register}
            setValue={setValue}
            watch={watch}
            className={clsx({ hidden: !isEdit })}
          />
          <SelectInput
            label={t("operations:policies:general:type")}
            name="typeId"
            options={lists?.policies?.polizaTypes ?? []}
            disabled
            register={register}
            setValue={setValue}
            watch={watch}
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
            className={clsx({ hidden: data?.type?.name !== "GMM" })}
          />
          {data?.type?.name === "VIDA" && (
            <SelectInput
              label={t("operations:policies:general:subbranch")}
              name="subramoId"
              options={lists?.policies?.polizaSubRamo ?? []}
              disabled={!isEdit}
              register={register}
              setValue={setValue}
              watch={watch}
            />
          )}
          <SelectInput
            label={t("control:portafolio:receipt:details:form:status")}
            options={[
              {
                id: "activa",
                name: "Vigente",
              },
              {
                id: "expirada",
                name: "No vigente",
              },
              {
                id: "cancelada",
                name: "Cancelada",
              },
              {
                id: "en_proceso",
                name: "En trámite",
              },
            ]}
            name="status"
            register={register}
            setValue={setValue}
            disabled={!isEdit}
            watch={watch}
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:rfc")}
            name="rfc"
            register={register}
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:address")}
            register={register}
            name="address"
            disabled
            multiple
            rows={2}
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
            label={t("operations:policies:general:payment-method")}
            name="formaCobroId"
            options={lists?.policies?.polizaFormasCobro ?? []}
            disabled={!isEdit}
            register={register}
            setValue={setValue}
            watch={watch}
          />
          <SelectInput
            label={t("operations:policies:general:payment-frequency")}
            name="frecuenciaCobroId"
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
          <SelectInput
            label={"Moneda"}
            options={lists?.policies?.currencies ?? []}
            name="currencyId"
            register={register}
            setValue={setValue}
            disabled={!isEdit}
            watch={watch}
          />
          <InputCurrency
            type="text"
            label={t("operations:policies:general:primaNeta")}
            setValue={setValue}
            name="primaNeta"
            disabled={!isEdit}
            defaultValue={data?.primaNeta?.toFixed(2) ?? null}
            prefix={
              lists?.policies?.currencies?.find(
                (x) => x.id == watch("currencyId")
              )?.symbol ?? ""
            }
          />
          <InputCurrency
            type="text"
            label={t("operations:policies:general:recargoFraccionado")}
            setValue={setValue}
            name="recargoFraccionado"
            disabled={!isEdit}
            defaultValue={data?.recargoFraccionado?.toFixed(2) ?? null}
            prefix={
              lists?.policies?.currencies?.find(
                (x) => x.id == watch("currencyId")
              )?.symbol ?? ""
            }
          />
          <InputCurrency
            type="text"
            label={t("operations:policies:general:derechoPoliza")}
            setValue={setValue}
            name="derechoPoliza"
            disabled={!isEdit}
            defaultValue={data?.derechoPoliza?.toFixed(2) ?? null}
            prefix={
              lists?.policies?.currencies?.find(
                (x) => x.id == watch("currencyId")
              )?.symbol ?? ""
            }
          />
          <InputCurrency
            type="text"
            label={t("operations:policies:general:iva")}
            setValue={setValue}
            name="iva"
            disabled={!isEdit}
            defaultValue={data?.iva?.toFixed(2) ?? null}
            prefix={
              lists?.policies?.currencies?.find(
                (x) => x.id == watch("currencyId")
              )?.symbol ?? ""
            }
          />
          <InputCurrency
            type="text"
            label={t("operations:policies:general:importePagar")}
            setValue={setValue}
            name="importePagar"
            disabled={!isEdit}
            defaultValue={data?.importePagar?.toFixed(2) ?? null}
            prefix={
              lists?.policies?.currencies?.find(
                (x) => x.id == watch("currencyId")
              )?.symbol ?? ""
            }
          />
          <IntermediarySelectAsync
            label={t("operations:policies:general:intermediary")}
            name="agenteIntermediarioId"
            disabled={!isEdit}
            setValue={setValue}
            watch={watch}
          />
          <AgentSelectAsync
            label={t("operations:programations:general:sub-agent")}
            name="subAgenteId"
            error={errors.subAgenteId}
            setValue={setValue}
            watch={watch}
            disabled={!isEdit}
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
          <MultipleSelect
            label={t("operations:policies:general:observers")}
            options={lists?.users || []}
            getValues={getValues}
            setValue={setValue}
            name="observers"
            error={errors.observers}
            disabled={!isEdit}
          />

          <TextInput
            type="text"
            label={t("control:portafolio:receipt:details:form:comments")}
            error={errors.observations}
            register={register}
            name="observations"
            disabled={!isEdit}
            multiple
          />
          {isEdit && (
            <Fragment>
              {[
                "01072927-e48a-4fd0-9b06-5288ff7bc23d", //GMM
                "e1794ba3-892d-4c51-ad62-32dcf836873b", //VIDA
              ].includes(watch("typeId")) && (
                <Fragment>
                  <Insureds
                    register={register}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    isAdd
                  />
                  {watch("typeId") ==
                    "e1794ba3-892d-4c51-ad62-32dcf836873b" && (
                    <Fragment>
                      <Beneficiaries
                        register={register}
                        control={control}
                        watch={watch}
                        isAdd
                      />
                      <TextInput
                        type="text"
                        label={t("operations:policies:general:specifications")}
                        error={errors.specifications}
                        register={register}
                        name="specifications"
                        disabled={!isEdit}
                        multiple
                      />
                    </Fragment>
                  )}
                </Fragment>
              )}
              {[
                "e4e2f26f-8199-4e82-97f0-bdf1a6b6701c", //AUTOS
              ].includes(watch("typeId")) && (
                <Vehicles
                  register={register}
                  watch={watch}
                  control={control}
                  isAdd
                />
              )}
            </Fragment>
          )}
        </div>
      </div>
      {/* Menu Izquierda */}
      <ActivityPanel entityId={id} crmType="poliza" className="lg:col-span-7" />
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
            onclick={handleCancelEdit}
            className="px-3 py-2"
          />
        </div>
      )}
    </form>
  );
}
