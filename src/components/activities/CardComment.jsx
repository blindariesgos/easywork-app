"use client";
import { formatDate } from "@/src/utils/getFormatDate";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import TextEditor from "../TextEditor";
import clsx from "clsx";

export const CommentType = {
  USER: "user",
  SYSTEM: "system",
};

export default function CardComment({ data }) {
  if (data?.metadata?.commentType === CommentType.SYSTEM) {
    return <SystemNotification data={data} />;
  }

  return <CommentUser data={data} />;
}

function SystemNotification({ data }) {
  const { t } = useTranslation();
  const { createdAt, comment, createdBy, metadata } = data;

  return (
    <div className="flex gap-2 md:gap-4 2xl:gap-6 mt-4 justify-between">
      {metadata.subType === "drive" ? (
        <p className="text-xs text-gray-50">
          {"Se ha subido el archivo "}
          <span
            className={clsx({
              "hover:underline cursor-pointer":
                !!metadata?.file?.name && !!metadata?.file?.url,
            })}
            onClick={() =>
              metadata?.file?.url &&
              window.open(
                metadata?.file?.url,
                "self",
                "status=yes,scrollbars=yes,toolbar=yes,resizable=yes,width=850,height=500"
              )
            }
          >
            {metadata?.file?.name ?? "System"}
          </span>
          {", por "}
          <span
            className={clsx({
              "hover:underline cursor-pointer": !!createdBy,
            })}
          >
            {createdBy?.profile?.firstName
              ? `${createdBy?.profile?.firstName} ${createdBy?.profile?.lastName}`
              : (createdBy.username ?? "System")}
          </span>
        </p>
      ) : (
        <p className="text-xs text-gray-50">
          {comment}
          {", por "}
          <span
            className={clsx({
              "hover:underline cursor-pointer": createdBy,
            })}
          >
            {createdBy?.profile?.firstName
              ? `${createdBy?.profile?.firstName} ${createdBy?.profile?.lastName}`
              : (createdBy.username ?? "System")}
          </span>
        </p>
      )}

      <p className="text-xs text-gray-50 whitespace-nowrap">
        {formatDate(createdAt, "dd/MM/yyyy hh:mm a")}
      </p>
    </div>
  );
}

function CommentUser({ data }) {
  const { t } = useTranslation();
  const quillRef = useRef();
  const { createdAt, comment } = data;
  return (
    <div className="bg-white px-4 py-3 rounded-lg w-full">
      <div className="flex items-center">
        <div className="flex gap-2 items-center">
          <p className="text-xs text-primary font-medium">
            {t("contacts:panel:comment")}
          </p>
          <p className="text-xs text-primary font-medium">
            {t("contacts:panel:date")}:{" "}
            {formatDate(createdAt, "dd/MM/yyyy hh:mm a")}
          </p>
        </div>
      </div>
      <div className="flex gap-4 md:gap-8 mt-3">
        <div className="">
          <div className="p-4 bg-primary rounded-full">
            <ChatBubbleBottomCenterIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="text-lg text-black font-medium">
            {t("contacts:panel:comment")}
          </p>
          <div className="flex gap-x-4 items-center">
            <TextEditor
              quillRef={quillRef}
              value={comment}
              className="h-full  w-full"
              setValue={(e) => {}}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
