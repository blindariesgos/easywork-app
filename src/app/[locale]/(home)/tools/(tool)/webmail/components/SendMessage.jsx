"use client";
import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Tag from "../../../../../../../components/Tag";
import { useRouter, useSearchParams } from "next/navigation";
import TextEditor from "../../tasks/components/TextEditor";
import { getTokenGoogle } from "../../../../../../../lib/apis";
import axios from "axios";

export default function SendMessage({
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
  const session = useSession();
  const router = useRouter();
  const [value, setValueText] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [label, setLabel] = useState("");
  const [subLabel, setSubLabel] = useState("");
  const [user, setUser] = useState("");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const quillRef = useRef(null);

  useEffect(() => {
    getTokenGoogle(session.data.user.id).then((res) => {
      setUser(res);
    });
  }, []);

  async function sendEmail() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/send/${session.data.user.id}`,
        {
          to: recipient,
          subject: subject,
          body: value,
        }
      );
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  if (params.get("send"))
    return (
      <Transition.Root show={JSON.parse(params.get("send"))} as={Fragment}>
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
                            className="bg-green-primary pl-2"
                            closeIcon
                            second
                          />
                        )}
                      </div>
                      <div className="bg-gray-300 max-md:w-screen rounded-l-2xl overflow-y-auto h-screen p-7 md:w-3/4 lg:w-3/4">
                        <h1 className="text-lg mb-4">Nuevo mensaje</h1>
                        <div className="bg-gray-100 text-sm p-5 h-5/6">
                          <div className="pb-2 border-b-2">
                            <p>De: Soporte Principal soporte@trabajox.com</p>
                          </div>
                          <div className="flex py-2 items-center border-b-2">
                            <p
                              onClick={() => {
                                console.log(value);
                              }}
                            >
                              Para
                            </p>
                            <input
                              type="text"
                              className="py-2 text-sm rounded-md ml-2 w-full focus:text-gray-900 placeholder-slate-600"
                              placeholder="+ Agregar destino"
                              autoComplete="off"
                              onChange={(e) => setRecipient(e.target.value)}
                            />
                          </div>
                          <div className="flex py-2 items-center">
                            <p>Asunto</p>
                            <input
                              type="text"
                              className="py-2 text-sm rounded-md ml-2 w-full focus:text-gray-900 placeholder-slate-600"
                              placeholder="Ingrese el asunto del mensaje"
                              autoComplete="off"
                              onChange={(e) => setSubject(e.target.value)}
                            />
                          </div>
                          <div className="h-full py-2">
                            <div className="h-80">
                              <TextEditor
                                className="w-full bg-white h-full"
                                theme="snow"
                                quillRef={quillRef}
                                value={value}
                                setValue={setValueText}
                              />
                            </div>
                            <div className="mt-3">
                              <button
                                className="bg-easywork-main text-white p-3 rounded-md"
                                onClick={() => sendEmail()}
                              >
                                Enviar
                              </button>
                              <button className="bg-gray-300 m-2 p-3 rounded-md">
                                Cancelar
                              </button>
                            </div>
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
