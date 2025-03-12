"use client";
import { Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import SelectDropdown from "./SelectDropdown";
import Tag from "../../../../../../../components/Tag";
import useAppContext from "../../../../../../../context/app";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";
import base64 from "base64-js";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { DocumentIcon, PencilIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
  updateLabelId,
  fetchData,
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useSession();
  const [label, setLabel] = useState("");
  const [value, setValueText] = useState("");
  const [valueTest, setValue] = useState("");
  const [send, setSend] = useState("");
  const [contactsArray, setContactsArray] = useState(null);
  const [subLabel, setSubLabel] = useState("");
  const [signature, setSignature] = useState(null);
  const [reply, setReply] = useState(false);
  const [forward, setForward] = useState(false);
  const [decodedMailData, setDecodedMailData] = useState("");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const fileInputRef = useRef(null);
  const container = useRef(null);
  const [files, setFiles] = useState([]);
  const [subject, setSubject] = useState("");
  const [BCCArray, setBCCArray] = useState(null);
  const [CCArray, setCCArray] = useState(null);
  const [CCBCC, setCCBCC] = useState({ CC: false, BCC: false });
  const { selectOauth, lists, selectedEmails, setSelectedEmails } =
    useAppContext();

  const getParts = (parts) => {
    let message = "";
    if (parts) {
      parts.forEach((part) => {
        if (part.parts) {
          message += getParts(part.parts);
        } else if (part.mimeType === "text/html") {
          let data = part.body.data;
          let bytes = base64.toByteArray(data);
          message += new TextDecoder().decode(bytes);
        }
      });
    }
    return message;
  };

  useEffect(() => {
    if (selectMail?.folder?.includes("UNREAD")) {
      updateLabelId([selectMail.googleId], "unread");
    }
    setReply(false);
  }, [params.get("detail")]);

  useEffect(() => {
    setDecodedMailData(selectMail.body);
  }, [selectMail]);

  useEffect(() => {
    getSignature();
  }, [reply]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const replyEmail = () => {
    setSend(true);
    setReply(true);
    setForward(false);
    setTimeout(() => {
      if (container.current) {
        container.current.scrollTop = container.current.scrollHeight;
      }
    }, 1000);
  };

  const forwardEmail = () => {
    setValueText(selectMail.body);
    setSend(true);
    setForward(true);
    setReply(false);
    setTimeout(() => {
      if (container.current) {
        container.current.scrollTop = container.current.scrollHeight;
      }
    }, 1000);
  };

  const moveFolder = async (folder, id) => {
    if (folder === 0) {
      await updateLabelId([id], "spam");
    } else if (folder === 1) {
      await updateLabelId([id], "trash");
    }
    router.back();
  };

  const getSignature = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_DRIVE_HOST}/files/signatures/${getCookie("myCheckbox")}`,
        {
          headers: {
            Authorization: `Bearer ${session?.data.user.accessToken}`,
          },
        }
      );
      setValueText(
        `<br><br><br><br><br><br><img src="${response.data.url}" style="max-width: 650px;">`
      );
      setSignature(response.data.url);
    } catch (error) {}
  };

  async function sendReply() {
    const data = {
      to: [selectMail?.from],
      // cc: CCArray,
      // bcc: BCCArray,
      subject: "Re: " + subject,
      body: value + " <style>img {max-width: 650px; }</style>",
      inReplyTo: selectMail.googleId,
      references: selectMail.googleId,
      attachments: [
        // {
        //   filename: "test.pdf",
        //   mimeType: "application/pdf",
        //   path: "https://www.renfe.com/content/dam/renfe/es/General/PDF-y-otros/Ejemplo-de-descarga-pdf.pdf",
        // },
      ],
    };
    try {
      if (!data.inReplyTo) {
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

  async function sendForward() {
    const data = {
      to: contactsArray,
      cc: CCArray,
      bcc: BCCArray,
      subject: "Fwd: " + subject,
      body: value + " <style>img {max-width: 650px; }</style>",
      inReplyTo: selectMail.googleId,
      references: selectMail.googleId,
      attachments: [
        // {
        //   filename: "test.pdf",
        //   mimeType: "application/pdf",
        //   path: "https://www.renfe.com/content/dam/renfe/es/General/PDF-y-otros/Ejemplo-de-descarga-pdf.pdf",
        // },
      ],
    };
    try {
      if (!data.inReplyTo) {
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
    <Transition.Root show={params.get("detail")} as={Fragment}>
      {/* <ReplyEmail colorTag="bg-easywork-main" userData={userData} selectOauth={selectOauth} /> */}
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
                    <div
                      className="bg-gray-100 max-md:w-screen rounded-l-2xl overflow-y-auto h-screen p-7 md:w-3/4 lg:w-3/4 scroll-smooth"
                      ref={container}
                    >
                      <h1 className="text-lg mb-4">{selectMail?.subject}</h1>
                      <div className="bg-white text-sm p-5">
                        <div className="pb-2 border-b-2">
                          <p>{selectMail?.from}</p>
                          {/* <p>Para: {selectMail?.to[0]}</p> */}
                          <div className="w-full flex justify-center items-center">
                            <p
                              className="m-2 text-xs font-semibold cursor-pointer"
                              onClick={() => {
                                replyEmail();
                              }}
                            >
                              RESPUESTA
                            </p>
                            <p
                              className="m-2 text-xs font-semibold cursor-pointer"
                              onClick={() => {
                                replyEmail();
                              }}
                            >
                              RESPONDER A TODOS
                            </p>
                            <p
                              className="m-2 text-xs font-semibold cursor-pointer"
                              onClick={() => {
                                forwardEmail();
                              }}
                            >
                              REENVIAR
                            </p>
                            <p
                              className="m-2 text-xs font-semibold cursor-pointer"
                              onClick={() => {
                                moveFolder(0, selectMail.googleId);
                              }}
                            >
                              MARCAR COMO CORREO NO DESEADO
                            </p>
                            <p
                              className="m-2 text-xs font-semibold cursor-pointer"
                              onClick={() => {
                                moveFolder(1, selectMail.googleId);
                              }}
                            >
                              ELIMINAR
                            </p>
                          </div>
                        </div>
                        <iframe
                          className="w-full h-screen"
                          srcDoc={decodedMailData}
                        />
                        {send && (
                          <div className="bg-white max-md:w-screen rounded-l-2xl overflow-y-auto h-auto p-7 w-full">
                            <div className="bg-gray-100 text-sm p-5 h-auto">
                              <div className="pb-2 border-b-2">
                                {reply && <p>Responder: {selectMail?.from}</p>}
                                {forward && (
                                  <>
                                    <div className="py-2 border-b-2">
                                      <div className="flex items-center">
                                        <p className="w-10">Para:</p>
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
                                            setCCBCC({
                                              CC: true,
                                              BCC: CCBCC.BCC,
                                            });
                                          }}
                                        >
                                          CC
                                        </p>
                                        <p
                                          className="ml-2 hover:underline cursor-pointer"
                                          onClick={() => {
                                            setCCBCC({
                                              CC: CCBCC.CC,
                                              BCC: true,
                                            });
                                          }}
                                        >
                                          BCC
                                        </p>
                                      </div>
                                      {CCBCC.CC && (
                                        <div className="flex items-center mt-2">
                                          <p className="w-10">CC:</p>
                                          <SelectDropdown
                                            name="responsible"
                                            options={lists?.users}
                                            setValue={setValue}
                                            className="ml-2 w-full"
                                            setContactsArray={setCCArray}
                                          />
                                        </div>
                                      )}
                                      {CCBCC.BCC && (
                                        <div className="flex items-center mt-2">
                                          <p className="w-10">BCC:</p>
                                          <SelectDropdown
                                            name="responsible"
                                            options={lists?.users}
                                            setValue={setValue}
                                            className="ml-2 w-full"
                                            setContactsArray={setBCCArray}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </>
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
                                  className=" w-full bg-white pb-12"
                                  theme="snow"
                                  value={value}
                                  onChange={setValueText}
                                  formats={formats}
                                  modules={{ toolbar }}
                                />
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
                                    onClick={() =>
                                      forward ? sendForward() : sendReply()
                                    }
                                  >
                                    Enviar
                                  </button>
                                  <button
                                    className="bg-gray-300 m-2 p-3 rounded-md"
                                    onClick={() => {
                                      setSend(false);
                                    }}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
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
