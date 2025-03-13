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
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { DocumentIcon, PencilIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import * as yup from "yup";
import dynamic from "next/dynamic";
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function ReplyEmail({
  selectOauth,
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
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState("");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const quillRef = useRef(null);
  const { lists, setFilter } = useAppContext();
  const fileInputRef = useRef(null);

  const schema = yup.object().shape({
    responsible: yup.string(),
  });

  useEffect(() => {
    getTokenGoogle(session?.data.user.sub).then((res) => {
      setUser(res);
    });
  }, [params.get("reply")]);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  async function sendEmail() {
    const data = {
      to: contactsArray,
      cc: CCArray,
      bcc: BCCArray,
      subject: subject,
      body: value,
      attachments: [
        {
          filename: "test.pdf",
          mimeType: "application/pdf",
          path: "https://www.renfe.com/content/dam/renfe/es/General/PDF-y-otros/Ejemplo-de-descarga-pdf.pdf",
        },
      ],
    };
    try {
      if (!data.to) {
        toast.error("Debes colocar destinatario");
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/gmail/send/${session?.data.user.sub}/${selectOauth.id}`,
        data
      );
      toast.success("Correo enviado");
      router.back();
    } catch (error) {
      toast.error("Error al enviar correo");
      console.error("Failed to send email:", error);
    }
  }

  const toolbar = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    ["link", "image"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
  ];

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "size",
    "font",
    "color",
    "background",
    "align",
    "header",
    "direction",
  ];

  return (
    <Transition.Root show={params.get("reply")} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-96" />
        <div className="fixed inset-96 overflow-hidden">
          <div className="absolute inset-96 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-96 right-0 flex max-w-full pl-0 2xl:pl-52">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-y-full"
                enterTo="translate-y-96"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-y-96"
                leaveTo="translate-y-full"
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
                    <div className="bg-gray-300 max-md:w-screen rounded-l-2xl overflow-y-auto h-96 p-7 md:w-3/4 lg:w-3/4">
                      <h1 className="text-lg mb-4">Nuevo mensaje</h1>
                      <div className="bg-gray-100 text-sm p-5 h-auto">
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
                              setContactsArray={setContactsArray}
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
                                setContactsArray={setCCArray}
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
                                setContactsArray={setBCCArray}
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
                          <ReactQuill
                            className="h-96 w-full bg-white pb-12"
                            theme="snow"
                            value={value}
                            onChange={setValueText}
                            formats={formats}
                            modules={{ toolbar }}
                          />
                          {/* <TextEditor
                            className="h-96 w-full bg-white pb-12"
                            theme="snow"
                            ref={quillRef}
                            value={value}
                            setValue={setValueText}
                          /> */}
                          <div className="mt-2">
                            {files &&
                              files.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col gap-2"
                                >
                                  <p className="text-sm">{file.name}</p>
                                </div>
                              ))}
                          </div>
                          <div className="flex mt-2">
                            <div>
                              <div
                                className="flex text-slate-400 cursor-pointer"
                                onClick={handleFileClick}
                              >
                                <PaperClipIcon className="h-5 w-5" />
                                <p className="ml-1">Archivo</p>
                              </div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                              />
                            </div>
                            <div className="ml-2 flex text-slate-400 cursor-pointer">
                              <DocumentIcon className="h-5 w-5" />
                              <p className="ml-1">Crear documento</p>
                            </div>
                            <div
                              className="ml-2 flex text-slate-400 cursor-pointer"
                              onClick={() => {
                                router.push(
                                  `/tools/webmail/?page=${searchParams.get("page")}&send=true&signature=true`
                                );
                              }}
                            >
                              <PencilIcon className="h-5 w-5" />
                              <p className="ml-1">Firma</p>
                            </div>
                          </div>
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
