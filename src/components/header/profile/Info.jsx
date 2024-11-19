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
import { updateUser } from "@/src/lib/apis";
import { reloadSession } from "@/src/lib/axios";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import { useRouter, useSearchParams } from "next/navigation";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useSWRConfig } from "swr";
import Image from "next/image";
import Tag from "@/src/components/Tag";
import { Profile, Tasks, Calendar, Drive } from "./components"

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
  const { data, update } = useSession();

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.user) {
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
      image: id ? "" : selectedProfileImage?.file || "",
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

  const tabs = [
    { name: t("contacts:create:tabs:general"), value: 0 },
    { name: "Tareas", value: 1 },
    { name: "Calendario", value: 2 },
    // { name: "Drive", value: 3 },
    // { name: "Acompañamiento", value: 3 },
    // { name: "Flujo de comunicación", value: 4 },
    // { name: "mas", value: 5 },
  ];

  return (
    <Transition
      show={params.get("infoP") === "true"}
      as={Fragment}
      afterLeave={() => {
        router.back();
      }}
    >
      <Dialog as="div" className="relative z-[10000]" onClose={() => {}}>
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
                <div className={`pointer-events-auto w-screen drop-shadow-lg`}>
                  <div className="flex justify-end h-screen">
                    <div className={`flex flex-col`}>
                      <Tag
                        title={"Perfil"}
                        onclick={() => router.back()}
                        className="bg-easywork-main"
                      />
                    </div>
                    <div className="flex flex-col flex-1 bg-gray-600 shadow-xl text-black overflow-y-auto md:overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
                      <TabGroup className="flex flex-col flex-1 text-black md:overflow-hidden rounded-t-2xl rounded-bl-2xl">
                        {/* Encabezado del Formulario */}
                        <div className="bg-transparent p-4">
                          <div className="flex items-start flex-col justify-between gap-4">
                            <TabList className="flex gap-x-8 flex-wrap justify-start bg-white py-2 px-4 w-full rounded-lg">
                              {tabs.map((tab) => (
                                <Tab
                                  key={tab.value}
                                  className={clsx(
                                    "data-[selected]:border-indigo-500 data-[selected]:text-white data-[selected]:bg-blue-100 data-[selected]:rounded-md data-[selected]:focus:outline-none data-[selected]:focus:ring-0",
                                    "whitespace-nowrap p-2 text-sm font-medium cursor-pointer focus:outline-none focus:ring-0"
                                  )}
                                >
                                  {tab.name}
                                </Tab>
                              ))}
                            </TabList>
                            <TabPanels className="w-full overflow-auto">
                              <TabPanel className="w-full">
                                <Profile />
                              </TabPanel>
                              <TabPanel className="w-full">
                                <Tasks />
                              </TabPanel>
                              <TabPanel className="w-full">
                                <Calendar />
                              </TabPanel>
                              <TabPanel className="w-full">
                                <Drive />
                              </TabPanel>
                            </TabPanels>
                          </div>
                        </div>
                      </TabGroup>
                    </div>
                  </div>
                </div>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
