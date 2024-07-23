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
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { toast } from "react-toastify";
import * as yup from "yup";
import axios from "axios";

export default function Signature({
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
  const [contactsArray, setContactsArray] = useState(null);
  const [BCCArray, setBCCArray] = useState(null);
  const [CCArray, setCCArray] = useState(null);
  const [user, setUser] = useState("");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const quillRef = useRef(null);
  const { lists, setFilter, selectOauth } = useAppContext();

  const schema = yup.object().shape({
    responsible: yup.string(),
  });

  useEffect(() => {
    getTokenGoogle(session.data.user.id).then((res) => {
      setUser(res);
    });
  }, [params.get("signature")]);

  async function sendEmail() {
    const data = {
      to: contactsArray,
      cc: CCArray,
      bcc: BCCArray,
      subject: subject,
      body: value,
      attachments: null,
    };
    console.log(data);
    try {
      if (!data.to) {
        toast.error("Debes colocar destinatario");
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/send/${session.data.user.id}/${selectOauth.id}`,
        data
      );
      toast.success("Correo enviado");
      router.back();
    } catch (error) {
      toast.error("Error al enviar correo");
      console.error("Failed to send email:", error);
    }
  }
  return (
    <Transition.Root show={params.get("signature")} as={Fragment}>
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
                    <div className="bg-gray-300 max-md:w-screen rounded-l-2xl overflow-y-auto h-screen p-7 md:w-3/4 lg:w-3/4">
                      <div className="flex mb-3 items-center">
                        <div className="flex items-center"><h1 className="text-lg mb-4 inline-block align-middle h-full">Firmas</h1></div>
                        
                        <div className="flex items-center w-full rounded-md bg-white ml-2 pl-2">
                          <FaMagnifyingGlass className="h-4 w-4 text-primary" />
                          <input
                            type="search"
                            name="search"
                            id="search-cal"
                            className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 rounded-r-md"
                            placeholder={t("contacts:header:search")}
                            // onChange={(e) => setSearchInput(e.target.value)}
                            // onClick={() => setSearchInput("")}
                          />
                        </div>
                        <button
                          className="bg-easywork-main text-white px-3 py-1 rounded-md ml-3 w-44"
                          // onClick={() => sendEmail()}
                        >
                          Agregar Firma
                        </button>
                      </div>
                      <div className="bg-white p-5 h-auto rounded-lg w-full text-easywork-main flex">
                        <div className="w-1/2 flex">
                          <h1>Remitente</h1>
                          <ChevronDownIcon className="w-5 h-5" />
                        </div>
                        <div className="w-1/2 flex">
                          <h1>Firma</h1>
                          <ChevronDownIcon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-1/2 text-sm">
                          <div className="flex m-3">
                            <input type="checkbox" />
                            <p className="ml-2">{selectOauth?.email}</p>
                          </div>
                          <div className="flex m-3">
                            <input type="checkbox" />
                            <p className="ml-2">{selectOauth?.email}</p>
                          </div>
                        </div>
                        <div className="w-1/2">
                          <div className="flex m-3">
                            <p>logo.gif</p>
                          </div>
                          <div className="flex m-3">
                            <p>logo.gif</p>
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
