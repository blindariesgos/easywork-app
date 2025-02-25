"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
  DialogBackdrop,
} from "@headlessui/react";
import { useTranslation } from "react-i18next";
import Tag from "./Tag";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

export default function SlideOver({
  children,
  colorTag,
  labelTag,
  previousModalPadding,
  subLabelTag,
  className,
  remove,
  maxWidthClass,
  openModal,
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [subLabel, setSubLabel] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useMemo(() => {
    return new URLSearchParams(searchParams);
  }, [searchParams]);
  // Nuevo estado para controlar la transición
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Parsear el valor de `show` del parámetro de consulta
    setShow(params.get("show") === "true");
  }, []); // Dependencia del parámetro de consulta 'show'

  useEffect(() => {
    switch (labelTag) {
      case "contact":
        setLabel(t("contacts:header:tab"));
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
      case "renovations":
        setLabel(t("common:slide:renovations"));
        break;
      case "recruitment":
        setLabel(t("common:slide:recruitment"));
        break;
      case "conexion":
        setLabel(t("common:slide:conexion"));
        break;
      case "lead":
        setLabel(t("leads:header:lead"));
        break;
      case "task":
        setLabel(t("tools:tasks:name"));
        break;
      case "agent":
        setLabel(t("agentsmanagement:accompaniments:table:agent"));
        break;
      case "user":
        setLabel(t("Usuarios"));
        break;
      case "profile":
        setLabel(t("Perfil"));
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
    if (remove) {
      setTimeout(() => {
        params.delete("show");
        params.delete(remove);
        router.replace(`${pathname}?${params.toString()}`);
      }, 301);
    }
  };

  return (
    <Transition
      show={show}
      as={Fragment}
      afterLeave={() => {
        if (!remove) router.back();
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
      <Dialog as="div" className="relative z-[10000]" onClose={closeModal}>
        <DialogBackdrop className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={clsx(
                "pointer-events-none fixed inset-y-0 right-0 flex w-full pl-6 md:pl-52",
                maxWidthClass
              )}
            >
              <TransitionChild
                as={Fragment}
                // enter="transform transition ease-in-out duration-500 sm:duration-700"
                // enterFrom="translate-x-full"
                // enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel
                  className={`pointer-events-auto w-full drop-shadow-lg ${previousModalPadding}`}
                >
                  <div className="flex justify-end h-screen relative">
                    <div className={`absolute right-full top-0`}>
                      <Tag
                        title={label}
                        onclick={closeModal}
                        className={colorTag}
                      />
                      {/* {subLabelTag && (
                        <Tag
                          title={subLabel}
                          className="bg-green-primary pl-2"
                          closeIcon
                          second
                        />
                      )} */}
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
