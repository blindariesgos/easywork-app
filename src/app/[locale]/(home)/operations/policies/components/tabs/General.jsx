"use client";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "@/src/components/form/TextInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ActivityPanel from "../../../../../../../components/contactActivities/ActivityPanel";

import { formatToDollars } from "@/src/utils/formatters";

export default function PolicyDetails({ data, id }) {
  const { t } = useTranslation();

  const schema = Yup.object().shape({
    subAgent: Yup.string(),
    intermediary: Yup.string(),
    responsible: Yup.string(),
    rfc: Yup.string(),
    initDate: Yup.string(),
    endDate: Yup.string(),
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
    if (data?.metadata["Fecha de inicio"])
      setValue("initDate", data?.metadata["Fecha de inicio"] ?? "");
    if (data?.metadata["Fecha de cierre"])
      setValue("endDate", data?.metadata["Fecha de cierre"] ?? "");
    if (data?.status) setValue("status", data?.status);
    if (data?.subramo?.name) setValue("subramo", data?.subramo?.name);
    if (data?.cobertura) setValue("cobertura", data?.cobertura);
    if (data?.paymentMethod) setValue("paymentMethod", data?.paymentMethod);
    if (data?.paymentFrequency)
      setValue("paymentFrequency", data?.paymentFrequency);
    if (data?.paymentTerm) setValue("paymentTerm", data?.paymentTerm);
    if (data?.primaNeta)
      setValue("primaNeta", formatToDollars(data?.primaNeta));
    if (data?.derechoPoliza)
      setValue("derechoPoliza", formatToDollars(data?.derechoPoliza));
    if (data?.iva) setValue("iva", formatToDollars(data?.iva));
    if (data?.importePagar)
      setValue("importePagar", formatToDollars(data?.importePagar));
    if (data?.recargoFraccionado)
      setValue(
        "recargoFraccionado",
        formatToDollars(data?.recargoFraccionado ?? 0)
      );
    if (data?.formaCobro?.name) setValue("formaCobro", data?.formaCobro?.name);
    if (data?.frecuenciaCobro?.name)
      setValue("frecuenciaCobro", data?.frecuenciaCobro?.name);
    if (data?.agenteIntermediario?.name)
      setValue("intermediary", data?.agenteIntermediario?.name);
    if (data?.comments) setValue("comments", data?.comments);
    if (data?.currency?.name) setValue("currency", data?.currency?.name);
  }, [data]);

  const handleFormSubmit = async (data) => {
    console.log({ data });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto md:overflow-hidden bg-gray-100 rounded-2xl py-4 px-4 w-full h-[calc(100vh_-_210px)]"
    >
      {/* Menu Derecha */}
      <div className="h-auto rounded-2xl overflow-y-auto pr-1">
        <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
          {t("operations:policies:general:title")}
        </div>
        <div className="grid grid-cols-1 pt-8 rounded-lg w-full gap-y-3 px-5  pb-9">
          <TextInput
            type="text"
            label={t("operations:policies:general:address")}
            value={data?.address}
            register={register}
            name="address"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:rfc")}
            value={data?.metadata?.RFC}
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:status")}
            register={register}
            name="status"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:subbranch")}
            register={register}
            name="subramo"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:init-date")}
            register={register}
            name="initDate"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:expiration")}
            register={register}
            name="endDate"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:coverage")}
            register={register}
            name="cobertura"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:payment-method")}
            register={register}
            name="formaCobro"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:payment-frequency")}
            register={register}
            name="frecuenciaCobro"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:payment-term")}
            register={register}
            name="paymentTerm"
            disabled
          />
          <TextInput
            type="text"
            label={"Moneda"}
            register={register}
            name="currency"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:primaNeta")}
            register={register}
            name="primaNeta"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:recargoFraccionado")}
            register={register}
            name="recargoFraccionado"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:derechoPoliza")}
            register={register}
            name="derechoPoliza"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:iva")}
            register={register}
            name="iva"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:importePagar")}
            register={register}
            name="importePagar"
            disabled
          />

          <TextInput
            type="text"
            label={t("operations:policies:general:sub-agent")}
            register={register}
            name="sub-agent"
            disabled
          />

          <TextInput
            type="text"
            label={t("operations:policies:general:intermediary")}
            register={register}
            name="intermediary"
            disabled
          />

          <TextInput
            type="text"
            label={t("operations:policies:general:responsible")}
            register={register}
            name="responsible"
            disabled
          />

          {/* <SelectDropdown
            label={t("control:portafolio:receipt:details:form:responsible")}
            name="responsible"
            options={lists?.users}
            selectedOption={contactResponsible}
            register={register}
            disabled
            error={!watch("responsible") && errors.responsible}
            setValue={setValue}
          />
          <SelectInput
            label={t("control:portafolio:receipt:details:form:status")}
            options={[
              {
                id: "1",
                value: "1",
                name: "Liquidado",
              },
              {
                id: "2",
                value: "2",
                name: "Cancelado",
              },
              {
                id: "3",
                value: "3",
                name: "Pendiente",
              },
            ]}
            name="status"
            register={register}
            setValue={setValue}
            disabled
          />
          <SelectInput
            label={t("control:portafolio:receipt:details:form:payment-methods")}
            options={[
              {
                id: "1",
                value: "1",
                name: "Anual",
              },
              {
                id: "2",
                value: "2",
                name: "Semestral",
              },
              {
                id: "3",
                value: "3",
                name: "Trimentral",
              },
              {
                id: "4",
                value: "4",
                name: "Mensual",
              },
            ]}
            name="payment"
            register={register}
            setValue={setValue}
            disabled
          />
          <TextInput
            type="text"
            label={t("control:portafolio:receipt:details:form:amount")}
            placeholder={`10.000,00`}
            register={register}
            name="firstName"
            disabled
          />
          <SelectInput
            label={t("control:portafolio:receipt:details:form:currency")}
            options={[
              {
                id: "1",
                value: "1",
                name: "Pesos",
              },
              {
                id: "2",
                value: "2",
                name: "Dolares Americanos",
              },
            ]}
            name="paymendt"
            register={register}
            setValue={setValue}
            disabled
          /> */}
          <TextInput
            type="text"
            label={t("control:portafolio:receipt:details:form:comments")}
            error={errors.comments && errors.comments.message}
            register={register}
            name="comments"
            disabled
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

                {/* <SelectDropdown
            label={t("control:portafolio:receipt:details:form:responsible")}
            name="responsible"
            options={lists?.users}
            selectedOption={contactResponsible}
            register={register}
            disabled
            error={!watch("responsible") && errors.responsible}
            setValue={setValue}
          />
          <SelectInput
            label={t("control:portafolio:receipt:details:form:status")}
            options={[
              {
                id: "1",
                value: "1",
                name: "Liquidado",
              },
              {
                id: "2",
                value: "2",
                name: "Cancelado",
              },
              {
                id: "3",
                value: "3",
                name: "Pendiente",
              },
            ]}
            name="status"
            register={register}
            setValue={setValue}
            disabled
          />
          <SelectInput
            label={t("control:portafolio:receipt:details:form:payment-methods")}
            options={[
              {
                id: "1",
                value: "1",
                name: "Anual",
              },
              {
                id: "2",
                value: "2",
                name: "Semestral",
              },
              {
                id: "3",
                value: "3",
                name: "Trimentral",
              },
              {
                id: "4",
                value: "4",
                name: "Mensual",
              },
            ]}
            name="payment"
            register={register}
            setValue={setValue}
            disabled
          />
          <TextInput
            type="text"
            label={t("control:portafolio:receipt:details:form:amount")}
            placeholder={`10.000,00`}
            register={register}
            name="firstName"
            disabled
          />
          <SelectInput
            label={t("control:portafolio:receipt:details:form:currency")}
            options={[
              {
                id: "1",
                value: "1",
                name: "Pesos",
              },
              {
                id: "2",
                value: "2",
                name: "Dolares Americanos",
              },
            ]}
            name="paymendt"
            register={register}
            setValue={setValue}
            disabled
          /> */}
              </div>
            </Fragment>
          ))}
      </div>
      {/* Menu Izquierda */}
      <div className=" bg-gray-100 rounded-lg w-full">
        <ActivityPanel contactId={data?.contact?.id} />
      </div>
    </form>
  );
}
