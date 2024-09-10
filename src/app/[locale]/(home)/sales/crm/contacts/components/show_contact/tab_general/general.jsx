"use client";
import useAppContext from "@/src/context/app";
import { PencilIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import TextInput from "@/src/components/form/TextInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputPhone from "@/src/components/form/InputPhone";
import SelectInput from "@/src/components/form/SelectInput";
import InputDate from "@/src/components/form/InputDate";
import { FaCalendarDays } from "react-icons/fa6";
import ActivityPanel from "../../../../../../../../../components/contactActivities/ActivityPanel";
import { handleApiError } from "@/src/utils/api/errors";
import {
  createContact,
  updateContact,
  updatePhotoContact,
} from "@/src/lib/apis";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import { DocumentSelector } from "@/src/components/DocumentSelector";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import Image from "next/image";
import { clsx } from "clsx";
import { formatISO } from "date-fns";

export default function ContactGeneral({ contact, id }) {
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      setSelectedProfileImage({ base64: contact?.photo || null, file: null });
    }
  }, [contact, lists]);

  const schema = Yup.object().shape({
    email: Yup.string()
      .required(t("common:validations:required"))
      .email(t("common:validations:email"))
      .min(5, t("common:validations:min", { min: 5 })),
    fullName: Yup.string(),
    name: Yup.string()
      .required(t("common:validations:required"))
      .min(2, t("common:validations:min", { min: 2 })),
    lastName: Yup.string()
      .required(t("common:validations:required"))
      .min(2, t("common:validations:min", { min: 2 })),
    cargo: Yup.string(),
    phone: Yup.string().required(t("common:validations:required")),
    rfc: Yup.string(),
    typeContact: Yup.string(),
    sourceId: Yup.string(),
    address: Yup.string(),
    assignedById: Yup.string(),
    birthdate: Yup.string(),
    typePerson: Yup.string().required(t("common:validations:required")),
    observadorId: Yup.string().required(t("common:validations:required")),
    typeId: Yup.string(),
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

    if (contact?.fullName) setValue("fullName", contact?.fullName);
    if (contact?.name) setValue("name", contact?.name);
    if (contact?.lastName) setValue("lastName", contact?.lastName);
    if (contact?.cargo) setValue("cargo", contact?.cargo);
    if (contact?.phones[0]?.phone?.number)
      setValue("phone", contact?.phones[0]?.phone?.number);
    if (contact?.emails[0]?.email?.email)
      setValue("email", contact?.emails[0]?.email?.email);
    if (contact?.type?.id) setValue("typeId", contact?.type?.id);
    if (contact?.source?.id) setValue("sourceId", contact?.source?.id);
    if (contact?.birthdate) setValue("birthdate", contact?.birthdate);
    if (contact?.address) setValue("address", contact?.address);
    if (contact?.rfc) setValue("rfc", contact?.rfc);
    if (contact?.typePerson) setValue("typePerson", contact?.typePerson);
    if (contact?.assignedBy) setValue("assignedById", contact?.assignedBy.id);
    if (contact?.observador) setValue("observadorId", contact?.observador.id);
  }, [contact, id]);

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
    const phones = contact?.phones?.length
      ? contact?.phones.map((p, index) => ({
          number: index == 0 ? data.phone : p.phone?.number,
        }))
      : [{ number: phone }];
    const amails = contact?.emails?.length
      ? contact?.emails.map((e, index) => ({
          email: index == 0 ? phone : e.email?.email,
        }))
      : [{ email }];

    let body = {
      ...otherData,
      emails_dto: amails,
      phones_dto: phones,
    };

    try {
      setLoading(true);
      if (!contact) {
        body = {
          ...body,
          photo: selectedProfileImage?.file || "",
        };
        const formData = new FormData();
        for (const key in body) {
          if (
            body[key] === null ||
            body[key] === undefined ||
            body[key] === ""
          ) {
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
        const response = await createContact(formData);
        if (response.hasError) {
          let message = response.message;
          if (response.errors) {
            message = response.errors.join(", ");
          }
          throw { message };
        }
        await mutate(`/sales/crm/contacts?limit=5&page=1`);
        toast.success(t("contacts:create:msg"));
      } else {
        console.log({ body });
        const response = await updateContact(body, id);
        if (response.hasError) {
          console.log({ response });
          let message = response.message;
          if (response.errors) {
            message = response.errors.join(", ");
          }
          throw { message };
        }
        toast.success(t("contacts:edit:updated-contact"));
        if (selectedProfileImage.file) {
          const photo = new FormData();
          photo.append("photo", selectedProfileImage.file);
          const resp = await updatePhotoContact(photo, id);
          if (resp.hasError) {
            console.error(resp);
            toast.error("Error al actualizar la foto");
          }
        }
        await mutate(`/sales/crm/contacts?limit=5&page=1`);
        await mutate(`/sales/crm/contacts/${id}`);
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

  // Calculate the user's 18th birthday
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
              "lg:grid-cols-2": contact,
            }
          )}
        >
          {/* Panel Principal */}

          {/* Menu Izquierda */}
          <div className=" bg-gray-100 p-4 lg:overflow-y-scroll rounded-lg">
            <div className="pr-2">
              <div className="flex justify-between bg-white py-4 px-3 rounded-md">
                <h1 className="">{t("contacts:create:data")}</h1>
                {contact && (
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
            <div className="grid grid-cols-1 gap-x-6 gap-y-3  px-5 pb-20 pt-8">
              {isEdit ? (
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
              ) : (
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
              <TextInput
                label={t("contacts:create:position")}
                placeholder={t("contacts:create:position")}
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
                      error={errors.birthdate}
                      disabled={!isEdit}
                      inactiveDate={eighteenYearsAgo}
                    />
                  );
                }}
                name="birthdate"
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
                label={t("contacts:create:rfc")}
                placeholder="XEXX010101000"
                error={errors.rfc}
                register={register}
                name="rfc"
                disabled={!isEdit}
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
                placeholder="- Seleccionar -"
                watch={watch}
                name="typePerson"
                disabled={!isEdit}
                setValue={setValue}
                error={!watch("typePerson") && errors.typePerson}
              />
              <SelectInput
                label={t("contacts:create:contact-type")}
                options={lists?.listContact?.contactTypes}
                name="typeId"
                error={errors.typeId}
                register={register}
                setValue={setValue}
                disabled={!isEdit}
                watch={watch}
              />
              {watch("typeId") == "Otro" ? (
                <TextInput
                  label={t("contacts:create:otherType")}
                  placeholder=""
                  error={errors.otherType}
                  register={register}
                  name="otherType"
                  disabled={!isEdit}
                  //value={watch('otherType')}
                />
              ) : null}
              <TextInput
                label={t("contacts:create:address")}
                error={errors.address}
                register={register}
                name="address"
                placeholder={t("contacts:create:placeholder-address")}
                disabled={!isEdit}
                //value={watch('address')}
              />
              <SelectInput
                label={t("contacts:create:origen")}
                name="sourceId"
                options={lists?.listContact?.contactSources}
                error={errors.sourceId}
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
                placeholder="- Seleccionar -"
              />
              <SelectDropdown
                label={t("contacts:create:observer")}
                name="observadorId"
                options={lists?.users}
                register={register}
                disabled={!isEdit}
                error={errors.observadorId}
                setValue={setValue}
                watch={watch}
                placeholder="- Seleccionar -"
              />
            </div>
          </div>

          {/* Menu Derecha */}
          {id && contact && <ActivityPanel contactId={id} />}
          {/* Botones de acción */}
          {(isEdit || !contact) && (
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
      </div>
    </Fragment>
  );
}
