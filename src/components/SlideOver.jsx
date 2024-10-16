"use client";
import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useTranslation } from "react-i18next";
import Tag from "./Tag";
import { useRouter, useSearchParams } from "next/navigation";

export default function SlideOver({
  children,
  colorTag,
  labelTag,
  previousModalPadding,
  subLabelTag,
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [subLabel, setSubLabel] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [contactId, setContactId] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  // Nuevo estado para controlar la transición
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (params.get("prev") === "task") {
      setTaskId(params.get("prev_id"));
    } else if (params.get("prev") === "contact") {
      setContactId(params.get("prev_id"));
    } else if (params.get("prev") === "tasks") {
      setPreviousPage("tasks");
    }
  }, [params]);

  useEffect(() => {
    // Parsear el valor de `show` del parámetro de consulta
    setShow(params.get("show") === "true");
  }, []); // Dependencia del parámetro de consulta 'show'

  useEffect(() => {
    switch (labelTag) {
      case "contact":
        setLabel(t("contacts:header:contact"));
        break;
      case "policy":
        setLabel(t("contacts:create:tabs:policies"));
        break;
      case "consult":
        setLabel(t("contacts:edit:policies:table:policy"));
        break;
      case "life":
        setLabel(t("contacts:policies:branches:life"));
        break;
      case "cars":
        setLabel(t("contacts:policies:branches:cars"));
        break;
      case "medicine":
        setLabel(t("contacts:policies:branches:medicinal"));
        break;
      case "damages":
        setLabel(t("contacts:policies:branches:damages"));
        break;
      case "various":
        setLabel(t("contacts:policies:branches:various"));
        break;
      case "payments":
        setLabel(t("contacts:edit:policies:consult:payments"));
        break;
      case "claims":
        setLabel(t("contacts:edit:policies:consult:claims"));
        break;
      case "refunds":
        setLabel(t("contacts:edit:policies:consult:refund"));
        break;
      case "invoices":
        setLabel(t("contacts:edit:policies:consult:invoices"));
        break;
      case "versions":
        setLabel(t("contacts:edit:policies:consult:versions"));
        break;
      case "commissions":
        setLabel(t("contacts:edit:policies:consult:commissions"));
        break;
      case "quotes":
        setLabel(t("contacts:edit:policies:consult:quotes"));
        break;
      case "schedules":
        setLabel(t("contacts:edit:policies:consult:schedules"));
        break;
      case "lead":
        setLabel(t("leads:header:lead"));
        break;
      case "task":
        setLabel(t("tools:tasks:name"));
        break;

      default:
        break;
    }
  }, [labelTag, t]);

  useEffect(() => {
    switch (subLabelTag) {
      case "consult":
        setSubLabel(t("contacts:edit:policies:consult:name"));

      default:
        break;
    }
  }, [subLabelTag, t]);

  const closeModal = () => {
    setShow(false);
    params.set("show", "false");
  };

  return (
    <Transition
      show={show}
      as={Fragment}
      afterLeave={() => {
        router.back();
        // if (taskId) {
        //   router.replace(`/tools/tasks/task/${taskId}?show=true`, undefined, { shallow: true });
        //   return;
        // } else if (contactId) {
        //   router.replace(`/sales/crm/contacts/contact/${contactId}?show=true`, undefined, { shallow: true });
        //   return;
        // }

        // if (previousPage === "tasks") {
        //   router.replace(`/tools/tasks`, undefined, { shallow: true });
        //   return;
        // }

        // router.replace(`${samePage}`, undefined, { shallow: true });
      }}
    >
      <Dialog as="div" className="relative z-[10000]" onClose={() => {}}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 2xl:pl-52">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel
                  className={`pointer-events-auto w-screen drop-shadow-lg ${previousModalPadding}`}
                >
                  <div className="flex justify-end h-screen">
                    <div className={`flex flex-col`}>
                      <Tag
                        title={label}
                        onclick={closeModal}
                        className={colorTag}
                      />
                      {subLabelTag && (
                        <Tag
                          title={subLabel}
                          className="bg-green-primary pl-2"
                          closeIcon
                          second
                        />
                      )}
                    </div>
                    {children}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
