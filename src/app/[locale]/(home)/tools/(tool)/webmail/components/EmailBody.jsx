"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import Tag from "../../../../../../../components/Tag";
import { useRouter, useSearchParams } from "next/navigation";
import { decode } from "he";
import base64 from "base64-js";

export default function EmailBody({
  selectMail,
  openModal,
  setOpenModal,
  children,
  colorTag,
  labelTag,
  samePage,
  previousModalPadding,
  subLabelTag,
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [subLabel, setSubLabel] = useState("");
  const [decodedMailData, setDecodedMailData] = useState("");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const getParts = (parts) => {
    let message = "";
    if (parts) {
      parts.forEach((part) => {
        if (part.parts) {
          // Si la parte actual tiene más partes, recurre a ellas
          message += getParts(part.parts);
        } else if (part.mimeType === "text/html") {
          // Si la parte es HTML, decodifica y agrega al mensaje
          let data = part.body.data;
          // Decodifica los datos con base64-js
          let bytes = base64.toByteArray(data);
          message += new TextDecoder().decode(bytes);
        }
      });
    }
    return message;
  };

  useEffect(() => {
    // let mailData = "";
  
    // if (selectMail?.payload?.parts) {
    //   mailData = getParts(selectMail.payload.parts);
    // } else if (selectMail?.payload?.body?.data) {
    // let bytes = base64.toByteArray(selectMail.body);
    // let mailData = new TextDecoder().decode(selectMail.body);
    // console.log(mailData);
    // }
  
    setDecodedMailData(selectMail.body);
  }, [selectMail]);
  
    
  

  if (params.get("detail"))
    return (
      <Transition.Root show={JSON.parse(params.get("detail"))} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <div className="fixed inset-0" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 2xl:pl-52">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel
                    className={`pointer-events-auto w-screen drop-shadow-lg ${previousModalPadding}`}
                  >
                    <div className="flex justify-end h-screen">
                      <div className={`flex flex-col`}>
                        <Tag
                          title={label}
                          onclick={() => {
                            setOpenModal
                              ? setOpenModal(false)
                              : samePage
                              ? router.replace(samePage)
                              : router.back();
                          }}
                          className={colorTag}
                        />
                        {subLabelTag && (
                          <Tag
                            title={subLabel}
                            className="bg-easywork-main pl-2"
                            closeIcon
                            second
                          />
                        )}
                      </div>
                      <div className="bg-gray-100 max-md:w-screen rounded-l-2xl overflow-y-auto h-screen p-7 md:w-3/4 lg:w-3/4">
                          <h1 className="text-lg mb-4">{selectMail?.subject}</h1>
                        <div className="bg-white text-sm p-5 h-5/6">
                          <div className="pb-2 border-b-2">
                            <p>{selectMail?.subject}</p>
                            {/* <p>Para: {selectMail?.to[0]}</p> */}
                            <div className="w-full flex justify-center items-center">
                              <p className="m-2 text-xs font-semibold">RESPUESTA</p>
                              <p className="m-2 text-xs font-semibold">RESPONDER A TODOS</p>
                              <p className="m-2 text-xs font-semibold">REENVIAR</p>
                              <p className="m-2 text-xs font-semibold">MARCAR COMO CORREO NO DESEADO</p>
                              <p className="m-2 text-xs font-semibold">ELIMINAR</p>
                            </div>
                          </div>
                          <div className="flex h-full py-2 w-full">
                            <iframe
                              className="w-full"
                              srcDoc={decodedMailData}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
}
