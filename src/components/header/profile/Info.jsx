"use client";
import useAppContext from "@/src/context/app";
import { PencilIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import TextInput from "@/src/components/form/TextInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import SlideOver from "@/src/components/SlideOver";
import InputPhone from "@/src/components/form/InputPhone";
import SelectInput from "@/src/components/form/SelectInput";
import InputDate from "@/src/components/form/InputDate";
import { FaCalendarDays } from "react-icons/fa6";
import { handleApiError } from "@/src/utils/api/errors";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
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
import Tag from "@/src/components/Tag";

export default function Info({ user, id }) {
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [isEdit, setIsEdit] = useState(false);
  const [contactType, setContactType] = useState(null);
  const [contactSource, setContactSource] = useState(null);
  const [contactResponsible] = useState(null);
  const [files, setFiles] = useState([]);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const session = useSession();

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.data?.user) {
      lists?.listContact?.contactTypes.length > 0 &&
        setContactType(
          lists?.listContact?.contactTypes.filter(
            (option) => option.id === session?.data?.user?.type?.id
          )[0]
        );
      lists?.listContact?.contactSources.length > 0 &&
        setContactSource(
          lists?.listContact?.contactSources.filter(
            (option) => option.id === session?.data?.user?.source?.id
          )[0]
        );
      setSelectedProfileImage({
        base64: session?.data?.user?.photo || null,
        file: null,
      });
    }
  }, [session?.data?.user, lists]);

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
    // resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (session?.data?.user?.fullName)
      setValue("name", session?.data?.user?.fullName);
    if (session?.data?.user?.cargo)
      setValue("position", session?.data?.user?.cargo);
    if (session?.data?.user?.phone)
      setValue("phone", session?.data?.user?.phone);
    if (session?.data?.user?.email)
      setValue("email", session?.data?.user?.email);
    if (session?.data?.user?.curp) setValue("rfc", session?.data?.user?.curp);
    if (session?.data?.user?.cua) setValue("cua", session?.data?.user?.cua);
    if (session?.data?.user?.type?.id)
      setValue("typeContact", session?.data?.user?.type?.id);
    if (session?.data?.user?.source?.id)
      setValue("origin", session?.data?.user?.source?.id);
    if (session?.data?.user?.birthdate)
      setValue("birthday", session?.data?.user?.birthdate);
    if (session?.data?.user?.address)
      setValue("address", session?.data?.user?.address);
    if (session?.data?.user?.bio) setValue("bio", session?.data?.user?.bio);
    if (session?.data?.user?.profile?.firstName)
      setValue("firstName", session?.data?.user?.profile?.firstName);
    if (session?.data?.user?.profile?.lastName)
      setValue("lastName", session?.data?.user?.profile?.lastName);
    if (session?.data?.user?.avatar)
      setSelectedProfileImage({ base64: session?.data?.user?.avatar });
  }, [session?.data?.user, params.get("profile")]);

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
      firstName: data.firstName,
      lastName: data.lastName,
      photo: id ? "" : selectedProfileImage?.file || "",
      cua: data.cua,
      emails: data.email,
      phone: data.phone,
    };

    console.log(body);

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
      await updateContact(body, id);
      if (selectedProfileImage.file) {
        const photo = new FormData();
        photo.append("photo", selectedProfileImage.file);
        await updatePhotoContact(photo, id);
        await mutate(`/sales/crm/contacts?limit=10&page=1`);
        await mutate(`/sales/crm/contacts/${id}`);
        toast.success(t("contacts:edit:updated-contact"));
      }
      setLoading(false);
      // router.push(`/sales/crm/contacts?page=1`);
    } catch (error) {
      handleApiError(error.message);
      setLoading(false);
    }
  };

  // Calculate the user 18th birthday
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  return (
    <Transition
      show={params.get("infoP") === "true"}
      as={Fragment}
      afterLeave={() => {
        router.back();
      }}
    >
      <Dialog as="div" className="relative z-[10000]" onClose={() => {}}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 2xl:pl-52">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel
                  className={`pointer-events-auto w-screen drop-shadow-lg`}
                >
                  <div className="flex justify-end h-screen">
                    <div className={`flex flex-col`}>
                      <Tag
                        title={"Perfil"}
                        onclick={() => router.back()}
                        className="bg-easywork-main"
                      />
                    </div>
                    <div className={`bg-gray-600 p-8 rounded-3xl w-full`}>
                      {/* <Tag onclick={() => router.back()} className="bg-easywork-main" /> */}
                      {/* Formulario Principal */}
                      {loading && <LoaderSpinner />}
                      <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg w-full h-[calc(100vh_-_160px)]"
                      >
                        {/* Menu Izquierda */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="rounded-lg bg-white">
                            <div className="flex w-full justify-between pt-4">
                              <div className="px-2 flex items-center bg-easywork-main hover:bg-easywork-mainhover text-white">
                                {session?.data?.user.roles[0].name}
                                <ChevronDownIcon className="w-4 h-4" />
                              </div>
                              <p className="py-1 px-2">No molestar</p>
                            </div>
                            <div className="flex flex-col text-sm justify-center items-center w-full h-full">
                              {isEdit ? (
                                <ProfileImageInput
                                  selectedProfileImage={selectedProfileImage}
                                  onChange={handleProfileImageChange}
                                  disabled={!isEdit}
                                />
                              ) : (
                                <div className="p-2">
                                  <Image
                                    width={1080}
                                    height={1080}
                                    src={
                                      session?.data?.user?.avatar ||
                                      "/img/avatar.svg"
                                    }
                                    alt="Profile picture"
                                    className="h-64 w-64 flex-none rounded-full text-white fill-white bg-zinc-200 object-cover items-center justify-center"
                                    objectFit="fill"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="w-full p-1 rounded-lg bg-white">
                            <h1 className="text-easywork-main p-2 w-full mt-2 font-medium">
                              Compañia: Tu Agencia
                            </h1>
                            <div className="px-3 py-2 text-sm">
                              <div className="mb-3">
                                <p className="text-gray-50">
                                  Miembros del equipo
                                </p>
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
                                    <h1 className="font-semibold">
                                      Armando Graterol
                                    </h1>
                                  </div>
                                </div>
                              </div>
                              <div className="mb-3">
                                <p className="text-gray-50">
                                  Miembros del equipo
                                </p>
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
                                    <h1 className="font-semibold">
                                      Otilio Graterol
                                    </h1>
                                  </div>
                                </div>
                              </div>
                              <div className="mb-3">
                                <p className="text-gray-50">
                                  Miembros del equipo
                                </p>
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
                                    <h1 className="font-semibold">
                                      Nathaly Polin
                                    </h1>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Derecha */}
                        <div className=" bg-white h-auto rounded-lg">
                          <div className="flex justify-between bg-white p-4 rounded-md">
                            <h1 className="text-primary font-bold text-2xl">
                              Información del usuario
                            </h1>
                            {session?.data?.user && (
                              <button
                                type="button"
                                onClick={() => setIsEdit(!isEdit)}
                                title="Editar"
                              >
                                <PencilIcon className="h-6 w-6 text-primary" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 gap-x-6 bg-white rounded-lg w-full gap-y-3 px-5 pb-9">
                            <TextInput
                              type="text"
                              label={t("users:form:firstname")}
                              placeholder={t(
                                "contacts:create:placeholder-name"
                              )}
                              error={
                                errors.firstName && errors.firstName.message
                              }
                              register={register}
                              name="firstName"
                              disabled={!isEdit}
                            />
                            <TextInput
                              type="text"
                              label={t("users:form:lastname")}
                              placeholder={t(
                                "contacts:create:placeholder-name"
                              )}
                              error={errors.lastName && errors.lastName.message}
                              register={register}
                              name="lastName"
                              disabled={!isEdit}
                            />
                            <TextInput
                              label={t("contacts:create:email")}
                              placeholder={t(
                                "contacts:create:placeholder-lastname"
                              )}
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
                              label={t("contacts:create:cua")}
                              error={errors.cua}
                              register={register}
                              name="cua"
                              disabled={!isEdit}
                              //value={watch('cua')}
                              // placeholder={t('contacts:create:placeholder-address')}
                            />
                          </div>
                        </div>
                        {/* Botones de acción */}
                        {isEdit && (
                          <div className="flex w-full justify-center px-4 py-4 gap-4 fixed -bottom-4 md:bottom-0 bg-white shadow-[0px_-2px_6px_4px_#00000017]">
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
                      {/* )} */}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
