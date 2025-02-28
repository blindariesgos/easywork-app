"use client";
import useAppContext from "@/src/context/app";
import { PencilIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useCallback, useEffect, useState } from "react";
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
import SelectDropdown from "@/src/components/form/SelectDropdown";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { clsx } from "clsx";
import moment from "moment";
import { useSession } from "next-auth/react";
import UserSelectAsync from "@/src/components/form/UserSelectAsync";

export default function General({ agent, id, refPrint, type, handleAdd }) {
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { data: session } = useSession();
  const utcOffset = moment().utcOffset();

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
    firstName: Yup.string().required(t("common:validations:required")),
    lastName: Yup.string().required(t("common:validations:required")),
    email: Yup.string().email(t("common:validations:email")),
    phone: Yup.string().required(t("common:validations:required")),
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
      setValue(
        "recruitmentManagerId",
        lists?.users?.find((user) => user.id === session?.user?.sub)?.id
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
    if (agent?.source) setValue("sourceId", agent?.source?.id);

    if (type === "accompaniment") {
      if (agent?.status) setValue("status", agent?.status);
    }

    if (type === "recruitment") {
      const recruitment = agent?.recruitments[0] ?? {};
      if (recruitment?.startDate)
        setValue(
          "recruitmentStartDate",
          moment(recruitment?.startDate).subtract(utcOffset, "minutes").format()
        );
      if (recruitment?.endDate)
        setValue(
          "recruitmentEndDate",
          moment(recruitment?.endDate).subtract(utcOffset, "minutes").format()
        );
      if (recruitment?.entryDate)
        setValue(
          "recruitmentEntryDate",
          moment(recruitment?.entryDate).subtract(utcOffset, "minutes").format()
        );
      if (recruitment?.agentRecruitmentStage)
        setValue(
          "agentRecruitmentStageId",
          recruitment?.agentRecruitmentStage?.id
        );
    }
    if (type === "conection") {
      const connection = agent?.connections[0] ?? {};

      if (connection?.endDate)
        setValue(
          "connectionEndDate",
          moment(connection?.endDate).subtract(utcOffset, "minutes").format()
        );
      if (connection?.startDate)
        setValue(
          "connectionStartDate",
          moment(connection?.startDate).subtract(utcOffset, "minutes").format()
        );
      if (connection?.idcardNumber)
        setValue("idcardNumber", connection?.idcardNumber);
      if (connection?.cnsfDate)
        setValue(
          "connectionCnsfDate",
          moment(connection?.cnsfDate).subtract(utcOffset, "minutes").format()
        );
      if (connection?.effectiveDateCua)
        setValue(
          "effectiveDateCua",
          moment(connection?.effectiveDateCua)
            .subtract(utcOffset, "minutes")
            .format()
        );
      if (connection?.effectiveDateIdcard)
        setValue(
          "effectiveDateIdcard",
          moment(connection?.effectiveDateIdcard)
            .subtract(utcOffset, "minutes")
            .format()
        );
      if (connection?.agentConnectionStage)
        setValue(
          "agentConnectionStageId",
          connection?.agentConnectionStage?.id
        );
    }
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

  const handleSubmitForm = (data) => {
    handleAdd && handleAdd(data, selectedProfileImage);
  };

  return (
    <Fragment>
      <div className="px-4 lg:px-8 h-full w-full">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
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
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 pb-[7rem] pt-4">
              <TextInput
                type="text"
                label={t("agentsmanagement:general:firstname")}
                placeholder={t("contacts:create:placeholder-name")}
                error={errors.firstName}
                register={register}
                name="firstName"
                disabled={!isEdit}
              />
              <TextInput
                type="text"
                label={t("agentsmanagement:general:lastname")}
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
              {/* {!isEdit && (
                <TextInput
                  label={t("agentsmanagement:accompaniments:agent:age")}
                  error={errors.age}
                  register={register}
                  name="age"
                  disabled={true}
                  type="number"
                />
              )} */}
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
              {type === "accompaniment" && <Fragment></Fragment>}
              <SelectInput
                label={t("contacts:create:position")}
                name="bio"
                options={[
                  {
                    id: "Novel",
                    name: "Novel",
                  },
                  {
                    id: "Consolidado",
                    name: "Consolidado",
                  },
                ]}
                error={errors.bio}
                setValue={setValue}
                disabled={!isEdit}
                watch={watch}
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
                label={t("contacts:create:address")}
                error={errors?.address}
                register={register}
                name="address"
                placeholder={"Opcional"}
                disabled={!isEdit}
                multiple
                rows={3}
              />
              <SelectInput
                label={t("contacts:create:origen")}
                name="sourceId"
                options={lists?.recruitments?.agentSources ?? []}
                error={errors.sourceId}
                register={register}
                setValue={setValue}
                disabled={!isEdit}
                watch={watch}
              />
              {type === "accompaniment" && (
                <SelectInput
                  label={t("agentsmanagement:accompaniments:status")}
                  name="status"
                  options={[
                    {
                      name: "Seguimiento",
                      id: "Seguimiento",
                    },
                    {
                      name: "Aprobado",
                      id: "Aprobado",
                    },
                    {
                      name: "No aprobado-sin seguimiento",
                      id: "No aprobado-sin seguimiento",
                    },
                    {
                      name: "No volver a contactar",
                      id: "No volver a contactar",
                    },
                  ]}
                  error={errors.status}
                  setValue={setValue}
                  disabled={!isEdit}
                  watch={watch}
                />
              )}
              {type === "recruitment" && (
                <Fragment>
                  <SelectInput
                    label={t("agentsmanagement:recruitment:table:state")}
                    name="agentRecruitmentStageId"
                    options={lists?.recruitments?.agentRecruitmentStages ?? []}
                    error={errors.agentRecruitmentStageId}
                    register={register}
                    setValue={setValue}
                    disabled={!isEdit}
                    watch={watch}
                  />
                  <Controller
                    render={({ field: { value, onChange, ref, onBlur } }) => {
                      return (
                        <InputDate
                          label={t("agentsmanagement:recruitment:init-date")}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          icon={
                            <FaCalendarDays className="h-3 w-3 text-primary pr-4 mr-2" />
                          }
                          error={errors.recruitmentStartDate}
                          disabled={!isEdit}
                        />
                      );
                    }}
                    name="recruitmentStartDate"
                    control={control}
                    defaultValue=""
                  />
                  <Controller
                    render={({ field: { value, onChange, ref, onBlur } }) => {
                      return (
                        <InputDate
                          label={t("agentsmanagement:recruitment:end-date")}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          icon={
                            <FaCalendarDays className="h-3 w-3 text-primary pr-4 mr-2" />
                          }
                          error={errors.recruitmentEndDate}
                          disabled={!isEdit}
                        />
                      );
                    }}
                    name="recruitmentEndDate"
                    control={control}
                    defaultValue=""
                  />
                  <Controller
                    render={({ field: { value, onChange, ref, onBlur } }) => {
                      return (
                        <InputDate
                          label={t("agentsmanagement:recruitment:entry-date")}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          icon={
                            <FaCalendarDays className="h-3 w-3 text-primary pr-4 mr-2" />
                          }
                          error={errors.recruitmentEntryDate}
                          disabled={!isEdit}
                        />
                      );
                    }}
                    name="recruitmentEntryDate"
                    control={control}
                    defaultValue=""
                  />
                </Fragment>
              )}

              {type === "conection" && (
                <Fragment>
                  <SelectInput
                    label={t("agentsmanagement:recruitment:table:state")}
                    name="agentConnectionStageId"
                    options={lists?.connections?.agentConnectionStages ?? []}
                    error={errors.agentConnectionStageId}
                    register={register}
                    setValue={setValue}
                    disabled={!isEdit}
                    watch={watch}
                  />
                  <TextInput
                    label={t("agentsmanagement:conections:idcardNumber")}
                    error={errors?.idcardNumber}
                    register={register}
                    name="idcardNumber"
                    disabled={!isEdit}
                  />
                  <Controller
                    render={({ field: { value, onChange, ref, onBlur } }) => {
                      return (
                        <InputDate
                          label={t(
                            "agentsmanagement:conections:effectiveDateCua"
                          )}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          icon={
                            <FaCalendarDays className="h-3 w-3 text-primary pr-4 mr-2" />
                          }
                          error={errors.effectiveDateCua}
                          disabled={!isEdit}
                        />
                      );
                    }}
                    name="effectiveDateCua"
                    control={control}
                    defaultValue=""
                  />
                  <Controller
                    render={({ field: { value, onChange, ref, onBlur } }) => {
                      return (
                        <InputDate
                          label={t(
                            "agentsmanagement:conections:effectiveDateIdcard"
                          )}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          icon={
                            <FaCalendarDays className="h-3 w-3 text-primary pr-4 mr-2" />
                          }
                          error={errors.effectiveDateIdcard}
                          disabled={!isEdit}
                        />
                      );
                    }}
                    name="effectiveDateIdcard"
                    control={control}
                    defaultValue=""
                  />
                  <Controller
                    render={({ field: { value, onChange, ref, onBlur } }) => {
                      return (
                        <InputDate
                          label={t("agentsmanagement:recruitment:init-date")}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          icon={
                            <FaCalendarDays className="h-3 w-3 text-primary pr-4 mr-2" />
                          }
                          error={errors.connectionStartDate}
                          disabled={!isEdit}
                        />
                      );
                    }}
                    name="connectionStartDate"
                    control={control}
                    defaultValue=""
                  />
                  <Controller
                    render={({ field: { value, onChange, ref, onBlur } }) => {
                      return (
                        <InputDate
                          label={t("agentsmanagement:recruitment:end-date")}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          icon={
                            <FaCalendarDays className="h-3 w-3 text-primary pr-4 mr-2" />
                          }
                          error={errors.connectionEndDate}
                          disabled={!isEdit}
                        />
                      );
                    }}
                    name="connectionEndDate"
                    control={control}
                    defaultValue=""
                  />

                  <Controller
                    render={({ field: { value, onChange, ref, onBlur } }) => {
                      return (
                        <InputDate
                          label={t("agentsmanagement:conections:table:indate")}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          icon={
                            <FaCalendarDays className="h-3 w-3 text-primary pr-4 mr-2" />
                          }
                          error={errors.connectionCnsfDate}
                          disabled={!isEdit}
                        />
                      );
                    }}
                    name="connectionCnsfDate"
                    control={control}
                    defaultValue=""
                  />
                </Fragment>
              )}
              <UserSelectAsync
                label={t("agentsmanagement:accompaniments:agent:manager")}
                name="developmentManagerId"
                disabled={!isEdit}
                error={errors?.developmentManagerId}
                setValue={setValue}
                watch={watch}
              />
              <UserSelectAsync
                label={t("agentsmanagement:accompaniments:agent:responsible")}
                name="recruitmentManagerId"
                disabled={!isEdit}
                error={errors?.recruitmentManagerId}
                setValue={setValue}
                watch={watch}
              />
              <UserSelectAsync
                label={t("agentsmanagement:accompaniments:agent:observer")}
                name="observerId"
                disabled={!isEdit}
                error={errors?.observerId}
                setValue={setValue}
                watch={watch}
              />

              <TextInput
                label={t("agentsmanagement:accompaniments:agent:comments")}
                error={errors.observations}
                register={register}
                name="observations"
                disabled={!isEdit}
                placeholder={"Opcional"}
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
