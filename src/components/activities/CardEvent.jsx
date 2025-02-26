"use client";
import Button from "@/src/components/form/Button";
import TextEditor from "../TextEditor";
import IconDropdown from "@/src/components/SettingsButton";
import { formatDate, isEventOverdue } from "@/src/utils/getFormatDate";
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { postComment } from "../../lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import moment from "moment";

//is a component that must recieve its props
export default function CardEvent({ data }) {
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

  return (
    <div className="bg-white px-4 py-3 rounded-lg w-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <p className="text-xs text-primary font-bold">
            {t("common:activities:event")}
          </p>
          <p className="text-xs text-primary">
            {t("common:date:title")}:{" "}
            {moment(data.startTime).format("DD/MM/YYYY hh:mm a")}
          </p>
        </div>
        {data?.createdBy && (
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
        )}
      </div>
      <div className="flex gap-4 md:gap-8 mt-3">
        <div className="flex flex-col gap-2">
          <div className="p-4 bg-gray-100 rounded-lg">
            <Image
              width={50}
              height={50}
              alt="event icon"
              src="/img/activities/event-1-black.svg"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full justify-center">
          <p className="text-sm text-[#0F8BBF] font-bold">
            <Link href={`/tools/calendar/event/${data.id}?show=true`}>
              {data.name}
            </Link>
          </p>
          {data?.participants && data?.participants?.length > 0 && (
            <div className="flex gap-x-2 items-center">
              <p className="text-sm text-primary font-bold">
                {t("common:with")}:
              </p>

              <div className="flex gap-1 flex-wrap">
                {data?.participants &&
                  data?.participants?.map((participant, index, arr) => (
                    <Link
                      href={`/settings/permissions/users/user/${participant.id}?show=true`}
                      className="text-xs text-[#0F8BBF] hover:underline"
                      key={participant.id}
                    >
                      {participant?.profile?.firstName
                        ? `${participant?.profile?.firstName} ${participant?.profile?.lastName}`
                        : participant?.username}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const AddEventComment = ({ close, event }) => {
  const [value, setValueText] = useState("");
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const body = {
      comment: value,
      isSummary: event.requireSummary,
      eventId: event.id,
    };
    const response = await postComment(body, event.id).catch(() => ({
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
