"use client";
import useAppContext from "@/src/context/app";
import { PencilIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useState } from "react";
import AddContactTabs from "./AddContactTabs";
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
import ActivityPanel from "../ActivityPanel";
import { handleApiError } from "@/src/utils/api/errors";
import {
  createContact,
  updateContact,
  updatePhotoContact,
} from "@/src/lib/apis";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import { DocumentSelector } from "@/src/components/DocumentSelector";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import { useRouter, useSearchParams } from "next/navigation";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useSWRConfig } from "swr";
import Image from "next/image";
import ContactFolders from "../show_documents/ContactFolders"

export default function ContactEditor({ contact, id }) {
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [contactType, setContactType] = useState(null);
  const [contactSource, setContactSource] = useState(null);
  const [contactResponsible] = useState(null);
  const [files, setFiles] = useState([]);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("general")

  useEffect(() => {
    const tabSelected = params.get('tab') ?? "general"
    setTab(tabSelected)
  }, [params.get('tab')])

  useEffect(() => {
    if (contact) {
      lists?.listContact?.contactTypes.length > 0 &&
        setContactType(
          lists?.listContact?.contactTypes.filter(
            (option) => option.id === contact?.type?.id
          )[0]
        );
      lists?.listContact?.contactSources.length > 0 &&
        setContactSource(
          lists?.listContact?.contactSources.filter(
            (option) => option.id === contact?.source?.id
          )[0]
        );
      setSelectedProfileImage({ base64: contact?.photo || null, file: null });
    }
  }, [contact, lists]);

  const schema = Yup.object().shape({
    email: Yup.string()
      .required(t("common:validations:required"))
      .email(t("common:validations:email"))
      .min(5, t("common:validations:min", { min: 5 })),
    name: Yup.string()
      .required(t("common:validations:required"))
      .min(2, t("common:validations:min", { min: 2 })),
    position: Yup.string(),
    phone: Yup.string().required(t("common:validations:required")),
    rfc: Yup.string(),
    cua: Yup.string(),
    typeContact: Yup.string(),
    origin: Yup.string(),
    address: Yup.string(),
    responsible: Yup.string(),
    birthday: Yup.string(),
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
      setIsEdit(true)
      return
    }

    if (contact?.fullName) setValue("name", contact?.fullName)
    if (contact?.cargo) setValue("position", contact?.cargo)
    if (contact?.phones[0]?.phone?.number) setValue("phone", contact?.phones[0]?.phone?.number)
    if (contact?.emails[0]?.email?.email) setValue("email", contact?.emails[0]?.email?.email)
    if (contact?.curp) setValue("rfc", contact?.curp)
    if (contact?.cua) setValue("cua", contact?.cua)
    if (contact?.type?.id) setValue("typeContact", contact?.type?.id)
    if (contact?.source?.id) setValue("origin", contact?.source?.id)
    if (contact?.birthdate) setValue("birthday", contact?.birthdate)
    if (contact?.address) setValue("address", contact?.address)

  }, [contact, id])

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

  const handleFilesUpload = (event, drop) => {
    let uploadedImages = [...files];
    const fileList = drop ? event.dataTransfer.files : event.target.files;

    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.size > 5 * 1024 * 1024) {
          toast.error(t("common:validations:size", { size: 5 }));
          return;
        } else {
          const reader = new FileReader();

          reader.onload = (e) => {
            setTimeout(() => {
              const existFile = uploadedImages.some(
                (item) => item.name === file.name
              );
              if (!existFile) {
                uploadedImages = [
                  ...uploadedImages,
                  {
                    base64: reader.result,
                    type: file.type.split("/")[0],
                    name: file.name,
                  },
                ];
                setFiles(uploadedImages);
              }
            }, 500);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleFormSubmit = async (data) => {
    const body = {
      name: data.name,
      fullName: data.name,
      photo: id ? "" : selectedProfileImage?.file || "",
      cargo: data.position,
      typeId: data.typeContact,
      curp: data.rfc,
      cua: data.cua,
      address: data.address,
      birthdate: data.birthday,
      sourceId: data.origin,
      emails_dto: JSON.stringify([{ email: data.email }]),
      phones_dto: [{ number: data.phone }],
      observadorId: data.responsible,
      assignedById: data.responsible,
    };

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
      if (!contact) {
        await createContact(formData);
        await mutate(`/sales/crm/contacts?limit=10&page=1`);
        toast.success(t("contacts:create:msg"));
      } else {
        await updateContact(body, id);
        if (selectedProfileImage.file) {
          const photo = new FormData();
          photo.append("photo", selectedProfileImage.file);
          await updatePhotoContact(photo, id);
        }
        await mutate(`/sales/crm/contacts?limit=10&page=1`);
        await mutate(`/sales/crm/contacts/${id}`);
        toast.success(t("contacts:edit:updated-contact"));
      }
      setLoading(false);
      router.push(`/sales/crm/contacts?page=1`);
    } catch (error) {
      handleApiError(error.message);
      setLoading(false);
    }
  };

  // Calculate the user's 18th birthday
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  return (
    <div className="flex flex-col h-screen relative w-full">
      {/* Formulario Principal */}
      {loading && <LoaderSpinner />}
      {/* Encabezado del Formulario */}
      <div className="flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
        <div className="bg-transparent py-6 mx-4">
          <div className="flex items-start flex-col justify-between space-y-3 relative">
            {!id && (
              <div className="inset-0 bg-white/75 w-full h-full z-50 absolute rounded-t-2xl" />
            )}
            <div className="flex gap-2 items-center">
              <h1 className="text-xl sm:pl-6 pl-2">
                {contact ? contact.fullName ?? contact.name : t("leads:create:client")}
              </h1>

            </div>
            <AddContactTabs id={id} tab={tab} />
          </div>
        </div>
        {
          tab === "general" && (
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col flex-1 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl relative"
            >

              {/* Panel Principal */}

              <div className="flex flex-col md:flex-row h-full  bg-gray-100 md:mx-4 rounded-lg p-4 w-full">
                {/* Menu Izquierda */}
                <div className="md:w-2/5 bg-gray-100 md:overflow-y-scroll rounded-lg">
                  <div className="pr-2">
                    <div className="flex justify-between bg-white py-4 px-3 rounded-md">
                      <h1 className="">{t("contacts:create:data")}</h1>
                      {
                        contact && (
                          <button
                            type="button"
                            disabled={!id}
                            onClick={() => setIsEdit(!isEdit)}
                            title="Editar"
                          >
                            <PencilIcon className="h-6 w-6 text-primary" />
                          </button>
                        )
                      }
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {
                      isEdit
                        ? (
                          <ProfileImageInput
                            selectedProfileImage={selectedProfileImage}
                            onChange={handleProfileImageChange}
                            disabled={!isEdit}
                          />
                        ) : (
                          <div className="p-2">
                            <Image
                              width={96}
                              height={96}
                              src={selectedProfileImage?.base64 || "/img/avatar.svg"}
                              alt="Profile picture"
                              className="h-16 w-16 flex-none rounded-full text-white fill-white bg-zinc-200 object-cover items-center justify-center"
                              objectFit="fill"
                            />
                          </div>
                        )
                    }
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:max-w-xl px-5 mb-10 mt-8">
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
                      label={t("contacts:create:position")}
                      placeholder={t("contacts:create:position")}
                      error={errors.position}
                      register={register}
                      name="position"
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
                            error={errors.birthday}
                            disabled={!isEdit}
                          // inactiveDate={eighteenYearsAgo}
                          />
                        );
                      }}
                      name="birthday"
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
                      label={t("contacts:create:contact-type")}
                      options={lists?.listContact?.contactTypes}
                      selectedOption={contactType && contactType}
                      name="typeContact"
                      error={!watch("typeContact") && errors.typeContact}
                      register={register}
                      setValue={setValue}
                      disabled={!isEdit}
                    />
                    {watch("typeContact") == "Otro" ? (
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
                      name="origin"
                      options={lists?.listContact?.contactSources}
                      selectedOption={contactSource && contactSource}
                      error={!watch("origin") && errors.origin}
                      register={register}
                      setValue={setValue}
                      disabled={!isEdit}
                    //value={watch('origin')}
                    />
                    <SelectDropdown
                      label={t("contacts:create:responsible")}
                      name="responsible"
                      options={lists?.users}
                      selectedOption={contactResponsible}
                      register={register}
                      disabled={!isEdit}
                      error={!watch("responsible") && errors.responsible}
                      setValue={setValue}
                    // //value={watch('responsible')}
                    />
                    <TextInput
                      label={t("contacts:create:cua")}
                      error={errors.cua}
                      register={register}
                      name="cua"
                      disabled={!isEdit}
                    //value={watch('cua')}
                    // placeholder={t('contacts:create:placeholder-address')}
                    />
                    {
                      isEdit && (
                        <DocumentSelector
                          name="files"
                          onChange={handleFilesUpload}
                          files={files}
                          disabled={!isEdit}
                          setFiles={setFiles}
                        />

                      )
                    }
                  </div>
                </div>

                {/* Menu Derecha */}
                {id && <ActivityPanel contactId={id} />}
              </div>
              {/* )} */}

              {/* Botones de acción */}
              {(isEdit || !contact) && (
                <div className="flex justify-center px-4 py-4 gap-4 sticky -bottom-4 md:bottom-0 bg-white shadow-[0px_-2px_6px_4px_#00000017]">
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
          )
        }
        {
          tab === "documents" && (
            <ContactFolders id={id} />
          )
        }
      </div>
    </div>
  );
}
