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
import { updateUser, getUsersGroup } from "@/src/lib/apis";
import { reloadSession } from "@/src/lib/axios";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import { useRouter, useSearchParams } from "next/navigation";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useSWRConfig } from "swr";
import Image from "next/image";
import Tag from "@/src/components/Tag";

export function Profile({ user, id }) {
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
  const { data, update } = useSession();
  const [groups, setGroups] = useState([]);

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.user) {
      console.log(data);
      lists?.listContact?.contactTypes.length > 0 &&
        setContactType(
          lists?.listContact?.contactTypes.filter(
            (option) => option.id === data?.user?.type?.id
          )[0]
        );
      lists?.listContact?.contactSources.length > 0 &&
        setContactSource(
          lists?.listContact?.contactSources.filter(
            (option) => option.id === data?.user?.source?.id
          )[0]
        );
      setSelectedProfileImage({
        base64: data?.user?.photo || null,
        file: null,
      });
    }
  }, [data?.user, lists]);

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

  useEffect(() => {
    getUsersGroup(data?.user?.id).then((res) => {
      console.log(res.groups);
      setGroups(res.groups);
    });
  }, []);

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
    if (data?.user?.fullName) setValue("name", data?.user?.fullName);
    if (data?.user?.cargo) setValue("position", data?.user?.cargo);
    if (data?.user?.phone) setValue("phone", data?.user?.phone);
    if (data?.user?.email) setValue("email", data?.user?.email);
    if (data?.user?.curp) setValue("rfc", data?.user?.curp);
    if (data?.user?.cua) setValue("cua", data?.user?.cua);
    if (data?.user?.type?.id) setValue("typeContact", data?.user?.type?.id);
    if (data?.user?.source?.id) setValue("origin", data?.user?.source?.id);
    if (data?.user?.birthdate) setValue("birthday", data?.user?.birthdate);
    if (data?.user?.address) setValue("address", data?.user?.address);
    if (data?.user?.bio) setValue("bio", data?.user?.bio);
    if (data?.user?.profile?.firstName)
      setValue("firstName", data?.user?.profile?.firstName);
    if (data?.user?.profile?.lastName)
      setValue("lastName", data?.user?.profile?.lastName);
    if (data?.user?.avatar)
      setSelectedProfileImage({ base64: data?.user?.avatar });
  }, [data?.user, params.get("profile")]);

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

  const handleFormSubmit = async (dataUser) => {
    const previousData = {
      email: data.user.email,
      phone: data.user.phone,
    };

    const body = {
      firstName: dataUser.firstName,
      lastName: dataUser.lastName,
      image: selectedProfileImage?.file || "",
      cua: dataUser.cua,
      email: dataUser.email !== previousData.email ? dataUser.email : undefined,
      phone: dataUser.phone !== previousData.phone ? dataUser.phone : undefined,
    };

    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    const formData = new FormData();

    for (const key in body) {
      if (body[key] === null || body[key] === undefined || body[key] === "") {
        continue;
      }

      if (body[key] instanceof File || body[key] instanceof Blob) {
        formData.append(key, body[key]); // Agrega archivos o blobs directamente
      } else if (Array.isArray(body[key])) {
        formData.append(key, JSON.stringify(body[key])); // Convierte arrays a JSON
      } else {
        formData.append(key, body[key]?.toString() || ""); // Convierte los demás valores a string
      }
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    try {
      setLoading(true);
      const response = await updateUser(data?.user?.id, formData);
      console.log(response);
      await reloadSession();
      update();
      setLoading(false);
      setIsEdit(false);
    } catch (error) {
      handleApiError(error.message);
      setLoading(false);
    }
  };

  // Calculate the user 18th birthday
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  return (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg w-full h-[calc(100vh_-_160px)]"
        >
          {/* Menu Izquierda */}
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg bg-white">
              <div className="flex w-full justify-between pt-4">
                <div className="px-2 flex items-center bg-easywork-main hover:bg-easywork-mainhover text-white">
                  {data?.user.roles[0].name}
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
                      src={data?.user?.avatar || "/img/avatar.svg"}
                      alt="Profile picture"
                      className="h-60 w-60 flex-none rounded-full text-white fill-white bg-zinc-200 object-cover items-center justify-center"
                      objectFit="fill"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Menu Derecha */}
          <div className="h-auto rounded-lg">
            <div className="grid grid-cols-1 gap-x-6 bg-white rounded-lg w-full gap-y-3 px-5 pb-9">
              <div className="flex justify-between py-4 px-2 rounded-md">
                <h1 className="text-primary font-bold text-2xl">
                  Información del usuario
                </h1>
                {data?.user && (
                  <button
                    type="button"
                    onClick={() => setIsEdit(!isEdit)}
                    title="Editar"
                  >
                    <PencilIcon className="h-6 w-6 text-primary" />
                  </button>
                )}
              </div>
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
                label={t("contacts:create:cua")}
                error={errors.cua}
                register={register}
                name="cua"
                disabled={!isEdit}
                //value={watch('cua')}
                // placeholder={t('contacts:create:placeholder-address')}
              />
            </div>
            {groups?.map((group, index) => (
              <div className="w-full p-1 mt-4 rounded-lg h-60 bg-white overflow-y-auto" key={index}>
                <h1 className="text-easywork-main p-2 w-full mt-2 font-medium">
                  Compañía: {group.name}
                </h1>
                {group?.users?.map((user, index) => (
                  <div className="px-3 py-2 text-sm" key={index}>
                    <div className="mb-3">
                      <p className="text-gray-50">Miembro del equipo</p>
                      <div className="flex">
                        <Image
                          className="h-12 w-12 rounded-full object-cover"
                          width={100}
                          height={100}
                          src={user?.avatar}
                          alt="user"
                        />
                        <div className="ml-2">
                          <p>Nombre</p>
                          <h1 className="font-semibold">
                            {`${user?.profile?.firstName} ${user?.profile?.lastName}`}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
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
                onclick={() => setIsEdit(false)}
                className="px-3 py-2"
              />
            </div>
          )}
        </form>
  );
}
