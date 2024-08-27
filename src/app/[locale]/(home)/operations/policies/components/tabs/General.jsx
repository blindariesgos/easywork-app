"use client";
import useAppContext from "@/src/context/app";
import { PencilIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useState } from "react";
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
import ActivityPanel from "../../../../../../../components/contactActivities/ActivityPanel";
import { handleApiError } from "@/src/utils/api/errors";
import {
  createContact,
  updateContact,
  updatePhotoContact,
} from "@/src/lib/apis";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import { useRouter } from "next/navigation";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useSWRConfig } from "swr";
import IconDropdown from "@/src/components/SettingsButton";
import { Cog8ToothIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useCommon } from "@/src/hooks/useCommon";

export default function PolicyDetails({ data, id }) {
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(true);
  const [contactResponsible] = useState(null);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { settingsPolicy } = useCommon();
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (data) {
  //     lists?.listContact?.contactTypes?.length > 0 &&
  //       setContactType(
  //         lists?.listContact?.contactTypes?.filter(
  //           (option) => option.id === data?.type?.id
  //         )[0]
  //       );
  //     lists?.listContact?.contactSources.length > 0 &&
  //       setContactSource(
  //         lists?.listContact?.contactSources.filter(
  //           (option) => option.id === data?.source?.id
  //         )[0]
  //       );
  //     setSelectedProfileImage({ base64: data?.photo || null, file: null });
  //   }
  // }, [data, lists]);

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
    // if (data?.fullName) setValue("name", data?.fullName);
    // if (data?.cargo) setValue("position", data?.cargo);
    // if (data?.phone) setValue("phone", data?.phone);
    // if (data?.email) setValue("email", data?.email);
    // if (data?.curp) setValue("rfc", data?.curp);
    // if (data?.cua) setValue("cua", data?.cua);
    // if (data?.type?.id) setValue("typeContact", data?.type?.id);
    // if (data?.source?.id) setValue("origin", data?.source?.id);
    // if (data?.birthdate) setValue("birthday", data?.birthdate);
    // if (data?.address) setValue("address", data?.address);
    // if (data?.bio) setValue("bio", data?.bio);
    // if (data?.profile?.firstName)
    //   setValue("firstName", data?.profile?.firstName);
    // if (data?.profile?.lastName) setValue("lastName", data?.profile?.lastName);
    // if (data?.avatar) setSelectedProfileImage({ base64: data?.avatar });
  }, [data, id]);

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
      if (!data) {
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

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 md:grid-cols-2  overflow-y-scroll bg-gray-100 rounded-2xl p-4 w-full"
    >
      {/* Menu Derecha */}
      <div className="h-auto rounded-2xl ">
        <div className="flex justify-between py-4 px-3 rounded-md"></div>
        <div className="grid grid-cols-1 gap-x-6  rounded-lg w-full gap-y-3 px-5  pb-9">
          <SelectDropdown
            label={t("control:portafolio:receipt:details:form:responsible")}
            name="responsible"
            options={lists?.users}
            selectedOption={contactResponsible}
            register={register}
            disabled={!isEdit}
            error={!watch("responsible") && errors.responsible}
            setValue={setValue}
          />
          <SelectInput
            label={t("control:portafolio:receipt:details:form:status")}
            options={[
              {
                id: "1",
                value: "1",
                name: "Liquidado",
              },
              {
                id: "2",
                value: "2",
                name: "Cancelado",
              },
              {
                id: "3",
                value: "3",
                name: "Pendiente",
              },
            ]}
            name="status"
            register={register}
            setValue={setValue}
            disabled={!isEdit}
          />
          <SelectInput
            label={t("control:portafolio:receipt:details:form:payment-methods")}
            options={[
              {
                id: "1",
                value: "1",
                name: "Anual",
              },
              {
                id: "2",
                value: "2",
                name: "Semestral",
              },
              {
                id: "3",
                value: "3",
                name: "Trimentral",
              },
              {
                id: "4",
                value: "4",
                name: "Mensual",
              },
            ]}
            name="payment"
            register={register}
            setValue={setValue}
            disabled={!isEdit}
          />

          <Controller
            render={({ field: { value, onChange, ref, onBlur } }) => {
              return (
                <InputDate
                  label={t("control:portafolio:receipt:details:form:init-date")}
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
          <Controller
            render={({ field: { value, onChange, ref, onBlur } }) => {
              return (
                <InputDate
                  label={t(
                    "control:portafolio:receipt:details:form:expiration"
                  )}
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
            name="birthday1"
            control={control}
            defaultValue=""
          />
          <TextInput
            type="text"
            label={t("control:portafolio:receipt:details:form:amount")}
            placeholder={`10.000,00`}
            register={register}
            name="firstName"
            disabled={!isEdit}
          />
          <SelectInput
            label={t("control:portafolio:receipt:details:form:currency")}
            options={[
              {
                id: "1",
                value: "1",
                name: "Pesos",
              },
              {
                id: "2",
                value: "2",
                name: "Dolares Americanos",
              },
            ]}
            name="paymendt"
            register={register}
            setValue={setValue}
            disabled={!isEdit}
          />

          <TextInput
            type="text"
            label={t("control:portafolio:receipt:details:form:comments")}
            error={errors.lastName && errors.lastName.message}
            register={register}
            name="lastNamef"
            disabled={!isEdit}
            multiple
          />
        </div>
      </div>
      {/* Menu Izquierda */}
      <div className=" bg-gray-100 rounded-lg w-full">
        <ActivityPanel contactId={data?.id} />
      </div>
    </form>
  );
}
