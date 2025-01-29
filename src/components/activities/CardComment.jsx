"use client";
import { formatDate } from "@/src/utils/getFormatDate";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import React, { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TextEditor from "../TextEditor";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { correctSpecialCharacters } from "@/src/utils/formatters";
import moment from "moment";
import IconDropdown from "../SettingsButton";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { updateComment } from "@/src/lib/apis";
import { handleFrontError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { GiPin } from "react-icons/gi";
import LoaderSpinner from "../LoaderSpinner";

export const CommentType = {
  USER: "user",
  SYSTEM: "system",
};

export default function CardComment({ data, crmType, update, crmId }) {
  if (
    data?.metadata?.commentType === CommentType.SYSTEM ||
    data?.metadata?.subType == "lead"
  ) {
    return <SystemNotification data={data} />;
  }

  return (
    <CommentUser data={data} crmType={crmType} update={update} crmId={crmId} />
  );
}

function SystemNotification({ data }) {
  const { t } = useTranslation();
  const { createdAt, comment, createdBy, metadata } = data;

  return (
    <div className=" bg-white px-4 py-3 rounded-lg">
      {metadata.subType === "drive" ? (
        <Fragment>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <p className="text-xs text-primary font-bold">Carga de archivo</p>
              <p className="text-xs text-gray-50 whitespace-nowrap">
                {formatDate(createdAt, "dd/MM/yyyy hh:mm a")}
              </p>
            </div>
            <Image
              className="h-6 w-6 rounded-full object-cover"
              width={36}
              height={36}
              src={createdBy?.avatar}
              alt=""
              title={
                createdBy?.profile?.firstName
                  ? `${createdBy?.profile?.firstName} ${createdBy?.profile?.lastName}`
                  : (createdBy.username ?? "System")
              }
            />
          </div>

          <p className="text-xs text-gray-50">
            {`Se ha subido el archivo ${metadata?.file?.fieldname ? `${metadata?.file?.fieldname} ` : ""}`}
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
              {metadata?.file?.name || metadata?.file?.originalname
                ? correctSpecialCharacters(
                    metadata?.file?.name || metadata?.file?.originalname
                  )
                : "System"}
            </span>
            .
          </p>
        </Fragment>
      ) : metadata.subType === "contact" ? (
        <Fragment>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <p className="text-xs text-primary font-bold">
                Cierre positivo prospecto
              </p>
              <p className="text-xs text-gray-50 whitespace-nowrap">
                {formatDate(createdAt, "dd/MM/yyyy hh:mm a")}
              </p>
            </div>
            <Image
              className="h-6 w-6 rounded-full object-cover"
              width={36}
              height={36}
              src={createdBy?.avatar}
              alt=""
              title={
                createdBy?.profile?.firstName
                  ? `${createdBy?.profile?.firstName} ${createdBy?.profile?.lastName}`
                  : (createdBy.username ?? "System")
              }
            />
          </div>

          <p className="text-xs text-gray-50">
            {"Se ha creado al cliente "}
            {metadata?.contact?.fullName && (
              <Link
                href={`/sales/crm/contacts/contact/${metadata?.contact?.id}?show=true`}
                className="hover:underline cursor-pointer"
              >
                {metadata?.contact?.fullName}
              </Link>
            )}

            {" a partir del prospecto."}
          </p>
        </Fragment>
      ) : metadata.subType === "lead" ? (
        <Fragment>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <p className="text-xs text-primary font-bold">
                Cierre positivo prospecto
              </p>
              <p className="text-xs text-gray-50 whitespace-nowrap">
                {formatDate(createdAt, "dd/MM/yyyy hh:mm a")}
              </p>
            </div>
            <Image
              className="h-6 w-6 rounded-full object-cover"
              width={36}
              height={36}
              src={createdBy?.avatar}
              alt=""
              title={
                createdBy?.profile?.firstName
                  ? `${createdBy?.profile?.firstName} ${createdBy?.profile?.lastName}`
                  : (createdBy.username ?? "System")
              }
            />
          </div>

          <p className="text-xs text-gray-50">
            {"Se ha creado al cliente a partir del prospecto "}
            {metadata?.lead?.fullName && (
              <Link
                href={`/sales/crm/leads/lead/${metadata?.lead?.id}?show=true`}
                className="hover:underline cursor-pointer"
              >
                {metadata?.lead?.fullName}
              </Link>
            )}
            {"."}
          </p>
        </Fragment>
      ) : (
        <Fragment>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <p className="text-xs text-primary font-bold">Actualización</p>
              <p className="text-xs text-gray-50 whitespace-nowrap">
                {formatDate(createdAt, "dd/MM/yyyy hh:mm a")}
              </p>
            </div>
            <Image
              className="h-6 w-6 rounded-full object-cover"
              width={36}
              height={36}
              src={createdBy?.avatar}
              alt=""
              title={
                createdBy?.profile?.firstName
                  ? `${createdBy?.profile?.firstName} ${createdBy?.profile?.lastName}`
                  : (createdBy.username ?? "System")
              }
            />
          </div>
          <p className="text-xs text-gray-50">{comment}.</p>
        </Fragment>
      )}

      {/* <p className="text-xs text-gray-50 whitespace-nowrap">
        {formatDate(createdAt, "dd/MM/yyyy hh:mm a")}
      </p> */}
    </div>
  );
}

function CommentUser({ data, crmType, update, crmId }) {
  const { t } = useTranslation();
  const quillRef = useRef();
  const { createdAt, comment, createdBy, pinned } = data;
  const [loading, setLoading] = useState(false);

  const mapId = {
    contact: "contactId",
    lead: "leadId",
    receipt: "receiptId",
    poliza: "polizaId",
    renewal: "polizaId",
    agent: "agentId",
    poliza_reimbursement: "polizaReimbursementId",
    poliza_scheduling: "polizaSchedulingId",
  };

  const handlePinned = async () => {
    setLoading(true);
    const response = await updateComment(
      { comment, [mapId[crmType]]: crmId, pinned: !pinned },
      crmType,
      data.id
    );
    if (response.hasError) {
      handleFrontError(response);
      setLoading(false);
      return;
    }
    update();
    toast.success(pinned ? "Comentario fijado" : "Comentario desmarcado");
    setLoading(false);
  };

  const options = [
    {
      value: 0,
      name: "Fijar",
      onClick: handlePinned,
    },
  ];

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <div className="bg-white px-4 py-3 rounded-lg w-full">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <p className="text-xs text-primary font-bold">
              {t("contacts:panel:comment")}
            </p>
            <p className="text-xs text-primary">
              {t("common:date:title")}:{" "}
              {moment(createdAt).format("DD/MM/YYYY hh:mm a")}
            </p>
            {pinned && (
              <GiPin
                className="text-red-700 cursor-pointer h-5 w-5"
                title="Fijado"
                onClick={handlePinned}
              />
            )}
          </div>
          <Image
            className="h-6 w-6 rounded-full object-cover"
            width={36}
            height={36}
            src={createdBy?.avatar}
            alt=""
            title={
              createdBy?.profile?.firstName
                ? `${createdBy?.profile?.firstName} ${createdBy?.profile?.lastName}`
                : (createdBy.username ?? "")
            }
          />
        </div>
        <div className="flex gap-4 md:gap-8 mt-3">
          <TextEditor
            quillRef={quillRef}
            value={comment}
            className="h-full  w-full"
            setValue={(e) => {}}
            disabled={true}
          />
        </div>
        <div className="flex justify-end">
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
    </Fragment>
  );
}
