"use client";
import Button from "@/src/components/form/Button";
import TextEditor from "../TextEditor";
import IconDropdown from "@/src/components/SettingsButton";
import { formatDate, isTaskOverdue } from "@/src/utils/getFormatDate";
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { postComment } from "../../lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import clsx from "clsx";

//is a component that must recieve its props
export default function CardTask({ data }) {
  const { t } = useTranslation();
  const router = useRouter();
  const options = [
    {
      value: 0,
      name: t("common:buttons:edit"),
      onclick: () => {},
    },
    {
      value: 0,
      name: t("common:buttons:delete"),
      onclick: () => {},
    },
  ];

  const status = {
    overdue: "Vencida",
    completed: "Completada",
    pending: "Pendiente",
  };

  return (
    <div className="bg-white px-4 py-3 rounded-lg w-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <p className="text-xs text-primary font-bold">
            {t("tools:tasks:task")}
          </p>
          <span
            className={clsx(
              "inline-flex items-center rounded-full  px-2 py-1 text-[10px] font-medium",
              {
                "bg-red-100 text-red-800": data.status === "overdue",
                "bg-[#0f8bbf] text-white": data.status === "completed",
                "bg-yellow-500 text-white": data.status === "pending",
              }
            )}
          >
            {status[data.status] ?? data.status}
          </span>
          <p className="text-xs text-slate-500/60 font-medium">
            {formatDate(data.createdAt)}
          </p>
        </div>
        <div>
          <Image
            className="h-6 w-6 rounded-full object-cover"
            width={36}
            height={36}
            src={data?.createdBy?.avatar ?? "/img/avatar.svg"}
            alt=""
            title={
              data?.createdBy?.profile?.firstName
                ? `${data?.createdBy?.profile?.firstName} ${data?.createdBy?.profile?.lastName}`
                : (data?.createdBy?.username ?? "System")
            }
          />
        </div>
      </div>
      <div className="flex gap-4 md:gap-8 mt-3">
        <div className="flex flex-col gap-2">
          <div className="p-4 bg-gray-100 rounded-lg">
            <Image
              width={50}
              height={50}
              alt="task icon"
              src="/img/activities/task.svg"
            />
          </div>

          <Link
            href={`/tools/tasks/task/${data.id}?show=true`}
            className="flex items-center gap-x-2 rounded-md font-medium outline-none  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 justify-center bg-primary hover:bg-easy-500 text-white disabled:opacity-50 hover:bg-easy-500 shadow-sm text-sm"
          >
            {t("contacts:panel:open")}
          </Link>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-x-4 items-center">
            <p className="text-sm text-primary font-bold">
              {t("tools:tasks:panel:date")}:
            </p>
            {data?.deadline ? (
              <p className="text-xs font-normal bg-yellow-200 rounded-xl px-2 py-1 text-slate-500 flex items-center cursor-pointer align-middle lining-nums">
                <span className="leading-none align-middle">
                  {formatDate(data.deadline)}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-slate-500 ml-1" />
              </p>
            ) : (
              <p className="text-xs font-normal bg-blue-200 rounded-xl px-2 py-1 text-slate-600 flex items-center cursor-pointer">
                Ninguna
                <ChevronDownIcon className="h-4 w-4 text-slate-500 ml-1" />
              </p>
            )}
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-sm text-primary font-bold">
              {t("tools:tasks:panel:title")}:
            </p>
            <p className="text-sm text-blue-700 font-normal">
              <Link href={`/tools/tasks/task/${data.id}?show=true`}>
                {data.name}
              </Link>
            </p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-sm text-primary font-bold">
              {t("tools:tasks:panel:responsible")}:
            </p>
            <Link
              href={`/user/${data.id}?show=true`}
              className="text-sm text-blue-700 font-normal"
            >
              {data?.responsible[0]?.profile?.firstName
                ? `${data?.responsible[0]?.profile?.firstName} ${data?.responsible[0]?.profile?.lastName}`
                : data?.responsible[0]?.username}
            </Link>
          </div>
          <div className="flex justify-end mt-0 gap-2 items-center">
            {/* <div className="cursor-pointer" title="Agregar Comentario">
              <Menu as="div" className="relative inline-block text-left mt-1">
                {({ close }) => (
                  <Fragment>
                    <MenuButton className="inline-flex w-full focus:ring-0 outline-none focus:outline-none">
                      <RiFileEditLine className="h-4 w-4 text-black" />
                    </MenuButton>
                    <MenuItems
                      transition
                      anchor="bottom end"
                      className={`absolute right-0 mt-2 rounded-md  shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-[300px] md:w-[500px] p-2 bg-white`}
                    >
                      <div className="px-1 py-1 ">
                        <AddTaskComment close={close} task={data} />
                      </div>
                    </MenuItems>
                  </Fragment>
                )}
              </Menu>
            </div> */}
            <div title="Ver Opciones">
              <IconDropdown
                icon={
                  <EllipsisHorizontalIcon
                    className="h-4 w-4 text-black"
                    aria-hidden="true"
                  />
                }
                options={options}
                width="w-[100px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AddTaskComment = ({ close, task }) => {
  const [value, setValueText] = useState("");
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const body = {
      comment: value,
      isSummary: task.requireSummary,
      taskId: task.id,
    };
    const response = await postComment(body, task.id).catch(() => ({
      error: true,
    }));

    if (response.error) {
      toast.error(
        "Se ha producido un error al crear el comentario, inténtelo de nuevo."
      );
      setLoading(false);

      return;
    }
    toast.success("El comentario se ha añadido correctamente");
    close();
    setLoading(false);
  };

  return (
    <div>
      <div className="border rounded-md w-full h-full">
        <TextEditor
          quillRef={quillRef}
          value={value}
          className="h-full  w-full"
          setValue={(e) => {
            setValueText(e);
          }}
        />
      </div>
      <div className="pt-2 flex justify-end gap-2">
        <Button
          label={loading ? "Loading..." : "Guardar"}
          className="text-sm px-2 py-1"
          buttonStyle="primary"
          disabled={loading}
          onclick={handleAdd}
        />
        <Button
          label="Cancelar"
          className="text-sm px-2 py-1"
          buttonStyle="secondary"
          disabled={loading}
          onclick={close}
        />
      </div>
    </div>
  );
};
