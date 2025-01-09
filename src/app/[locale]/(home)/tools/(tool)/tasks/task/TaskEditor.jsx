"use client";
import { Cog8ToothIcon, FireIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAppContext from "@/src/context/app";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import MultipleSelect from "@/src/components/form/MultipleSelect";
import CRMMultipleSelectV2 from "@/src/components/form/CRMMultipleSelectV2";
import SubTaskSelect from "@/src/components/form/SubTaskSelect";
import InputDateV2 from "@/src/components/form/InputDateV2";
import { FaCalendarDays } from "react-icons/fa6";
import DateTimeCalculator from "../components/DateTimeCalculator";
import CheckBoxMultiple from "@/src/components/form/CkeckBoxMultiple";
import InputCheckBox from "@/src/components/form/InputCheckBox";
import Button from "@/src/components/form/Button";
import { useRouter, useSearchParams } from "next/navigation";
import OptionsTask from "../components/OptionsTask";
import { useSession } from "next-auth/react";
import MultiSelectTags from "../components/MultiSelectTags";
import {
  getContactId,
  postTask,
  putTaskId,
  getLeadById,
  getPolicyById,
  getReceiptById,
  getAgentById,
} from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { getFormatDate } from "@/src/utils/getFormatDate";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import IconDropdown from "@/src/components/SettingsButton";
import { useSWRConfig } from "swr";
import useTasksContext from "@/src/context/tasks";

const schemaInputs = yup.object().shape({
  name: yup.string().required(),
  responsible: yup.array(),
  createdBy: yup.array(),
  subTask: yup.array(),
  participants: yup.array(),
  observers: yup.array(),
  limitDate: yup.string().nullable(),
  startDate: yup.string(),
  duration: yup.string(),
  endDate: yup.string(),
  crm: yup.array(),
  tags: yup.array(),
  listField: yup.array(),
  important: yup.boolean(),
  fileIds: yup.array(),
});

export default function TaskEditor({ edit, copy, subtask }) {
  const { data: session } = useSession();
  const { mutate: updateTask } = useTasksContext();
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { lists } = useAppContext();
  const { settings } = useTasksConfigs();
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [value, setValueText] = useState(
    edit?.description ?? copy?.description ?? ""
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [checkedTime, setCheckedTime] = useState(false);
  const [checkedTask, setCheckedTask] = useState(false);
  const [listField, setListField] = useState([]);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [openOptions, setOpenOptions] = useState({
    created: !!edit?.createdBy,
    participants:
      (edit?.participants?.length ?? copy?.participants?.length) > 0,
    observers: (edit?.observers?.length ?? copy?.observers?.length) > 0,
    time: !!(edit?.deadline ?? copy?.deadline),
    options:
      (edit?.responsibleCanChangeDate ?? copy?.responsibleCanChangeDate) ||
      (edit?.requireRevision ?? copy?.requireRevision),
    more: (edit?.crm?.length ?? copy?.crm?.length ?? subtask) > 0,
  });

  const optionsTime = [
    {
      id: 1,
      name: t("tools:tasks:new:person-responsible"),
    },
    {
      id: 2,
      name: t("tools:tasks:new:review-task"),
    },
    {
      id: 3,
      name: t("tools:tasks:new:add-favorites"),
    },
    {
      id: 4,
      name: t("tools:tasks:new:add-plan"),
    },
  ];

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
      name: edit?.name ?? copy?.name ?? "",
      limitDate: edit?.deadline ?? copy?.deadline ?? "",
      startDate: edit?.startTime ?? copy?.startTime ?? "",
      endDate:
        edit?.startTime || copy?.startTime
          ? (edit?.deadline ?? copy?.deadline ?? "")
          : "",
      participants: edit?.participants ?? copy?.participants ?? [],
      responsible: edit?.responsible ?? copy?.responsible ?? [],
      observers: edit?.observers ?? copy?.observers ?? [],
      tags: edit?.tags ?? copy?.tags ?? [],
      subTask: subtask ? [subtask] : [],
      crm: formatCrmData(edit?.crm ?? copy?.crm ?? []),
      createdBy: edit ? [edit.createdBy] : [],
      important: edit?.important ?? copy?.important ?? false,
      metadata: edit?.metadata ?? copy?.metadata ?? {},
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
    setValue("name", "CRM - Cliente: ");
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
    setValue("name", "CRM - Prospecto: ");
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
    setValue("name", "CRM - Recibo: ");
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
    setValue("name", "CRM - Agente: ");
    setLoading(false);
  };
  const setCrmPolicy = async (policyId, type) => {
    const response = await getPolicyById(policyId);
    console.log({ response });
    if (!response?.id) {
      setLoading(false);
      return;
    }
    setValue("crm", [
      {
        id: response?.id,
        name: `${response?.company?.name ?? ""} ${response?.poliza ?? ""} ${response?.type?.name ?? ""}`,
        type,
      },
    ]);
    setValue("name", `CRM - ${type == "policy" ? "Póliza" : "Renovación"}: `);
    setLoading(false);
  };
  const setCrmMeet = async (agentId) => {
    const response = localStorage.getItem(agentId);
    console.log(response, agentId);

    if (!response) {
      console.log("no hay meet 1");
      setLoading(false);
      return;
    }

    const data = JSON.parse(response);

    if (!data) {
      console.log("no hay meet 2");
      setLoading(false);
      return;
    }
    const { userId, ...metadata } = data;

    const user = lists.users.find((x) => x.id == userId);
    setValue(
      "createdBy",
      lists?.users.filter((user) => user.id === data.developmentManagerId)
    );
    setValue("responsible", [user]);
    setValue("metadata", metadata);
    setValue("name", "CRM - Junta: ");
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

    if (params.get("prev") === "meet") {
      setLoading(true);
      setCrmMeet(prevId);
      return;
    }
  }, [params.get("prev")]);
  //#endregion

  useEffect(() => {
    setValue("metadata.taggedUsers", taggedUsers);
  }, [taggedUsers]);

  useEffect(() => {
    if (session && params.get("prev") != "meet") {
      setValue(
        "createdBy",
        lists?.users.filter((user) => user.id === session.user?.id)
      );
    }
  }, [session, lists?.users, setValue]);

  useEffect(() => {
    if (edit) {
      setCheckedTime(edit.requireSummary);
      const optionsSelected = getSelectedOptions(edit, t);
      setSelectedOptions(optionsSelected);
    }
  }, [edit, t]);

  useEffect(() => {
    setValue("important", edit?.important ?? copy?.important ?? false);
    setCheck(edit?.important ?? copy?.important ?? false);
  }, [edit, copy]);

  const createTask = async (data, isNewTask) => {
    if (data.name === "") return toast.error(t("tools:tasks:name-msg"));

    const crm =
      data?.crm?.map((item) => ({ id: item.id, type: item.type })) || [];
    const body = buildTaskBody(
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
        await putTaskId(edit.id, body);
        toast.success(t("tools:tasks:update-msg"));
        mutate(`/tools/tasks/task/${edit.id}`);
        updateTask();
        router.back();
      } else {
        await postTask(body);
        toast.success(t("tools:tasks:success-msg"));
        updateTask();

        if (isNewTask) {
          reset();
          setValueText("");
          setValue("name", "");
        } else {
          router.back();
        }
      }
    } catch (error) {
      handleApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (params.get("prev")) {
      router.back();
    } else {
      router.push(`/tools/tasks?page=1`);
    }
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
          className={`flex flex-col flex-1 ${
            !edit && "bg-gray-600 shadow-xl"
          } opacity-100  text-black rounded-tl-[35px] rounded-bl-[35px] p-2 ${
            edit ? "sm:p-0" : "sm:p-4"
          }`}
        >
          {(!edit ?? !copy) && (
            <div className="flex justify-between items-center py-2">
              <h1 className="text-xl font-medium">
                {t("tools:tasks:new:title")}
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
                  {...register("name")}
                  placeholder={t("tools:tasks:new:description")}
                  className="bg-transparent border-none focus:ring-0 w-full placeholder:text-black"
                />
              </div>
              <div className="flex gap-2 items-center w-48">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-0"
                  value={check}
                  checked={check}
                  onChange={(e) => {
                    setCheck(e.target.checked);
                    setValue("important", e.target.checked);
                  }}
                />
                <p className="text-sm">{t("tools:tasks:new:high")}</p>
                <FireIcon
                  className={`h-5 w-5 ${
                    check ? "text-orange-400" : "text-gray-200"
                  }`}
                />
              </div>
            </div>
            <OptionsTask
              setValueText={setValueText}
              value={value}
              setListField={setListField}
              edit={edit}
              copy={copy}
              taggedUsers={taggedUsers}
              setTaggedUsers={setTaggedUsers}
              addFile={!edit && setValue}
              files={!edit && (watch("fileIds") ?? [])}
            />
            <div className="mt-6 flex flex-col gap-3">
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
                  />
                </div>
              </div>
              <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                <p className="text-sm text-left w-full md:w-36">
                  {t("tools:tasks:new:responsible")}
                </p>
                <div className="w-full md:w-[40%]">
                  <Controller
                    name="responsible"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <MultipleSelect
                        {...field}
                        options={lists?.users || []}
                        getValues={getValues}
                        setValue={setValue}
                        onlyOne
                        name="responsible"
                        error={errors.responsible}
                      />
                    )}
                  />
                </div>
                <div className="flex gap-2 sm:gap-6 flex-wrap items-center sm:ml-6">
                  <div
                    className="cursor-pointer hover:text-primary hover:border-b hover:border-dashed"
                    onClick={() =>
                      setOpenOptions({
                        ...openOptions,
                        created: !openOptions.created,
                      })
                    }
                  >
                    <p className="text-sm">{t("tools:tasks:new:created-by")}</p>
                  </div>
                  <div
                    className="cursor-pointer hover:text-primary hover:border-b hover:border-dashed"
                    onClick={() =>
                      setOpenOptions({
                        ...openOptions,
                        participants: !openOptions.participants,
                      })
                    }
                  >
                    <p className="text-sm">
                      {t("tools:tasks:new:participants")}
                    </p>
                  </div>
                  <div
                    className="cursor-pointer hover:text-primary hover:border-b hover:border-dashed"
                    onClick={() =>
                      setOpenOptions({
                        ...openOptions,
                        observers: !openOptions.observers,
                      })
                    }
                  >
                    <p className="text-sm">{t("tools:tasks:new:observers")}</p>
                  </div>
                </div>
              </div>
              {openOptions.created && (
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
              )}
              {openOptions.participants && (
                <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                  <p className="text-sm text-left w-full md:w-36">
                    {t("tools:tasks:new:participants")}
                  </p>
                  <div className="w-full md:w-[40%]">
                    <Controller
                      name="participants"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <MultipleSelect
                          {...field}
                          options={lists?.users || []}
                          getValues={getValues}
                          setValue={setValue}
                          name="participants"
                          error={errors.participants}
                        />
                      )}
                    />
                  </div>
                </div>
              )}
              {openOptions.observers && (
                <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
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
                </div>
              )}
              <div className="">
                <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                  <p className="text-sm text-left w-full md:w-36">
                    {t("tools:tasks:new:limit-date")}
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
                      name="limitDate"
                      control={control}
                      defaultValue=""
                    />
                  </div>
                  <div className="flex gap-2 sm:gap-6 flex-wrap items-center sm:ml-6">
                    <div
                      className="cursor-pointer hover:text-primary hover:border-b hover:border-dashed"
                      onClick={() => {
                        setValue("endDate", "");
                        setValue("duration", 0);
                        setValue("startDate", "");
                        setOpenOptions({
                          ...openOptions,
                          time: !openOptions.time,
                        });
                      }}
                    >
                      <p className="text-sm">{t("tools:tasks:new:time")}</p>
                    </div>
                    <div
                      className="cursor-pointer hover:text-primary hover:border-b hover:border-dashed"
                      onClick={() =>
                        setOpenOptions({
                          ...openOptions,
                          options: !openOptions.options,
                        })
                      }
                    >
                      <p className="text-sm">{t("tools:tasks:new:options")}</p>
                    </div>
                  </div>
                </div>
              </div>
              {openOptions.time && (
                <DateTimeCalculator
                  control={control}
                  watch={watch}
                  setValue={setValue}
                />
              )}
              {openOptions.options && (
                <div className="flex gap-2 flex-col w-full mt-4 md:pl-36">
                  {optionsTime.map((opt, index) => (
                    <CheckBoxMultiple
                      key={index}
                      item={opt}
                      setSelectedCheckbox={setSelectedOptions}
                      selectedCheckbox={selectedOptions}
                      label={opt.name}
                    />
                  ))}
                </div>
              )}
              <div>
                <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                  <p className="text-sm text-left w-full md:w-36">
                    {t("tools:tasks:new:summary")}
                  </p>
                  <div className="w-full md:w-[40%]">
                    <InputCheckBox
                      label={t("tools:tasks:new:status")}
                      setChecked={setCheckedTime}
                      checked={checkedTime}
                    />
                  </div>
                </div>
              </div>
              <div
                className="flex gap-2 flex-wrap cursor-pointer mt-4 items-center"
                onClick={() =>
                  setOpenOptions({ ...openOptions, more: !openOptions.more })
                }
              >
                <div>
                  <ChevronDownIcon
                    className={`w-4 h-4 ${
                      openOptions.more && "rotate-180"
                    } text-primary`}
                  />
                </div>
                <div className="flex gap-2 text-sm">
                  <p className="font-medium">{t("tools:tasks:new:more")}</p>
                  <p>({t("tools:tasks:new:tracking")},</p>
                  <p>{t("tools:tasks:new:tags")})</p>
                </div>
              </div>
              {openOptions.more && (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                    <p className="text-sm text-left w-full md:w-36">
                      {t("tools:tasks:new:tracking")}
                    </p>
                    <div className="w-full md:w-[40%]">
                      <InputCheckBox
                        label={t("tools:tasks:new:time-task")}
                        setChecked={setCheckedTask}
                        checked={checkedTask}
                      />
                    </div>
                  </div>
                  {/* Sub Task */}
                  {!edit && (
                    <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                      <p className="text-sm text-left w-full md:w-36">
                        {t("tools:tasks:new:subtask")}
                      </p>
                      <div className="w-full md:w-[40%]">
                        <SubTaskSelect
                          name="subTask"
                          getValues={getValues}
                          setValue={setValue}
                          disabled={subtask}
                          error={errors.subTask}
                          onlyOne
                          subtitle="Seleccionar tarea padre"
                          taskId={edit?.id ?? copy?.id ?? ""}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 sm:flex-row flex-col sm:items-center">
                    <p className="text-sm text-left w-full md:w-36">
                      {t("tools:tasks:new:tags")}
                    </p>
                    <div className="w-full md:w-[40%]">
                      <MultiSelectTags
                        getValues={getValues}
                        setValue={setValue}
                        name="tags"
                        error={errors.tags}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={`flex gap-4 flex-wrap mt-4 ${edit && "mb-4"}`}>
            <Button
              label={
                loading
                  ? t("common:saving")
                  : edit
                    ? t("tools:tasks:new:update-task")
                    : t("tools:tasks:new:add-task")
              }
              buttonStyle="primary"
              disabled={loading}
              className="px-3 py-2 drop-shadow-lg"
              onclick={handleSubmit((data) => createTask(data, false))}
            />
            {!edit && (
              <Button
                label={t("tools:tasks:new:add-create")}
                buttonStyle="secondary"
                disabled={loading}
                className="px-3 py-2 drop-shadow-lg"
                onclick={handleSubmit((data) => createTask(data, true))}
              />
            )}

            <Button
              label={t("common:buttons:cancel")}
              buttonStyle="secondary"
              disabled={loading}
              className="px-3 py-2 drop-shadow-lg"
              onclick={handleCancel}
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

const getSelectedOptions = (edit, t) => {
  const optionsSelected = [];
  if (edit?.requireRevision) {
    optionsSelected.push({
      id: 2,
      name: t("tools:tasks:new:review-task"),
    });
  }
  if (edit?.responsibleCanChangeDate) {
    optionsSelected.push({
      id: 1,
      name: t("tools:tasks:new:person-responsible"),
    });
  }
  return optionsSelected;
};

const buildTaskBody = (
  data,
  description,
  selectedOptions,
  session,
  crm,
  listField,
  t
) => {
  console.log({ data });
  const body = {
    name: data.name,
    description,
    requireRevision: selectedOptions.some((sel) => sel.id === 2),
    requireSummary: data.requireSummary,
    responsibleCanChangeDate: selectedOptions.some((sel) => sel.id === 1),
    createdById: session.user?.id,
    crm,
    important: !!data?.important,
    metadata: data.metadata,
  };

  if (data.createdBy?.length) {
    body.createdById = data.createdBy[0].id;
  }
  if (data.observers?.length) {
    body.observersIds = data.observers.map((obs) => obs.id);
  }
  if (data.participants?.length) {
    body.participantsIds = data.participants.map((part) => part.id);
  }
  if (data.responsible?.length) {
    body.responsibleIds = data.responsible.map((resp) => resp.id);
  }
  if (data.subTask?.length) {
    body.parentId = data.subTask[0].id;
  }
  if (data.tags?.length) {
    body.tagsIds = data.tags.map((tag) => tag.id);
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

  body.deadline = getFormatDate(data.limitDate ?? data.endDate) ?? null;
  body.startTime = getFormatDate(data.startDate) ?? null;

  console.log("body", body);
  console.log(data.limitDate);
  console.log(data.endDate);

  return body;
};
