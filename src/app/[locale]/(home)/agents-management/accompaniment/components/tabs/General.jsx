"use client";
import useAppContext from "@/src/context/app";
import { PencilIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import TextInput from "@/src/components/form/TextInput";
import InputPhone from "@/src/components/form/InputPhone";
import MultipleEmailsInput from "@/src/components/form/MultipleEmailsInput";
import MultiplePhonesInput from "@/src/components/form/MultiplePhonesInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import SelectInput from "@/src/components/form/SelectInput";
import InputDate from "@/src/components/form/InputDate";
import { FaCalendarDays } from "react-icons/fa6";
import ActivityPanel from "@/src/components/activities/ActivityPanel";
import { handleApiError } from "@/src/utils/api/errors";
import {
  createContact,
  createUser,
  getContactId,
  updateContact,
  updateUser,
} from "@/src/lib/apis";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import Image from "next/image";
import { clsx } from "clsx";

export default function General({ agent, id, refPrint }) {
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if (params.get("edit") === "true") {
      setIsEdit(true);
    }
  }, [params.get("edit")]);

  const schema = Yup.object().shape({
    name: Yup.string()
      .required(t("common:validations:required"))
      .min(2, t("common:validations:min", { min: 2 })),
    curp: Yup.string(),
    cua: Yup.string(),
    typeId: Yup.string(),
    sourceId: Yup.string(),
    address: Yup.string(),
    responsibleId: Yup.string(),
    birthday: Yup.string(),
    bio: Yup.string(),
    lastName: Yup.string(),
    firstName: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),
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
    if (!id) {
      setIsEdit(true);
      return;
    }
    setLoading(true);

    if (agent?.fullName) setValue("name", agent?.fullName);
    if (agent?.cargo) setValue("position", agent?.cargo);
    if (agent?.phone) setValue("phone", agent?.phone);
    if (agent?.email) setValue("email", agent?.email);
    if (agent?.curp) setValue("curp", agent?.curp);
    if (agent?.cua) setValue("cua", agent?.cua);
    if (agent?.type?.id) setValue("typeId", agent?.type?.id);
    if (agent?.source?.id) setValue("sourceId", agent?.source?.id);
    if (agent?.profile?.birthday)
      setValue("birthday", agent?.profile?.birthday);
    if (agent?.address) setValue("address", agent?.address);
    if (agent?.bio) setValue("bio", agent?.bio);
    if (agent?.profile?.firstName)
      setValue("firstName", agent?.profile?.firstName);
    if (agent?.profile?.lastName)
      setValue("lastName", agent?.profile?.lastName);
    if (agent?.avatar) setSelectedProfileImage({ base64: agent?.avatar });
    if (agent?.age) setValue("age", agent?.age);
    if (agent?.children) setValue("children", agent?.children);

    setLoading(false);
  }, [agent, id]);

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

  const getFormData = (body) => {
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
    return formData;
  };

  const handleFormSubmit = async (data) => {
    let body = { ...data };

    try {
      setLoading(true);
      if (!agent) {
        if (selectedProfileImage?.file) {
          body = {
            ...body,
            avatar: selectedProfileImage?.file || "",
          };
        }
        const formData = getFormData(body);
        const response = await createUser(formData);
        if (response.hasError) {
          let message = response.message;
          if (response.errors) {
            message = response.errors.join(", ");
          }
          throw { message };
        }
        // await mutate(`/sales/crm/contacts?limit=5&page=1`);
        toast.success("Agente creado exitosamente");
      } else {
        if (selectedProfileImage?.file) {
          body = {
            ...body,
            image: selectedProfileImage?.file || "",
          };
        }
        const formData = getFormData(body);
        const response = await updateUser(id, formData);
        if (response.hasError) {
          let message = response.message;
          if (response.errors) {
            message = response.errors.join(", ");
          }
          throw { message };
        }
        toast.success("Agente actualizado correctamente");
        // await mutate(`/sales/crm/contacts?limit=5&page=1`);
        // await mutate(`/sales/crm/contacts/${id}`);
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

  // Calculate the agent's 18th birthday
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  return (
    <Fragment>
      <div className="px-4 lg:px-8 h-full w-full">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className={clsx(
            "grid grid-cols-1 lg:h-full bg-gray-100 rounded-lg  w-full",
            {
              "lg:grid-cols-12": agent,
            }
          )}
          ref={refPrint}
        >
          {/* Panel Principal */}

          {/* Menu Izquierda */}
          <div className=" bg-gray-100 p-4 lg:overflow-y-scroll rounded-lg lg:col-span-5 ">
            <div className="flex justify-between bg-white py-4 px-3 rounded-md">
              <h1 className="">
                {t("agentsmanagement:accompaniments:agent:data")}
              </h1>
              {agent && (
                <button
                  type="button"
                  disabled={!id}
                  onClick={() => setIsEdit(!isEdit)}
                  title="Editar"
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
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 pb-20 pt-4">
              <TextInput
                type="text"
                label={t("users:form:firstname")}
                placeholder={t("contacts:create:placeholder-name")}
                error={errors.firstName && errors.firstName.message}
                register={register}
                name="firstName"
                disabled={!isEdit}
              />
              <TextInput
                type="text"
                label={t("users:form:lastname")}
                placeholder={t("contacts:create:placeholder-name")}
                error={errors.lastName && errors.lastName.message}
                register={register}
                name="lastName"
                disabled={!isEdit}
              />
              <Controller
                render={({ field: { ref, ...field } }) => {
                  return (
                    <InputPhone
                      name="phone"
                      field={field}
                      error={errors.phone}
                      label={t("contacts:create:phone")}
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
                label={t("contacts:create:email")}
                placeholder={t("contacts:create:placeholder-lastname")}
                error={errors.email}
                register={register}
                name="email"
                disabled={!isEdit}
              />

              <TextInput
                label={t("agentsmanagement:accompaniments:agent:age")}
                error={errors.age}
                register={register}
                name="age"
                disabled={!isEdit}
                type="number"
              />
              <Controller
                render={({ field: { value, onChange, ref, onBlur } }) => {
                  return (
                    <InputDate
                      label={t("contacts:create:born-date")}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      icon={
                        <FaCalendarDays className="h-3 w-3 text-primary pr-4 mr-2" />
                      }
                      error={errors.birthday}
                      disabled={!isEdit}
                    />
                  );
                }}
                name="birthday"
                control={control}
                defaultValue=""
              />
              <TextInput
                label={t("contacts:create:position")}
                placeholder={t("contacts:create:position")}
                error={errors.bio}
                register={register}
                name="bio"
                disabled={!isEdit}
              />

              <TextInput
                label={t("agentsmanagement:accompaniments:agent:children")}
                error={errors.children}
                register={register}
                name="children"
                disabled={!isEdit}
              />
              <TextInput
                label={t("contacts:create:rfc")}
                placeholder="XEXX010101000"
                error={errors.curp}
                register={register}
                name="curp"
                disabled={!isEdit}
              />
              <TextInput
                label={t("contacts:create:cua")}
                error={errors.cua}
                register={register}
                name="cua"
                disabled={!isEdit}
              />
              <SelectInput
                label={t("contacts:create:contact-type")}
                options={lists?.listContact?.contactTypes}
                name="typeId"
                error={!watch("typeId") && errors.typeId}
                register={register}
                setValue={setValue}
                disabled={!isEdit}
                watch={watch}
              />
              <TextInput
                label={t("contacts:create:address")}
                error={errors.address}
                register={register}
                name="address"
                placeholder={t("contacts:create:placeholder-address")}
                disabled={!isEdit}
                multiple
                rows={3}
              />
              <SelectInput
                label={t("contacts:create:origen")}
                name="sourceId"
                options={lists?.listContact?.contactSources}
                error={!watch("sourceId") && errors.sourceId}
                register={register}
                setValue={setValue}
                disabled={!isEdit}
                watch={watch}
              />

              <SelectDropdown
                label={t("agentsmanagement:accompaniments:agent:responsible")}
                name="responsibleId"
                options={lists?.users}
                register={register}
                disabled={!isEdit}
                error={!watch("responsibleId") && errors.responsibleId}
                setValue={setValue}
                watch={watch}
              />
              <SelectDropdown
                label={t("agentsmanagement:accompaniments:agent:manager")}
                name="managerId"
                options={lists?.users}
                register={register}
                disabled={!isEdit}
                error={!watch("managerId") && errors.managerId}
                setValue={setValue}
                watch={watch}
              />
              <SelectDropdown
                label={t("agentsmanagement:accompaniments:agent:observer")}
                name="observerId"
                options={lists?.users}
                register={register}
                disabled={!isEdit}
                error={!watch("observerId") && errors.observerId}
                setValue={setValue}
                watch={watch}
              />
              <TextInput
                label={t("agentsmanagement:accompaniments:agent:comments")}
                error={errors.address}
                register={register}
                name="address"
                disabled={!isEdit}
                multiple
              />
            </div>
          </div>

          {/* Menu Derecha */}
          {id && agent && (
            <ActivityPanel
              entityId={id}
              crmType="agent"
              className="lg:col-span-7"
            />
          )}
          {/* Botones de acción */}
          {(isEdit || !agent) && (
            <div
              className={clsx(
                "flex justify-center px-4 w-full py-4 gap-4 bottom-0 lg:rounded-bl-[35px] rounded-none left-0 right-0 fixed lg:absolute bg-white shadow-[0px_-2px_6px_4px_#00000017] "
              )}
            >
              <Button
                type="submit"
                label={
                  loading
                    ? t("common:buttons:saving")
                    : t("common:buttons:save")
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
                onclick={() => router.back()}
                className="px-3 py-2"
              />
            </div>
          )}
        </form>
      </div>
    </Fragment>
  );
}
