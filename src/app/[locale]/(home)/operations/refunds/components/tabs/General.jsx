"use client";
import React, { Fragment, useCallback, useEffect, useState } from "react";
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
import CheckboxInput from "@/src/components/form/CheckboxInput";
import Button from "@/src/components/form/Button";
import { putRefund, putSchedule } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import AgentSelectAsync from "@/src/components/form/AgentSelectAsync";
import { polizaReimbursementStatus } from "@/src/utils/stages";
import IntermediarySelectAsync from "@/src/components/form/IntermediarySelectAsync";

export default function RefundGeneralTab({ data, id, mutate: updateRefund }) {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { lists } = useAppContext();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const utcOffset = moment().utcOffset();

  const schema = Yup.object().shape({
    agenteIntermediarioId: Yup.string(),
    assignedById: Yup.string(),
    status: Yup.string(),
    type: Yup.string(),
    subramoId: Yup.string(),
    startDate: Yup.string(),
    claimNumber: Yup.string(),
    requestType: Yup.string(),
    folioNumber: Yup.string(),
    medicalCondition: Yup.string(),
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
    if (!data) return;

    if (data?.startDate)
      setValue(
        "startDate",
        moment(data?.startDate).subtract(utcOffset, "minutes").format()
      );
    if (data?.claimNumber) setValue("claimNumber", data?.claimNumber);
    if (data?.requestType) setValue("requestType", data?.requestType);
    if (data?.folioNumber) setValue("folioNumber", data?.folioNumber);
    if (data?.folioSubsequent)
      setValue("folioSubsequent", data?.folioSubsequent);
    if (data?.ot) setValue("ot", data?.ot);
    if (data?.sigre) setValue("sigre", data?.sigre);
    if (data?.status) setValue("status", data?.status);
    if (data?.subRamo?.name) setValue("subRamoId", data?.subRamo?.id);
    if (data?.polizaType?.id) setValue("polizaTypeId", data?.polizaType?.id);
    if (data?.type) setValue("type", data?.type);
    if (data?.medicalCondition)
      setValue("medicalCondition", data?.medicalCondition);
    if (data?.agenteIntermediario?.name)
      setValue("agenteIntermediarioId", data?.agenteIntermediario?.id);
    if (data?.observations) setValue("observations", data?.observations);
    if (data?.assignedBy) setValue("assignedById", data?.assignedBy?.id);
    if (data?.agenteRelacionado)
      setValue("agenteRelacionadoId", data?.agenteRelacionado?.id);
    if (data?.observer) setValue("observerId", data?.observer?.id);
    if (data?.requireReimbursementSubsequent)
      setValue(
        "requireReimbursementSubsequent",
        data?.requireReimbursementSubsequent
      );
  }, [data]);

  const handleFormSubmit = async (data) => {
    const { startDate, ...otherData } = data;
    const body = {
      ...otherData,
    };
    if (startDate) {
      body.startDate = moment(startDate).format("YYYY-MM-DD");
    }
    try {
      console.log("Reembolso body", body);
      const response = await putRefund(id, body);
      if (response.hasError) {
        console.log(response);
        toast.error(
          "Se ha producido un error al actualizar el reembolso, inténtelo de nuevo."
        );
        return;
      }
      setIsEdit(false);
      router.back();
      updateRefund();
      toast.success("Reembolso actualizado correctamente.");
    } catch (error) {
      toast.error(
        "Se ha producido un error al actualizar el reembolso, inténtelo de nuevo."
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
          {isEdit && (
            <Fragment>
              <TextInput
                type="text"
                label={t("operations:programations:general:claim-number")}
                name="claimNumber"
                register={register}
                disabled={!isEdit}
              />
              <TextInput
                type="text"
                label={t("operations:programations:general:sheet-number")}
                name="folioNumber"
                register={register}
                disabled={!isEdit}
              />
            </Fragment>
          )}
          <Controller
            render={({ field: { value, onChange, ref, onBlur } }) => {
              return (
                <InputDate
                  label={t("operations:programations:general:init-date")}
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
            defaultValue=""
          />
          <TextInput
            type="text"
            label={t(
              "operations:programations:general:sheet-number-subsecuent"
            )}
            name="folioSubsequent"
            disabled={!isEdit}
            register={register}
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
                id: "inicial",
                name: "Inicial",
              },
              {
                id: "subsecuente",
                name: "Subsecuente",
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
            label={t("operations:programations:general:diagnosis")}
            name="medicalCondition"
            disabled={!isEdit}
            register={register}
          />

          <AgentSelectAsync
            label={t("operations:programations:general:responsible")}
            name="assignedById"
            disabled={!isEdit}
            error={errors.assignedById}
            setValue={setValue}
            watch={watch}
          />
          <IntermediarySelectAsync
            label={t("operations:programations:general:intermediary")}
            name="agenteIntermediarioId"
            disabled={!isEdit}
            setValue={setValue}
            watch={watch}
            error={errors.agenteIntermediarioId}
          />

          <AgentSelectAsync
            label={t("operations:programations:general:sub-agent")}
            name="agenteRelacionadoId"
            disabled={!isEdit}
            error={errors.agenteRelacionadoId}
            setValue={setValue}
            watch={watch}
          />

          <SelectInput
            label={t("operations:programations:general:observer")}
            name="observerId"
            options={lists?.users ?? []}
            disabled={!isEdit}
            setValue={setValue}
            watch={watch}
            error={errors.observerId}
          />
          <div
            className={clsx(
              "rounded-md px-3 py-2 bg-white mt-2 grid grid-cols-1 gap-2",
              {
                "drop-shadow-md": isEdit,
              }
            )}
          >
            <p className={clsx("text-xs leading-6 text-gray-900 ")}>
              MARCAR EN CASO DE REQUERIR UN REEMBOLSO SUBSECUENTE
            </p>
            <CheckboxInput
              name="requireReimbursementSubsequent"
              setValue={setValue}
              label={"Requiere reembolso sub-secuente"}
              disabled={!isEdit}
              defaultValue={data?.requireReimbursementSubsequent}
            />
          </div>
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
        crmType="poliza_reimbursement"
        className="lg:col-span-7"
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
