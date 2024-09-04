"use client";
import useAppContext from "@/src/context/app";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import TextInput from "@/src/components/form/TextInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import SelectInput from "@/src/components/form/SelectInput";
import InputDate from "@/src/components/form/InputDate";
import { FaCalendarDays } from "react-icons/fa6";
import { handleApiError } from "@/src/utils/api/errors";
import {
  createContact,
  updateContact,
  updatePhotoContact,
} from "@/src/lib/apis";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { useCommon } from "@/src/hooks/useCommon";
import { formatToDollars } from "@/src/utils/formatters";

export default function PolicyDetails({ data, id }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (data?.address) setValue("address", data?.address);
    if (data?.metadata?.RFC) setValue("rfc", data?.metadata?.RFC);
    if (data?.status) setValue("status", data?.status);
    if (data?.subbranch) setValue("subbranch", data?.subbranch);
    if (data?.cobertura)
      setValue("cobertura", formatToDollars(data?.cobertura));
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
      setValue("recargoFraccionado", data?.recargoFraccionado);
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
      <div className="h-auto rounded-2xl overflow-y-auto">
        <div className="flex justify-between py-4 px-3 rounded-2xl bg-white">
          {t("operations:policies:general:title")}
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
            register={register}
            name="rfc"
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
            name="subbranch"
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
            name="paymentMethod"
            disabled
          />
          <TextInput
            type="text"
            label={t("operations:policies:general:payment-frequency")}
            register={register}
            name="paymentFrequency"
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
            error={errors.lastName && errors.lastName.message}
            register={register}
            name="lastNamef"
            disabled
            multiple
          />
        </div>
      </div>
      {/* Menu Izquierda */}
      <div className=" bg-gray-100 rounded-lg w-full">
        {/* <ActivityPanel contactId={data?.id} /> */}
        N/D
      </div>
    </form>
  );
}
