"use client";
import TextEditor from "../../../../tools/(tool)/tasks/components/TextEditor";
import IconDropdown from "@/src/components/SettingsButton";
import { formatDate, isTaskOverdue } from "@/src/utils/getFormatDate";
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsBriefcase } from "react-icons/bs";
import { RiFileEditLine } from "react-icons/ri";
//is a component that must recieve its props
export default function CardTask({ data }) {
  const { t } = useTranslation();
  const [value, setValueText] = useState("");
  const quillRef = useRef(null);

  const handleComment = async (e) => {
    if (e.key === "Enter") {
      if (quillRef.current) {
        const quillEditor = quillRef.current.getEditor();
        const currentContents = quillEditor.getContents();
        const text = currentContents.ops.map((op) => op.insert).join("");
      }
    }
  };

  const options = [
    {
      value: 0,
      name: t("common:buttons:edit"),
      onclick: () => { },
    },
    {
      value: 0,
      name: t("common:buttons:delete"),
      onclick: () => { },
    },
  ];

  const TextEditorComponent = () => (
    <TextEditor
      quillRef={quillRef}
      value={value}
      className="sm:h-16 h-30  w-full"
      setValue={setValueText}
      handleKeyDown={(e) => handleComment(e)}
    />
  );
  return (
    <div className="bg-white px-4 py-3 rounded-lg w-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <p className="text-xs text-primary font-medium">
            {t("tools:tasks:task")}
          </p>
          {isTaskOverdue(data) && (<span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
            Vencida
          </span>)}
          <p className="text-xs text-slate-500/60 font-medium">
            {formatDate(data.createdAt)}
          </p>
        </div>
        <div>
          <Image
            className="h-6 w-6 rounded-full object-cover"
            width={36}
            height={36}
            src={data?.createdBy?.avatar}
            alt=""
          />
        </div>
      </div>
      <div className="flex gap-4 md:gap-8 mt-3">
        <div className="flex flex-col gap-2">
          <div className="p-4 bg-gray-100 rounded-lg">
            <BsBriefcase className="h-12 w-12 text-black" />
          </div>
          <Link href={`/tools/tasks/task/${data.id}?show=true`} className="text-xs text-primary font-medium px-4 py-2 bg-gray-100 rounded-lg flex justify-center items-center hover:bg-gray-200/50">
            {t("contacts:panel:open")}
          </Link>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-x-4 items-center">
            <p className="text-sm text-black font-medium">
              {t("tools:tasks:panel:date")}:
            </p>
            {data?.deadline ? (<p className="text-xs font-normal bg-yellow-200 rounded-xl px-2 py-1 text-slate-500 flex items-center cursor-pointer align-middle lining-nums"><span className="leading-none align-middle">{formatDate(data.deadline)}</span>
              <ChevronDownIcon className="h-4 w-4 text-slate-500 ml-1" />
            </p>) : (<p className="text-xs font-normal bg-blue-200 rounded-xl px-2 py-1 text-slate-600 flex items-center cursor-pointer">Ninguna
              <ChevronDownIcon className="h-4 w-4 text-slate-500 ml-1" />
            </p>)}
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-sm text-black font-medium">
              {t("tools:tasks:panel:title")}:
            </p>
            <p className="text-sm text-blue-700 font-normal">
              <Link href={`/tools/tasks/task/${data.id}?show=true`}>{data.name}</Link>
            </p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-sm text-black font-medium">
              {t("tools:tasks:panel:responsible")}:
            </p>
            <Link href={`/user/${data.id}?show=true`} className="text-sm text-blue-700 font-normal">
              {data?.responsible[0]?.profile?.firstName ? `${data?.responsible[0]?.profile?.firstName} ${data?.responsible[0]?.profile?.lastName}` : data?.responsible[0]?.username}</Link>
          </div>
          <div className="flex justify-end mt-0 gap-2 items-center">
            <div className="cursor-pointer">
              <IconDropdown
                icon={<RiFileEditLine className="h-4 w-4 text-black" />}
                width="w-[300px] md:w-[500px] p-2"
              >
                <div className="border rounded-md w-full h-28">
                  {TextEditorComponent()}
                </div>
              </IconDropdown>
            </div>
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
  );
}
