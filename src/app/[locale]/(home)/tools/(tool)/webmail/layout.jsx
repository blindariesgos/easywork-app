"use client";
import useAppContext from "../../../../../../context/app";
import EmailHeader from "./components/EmailHeader";
import React, { useState, useEffect, Fragment } from "react";
import clsx from "clsx";
import { itemsByPage } from "@/src/lib/common";
import SendMessage from "./components/SendMessage";
import ModalAddFolders from "../mails/components/ModalAddFolders";
import Tag from "../../../../../../components/Tag";
import Table from "./components/Table";
import axios from "axios";
import {
  Cog8ToothIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  FolderIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import {
  ChevronUpIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  PauseCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  MenuButton,
  MenuItem,
  MenuItems,
  Menu,
  Transition,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import TaskSubMenu from "./components/TaskSubMenu";
import { useTranslation } from "react-i18next";
import SliderOverEmail from "./components/SliderOverEmail";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getTokenGoogle,
  getFoldersSaved,
  deleteTokenGoogle,
  getMails,
  deleteFoldersMail,
  getAllOauth,
} from "../../../../../../lib/apis";
import { useSession } from "next-auth/react";
import ModalConfigGmail from "../mails/components/ModalConfigGmail";
import { Pagination } from "../../../../../../components/pagination/Pagination";
import Signature from "./components/Signature";
import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function WebmailLayout({ children, table }) {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { query } = router;
  const {
    sidebarOpenEmail,
    setSidebarOpenEmail,
    selectOauth,
    setSelectOauth,
    setOpenModalFolders,
    openModalFolders,
  } = useAppContext();
  const { t } = useTranslation();
  const [userData, setUserData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [dmails, setDMails] = useState([]);
  const [gmailState, setGmailState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [addOtherOauth, setAddOtherOauth] = useState(false);
  const [folders, setFolders] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("INBOX");
  const [allOauth, setAllOauth] = useState(null);

  useEffect(() => {
    setSelectOauth(null);
    allOauthPromise();
  }, []);

  useEffect(() => {
    if (window.innerWidth > 1023) {
      setTimeout(() => {
        setSidebarOpenEmail(true);
      }, 1000);
    } else {
    }
  }, [setSidebarOpenEmail]);

  useEffect(() => {
    allOauthPromise();
  }, [selectOauth]);

  useEffect(() => {
    allOauthPromise();
  }, [openModalFolders]);

  useEffect(() => {
    console.log(limit);
    getMails(
      session.data.user.id,
      searchParams.get("page"),
      limit,
      selectedFolder,
      selectOauth?.id
    ).then((res) => {
      setDMails(res);
    });
  }, [selectOauth, searchParams.get("page"), selectedFolder, limit]);

  const updateData = async () => {
    setIsLoading(true);
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/updateemail/${session.data.user.id}/${selectOauth.id}`
      );
      fetchData();
    } catch (error) {
      setIsLoading(false);
      toast.success("Correos actualizados");
    } finally {
      setIsLoading(false);
      toast.success("Correos actualizados");
    }
  };

  const totalUnreadByPage = () => {
    let contador = 0;
    for (const email of dmails) {
      if (email.email.folder.includes('UNREAD')) {
        contador++;
      }
    }
    return contador;    
  }

  const fetchData = async () => {
    const config = {
      headers: { Authorization: `Bearer ${session.data.user.access_token}` },
    };
    try {
      if (session.data.user.id && selectOauth?.id) {
        const axiosUserData = await axios.get(
          `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/googleUser/${session.data.user.id}/${selectOauth?.id}`,
          config
        );
        setUserData(axiosUserData.data);
        const axiosMails = await getMails(
          session.data.user.id,
          searchParams.get("page"),
          10,
          selectedFolder,
          selectOauth.id
        );
        setDMails(axiosMails);
        const axiosFolders = await getFoldersSaved(session.data.user.id);
        setFolders(axiosFolders);
        if (!axiosMails || axiosMails?.length === 0) {
          await deleteOauth();
        }
      }
    } catch (errr) {
      await deleteOauth();
    }
  };

  async function deleteOauth() {
    await deleteTokenGoogle(session.data.user.id);
    await deleteFoldersMail(session.data.user.id);
    router.push("/tools/mails");
  }

  function allOauthPromise() {
    getAllOauth(session.data.user.id).then((res) => {
      if (!selectOauth) {
        setSelectOauth(res[0]);
      }
      setAllOauth(res);
      fetchData();
    });
  }

  function openModal(motivo, state, add) {
    setMotivo(motivo);
    setAddOtherOauth(add);
    setGmailState(state);
  }

  function backButton() {
    setSidebarOpenEmail(false);
    router.push("/tools/mails");
  }

  const itemOptions = [
    { name: "Volver a la lista", onClick: "" },
    { name: "Contactos", onClick: "" },
    { name: "Editar firmas", onClick: "" },
    {
      name: "Configuración del buzón",
      onClick: () => openModal("edit", true, false),
    },
    { name: "Abrir email", onClick: "" },
  ];

  // async function saveMails() {
  //   axios.get(
  //     `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/savemails/${session.data.user.id}/${selectOauth.id}`
  //   );
  // }

  return (
    <>
      <Signature />
      <ModalConfigGmail
        state={gmailState}
        addOtherOauth={addOtherOauth}
        motivo={motivo}
      >
        <Tag
          onclick={() => setGmailState(false)}
          className="bg-easywork-main"
        />
      </ModalConfigGmail>
      {openModalFolders && (
        <ModalAddFolders state={true} addOtherOauth={addOtherOauth}>
          <Tag
            onclick={() => setOpenModalFolders(false)}
            className="bg-easywork-main"
          />
        </ModalAddFolders>
      )}
      <SendMessage
        colorTag="bg-easywork-main"
        userData={userData}
        selectOauth={selectOauth}
      />
      <div className="flex flex-col flex-grow">
        <EmailHeader
          title="Tareas"
          ActionButton={
            <>
              <button
                type="button"
                className="relative inline-flex items-center rounded-md bg-primary px-3 py-2 text-md font-semibold text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10"
                onClick={() =>
                  router.push(
                    `/tools/webmail/?page=${searchParams.get("page")}&send=true`
                  )
                }
              >
                Nuevo mensaje
              </button>
            </>
          }
          ToolsButtons={
            <Menu as="div" className="relative">
              <Menu.Button>
                <div
                  type="button"
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <Cog8ToothIcon
                    className="-ml-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-50 mt-2.5 w-48 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                  {itemOptions.map((item, index) => (
                    <MenuItem key={index}>
                      {({ active }) => (
                        <div
                          onClick={item.onClick}
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                          )}
                        >
                          {item.name}
                        </div>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Transition>
            </Menu>
          }
        >
          <div className="flex-none items-center justify-between  border-gray-200 py-4 hidden lg:flex">
            <TaskSubMenu fetchData={fetchData} totalUnreadByPage={totalUnreadByPage} />
          </div>
        </EmailHeader>
        <SliderOverEmail>
          <div className="flex flex-col h-16 shrink-0 items-center mx-auto mt-10">
            <Link href="/">
              <Image
                width={72}
                height={72}
                className="h-16 w-auto"
                src="/img/Layer_2.svg"
                alt="EasyWork"
              />
            </Link>
            <div className="mt-3">
              <Menu as="div" className="flex items-center relative">
                <Menu.Button>
                  <div className="flex border border-white p-1.5 rounded-lg text-white">
                    <Image
                      width={45}
                      height={45}
                      alt="img"
                      className="rounded-full"
                      src={userData?.picture}
                    />
                    <div className="ml-2">
                      <h1 className="font-bold">
                        {userData?.given_name} {userData?.family_name}
                      </h1>
                      <p className="text-xs">info</p>
                    </div>
                    <div className="flex items-center mb-1">
                      <ChevronUpIcon className="ml-2 h-5 w-5 text-white" />
                    </div>
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-1 top-11 z-50 mt-2.5 w-72 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                    {allOauth?.map((oauth) => (
                      <Menu.Item key={oauth.id}>
                        {({ active }) => (
                          <div
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "flex justify-between items-center px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                            )}
                            onClick={() => {
                              setSelectOauth(oauth);
                            }}
                          >
                            <p>{oauth.email}</p>
                            <p className="bg-green-500 px-0.5 rounded-md text-white text-sm">{oauth.unreadCount}</p>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                    <Menu.Item className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer border-t-2">
                      <div
                        onClick={() => {
                          openModal("add", true, true);
                        }}
                      >
                        Conectar nuevo
                      </div>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "1rem",
                    border: "1px solid white",
                    borderRadius: "50%",
                    cursor: "pointer",
                    animation: isLoading ? "spin 1s infinite linear" : "none", // Aplica la animación si isLoading es true
                  }}
                  onClick={() => updateData()}
                >
                  <ArrowPathIcon className="m-1 h-6 w-6 text-white" />
                </div>
              </Menu>
            </div>
            <div className="w-full my-4">
              <p className="text-xs text-white text-left">
                HERRAMIENTAS - CORREO
              </p>
            </div>
            <div className="w-full">
              <button
                onClick={() => backButton()}
                className="w-full bg-white text-easywork-main py-2 rounded-lg cursor-pointer"
              >
                volver
              </button>
            </div>
            <ul className="w-full mt-2">
              <li
                className={`cursor-pointer text-left text-white flex p-4 ${
                  selectedFolder === "INBOX"
                    ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                    : ""
                }`}
                onClick={() => setSelectedFolder("INBOX")}
              >
                <ChevronRightIcon className="ml-2 mt-1 h-4 w-4" />
                <h3 className="ml-4 text-md">INBOX</h3>
              </li>
              <li
                className={`cursor-pointer text-left text-white flex p-4 ${
                  selectedFolder === "ALL"
                    ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                    : ""
                }`}
                onClick={() => setSelectedFolder("ALL")}
              >
                <BookmarkIcon className="h-6 w-6 text-white" />
                <h3 className="ml-4 text-md">Todos</h3>
              </li>
              <li
                className={`cursor-pointer text-left text-white flex p-4 ${
                  selectedFolder === "SENT"
                    ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                    : ""
                }`}
                onClick={() => setSelectedFolder("SENT")}
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                <h3 className="ml-4 text-md">Enviados</h3>
              </li>
              <li
                className={`cursor-pointer text-left text-white flex p-4 ${
                  selectedFolder === "SAVED"
                    ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                    : ""
                }`}
                onClick={() => setSelectedFolder("SAVED")}
              >
                <HeartIcon className="h-6 w-6 text-white" />
                <h3 className="ml-4 text-md">Guardados</h3>
              </li>
              <li
                className={`cursor-pointer text-left text-white flex p-4 ${
                  selectedFolder === "SPAM"
                    ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                    : ""
                }`}
                onClick={() => setSelectedFolder("SPAM")}
              >
                <ExclamationCircleIcon className="h-6 w-6 text-white" />
                <h3 className="ml-4 text-md">Spam</h3>
              </li>
              <li
                className={`cursor-pointer text-left text-white flex p-4 ${
                  selectedFolder === "DRAFTS"
                    ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                    : ""
                }`}
                onClick={() => setSelectedFolder("DRAFTS")}
              >
                <FolderIcon className="h-6 w-6 text-white" />
                <h3 className="ml-4 text-md">Borradores</h3>
              </li>
              <li
                className={`cursor-pointer text-left text-white flex p-4 ${
                  selectedFolder === "TRASH"
                    ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                    : ""
                }`}
                onClick={() => setSelectedFolder("TRASH")}
              >
                <TrashIcon className="h-6 w-6 text-white" />
                <h3 className="ml-4 text-md">Basura</h3>
              </li>
              {folders &&
                folders
                  .filter((folder) => folder.type === "user")
                  .map((folder, index) => (
                    <li
                      key={index}
                      className={`cursor-pointer text-left text-white flex p-4 ${
                        selectedFolder === folder.mailboxName
                          ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                          : ""
                      }`}
                      onClick={() => setSelectedFolder(folder.mailboxName)}
                    >
                      <FolderIcon className="h-6 w-6 text-white" />
                      <h3 className="ml-4 text-md">{folder.mailboxName}</h3>
                    </li>
                  ))}
            </ul>
          </div>
        </SliderOverEmail>
        {dmails && (
          <Table
            mails={dmails}
            fetchData={fetchData}
            selectedFolder={selectedFolder}
          />
        )}
        {children}
        <div className="flex justify-center">
        <div className="flex gap-1 items-center">
            <p>Mostrar:</p>
            <Listbox value={limit} onChange={setLimit} as="div">
              <ListboxButton
                className={clsx(
                  "relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
                )}
              >
                {limit}
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-2.5 right-2.5 size-4 "
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions
                anchor="bottom"
                transition
                className={clsx(
                  "rounded-xl border border-white p-1 focus:outline-none bg-white shadow-2xl",
                  "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                )}
              >
                {itemsByPage.map((page) => (
                  <ListboxOption
                    key={page.name}
                    value={page.id}
                    className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-primary data-[focus]:text-white"
                  >
                    <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
                    <div className="text-sm/6">{page.name}</div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </div>
          {/* <Pagination totalPages={dataContacts?.meta?.totalPages || 0} /> */}
          <Pagination totalPages={10} bgColor="bg-gray-300" />
        </div>
      </div>
    </>
  );
}
