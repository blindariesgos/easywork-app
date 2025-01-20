import clsx from "clsx";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AppointmentMenu from "./AppointmentMenu";
import Link from "next/link";
import TextEditor from "../TextEditor";
import Button from "../form/Button";
import { addContactComment } from "../../lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ActivityHeader({
  entityId,
  update,
  crmType = "contact",
  contactType = "fisica",
  disabled,
}) {
  const [isShowAddComment, setIsShowAddComment] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const tabs = [
    {
      name: t("contacts:create:activities:tasks"),
      onClick: () =>
        router.push(
          `/tools/tasks/task?show=true&prev=${crmType}&prev_id=${entityId}`
        ),
    },
    {
      name: t("contacts:create:activities:comment"),
      onClick: () => setIsShowAddComment(true),
      hidden: ["agent"].includes(crmType),
    },
    {
      name: t("contacts:create:activities:email"),
      onClick: () => router.push("/tools/mails"),
      hidden: ["agent"].includes(crmType),
    },
    {
      name: t("contacts:create:activities:appointments"),
      onClick: () =>
        router.push(
          `/tools/calendar/addEvent?show=true&prev=${crmType}&prev_id=${entityId}`
        ),
      hidden: contactType == "moral" || ["receipt"].includes(crmType),
    },
    {
      name: t("contacts:create:activities:whatsapp"),
      hidden: contactType == "moral" || ["agent"].includes(crmType),
    },
    {
      name: t("contacts:create:activities:call"),
      hidden: contactType == "moral" || ["receipt", "agent"].includes(crmType),
    },
    {
      name: t("contacts:create:activities:zoom"),
      hidden: contactType == "moral" || ["receipt", "agent"].includes(crmType),
    },
    {
      name: t("contacts:create:activities:meet"),
      hidden: !["agent"].includes(crmType),
      onClick: () =>
        router.push(
          `/agents-management/meetings-and-sessions/individuals/meet?show=true&prev=agent-meet&prev_id=${entityId}`
        ),
    },
  ];
  return (
    <>
      <div className="bg-white px-2 md:px-4 rounded-lg w-full shadow-sm">
        <div className="bg-white">
          <div className="">
            <div className=" mt-4">
              <nav className="flex space-x-2 flex-wrap pt-4" aria-label="Tabs">
                {tabs
                  .filter((tab) => !tab.hidden)
                  .map((tab) => (
                    <div key={tab.name}>
                      {tab.children ? (
                        <div key={tab.name} className="py-4 -mt-4">
                          <AppointmentMenu
                            options={tab.children}
                            label={tab.name}
                          />
                        </div>
                      ) : (
                        <div
                          key={tab.name}
                          className={clsx(
                            "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-700",
                            "whitespace-nowrap py-2 px-1 text-sm font-medium uppercase cursor-pointer"
                          )}
                          onClick={!disabled && tab.onClick}
                          disabled={disabled}
                        >
                          {tab.name}
                        </div>
                      )}
                    </div>
                  ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="py-2">
          {isShowAddComment ? (
            <AddComment
              entityId={entityId}
              crmType={crmType}
              updateActivities={update}
              close={() => setIsShowAddComment(false)}
            />
          ) : (
            <input
              type="text"
              name="todo"
              id="todo"
              disabled={disabled}
              className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm bg-gray-200 placeholder:text-gray-400 outline-none focus:outline-none focus:border focus:border-primary sm:text-sm sm:leading-6"
              placeholder={"Escribe un comentario"}
              onClick={() => !disabled && setIsShowAddComment(true)}
            />
          )}
        </div>
      </div>
    </>
  );
}

const AddComment = ({ entityId, close, updateActivities, crmType }) => {
  const [value, setValueText] = useState("");
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const mapId = {
    contact: "contactId",
    lead: "leadId",
    receipt: "receiptId",
    policy: "polizaId",
    agent: "agentId",
    poliza_reimbursement: "polizaReimbursementId",
    poliza_scheduling: "polizaSchedulingId",
  };

  const handleAdd = async () => {
    setLoading(true);
    const body = {
      comment: value,
      pinned: false,
      [mapId[crmType]]: entityId,
    };
    const response = await addContactComment(body, crmType);

    if (response.hasError) {
      console.log({ response });
      toast.error(
        "Se ha producido un error al crear el comentario, inténtelo de nuevo."
      );
      setLoading(false);
      return;
    }
    toast.success("El comentario se ha añadido correctamente");
    close();
    updateActivities();
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
