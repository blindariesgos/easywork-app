"use client";
import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAppContext from "@/src/context/app";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import MultipleSelect from "@/src/components/form/MultipleSelect";
import CRMMultipleSelectV2 from "@/src/components/form/CRMMultipleSelectV2";
import InputDateV2 from "@/src/components/form/InputDateV2";
import { FaCalendarDays } from "react-icons/fa6";
import Button from "@/src/components/form/Button";
import { useRouter, useSearchParams } from "next/navigation";
import OptionsTask from "./components/OptionsTask";
import { useSession } from "next-auth/react";
import {
  getContactId,
  getLeadById,
  getPolicyById,
  getReceiptById,
  getAgentById,
  postMeet,
  putMeetById,
} from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { getFormatDate } from "@/src/utils/getFormatDate";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { useSWRConfig } from "swr";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import SubTaskSelect from "@/src/components/form/SubTaskSelect";
import useMeetingsContext from "@/src/context/meetings";

const schemaInputs = yup.object().shape({
  title: yup.string().required(),
  responsible: yup.string(),
  createdBy: yup.array(),
  participants: yup.array(),
  observers: yup.array(),
  crm: yup.array(),
  listField: yup.array(),
  type: yup.string(),
});

export default function MeetEditor({ edit, copy, type }) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { lists } = useAppContext();
  const { settings } = useTasksConfigs();
  const [loading, setLoading] = useState(false);
  const [value, setValueText] = useState(
    edit?.description ?? copy?.description ?? ""
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [listField, setListField] = useState([]);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { mutate: mutateMeets } = useMeetingsContext();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    control,
    getValues,
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      title: edit?.title ?? "",
      startTime: edit?.startTime ?? "",
      participants: edit?.agents ?? [],
      responsible: edit?.developmentManager?.id ?? "",
      observers: edit?.observers ?? [],
      crm: formatCrmData(edit?.crm ?? copy?.crm ?? []),
      createdBy: edit ? [edit?.createdBy] : [],
      type: type,
    },
    resolver: yupResolver(schemaInputs),
  });

  //#region Logica conexion crm desde actividades
  const setCrmContact = async (contactId) => {
    const response = await getContactId(contactId);
    setValue("crm", [
      {
        id: response?.id,
        type: "contact",
        name: response?.fullName || response?.name,
      },
    ]);
    setValue("title", "CRM - Cliente: ");
    setLoading(false);
  };
  const setCrmLead = async (leadId) => {
    console.log("paso por lead");
    const response = await getLeadById(leadId);
    setValue("crm", [
      {
        id: response?.id,
        type: "lead",
        name: response?.fullName || response?.name,
      },
    ]);
    setValue("title", "CRM - Prospecto: ");
    setLoading(false);
  };
  const setCrmReceipt = async (receiptId) => {
    const response = await getReceiptById(receiptId);
    setValue("crm", [
      {
        id: response?.id,
        type: "receipt",
        name: response?.title,
      },
    ]);
    console.log("receipt", response);
    setValue("title", "CRM - Recibo: ");
    setLoading(false);
  };
  const setCrmAgent = async (agentId) => {
    const response = await getAgentById(agentId);
    setValue("crm", [
      {
        id: response?.id,
        type: "agent",
        name: response?.name,
      },
    ]);
    console.log("Agente", response);
    setValue("title", "CRM - Agente: ");
    setLoading(false);
  };
  const setCrmAgentMeet = async (agentIds) => {
    const ids = agentIds.split("^");
    const response = await Promise.all(ids.map((x) => getAgentById(agentIds)));
    console.log({ response });
    setValue("participants", response);
    // console.log("Agente", response);
    setLoading(false);
  };
  const setCrmPolicy = async (policyId, type) => {
    const response = await getPolicyById(policyId);
    setValue("crm", [
      {
        id: response?.id,
        name: `${response?.company?.name ?? ""} ${response?.poliza ?? ""} ${response?.type?.name ?? ""}`,
        type,
      },
    ]);
    setValue("title", `CRM - ${type == "policy" ? "Póliza" : "Renovación"}: `);
    setLoading(false);
  };
  useEffect(() => {
    const prevId = params.get("prev_id");

    if (params.get("prev") === "contact") {
      setLoading(true);
      setCrmContact(prevId);
      return;
    }

    if (params.get("prev") === "lead") {
      setLoading(true);
      setCrmLead(prevId);
      return;
    }

    if (["policy", "renewal"].includes(params.get("prev"))) {
      setLoading(true);
      setCrmPolicy(prevId, params.get("prev"));
      return;
    }

    if (params.get("prev") === "receipt") {
      setLoading(true);
      setCrmReceipt(prevId);
      return;
    }

    if (params.get("prev") === "agent") {
      setLoading(true);
      setCrmAgent(prevId);
      return;
    }

    if (params.get("prev") === "agent-meet") {
      setLoading(true);
      setCrmAgentMeet(prevId);
      return;
    }
  }, [params.get("prev")]);
  //#endregion

  useEffect(() => {
    if (session) {
      setValue(
        "createdBy",
        lists?.users.filter((user) => user.id === session.user?.sub)
      );
    }
  }, [session, lists?.users, setValue]);

  const createMeet = async (data, isNewTask) => {
    // if (data.name === "") return toast.error(t("tools:tasks:name-msg"));

    console.log({ data });
    const crm =
      data?.crm?.map((item) => ({ id: item.id, type: item.type })) || [];
    const body = buildMeetBody(
      data,
      value,
      selectedOptions,
      session,
      crm,
      listField,
      t
    );
    console.log({ body });
    try {
      setLoading(true);
      if (edit) {
        const response = await putMeetById(edit.id, body);
        if (response.hasError) {
          toast.error(
            response?.error?.message ?? "Ocurrio un error al editar la junta"
          );
          setLoading(false);

          return;
        }
        mutate(`/agent-management/meetings/${edit.id}`);
        toast.success("Junta actualizada exitosamente!");
        mutateMeets();
        router.back();
      } else {
        const response = await postMeet(body);
        if (response.hasError) {
          toast.error(
            response?.error?.message ?? "Ocurrio un error al crear la junta"
          );
          setLoading(false);

          return;
        }
        toast.success("Junta creada exitosamente!");
        mutateMeets();

        if (isNewTask) {
          reset();
          setValueText("");
          setValue("title", "");
        } else {
          router.back();
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      {loading && <LoaderSpinner />}
      <div
        className={`col-span-12 flex flex-col ${
          edit ? "h-full" : "h-screen"
        } relative w-full ${!edit && "overflow-y-auto"}`}
      >
        <div
          className={`flex flex-col flex-1 bg-gray-600 shadow-xl opacity-100  text-black rounded-tl-[35px] rounded-bl-[35px] p-2 sm:p-4`}
        >
          {(!edit ?? !copy) && (
            <div className="flex justify-between items-center py-2">
              <h1 className="text-xl font-medium">
                {t("agentsmanagement:meetings-and-sessions:new:title")}
              </h1>
              <IconDropdown
                icon={
                  <Cog8ToothIcon
                    className="h-8 w-8 text-primary"
                    aria-hidden="true"
                  />
                }
                options={settings}
                width="w-44"
              />
            </div>
          )}
          <div className="flex flex-col flex-1 bg-gray-100 text-black rounded-lg relative p-2 sm:p-4">
            <div className="flex justify-between gap-2 items-center">
              <div className="flex flex-col w-full">
                <input
                  {...register("title")}
                  placeholder={t(
                    "agentsmanagement:meetings-and-sessions:new:description"
                  )}
                  className="bg-transparent border-none focus:ring-0 w-full placeholder:text-black"
                />
              </div>
            </div>
            <OptionsTask
              setValueText={setValueText}
              value={value}
              setListField={setListField}
              edit={edit}
              copy={copy}
              addFile={!edit && setValue}
              files={!edit && (watch("fileIds") ?? [])}
            />
            <div className="mt-6 flex flex-col gap-3">
              {type == "individual" && (
                <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                  <p className="text-sm text-left w-full md:w-36">
                    {t("tools:tasks:new:crm")}
                  </p>
                  <div className="w-full md:w-[40%]">
                    <CRMMultipleSelectV2
                      getValues={getValues}
                      setValue={setValue}
                      name="crm"
                      error={errors.crm}
                      hidden={["poliza", "receipt", "renewal", "agent"]}
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                <p className="text-sm text-left w-full md:w-36">
                  {t("agentsmanagement:meetings-and-sessions:new:responsible")}
                </p>
                <div className="w-full md:w-[40%]">
                  <Controller
                    name="responsible"
                    control={control}
                    render={({ field }) => (
                      <SelectDropdown
                        {...field}
                        options={lists?.users || []}
                        getValues={getValues}
                        setValue={setValue}
                        name="responsible"
                        watch={watch}
                        error={errors.responsible}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                <p className="text-sm text-left w-full md:w-36">
                  {t("tools:tasks:new:created-by")}
                </p>
                <div className="w-full md:w-[40%]">
                  <Controller
                    name="createdBy"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <MultipleSelect
                        {...field}
                        options={lists?.users || []}
                        getValues={getValues}
                        setValue={setValue}
                        name="createdBy"
                        error={errors.createdBy}
                        onlyOne
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                <p className="text-sm text-left w-full md:w-36">
                  {type == "individual"
                    ? "Agente"
                    : t("tools:tasks:new:participants")}
                </p>
                <div className="w-full md:w-[40%]">
                  <Controller
                    name="participants"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <MultipleSelect
                        {...field}
                        options={lists?.policies?.agentesIntermediarios || []}
                        getValues={getValues}
                        setValue={setValue}
                        name="participants"
                        onlyOne={type != "group"}
                        error={errors.participants}
                      />
                    )}
                  />
                </div>
              </div>

              {/* <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                <p className="text-sm text-left w-full md:w-36">
                  {t("tools:tasks:new:observers")}
                </p>
                <div className="w-full md:w-[40%]">
                  <Controller
                    name="observers"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <MultipleSelect
                        {...field}
                        options={lists?.users || []}
                        getValues={getValues}
                        setValue={setValue}
                        name="observers"
                        error={errors.observers}
                      />
                    )}
                  />
                </div>
              </div> */}
              <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                <p className="text-sm text-left w-full md:w-36">
                  {t("agentsmanagement:meetings-and-sessions:new:date")}
                </p>
                <div className="w-full md:w-[40%]">
                  <Controller
                    render={({ field: { value, onChange, ref, onBlur } }) => {
                      return (
                        <InputDateV2
                          value={value}
                          onChange={onChange}
                          icon={
                            <FaCalendarDays className="h-4 w-4 text-primary" />
                          }
                          time
                          watch={watch}
                        />
                      );
                    }}
                    name="startTime"
                    control={control}
                    defaultValue=""
                  />
                </div>
              </div>
              <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                <p className="text-sm text-left w-full md:w-36">
                  {"Tarea Relacionada"}
                </p>
                <div className="w-full md:w-[40%]">
                  <SubTaskSelect
                    name="subTasks"
                    getValues={getValues}
                    setValue={setValue}
                    error={errors.subTask}
                    subtitle="Seleccionar tarea"
                    taskId={""}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`flex gap-4 flex-wrap mt-4 ${edit && "mb-4"}`}>
            <Button
              label={t("common:buttons:cancel")}
              buttonStyle="secondary"
              disabled={loading}
              className="px-3 py-2 drop-shadow-lg"
              onclick={handleCancel}
            />
            <Button
              label={
                loading
                  ? t("common:saving")
                  : edit
                    ? t("tools:tasks:new:update-task")
                    : "Agregar junta"
              }
              buttonStyle="primary"
              disabled={loading}
              className="px-3 py-2 drop-shadow-lg"
              onclick={handleSubmit((data) => createMeet(data, false))}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Función actualizada
const getCmrInfo = (cmr) => {
  if (!cmr || !cmr.type || !cmr.crmEntity) return null;

  const { id } = cmr.crmEntity;
  const { type } = cmr;

  let name = cmr.crmEntity.name;

  if (type === "contact" || type === "lead" || type === "agent") {
    name = cmr.crmEntity.fullName || cmr.crmEntity.name;
  }

  if (type === "poliza") {
    name = `${cmr?.crmEntity?.company?.name} ${cmr?.crmEntity?.poliza} ${cmr?.crmEntity?.type?.name}`;
  }

  if (type === "receipt") {
    name = cmr?.crmEntity?.title;
  }

  return { id, type, name };
};

const formatCrmData = (crmData) => {
  if (!crmData) return [];
  return crmData.map((item) => getCmrInfo(item));
};

const buildMeetBody = (
  data,
  description,
  selectedOptions,
  session,
  crm,
  listField,
  t
) => {
  const body = {
    title: data.title,
    description,
    createdById: session.user?.sub,
    crm,
    type: data?.type,
  };

  if (data.createdBy?.length) {
    body.createdById = data.createdBy[0].id;
  }
  if (data.observers?.length) {
    body.observersIds = data.observers.map((obs) => obs.id);
  }
  if (data.participants?.length) {
    body.agentsIds = data.participants.map((part) => part.id);
  }
  if (data.responsible?.length) {
    body.developmentManagerId = data.responsible;
  }
  if (data.subTasks?.length) {
    body.subtasksIds = data.subTasks.map((x) => x.id);
  }

  if (listField?.length) {
    body.listField = listField.map((item) => ({
      text: item.name,
      completed: item.subItems.every((subItem) => subItem.value),
      child: item.subItems
        .filter((subItem) => subItem.name)
        .map((subItem) => ({
          text: subItem.name,
          completed: subItem.value,
        })),
    }));
  }
  if (data?.fileIds?.length) {
    body.fileIds = data.fileIds;
  }
  body.startTime = getFormatDate(data.startTime) ?? null;

  console.log("body", body);

  return body;
};
