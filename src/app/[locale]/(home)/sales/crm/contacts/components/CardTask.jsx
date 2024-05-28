"use client";
import TextEditor from "../../../../tools/tasks/components/TextEditor";
import IconDropdown from "../../../../../../../components/SettingsButton";
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsBriefcase } from "react-icons/bs";
import { RiFileEditLine } from "react-icons/ri";
//is a component that must recieve its props
export default function CardTask() {
  const { t } = useTranslation();
  const [value, setValueText] = useState("");
  const quillRef = useRef(null);
  const [openEdit, setOpenEdit] = useState(false);

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
      onclick: () => {},
    },
    {
      value: 0,
      name: t("common:buttons:delete"),
      onclick: () => {},
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
          <div className="flex justify-center items-center p-1 bg-red-300 rounded-md">
            <p className="text-xs text-primary font-medium">Vencida</p>
          </div>
          <p className="text-xs text-primary font-medium">
            {t("contacts:panel:date")}: 02/02/2024 13:33 pm
          </p>
        </div>
        <div>
          <Image
            className="h-6 w-6 rounded-full object-cover"
            width={36}
            height={36}
            src="https://images.unsplash.com/photo-1542309667-2a115d1f54c6?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
      </div>
      <div className="flex gap-4 md:gap-8 mt-3">
        <div className="flex flex-col gap-2">
          <div className="p-4 bg-gray-100 rounded-lg">
            <BsBriefcase className="h-12 w-12 text-black" />
          </div>
          <div className="px-4 py-2 bg-gray-100 rounded-lg flex justify-center items-center">
            <p className="text-xs text-primary font-medium">
              {t("contacts:panel:open")}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-x-4 items-center">
            <p className="text-sm text-black font-medium">
              {t("tools:tasks:panel:date")}:
            </p>
            <p className="text-xs text-black font-normal">Lun, En 10, 8:00pm</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-sm text-black font-medium">
              {t("tools:tasks:panel:title")}:
            </p>
            <p className="text-xs text-black font-normal">Seguimiento póliza</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-sm text-black font-medium">
              {t("tools:tasks:panel:responsible")}:
            </p>
            <p className="text-xs text-black font-normal">Juanito Cruz</p>
          </div>
          <div className="p-2 bg-yellow-50 rounded-md flex gap-2 w-full justify-between items-center">
            {!openEdit ? (
              <div className="flex gap-2 items-center">
                <div className="flex justify-center items-center p-1 bg-red-300 rounded-full">
                  <UserIcon className="h-3 w-3 text-white" />
                </div>
                <p className="text-sm text-black">Test</p>
              </div>
            ) : (
              <div className="border rounded-md h-28">
                {TextEditorComponent()}
              </div>
            )}
            <div className="flex gap-1 items-center">
              {!openEdit && (
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenEdit(true)}
                >
                  <PencilIcon className="h-4 w-4 text-black" />
                </div>
              )}
              <div
                className="cursor-pointer"
                onClick={() => setOpenEdit(false)}
              >
                <XMarkIcon className="h-4 w-4 text-black" />
              </div>
            </div>
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
