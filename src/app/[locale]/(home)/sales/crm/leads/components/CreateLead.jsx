"use client";
import LoaderSpinner from "../../../../../../../components/LoaderSpinner";
import ProfileImageInput from "../../../../../../../components/ProfileImageInput";
import InputPhone from "../../../../../../../components/form/InputPhone";
import SelectDropdown from "../../../../../../../components/form/SelectDropdown";
import SelectInput from "../../../../../../../components/form/SelectInput";
import { PencilIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ActivityPanel from "../../../../../../../components/contactActivities/ActivityPanel";
import Button from "../../../../../../../components/form/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ProgressStages from "./ProgressStages";
import TextInput from "../../../../../../../components/form/TextInput";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import useAppContext from "@/src/context/app";
import { createLead, updateContact, updateLead } from "@/src/lib/apis";
import { useSWRConfig } from "swr";
import AddDocuments from "./AddDocuments";
import InputCurrency from "@/src/components/form/InputCurrency";

export default function CreateLead({ lead, id, updateLead: mutateLead }) {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState();
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { lists } = useAppContext();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setIsEdit(id ? false : true);
  }, [id]);

  const schema = Yup.object().shape({
    email: Yup.string().email(t("common:validations:email")),
    name: Yup.string()
      .required(t("common:validations:required"))
      .min(2, t("common:validations:min", { min: 2 })),
    lastName: Yup.string()
      .required(t("common:validations:required"))
      .min(2, t("common:validations:min", { min: 2 })),
    cargo: Yup.string(),
    phone: Yup.string(),
    rfc: Yup.string(),
    typeId: Yup.string(),
    sourceId: Yup.string(),
    typePerson: Yup.string(),
    address: Yup.string(),
    assignedById: Yup.string(),
    amount: Yup.string(),
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
    if (!lead) return;
    if (lead?.fullName) setValue("fullName", lead?.fullName);
    if (lead?.name) setValue("name", lead?.name);
    if (lead?.lastName) setValue("lastName", lead?.lastName);
    if (lead?.cargo) setValue("cargo", lead?.cargo);
    if (lead?.phones?.length) setValue("phone", lead?.phones[0]?.phone?.number);
    if (lead?.emails[0]?.email?.email)
      setValue("email", lead?.emails[0]?.email?.email);
    if (lead?.type?.id) setValue("typeId", lead?.type?.id);
    if (lead?.source?.id) setValue("sourceId", lead?.source?.id);
    if (lead?.birthdate) setValue("birthdate", lead?.birthdate);
    if (lead?.address) setValue("address", lead?.address);
    if (lead?.rfc) setValue("rfc", lead?.rfc);
    if (lead?.typePerson) setValue("typePerson", lead?.typePerson);
    if (lead?.assignedBy) setValue("assignedById", lead?.assignedBy.id);
    if (lead?.currency) setValue("currencyId", lead?.currency.id);
    if (lead?.quote) setValue("quote", lead?.quote);
    // if (lead?.observador) setValue("observadorId", lead?.observador.id);

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
    const { phone, email, ...otherData } = data;
    const phones = lead?.phones?.length
      ? lead?.phones.map((p, index) => ({
          number: index == 0 ? data.phone : p.phone?.number,
        }))
      : [{ number: phone }];
    const amails = lead?.emails?.length
      ? lead?.emails.map((e, index) => ({
          email: index == 0 ? phone : e.email?.email,
        }))
      : [{ email }];

    let body = {
      ...otherData,
      emails_dto: amails,
      phones_dto: phones,
    };

    if (selectedProfileImage?.file && !lead) {
      body = {
        ...body,
        photo: selectedProfileImage?.file || "",
      };
    }

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
          throw { message };
        }
        await mutate(`/sales/crm/leads?limit=5&page=1`);
        toast.success("Prospecto creado con exito");
      } else {
        console.log({ body });
        const response = await updateLead(body, id);
        if (response.hasError) {
          console.log({ response });
          let message = response.message;
          if (response.errors) {
            message = response.errors.join(", ");
          }
          throw { message };
        }
        toast.success(t("contacts:edit:updated-contact"));
        await mutate(`/sales/crm/leads?limit=5&page=1`);
        mutateLead();
      }
      setLoading(false);
      router.back();
    } catch (error) {
      console.log({ error });
      console.error(error.message);
      handleApiError(error.message);
      setLoading(false);
    }
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
              <div className="flex gap-2 items-center">
                <h1 className="text-xl pl-4">
                  {lead ? lead.fullName : t("leads:lead:new")}
                </h1>
                {/* <div>
                <PencilIcon className="h-4 w-4 text-gray-200" />
              </div> */}
              </div>
              <div className="w-full relative">
                <ProgressStages
                  stage={lead.stage}
                  mutate={mutateLead}
                  leadId={id}
                  setValue={setValue}
                  disabled={lead.cancelled}
                />
              </div>
              <div className="bg-white rounded-md shadow-sm w-full">
                <div className="flex gap-6 py-4 px-4 flex-wrap items-center">
                  <p className="text-gray-400 font-medium hover:text-primary">
                    {t("leads:header:sales")}
                  </p>
                  <AddDocuments />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="px-4 w-full h-full">
          <div
            className={clsx(
              "grid grid-cols-1 h-full  w-full bg-gray-100 rounded-xl md:overflow-hidden",
              {
                "md:grid-cols-2": lead,
              }
            )}
          >
            {/* Menu Izquierda */}
            <div
              className={clsx("overflow-y-scroll rounded-lg px-4 pt-4 ", {
                "md:pb-[280px]": lead,
                "md:pb-[140px]": !lead,
              })}
            >
              <div className="flex justify-between bg-white py-4 px-4 rounded-md">
                <h1 className="">{t("leads:lead:lead-data")}</h1>
                <button
                  type="button"
                  disabled={!id}
                  onClick={() => setIsEdit(!isEdit)}
                >
                  <PencilIcon className="h-6 w-6 text-primary" />
                </button>
              </div>
              <div className="flex justify-center">
                <ProfileImageInput
                  selectedProfileImage={selectedProfileImage}
                  onChange={handleProfileImageChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-3 lg:px-12 px-2">
                <TextInput
                  type="text"
                  label={t("leads:lead:fields:name")}
                  placeholder={t("leads:lead:fields:placeholder-name")}
                  error={errors.name}
                  register={register}
                  name="name"
                  disabled={!isEdit}
                  // value={watch('name')}
                />

                <TextInput
                  type="text"
                  label={t("leads:lead:fields:lastName")}
                  placeholder={t("leads:lead:fields:placeholder-name")}
                  error={errors.name}
                  register={register}
                  name="lastName"
                  disabled={!isEdit}
                  // value={watch('name')}
                />
                <TextInput
                  label={t("leads:lead:fields:position")}
                  placeholder={t("leads:lead:fields:position")}
                  error={errors.cargo}
                  register={register}
                  name="cargo"
                  disabled={!isEdit}
                />
                <Controller
                  render={({ field: { ref, ...field } }) => {
                    return (
                      <InputPhone
                        name="phone"
                        field={field}
                        error={errors.phone}
                        label={t("leads:lead:fields:phone-number")}
                        defaultValue={field.value}
                        disabled={!isEdit}
                      />
                    );
                  }}
                  name="phone"
                  control={control}
                  defaultValue=""
                />
                <TextInput
                  label={t("leads:lead:fields:email")}
                  placeholder={"Ej: example@gmail.com"}
                  error={errors.email}
                  register={register}
                  name="email"
                  // value={watch('email')}
                  disabled={!isEdit}
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
                  label={t("leads:lead:fields:responsible")}
                  name="assignedById"
                  options={lists?.users ?? []}
                  register={register}
                  disabled={!isEdit}
                  error={!watch("assignedById") && errors.assignedById}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={t("contacts:create:typePerson")}
                  options={[
                    {
                      name: "Fisica",
                      id: "fisica",
                    },
                    {
                      name: "Moral",
                      id: "moral",
                    },
                  ]}
                  watch={watch}
                  name="typePerson"
                  disabled={!isEdit}
                  setValue={setValue}
                  error={!watch("typePerson") && errors.typePerson}
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
                  label={t("leads:lead:fields:amount")}
                  setValue={setValue}
                  name="quote"
                  disabled={!isEdit}
                  defaultValue={
                    lead?.quote && lead?.quote?.length
                      ? (+lead?.quote)?.toFixed(2)
                      : null
                  }
                  prefix={
                    lists?.policies?.currencies?.find(
                      (x) => x.id == watch("currencyId")
                    )?.symbol ?? ""
                  }
                />
              </div>
            </div>

            {/* Menu Derecha */}
            {lead && <ActivityPanel contactId={id} crmType="leads" />}
          </div>
        </div>

        {/* Botones de acción */}
        {(isEdit || !lead) && (
          <div className="flex justify-center px-4 py-4 gap-4 sticky -bottom-4 md:bottom-0 bg-white">
            <Button
              type="submit"
              label={
                loading ? t("common:buttons:saving") : t("common:buttons:save")
              }
              disabled={loading}
              buttonStyle="primary"
              className="px-3 py-2"
            />
            <Button
              type="button"
              label={t("common:buttons:cancel")}
              disabled={loading}
              buttonStyle="secondary"
              onclick={() => router.push(`/sales/crm/leads?page=1`)}
              className="px-3 py-2"
            />
          </div>
        )}
      </form>
    </div>
  );
}
