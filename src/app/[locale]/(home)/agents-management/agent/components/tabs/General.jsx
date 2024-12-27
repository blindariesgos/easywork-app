"use client";
import useAppContext from "@/src/context/app";
import { PencilIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import TextInput from "@/src/components/form/TextInput";
import InputPhone from "@/src/components/form/InputPhone";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import SelectInput from "@/src/components/form/SelectInput";
import InputDate from "@/src/components/form/InputDate";
import { FaCalendarDays } from "react-icons/fa6";
import ActivityPanel from "@/src/components/activities/ActivityPanel";
import { handleApiError } from "@/src/utils/api/errors";
import { createAgent, updateAgent } from "@/src/lib/apis";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import Image from "next/image";
import { clsx } from "clsx";
import moment from "moment";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  useEffect(() => {
    if (params.get("edit") === "true") {
      setIsEdit(true);
    }
  }, [params.get("edit")]);

  useEffect(() => {
    if (agent) {
      setSelectedProfileImage({ base64: agent?.avatar || null, file: null });
    }
  }, [agent]);

  const schema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string().email(t("common:validations:email")),
    phone: Yup.string(),
    birthdate: Yup.string(),
    childrens: Yup.number(),
    cua: Yup.string(),
    rfc: Yup.string(),
    bio: Yup.string(),
    password: Yup.string(),
    address: Yup.string(),
    recruitmentManagerId: Yup.string(),
    developmentManagerId: Yup.string(),
    observerId: Yup.string(),
    observations: Yup.string(),
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
    console.log({ session, agent });
    if (session && typeof agent === "undefined") {
      console.log("pase por aqui perrito");
      setValue(
        "recruitmentManagerId",
        lists?.users?.find((user) => user.id === session?.user?.id)?.id
      );
    }
  }, [session, lists?.users, setValue]);

  useEffect(() => {
    if (!id) {
      setIsEdit(true);
      return;
    }
    setLoading(true);

    if (agent?.user?.profile?.firstName)
      setValue("firstName", agent?.user?.profile?.firstName);
    if (agent?.user?.profile?.lastName)
      setValue("lastName", agent?.user?.profile?.lastName);
    if (agent?.user?.email) setValue("email", agent?.user?.email);
    if (agent?.user?.phone) setValue("phone", agent?.user?.phone);
    if (agent?.user?.profile?.birthday) {
      setValue("birthdate", agent?.user?.profile?.birthday);
      var a = moment(agent?.user?.profile?.birthday);
      setValue("age", moment().diff(a, "years"));
    }
    if (agent?.children) setValue("childrens", agent?.children);
    if (agent?.cua) setValue("cua", agent?.cua);
    if (agent?.user?.profile?.idcard)
      setValue("rfc", agent?.user?.profile?.idcard);
    if (agent?.user?.bio) setValue("bio", agent?.user?.bio);
    if (agent?.address) setValue("address", agent?.address);
    if (agent?.recruitmentManager)
      setValue("recruitmentManagerId", agent?.recruitmentManager?.id);
    if (agent?.developmentManager)
      setValue("developmentManagerId", agent?.developmentManager?.id);
    if (agent?.observer) setValue("observerId", agent?.observer?.id);
    if (agent?.observations) setValue("observations", agent?.observations);

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
    const { childrens, birthdate, ...other } = data;
    let body = {
      ...other,
      children: childrens,
      birthdate: moment(birthdate).format("YYYY-MM-DD"),
    };
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

        const response = await createAgent(formData);
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
        const response = await updateAgent(formData, id);
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
                error={errors.firstName}
                register={register}
                name="firstName"
                disabled={!isEdit}
              />
              <TextInput
                type="text"
                label={t("users:form:lastname")}
                placeholder={t("contacts:create:placeholder-name")}
                error={errors.lastName}
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
                    />
                  );
                }}
                name="phone"
                control={control}
                defaultValue=""
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
              {!isEdit && (
                <TextInput
                  label={t("agentsmanagement:accompaniments:agent:age")}
                  error={errors.age}
                  register={register}
                  name="age"
                  disabled={true}
                  type="number"
                />
              )}
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
                    />
                  );
                }}
                name="birthdate"
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
                error={errors?.childrens}
                register={register}
                name="childrens"
                type="number"
                disabled={!isEdit}
              />
              <TextInput
                label={t("contacts:create:rfc")}
                placeholder="XEXX010101000"
                error={errors?.rfc}
                register={register}
                name="rfc"
                disabled={!isEdit}
              />
              <TextInput
                label={t("contacts:create:cua")}
                error={errors?.cua}
                register={register}
                name="cua"
                disabled={!isEdit}
              />
              <TextInput
                label={t("contacts:create:address")}
                error={errors?.address}
                register={register}
                name="address"
                placeholder={t("contacts:create:placeholder-address")}
                disabled={!isEdit}
                multiple
                rows={3}
              />

              <SelectDropdown
                label={t("agentsmanagement:accompaniments:agent:manager")}
                name="developmentManagerId"
                options={lists?.users ?? []}
                disabled={!isEdit}
                error={errors?.developmentManagerId}
                setValue={setValue}
                watch={watch}
              />
              <SelectDropdown
                label={t("agentsmanagement:accompaniments:agent:responsible")}
                name="recruitmentManagerId"
                options={lists?.users ?? []}
                disabled={!isEdit}
                error={errors?.recruitmentManagerId}
                setValue={setValue}
                watch={watch}
              />
              <SelectDropdown
                label={t("agentsmanagement:accompaniments:agent:observer")}
                name="observerId"
                options={lists?.users ?? []}
                disabled={!isEdit}
                error={errors?.observerId}
                setValue={setValue}
                watch={watch}
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
              <TextInput
                label={t("agentsmanagement:accompaniments:agent:comments")}
                error={errors.address}
                register={register}
                name="observations"
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
