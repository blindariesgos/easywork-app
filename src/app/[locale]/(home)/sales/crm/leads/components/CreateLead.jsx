"use client";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import SelectInput from "@/src/components/form/SelectInput";
import MultiplePhonesInput from "@/src/components/form/MultiplePhonesInput";
import MultipleEmailsInput from "@/src/components/form/MultipleEmailsInput";

import { PencilIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ActivityPanel from "@/src/components/activities/ActivityPanel";
import Button from "@/src/components/form/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ProgressStages from "./ProgressStages";
import TextInput from "@/src/components/form/TextInput";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import useAppContext from "@/src/context/app";
import { createLead, getLeadById, updateLead } from "@/src/lib/apis";
import { useSWRConfig } from "swr";
import AddDocuments from "./AddDocuments";
import InputCurrency from "@/src/components/form/InputCurrency";
import Image from "next/image";
import { VALIDATE_EMAIL_REGEX } from "@/src/utils/regularExp";
import { handleApiError } from "@/src/utils/api/errors";
import ValidatePolizaData from "./ValidatePolizaData";
import useLeadContext from "@/src/context/leads";
import { LinkIcon } from "@heroicons/react/24/outline";
import AgentSelectAsync from "@/src/components/form/AgentSelectAsync";
import ContactSelectAsync from "@/src/components/form/ContactSelectAsync";
import { activitySectors } from "@/src/utils/stages";

export default function CreateLead({ lead, id }) {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState();
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { lists } = useAppContext();
  const {
    isOpenValidation,
    setIsOpenValidation,
    policyInfo,
    mutate: mutateLeads,
  } = useLeadContext();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [type, setType] = useState("fisica");

  useEffect(() => {
    setIsEdit(id ? false : true);
  }, [id]);

  useEffect(() => {
    if (!params.get("type")) return;

    setType(params.get("type"));
    setValue("typePerson", params.get("type"));
  }, [params.get("type")]);

  useEffect(() => {
    if (params.get("edit") === "true") {
      setIsEdit(true);
    }
  }, [params.get("edit")]);

  const schema = Yup.object().shape({
    fullName: Yup.string(),
    name: Yup.string()
      .required(t("common:validations:required"))
      .min(2, t("common:validations:min", { min: 2 })),
    lastName: Yup.string().when("typePerson", {
      is: (value) => value === "fisica",
      then: (schema) =>
        schema
          .required(t("common:validations:required"))
          .min(2, t("common:validations:min", { min: 2 })),
      otherwise: (schema) => schema,
    }),
    cargo: Yup.string(),
    rfc: Yup.string(),
    typeId: Yup.string(),
    polizaTypeId: Yup.string(),
    sourceId: Yup.string(),
    typePerson: Yup.string(),
    address: Yup.string(),
    assignedById: Yup.string(),
    observerId: Yup.string(),
    observations: Yup.string(),
    quoteAmount: Yup.string(),
    quoteCurrencyId: Yup.string(),
    emails_dto: Yup.array().of(
      Yup.object().shape({
        email: Yup.string()
          .matches(VALIDATE_EMAIL_REGEX, t("common:validations:email"))
          .nullable() // Permite que el campo sea nulo
          .notRequired(),
        relation: Yup.string(),
      })
    ),
    phones_dto: Yup.array().of(
      Yup.object().shape({
        number: Yup.string(),
        relation: Yup.string(),
      })
    ),
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
    defaultValues: {
      emails_dto: lead?.emails?.length
        ? lead?.emails?.map((e) => ({
            email: e?.email?.email,
            relation: e?.relation ?? "",
          }))
        : [
            {
              email: null,
              relation: "",
            },
          ],
      phones_dto: lead?.phones?.length
        ? lead?.phones?.map((e) => ({
            number: e?.phone?.number,
            relation: e?.relation ?? "",
          }))
        : [
            {
              number: "",
              relation: "",
            },
          ],
    },
  });

  useEffect(() => {
    if (!params.get("copy")) return;
    setLoading(true);
    const getLeadCopy = async (leadId) => {
      const response = await getLeadById(leadId);
      if (response?.name) {
        setValue("name", response?.name);
      } else {
        setValue("name", response?.fullName);
      }
      if (response?.lastName) setValue("lastName", response?.lastName);
      setLoading(false);
    };
    getLeadCopy(params.get("copy"));
  }, [params.get("copy")]);

  useEffect(() => {
    if (!lead) return;
    if (lead?.fullName) setValue("fullName", lead?.fullName);
    if (lead?.name) {
      setValue("name", lead?.name);
    } else {
      setValue("name", lead?.fullName);
    }
    if (lead?.relatedContact) {
      setValue("contact", lead?.relatedContact?.id);
    }
    if (lead?.lastName) setValue("lastName", lead?.lastName);
    if (lead?.polizaType) setValue("polizaTypeId", lead?.polizaType?.id);
    if (lead?.cargo) setValue("cargo", lead?.cargo);
    if (lead?.type?.id) setValue("typeId", lead?.type?.id);
    if (lead?.source?.id) setValue("sourceId", lead?.source?.id);
    if (lead?.birthdate) setValue("birthdate", lead?.birthdate);
    if (lead?.address) setValue("address", lead?.address);
    if (lead?.rfc) setValue("rfc", lead?.rfc);
    if (lead?.typePerson) {
      setType(lead?.typePerson);
      setValue("typePerson", lead?.typePerson);
    }
    if (lead?.quoteCurrency)
      setValue("quoteCurrencyId", lead?.quoteCurrency.id);
    if (lead?.quoteAmount) setValue("quoteAmount", lead?.quoteAmount);
    if (lead?.observations) setValue("observations", lead?.observations);
    if (lead?.assignedBy) setValue("assignedById", lead?.assignedBy?.id);
    if (lead?.agenteIntermediario)
      setValue("agenteIntermediarioId", lead?.agenteIntermediario?.id);
    if (lead?.observer) setValue("observerId", lead?.observer?.id);
    if (lead?.subAgent) setValue("subAgentId", lead?.subAgent?.id);
    if (lead?.activitySector) setValue("activitySector", lead?.activitySector);

    setSelectedProfileImage({ base64: lead?.photo || null, file: null });
  }, [lead]);

  const handleProfileImageChange = useCallback((event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedProfileImage({ base64: e.target.result, file: file });
      };

      reader.readAsDataURL(file);
    }
  }, []);

  const handleFormSubmit = async (data) => {
    const { contact, subAgent, ...info } = data;
    let body = {
      ...info,
      relatedContactId: contact?.id ?? null,
    };

    if (selectedProfileImage?.file) {
      body = {
        ...body,
        photo: selectedProfileImage?.file || "",
      };
    }
    console.log({ body });
    const formData = new FormData();
    for (const key in body) {
      if (body[key] === null || body[key] === undefined || body[key] === "") {
        continue;
      }
      if (body[key] instanceof File || body[key] instanceof Blob) {
        formData.append(key, body[key]);
      } else if (Array.isArray(body[key])) {
        formData.append(key, JSON.stringify(body[key]));
      } else {
        formData.append(key, body[key]?.toString() || "");
      }
    }

    try {
      setLoading(true);
      if (!lead) {
        const response = await createLead(formData);
        if (response.hasError) {
          let message = response.message;
          if (response.errors) {
            message = response.errors.join(", ");
          }
          toast.error(message);
          setLoading(false);
          return;
        }
        toast.success("Prospecto creado con éxito");
        mutateLeads();
        setLoading(false);
        router.back();
      } else {
        const response = await updateLead(formData, id);
        if (response.hasError) {
          let message = response.message;
          if (response.errors) {
            message = response.errors.join(", ");
          }
          toast.error(message);
          setLoading(false);
          return;
        }
        toast.success("¡Prospecto actualizado!");
        mutate(`/sales/crm/leads/${id}`);
        mutateLeads();
        setLoading(false);
        router.back();
      }
    } catch (error) {
      handleApiError(error.message);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copiado en el Portapapeles");
  };

  return (
    <div
      className={clsx("flex flex-col h-screen relative w-full", {
        "max-w-xl": !lead,
      })}
    >
      {loading && <LoaderSpinner />}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="  bg-gray-600 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px]  overflow-y-auto md:overflow-hidden"
      >
        {!lead && (
          <div className="flex gap-2 items-center py-4">
            <h1 className="text-xl pl-4">{t("leads:lead:new")}</h1>
          </div>
        )}
        {lead && (
          <div className="bg-transparent p-4">
            <div className="flex items-start flex-col justify-between gap-y-4 relative">
              <div className="flex gap-3 pl-4 items-center">
                <h1 className="text-xl font-semibold">
                  {lead ? lead.fullName : t("leads:lead:new")}
                </h1>
                <LinkIcon
                  className="h-4 w-4 text-[#4f4f4f] opacity-50 hover:opacity-100 cursor-pointer"
                  title="Copiar enlace de prospecto en Portapapeles"
                  aria-hidden="true"
                  onClick={handleCopyUrl}
                />
              </div>
              <div className="w-full relative">
                <ProgressStages
                  stage={lead?.stage}
                  leadId={id}
                  setValue={setValue}
                  disabled={
                    lead?.cancelled || /Positivo/gi.test(lead?.stage?.name)
                  }
                />
              </div>
              <div className="bg-white rounded-md shadow-sm w-full">
                <div className="flex gap-6 py-4 px-4 flex-wrap items-center">
                  <p className="text-gray-400 font-medium hover:text-primary">
                    {t("leads:header:general")}
                  </p>
                  <AddDocuments leadId={id} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="px-4 w-full h-full">
          <div
            className={clsx(
              "grid grid-cols-1 h-full  w-full bg-gray-100 rounded-xl lg:overflow-hidden",
              {
                "lg:grid-cols-12": lead,
              }
            )}
          >
            {/* Menu Izquierda */}
            <div
              className={clsx(
                "overflow-y-scroll rounded-lg px-4 pt-4 lg:col-span-5",
                {
                  "md:pb-[280px]": lead,
                  "md:pb-[140px]": !lead,
                }
              )}
            >
              <div className="flex justify-between bg-white py-4 px-3 rounded-md">
                <h1 className="">{t("leads:lead:lead-data")}</h1>
                {lead && (
                  // !lead.cancelled &&
                  // !/Positivo/gi.test(lead?.stage?.name) &&
                  <button
                    type="button"
                    disabled={!id}
                    onClick={() => setIsEdit(!isEdit)}
                  >
                    <PencilIcon className="h-6 w-6 text-primary" />
                  </button>
                )}
              </div>
              <div className="flex justify-center">
                {isEdit ? (
                  <ProfileImageInput
                    selectedProfileImage={selectedProfileImage}
                    onChange={handleProfileImageChange}
                    disabled={!isEdit}
                    label={"Seleccionar foto o logo"}
                  />
                ) : (
                  <div className="pb-2 pt-4">
                    <Image
                      width={96}
                      height={96}
                      src={selectedProfileImage?.base64 || "/img/avatar.svg"}
                      alt="Profile picture"
                      className="h-[150px] w-[150px] flex-none rounded-full text-white fill-white bg-zinc-200 object-cover items-center justify-center"
                      objectFit="fill"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-3 pt-4">
                {type === "fisica" ? (
                  <Fragment>
                    {isEdit && (
                      <Fragment>
                        <TextInput
                          type="text"
                          label={t("contacts:create:name")}
                          placeholder={t("contacts:create:placeholder-name")}
                          error={errors.name}
                          register={register}
                          name="name"
                          disabled={!isEdit}
                        />

                        <TextInput
                          type="text"
                          label={t("contacts:create:lastName")}
                          placeholder={t("contacts:create:placeholder-name")}
                          error={errors.lastName}
                          register={register}
                          name="lastName"
                          disabled={!isEdit}
                        />
                      </Fragment>
                    )}
                    {!isEdit && (
                      <TextInput
                        type="text"
                        label={t("contacts:create:fullname")}
                        placeholder={t("contacts:create:placeholder-name")}
                        error={errors.fullName}
                        register={register}
                        name="fullName"
                        disabled={!isEdit}
                      />
                    )}
                    {isEdit && (
                      <SelectInput
                        label={t("contacts:create:typePerson")}
                        options={[
                          {
                            name: "Física",
                            id: "fisica",
                          },
                          {
                            name: "Moral",
                            id: "moral",
                          },
                        ]}
                        setSelectedOption={(option) => setType(option.id)}
                        watch={watch}
                        name="typePerson"
                        setValue={setValue}
                        error={errors.typePerson}
                      />
                    )}
                    <TextInput
                      label={t("leads:lead:fields:position")}
                      placeholder={t("leads:lead:fields:position")}
                      error={errors.cargo}
                      register={register}
                      name="cargo"
                      disabled={!isEdit}
                    />
                    <MultiplePhonesInput
                      label={t("contacts:create:phone")}
                      errors={errors.phones_dto}
                      register={register}
                      name="phones_dto"
                      disabled={!isEdit}
                      control={control}
                      watch={watch}
                      setValue={setValue}
                    />

                    <MultipleEmailsInput
                      label={t("contacts:create:email")}
                      errors={errors.emails_dto}
                      register={register}
                      name="emails_dto"
                      disabled={!isEdit}
                      control={control}
                      watch={watch}
                      setValue={setValue}
                    />
                    <TextInput
                      label={t("leads:lead:fields:rfc")}
                      placeholder="XEXX010101000"
                      error={errors.rfc}
                      register={register}
                      name="rfc"
                      disabled={!isEdit}
                      // value={watch('rfc')}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    {isEdit && (
                      <TextInput
                        type="text"
                        label={t("contacts:create:fullname-company")}
                        placeholder={t("contacts:create:placeholder-name")}
                        error={errors.name}
                        register={register}
                        name="name"
                        disabled={!isEdit}
                      />
                    )}
                    {!isEdit && (
                      <TextInput
                        type="text"
                        label={t("contacts:create:fullname-company")}
                        placeholder={t("contacts:create:placeholder-name")}
                        error={errors.fullName}
                        register={register}
                        name="fullName"
                        disabled={!isEdit}
                      />
                    )}
                    <TextInput
                      label={t("leads:lead:fields:rfc")}
                      placeholder="XEXX010101000"
                      error={errors.rfc}
                      register={register}
                      name="rfc"
                      disabled={!isEdit}
                      // value={watch('rfc')}
                    />
                    <MultiplePhonesInput
                      label={t("contacts:create:phone")}
                      errors={errors.phones_dto}
                      register={register}
                      name="phones_dto"
                      disabled={!isEdit}
                      control={control}
                      watch={watch}
                      setValue={setValue}
                    />

                    <MultipleEmailsInput
                      label={t("contacts:create:email")}
                      errors={errors.emails_dto}
                      register={register}
                      name="emails_dto"
                      disabled={!isEdit}
                      control={control}
                      watch={watch}
                      setValue={setValue}
                    />
                  </Fragment>
                )}
                <TextInput
                  label={t("leads:lead:fields:address")}
                  error={errors.address}
                  register={register}
                  name="address"
                  placeholder={t("leads:lead:fields:placeholder-address")}
                  disabled={!isEdit}
                  // value={watch('address')}
                />
                <SelectInput
                  label={t("leads:lead:fields:origin")}
                  name="sourceId"
                  options={lists?.listLead?.leadSources}
                  error={errors.sourceId}
                  register={register}
                  setValue={setValue}
                  disabled={!isEdit}
                  watch={watch}
                />
                <SelectInput
                  label={t("leads:lead:fields:contact-type")}
                  options={lists?.listLead?.leadTypes}
                  name="typeId"
                  error={errors.typeId}
                  register={register}
                  setValue={setValue}
                  disabled={!isEdit}
                  watch={watch}
                />
                <SelectDropdown
                  label={t("contacts:create:responsible")}
                  name="assignedById"
                  options={lists?.users}
                  register={register}
                  disabled={!isEdit}
                  error={errors.assignedById}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectDropdown
                  label={t("contacts:create:observer")}
                  name="observerId"
                  options={lists?.users}
                  register={register}
                  disabled={!isEdit}
                  error={errors.observerId}
                  setValue={setValue}
                  watch={watch}
                />
                <AgentSelectAsync
                  label={t("contacts:create:sub-agent")}
                  name="subAgentId"
                  register={register}
                  disabled={!isEdit}
                  error={errors.subAgentId}
                  setValue={setValue}
                  watch={watch}
                />

                <SelectInput
                  label={t("contacts:create:intermediario")}
                  name="agenteIntermediarioId"
                  options={lists?.policies?.agentesIntermediarios || []}
                  register={register}
                  disabled={!isEdit}
                  error={errors.agenteIntermediarioId}
                  setValue={setValue}
                  watch={watch}
                />

                <SelectInput
                  label={t("operations:policies:general:type")}
                  name="polizaTypeId"
                  options={lists?.policies?.polizaTypes ?? []}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  disabled={!isEdit}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2">
                  <div className="md:col-span-2">
                    <InputCurrency
                      type="text"
                      label={t("leads:lead:fields:amount")}
                      setValue={setValue}
                      name="quoteAmount"
                      disabled={!isEdit}
                      defaultValue={
                        lead?.quoteAmount && lead?.quoteAmount?.length
                          ? (+lead?.quoteAmount)?.toFixed(2)
                          : null
                      }
                      prefix={
                        lists?.policies?.currencies?.find(
                          (x) => x.id == watch("quoteCurrencyId")
                        )?.symbol ?? ""
                      }
                    />
                  </div>
                  <SelectInput
                    label={t(
                      "control:portafolio:receipt:details:form:currency"
                    )}
                    name="quoteCurrencyId"
                    options={lists?.policies?.currencies ?? []}
                    disabled={!isEdit}
                    register={register}
                    setValue={setValue}
                    watch={watch}
                  />
                </div>
                {type == "moral" && (
                  <SelectInput
                    label={t("contacts:create:company-activity")}
                    options={activitySectors.map((activity) => ({
                      name: activity,
                      id: activity,
                    }))}
                    watch={watch}
                    name="activitySector"
                    disabled={!isEdit}
                    setValue={setValue}
                    error={!watch("activitySector") && errors.activitySector}
                  />
                )}
                {type == "moral" && isEdit && (
                  <ContactSelectAsync
                    label={"Cliente contacto"}
                    name={"contact"}
                    setValue={setValue}
                    watch={watch}
                    error={errors?.contact}
                    notFoundHelperText={() => (
                      <div>
                        <p className="px-4 py-2 text-gray-700 text-xs">
                          {t("common:not-found")}
                          {". "}
                          <span
                            className="text-primary underline cursor-pointer"
                            onClick={() =>
                              router.push(
                                "/sales/crm/contacts/contact?show=true&type=fisica"
                              )
                            }
                          >
                            {"Crear el cliente contacto"}
                          </span>
                        </p>
                      </div>
                    )}
                  />
                )}
                <TextInput
                  label={t("leads:lead:fields:comments")}
                  error={errors.observations}
                  register={register}
                  name="observations"
                  disabled={!isEdit}
                  multiple
                />
              </div>
            </div>

            {/* Menu Derecha */}
            {lead && (
              <ActivityPanel
                entityId={id}
                crmType="lead"
                className="lg:col-span-7 md:pb-[280px]"
              />
            )}
          </div>
        </div>

        {/* Botones de acción */}
        {(isEdit || !lead) && (
          <div className="flex justify-center px-4 py-4 gap-4 sticky -bottom-4 md:bottom-0 bg-white">
            <Button
              type="button"
              label={t("common:buttons:cancel")}
              disabled={loading}
              buttonStyle="secondary"
              onclick={() => router.back()}
              className="px-3 py-2"
            />
            <Button
              type="submit"
              label={
                loading ? t("common:buttons:saving") : t("common:buttons:save")
              }
              disabled={loading}
              buttonStyle="primary"
              className="px-3 py-2"
            />
          </div>
        )}
      </form>
      <ValidatePolizaData
        isOpen={isOpenValidation}
        setIsOpen={setIsOpenValidation}
        policy={policyInfo}
        leadId={id}
      />
    </div>
  );
}
