"use client";
import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Tag from "../../../../../../../components/Tag";
import { useRouter, useSearchParams } from "next/navigation";
import TextEditor from "../../tasks/components/TextEditor";
import { getTokenGoogle } from "../../../../../../../lib/apis";
import SelectDropdown from "./SelectDropdown";
import useAppContext from "../../../../../../../context/app";
import { toast } from "react-toastify";
import * as yup from "yup";
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
  userData,
}) {
  const { t } = useTranslation();
  const session = useSession();
  const router = useRouter();
  const [value, setValueText] = useState("");
  const [recipient, setRecipient] = useState("");
  const [CCBCC, setCCBCC] = useState({ CC: false, BCC: false });
  const [subject, setSubject] = useState("");
  const [label, setLabel] = useState("");
  const [subLabel, setSubLabel] = useState("");
  const [valueTest, setValue] = useState("");
  const [user, setUser] = useState("");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const quillRef = useRef(null);
  const { lists, setFilter } = useAppContext();

  const schema = yup.object().shape({
    responsible: yup.string(),
  });

  useEffect(() => {
    getTokenGoogle(session.data.user.id).then((res) => {
      setUser(res);
    });
  }, []);

  // const {
  //   setValue,
  //   formState: { isValid, errors },
  // } = useForm({
  //   defaultValues: {
  //     range: [null, null],
  //   },
  //   mode: "onChange",
  //   resolver: yupResolver(schema),
  // });

  async function sendEmail() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/send/${session.data.user.id}`,
        {
          to: valueTest,
          subject: subject,
          body: value,
        }
      );
      toast.success("Correo enviado");
      router.back();
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }
  return (
    <Transition.Root show={params.get("send")} as={Fragment}>
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
                          <p>De: {userData.email}</p>
                        </div>
                        <div className="py-2 border-b-2">
                          <div className="flex items-center">
                            <p>Para</p>
                            <SelectDropdown
                              name="responsible"
                              options={lists?.users}
                              setValue={setValue}
                              className="ml-2 w-full"
                            />
                            <p
                              className="ml-2 hover:underline cursor-pointer"
                              onClick={() => {
                                setCCBCC({ CC: true, BCC: CCBCC.BCC });
                              }}
                            >
                              CC
                            </p>
                            <p
                              className="ml-2 hover:underline cursor-pointer"
                              onClick={() => {
                                setCCBCC({ CC: CCBCC.CC, BCC: true });
                              }}
                            >
                              BCC
                            </p>
                          </div>
                          {CCBCC.CC && (
                            <div className="flex items-center mt-2">
                              <p>CC</p>
                              <SelectDropdown
                                name="responsible"
                                options={lists?.users}
                                setValue={setValue}
                                className="ml-2 w-10/12"
                              />
                            </div>
                          )}
                          {CCBCC.BCC && (
                            <div className="flex items-center mt-2">
                              <p>BCC</p>
                              <SelectDropdown
                                name="responsible"
                                options={lists?.users}
                                setValue={setValue}
                                className="ml-2 w-10/12"
                              />
                            </div>
                          )}
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
                        <div className="py-2">
                          <TextEditor
                            className="h-96 w-full bg-white pb-12"
                            theme="snow"
                            ref={quillRef}
                            value={value}
                            setValue={setValueText}
                          />
                          <div className="mt-8">
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
