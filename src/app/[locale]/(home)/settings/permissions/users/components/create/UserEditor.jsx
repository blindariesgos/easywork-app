"use client";
import useAppContext from "@/src/context/app";
import { PencilIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
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
import ActivityPanel from "../../../../../../../../components/contactActivities/ActivityPanel";
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
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useSWRConfig } from "swr";
import Image from "next/image";

export default function UserEditor({ user, id }) {
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [contactType, setContactType] = useState(null);
  const [contactSource, setContactSource] = useState(null);
  const [contactResponsible] = useState(null);
  const [files, setFiles] = useState([]);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      lists?.listContact?.contactTypes.length > 0 &&
        setContactType(
          lists?.listContact?.contactTypes.filter(
            (option) => option.id === user?.type?.id
          )[0]
        );
      lists?.listContact?.contactSources.length > 0 &&
        setContactSource(
          lists?.listContact?.contactSources.filter(
            (option) => option.id === user?.source?.id
          )[0]
        );
      setSelectedProfileImage({ base64: user?.photo || null, file: null });
    }
  }, [user, lists]);

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
    bio: Yup.string(),
    lastName: Yup.string(),
    firstName: Yup.string(),
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

    if (user?.fullName) setValue("name", user?.fullName);
    if (user?.cargo) setValue("position", user?.cargo);
    if (user?.phone) setValue("phone", user?.phone);
    if (user?.email) setValue("email", user?.email);
    if (user?.curp) setValue("rfc", user?.curp);
    if (user?.cua) setValue("cua", user?.cua);
    if (user?.type?.id) setValue("typeContact", user?.type?.id);
    if (user?.source?.id) setValue("origin", user?.source?.id);
    if (user?.birthdate) setValue("birthday", user?.birthdate);
    if (user?.address) setValue("address", user?.address);
    if (user?.bio) setValue("bio", user?.bio);
    if (user?.profile?.firstName)
      setValue("firstName", user?.profile?.firstName);
    if (user?.profile?.lastName) setValue("lastName", user?.profile?.lastName);
    if (user?.avatar) setSelectedProfileImage({ base64: user?.avatar });
  }, [user, id]);

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
      if (!user) {
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
      <div className="flex flex-col flex-1 bg-gray-100 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col flex-1 bg-gray-100 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl relative"
        >
          {/* Encabezado del Formulario */}
          <div className="bg-transparent py-6 mx-4">
            <div className="flex items-start flex-col justify-between space-y-3 relative">
              {!id && (
                <div className="inset-0 bg-white/75 w-full h-full z-50 absolute rounded-t-2xl" />
              )}
              <div className="flex gap-2 items-center">
                <h1 className="text-xl sm:pl-6 pl-2">
                  {user ? user.fullName ?? user.name : t("leads:create:client")}
                </h1>
              </div>
              <AddContactTabs id={id} />
            </div>
          </div>

          {/* Panel Principal */}

          <div className="grid grid-cols-1 md:grid-cols-2  overflow-y-scroll bg-gray-100 md:mx-4 rounded-lg p-4 w-full">
            {/* Menu Izquierda */}
            <div className=" bg-gray-100">
              <div className="rounded-lg bg-white my-3 py-4">
                <div className="flex w-full justify-between">
                  <div className="px-2 flex items-center bg-easywork-main hover:bg-easywork-mainhover text-white">
                    Supervisor
                    <ChevronDownIcon className="ml-1 w-4 h-4" />
                  </div>
                  <p className="py-1 px-2">No molestar</p>
                </div>
                <div className="flex flex-col text-sm justify-center items-center w-full h-full mr-3 mb-3">
                  {isEdit ? (
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
                        className="h-64 w-64 flex-none rounded-full text-white fill-white bg-zinc-200 object-cover items-center justify-center"
                        objectFit="fill"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full mr-3 my-3 mt-1 p-1 rounded-lg bg-white">
                <h1 className="text-easywork-main p-2 w-full mt-2 font-medium">
                  Compañia: Tu Agencia
                </h1>
                <div className="px-3 py-2 text-sm">
                  <div className="mb-3">
                    <p className="text-gray-50">Miembros del equipo</p>
                    <div className="flex">
                      <Image
                        className="h-12 w-12 rounded-full object-cover"
                        width={36}
                        height={36}
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                      />
                      <div className="ml-2">
                        <p>Nombre</p>
                        <h1 className="font-semibold">Armando Graterol</h1>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-gray-50">Miembros del equipo</p>
                    <div className="flex">
                      <Image
                        className="h-12 w-12 rounded-full object-cover"
                        width={36}
                        height={36}
                        src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1889&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                      />
                      <div className="ml-2">
                        <p>Nombre</p>
                        <h1 className="font-semibold">Otilio Graterol</h1>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-gray-50">Miembros del equipo</p>
                    <div className="flex">
                      <Image
                        className="h-12 w-12 rounded-full object-cover"
                        width={36}
                        height={36}
                        src="https://images.unsplash.com/photo-1542309667-2a115d1f54c6?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                      />
                      <div className="ml-2">
                        <p>Nombre</p>
                        <h1 className="font-semibold">Nathaly Polin</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Derecha */}
            <div className=" bg-white h-auto m-3 pt-1 rounded-lg">
              <div className="flex justify-between bg-white py-4 px-3 rounded-md">
                <h1 className="text-primary font-bold text-2xl">
                  {t("users:form:title")}
                </h1>
                {user && (
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
              <div className="grid grid-cols-1 gap-x-6 bg-white rounded-lg w-full gap-y-3 px-5 mb-10 pb-9 mt-8">
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
                <TextInput
                  label={t("contacts:create:email")}
                  placeholder={t("contacts:create:placeholder-lastname")}
                  error={errors.email}
                  register={register}
                  name="email"
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
                  label={t("contacts:create:position")}
                  placeholder={t("contacts:create:position")}
                  error={errors.position}
                  register={register}
                  name="position"
                  disabled={!isEdit}
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
                {isEdit && (
                  <DocumentSelector
                    name="files"
                    onChange={handleFilesUpload}
                    files={files}
                    disabled={!isEdit}
                    setFiles={setFiles}
                  />
                )}
              </div>
            </div>
          </div>
          {/* )} */}

          {/* Botones de acción */}
          {(isEdit || !user) && (
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
      </div>
    </div>
  );
}
