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
import CheckBoxMultiple from "@/src/components/form/CkeckBoxMultiple";
import InputCheckBox from "@/src/components/form/InputCheckBox";
import Button from "@/src/components/form/Button";
import { useRouter, useSearchParams } from "next/navigation";
import OptionsTask from "./components/OptionsTask";
import { useSession } from "next-auth/react";
import {
  getContactId,
  postTask,
  putTaskId,
  getLeadById,
  getPolicyById,
  getReceiptById,
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
  participants: yup.array(),
  observers: yup.array(),
  crm: yup.array(),
  listField: yup.array(),
});

export default function MeetEditor({ edit, copy }) {
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
      participants: edit?.participants ?? copy?.participants ?? [],
      responsible: edit?.responsible ?? copy?.responsible ?? [],
      observers: edit?.observers ?? copy?.observers ?? [],
      crm: formatCrmData(edit?.crm ?? copy?.crm ?? []),
      createdBy: edit ? [edit.createdBy] : [],
    },
    resolver: yupResolver(schemaInputs),
  });

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

  const setCrmPolicy = async (policyId, type) => {
    const response = await getPolicyById(policyId);
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
  }, [params.get("prev")]);

  useEffect(() => {
    if (session) {
      setValue(
        "createdBy",
        lists?.users.filter((user) => user.id === session.user?.id)
      );
    }
  }, [session, lists?.users, setValue]);

  const createMeet = async (data, isNewTask) => {
    // if (data.name === "") return toast.error(t("tools:tasks:name-msg"));

    // const crm =
    //   data?.crm?.map((item) => ({ id: item.id, type: item.type })) || [];
    // const body = buildTaskBody(
    //   data,
    //   value,
    //   selectedOptions,
    //   session,
    //   crm,
    //   listField,
    //   t
    // );
    // console.log({ body });
    // try {
    //   setLoading(true);
    //   if (edit) {
    //     await putTaskId(edit.id, body);
    //     toast.success(t("tools:tasks:update-msg"));
    //     mutate(`/tools/tasks/task/${edit.id}`);
    //     router.push("/tools/tasks?page=1");
    //   } else {
    //     await postTask(body);
    //     toast.success(t("tools:tasks:success-msg"));

    //     if (isNewTask) {
    //       reset();
    //       setValueText("");
    //       setValue("name", "");
    //     } else {
    //       router.push("/tools/tasks?page=1");
    //     }
    //   }
    // } catch (error) {
    //   handleApiError(error.message);
    // } finally {
    //   setLoading(false);
    // }
    toast.success(t("tools:tasks:update-msg"));
    setLoading(false);
    router.back();
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
          className={`flex flex-col flex-1 ${
            !edit && "bg-gray-600 shadow-xl"
          } opacity-100  text-black rounded-tl-[35px] rounded-bl-[35px] p-2 ${
            edit ? "sm:p-0" : "sm:p-4"
          }`}
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
                  {...register("name")}
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
                  {t("agentsmanagement:meetings-and-sessions:new:responsible")}
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
              <div className="">
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
                      name="limitDate"
                      control={control}
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`flex gap-4 flex-wrap mt-4 ${edit && "mb-4"}`}>
            <Button
              label={
                loading
                  ? t("common:saving")
                  : edit
                    ? t("tools:tasks:new:update-task")
                    : t("agentsmanagement:meetings-and-sessions:new:add")
              }
              buttonStyle="primary"
              disabled={loading}
              className="px-3 py-2 drop-shadow-lg"
              onclick={handleSubmit((data) => createMeet(data, false))}
            />
            {/* {!edit && (
              <Button
                label={t("tools:tasks:new:add-create")}
                buttonStyle="secondary"
                disabled={loading}
                className="px-3 py-2 drop-shadow-lg"
                onclick={handleSubmit((data) => createTask(data, true))}
              />
            )} */}

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

  if (type === "contact" || type === "lead") {
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
  const body = {
    name: data.name,
    description,
    requireRevision: selectedOptions.some((sel) => sel.id === 2),
    requireSummary: data.requireSummary,
    responsibleCanChangeDate: selectedOptions.some((sel) => sel.id === 1),
    createdById: session.user?.id,
    crm,
    important: !!data?.important,
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

  body.deadline = getFormatDate(data.limitDate ?? data.endDate) ?? null;
  body.startTime = getFormatDate(data.startDate) ?? null;

  console.log("body", body);
  console.log(data.limitDate);
  console.log(data.endDate);

  return body;
};