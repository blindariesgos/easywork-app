"use client";
import useAppContext from "../../../../../../context/app";
import EmailHeader from "./components/EmailHeader";
import React, { useState, useEffect, Fragment } from "react";
import LoaderSpinner, {
  LoadingSpinnerSmall,
} from "@/src/components/LoaderSpinner";
import clsx from "clsx";
import { itemsByPage } from "@/src/lib/common";
import SendMessage from "./components/SendMessage";
import ModalAddFolders from "../mails/components/ModalAddFolders";
import Table from "./components/Table";
import axios from "axios";
import {
  Cog8ToothIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  FolderIcon,
  ArrowRightCircleIcon,
  CheckIcon,
  ChatBubbleLeftIcon,
  ChevronDownIcon,
  UsersIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import {
  ChevronUpIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  PauseCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems, Menu } from "@headlessui/react";
import TaskSubMenu from "./components/TaskSubMenu";
import { useTranslation } from "react-i18next";
import SliderOverEmail from "./components/SliderOverEmail";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  updateLabelId,
  deleteTokenGoogle,
  getMails,
  deleteFoldersMail,
  getAllOauth,
} from "../../../../../../lib/apis";
import { useSession } from "next-auth/react";
import ModalConfigGmail from "../mails/components/ModalConfigGmail";
import Signature from "./components/Signature";
import AddSignature from "./components/AddSignature";
import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function WebmailLayout({ children, table }) {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSidebarOpenEmail, selectOauth, setSelectOauth, openModalFolders } =
    useAppContext();
  const { t } = useTranslation();
  const [userData, setUserData] = useState([]);
  const [dmails, setDMails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("INBOX");
  const [allOauth, setAllOauth] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialFetch, setInitialFetch] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSelectOauth(null);
    allOauthPromise();
    getAllOauth(session.data.user.id).then((response) => {
      if (response.length === 0) {
        router.push("/tools/mails");
      }
    });
    if (window.innerWidth > 1023) {
      setTimeout(() => {
        setSidebarOpenEmail(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (selectOauth) {
      fetchData(true);
      if (!initialFetch) {
        setInitialFetch(true);
      }
    }
  }, [selectOauth, selectedFolder]);

  useEffect(() => {
    if (selectOauth) {
      fetchData(false);
    }
  }, [page]);

  useEffect(() => {
    if (selectOauth) {
      getAxiosMails("ALL", 1).then((res) => {
        if (res.length == 0)
          axios.get(
            `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/savemails/${session.data.user.id}/${selectOauth?.id}`
          );
      });
    }
  }, [page, selectedFolder]);

  useEffect(() => {
    if (openModalFolders) {
      allOauthPromise();
    }
  }, [openModalFolders]);

  const updateData = async () => {
    setIsLoading(true);
    setDMails([]);
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/updateemail/${session.data.user.id}/${selectOauth.id}`
      );
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar correos");
    } finally {
      setIsLoading(false);
      toast.success("Correos actualizados");
    }
  };

  const getMoreMails = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const totalUnreadByPage = () => {
    return dmails.reduce(
      (count, email) =>
        email.email.folder.includes("UNREAD") ? count + 1 : count,
      0
    );
  };

  const getAxiosMails = async (folder, limit = 10) => {
    try {
      const response = await getMails(
        session.data.user.id,
        page,
        limit,
        folder ? folder : selectedFolder,
        selectOauth?.id
      );
      return response;
    } catch (error) {
      console.error("Error fetching mails:", error);
      throw error;
    }
  };

  const fetchUserData = async () => {
    const config = {
      headers: { Authorization: `Bearer ${session.data.user.access_token}` },
    };
    try {
      const axiosUserData = await axios.get(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/googleUser/${session.data.user.id}/${selectOauth?.id}`,
        config
      );
      setUserData(axiosUserData.data);
      return axiosUserData.data;
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const fetchMails = async (reset = false) => {
    try {
      const response = await getAxiosMails(selectedFolder);
      setDMails((prevMails) =>
        reset ? response : [...prevMails, ...response]
      );
    } catch (error) {
      console.error("Error fetching mails:", error);
    }
  };

  const fetchData = async (reset = false) => {
    try {
      if (session.data.user.id && selectOauth?.id) {
        await fetchUserData();
        await fetchMails(reset);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  async function saveFoldersData(usergoogle_id) {
    const folders = [
      { imapFolderId: "CHAT", mailboxName: "CHAT", type: "system" },
      { imapFolderId: "SENT", mailboxName: "SENT", type: "system" },
      { imapFolderId: "INBOX", mailboxName: "INBOX", type: "system" },
      { imapFolderId: "IMPORTANT", mailboxName: "IMPORTANT", type: "system" },
      { imapFolderId: "TRASH", mailboxName: "TRASH", type: "system" },
      { imapFolderId: "DRAFT", mailboxName: "DRAFT", type: "system" },
      { imapFolderId: "SPAM", mailboxName: "SPAM", type: "system" },
      {
        imapFolderId: "CATEGORY_FORUMS",
        mailboxName: "CATEGORY_FORUMS",
        type: "system",
      },
      {
        imapFolderId: "CATEGORY_UPDATES",
        mailboxName: "CATEGORY_UPDATES",
        type: "system",
      },
      {
        imapFolderId: "CATEGORY_PERSONAL",
        mailboxName: "CATEGORY_PERSONAL",
        type: "system",
      },
      {
        imapFolderId: "CATEGORY_PROMOTIONS",
        mailboxName: "CATEGORY_PROMOTIONS",
        type: "system",
      },
      {
        imapFolderId: "CATEGORY_SOCIAL",
        mailboxName: "CATEGORY_SOCIAL",
        type: "system",
      },
      { imapFolderId: "STARRED", mailboxName: "STARRED", type: "system" },
      { imapFolderId: "UNREAD", mailboxName: "UNREAD", type: "system" },
    ];
    await updateLabelId(usergoogle_id, folders);
    fetchData();
  }

  function allOauthPromise() {
    getAllOauth(session.data.user.id).then((res) => {
      if (!selectOauth) {
        setSelectOauth(res[0]);
      }
      setAllOauth(res);
    });
  }

  const itemOptions = [
    { name: "Volver a la lista", onClick: "" },
    { name: "Contactos", onClick: "" },
    {
      name: "Editar firmas",
      onClick: () => router.push(`${window.location.pathname}?signature=true`),
    },
    {
      name: "Configuración del buzón",
      onClick: () =>
        router.push(`${window.location.pathname}?configemail=true&isEdit=true`),
    },
  ];

  const folderList = [
    {
      selectedFolder: "INBOX",
      label: "Recibidos",
      icon: <ArrowRightCircleIcon className="h-6 w-6 text-white" />,
      unread: selectOauth?.unreadInboxCount,
    },
    {
      selectedFolder: "CHAT",
      label: "Chats",
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "ALL",
      label: "Todos",
      icon: <BookmarkIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "SENT",
      label: "Enviados",
      icon: <ChatBubbleLeftIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "SAVED",
      label: "Guardados",
      icon: <HeartIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "SPAM",
      label: "Spam",
      icon: <ExclamationCircleIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "TRASH",
      label: "Basura",
      icon: <TrashIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "DRAFT",
      label: "Borradores",
      icon: <FolderIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "CATEGORY_FORUMS",
      label: "Foros",
      icon: <FolderIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "CATEGORY_UPDATES",
      label: "Actualizaciones",
      icon: <ArrowPathIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "CATEGORY_PERSONAL",
      label: "Personal",
      icon: <UserIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "CATEGORY_PROMOTIONS",
      label: "Promociones",
      icon: <FolderIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "CATEGORY_SOCIAL",
      label: "Social",
      icon: <UsersIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "STARRED",
      label: "Destacados",
      icon: <FolderIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "IMPORTANT",
      label: "Importantes",
      icon: <FolderIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
    {
      selectedFolder: "UNREAD",
      label: "No leído",
      icon: <FolderIcon className="h-6 w-6 text-white" />,
      unread: null,
    },
  ];

  return (
    <>
      {loading && <LoaderSpinner />}
      <Signature />
      <AddSignature />
      <ModalConfigGmail isEdit={true} />
      <ModalAddFolders isConfig={true} />
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
                onClick={() => router.push(`/tools/webmail/?send=true`)}
              >
                Nuevo mensaje
              </button>
            </>
          }
          ToolsButtons={
            <Menu as="div" className="relative">
              <MenuButton>
                <div
                  type="button"
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <Cog8ToothIcon
                    className="-ml-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                </div>
              </MenuButton>
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
            </Menu>
          }
        >
          <div className="flex-none items-center justify-between  border-gray-200 py-4 hidden lg:flex">
            <TaskSubMenu
              totalUnreadByPage={totalUnreadByPage}
              setDMails={setDMails}
              getAxiosMails={getAxiosMails}
              selectedFolder={selectedFolder}
            />
          </div>
        </EmailHeader>
        <SliderOverEmail>
          <div className="flex flex-col shrink-0 items-center mx-auto h-full mt-10">
            <Link href="/">
              <Image
                width={72}
                height={72}
                className="h-16 w-auto"
                src="/img/Layer_2.svg"
                alt="EasyWork"
              />
            </Link>
            <div>
              <div className="mt-3">
                <Menu as="div" className="flex items-center relative">
                  <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                        <ChevronUpIcon
                          className={`ml-2 h-5 w-5 text-white ${isMenuOpen ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300"}`}
                        />
                      </div>
                    </div>
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className=" z-50 mt-1 w-80 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                  >
                    {allOauth?.map((oauth) => (
                      <MenuItem key={oauth.id}>
                        {({ active }) => (
                          <div
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "flex justify-between items-center px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                            )}
                            onClick={() => {
                              setLoading(true);
                              setSelectOauth(oauth);
                            }}
                          >
                            <p>{oauth.email}</p>
                            <p className="bg-green-500 px-0.5 rounded-md text-white text-sm">
                              {oauth.unreadCount}
                            </p>
                          </div>
                        )}
                      </MenuItem>
                    ))}
                    <MenuItem
                      transition
                      className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer border-t-2"
                    >
                      <div
                        onClick={() =>
                          router.push(
                            `${window.location.href}?connectemail=true`
                          )
                        }
                      >
                        Conectar nuevo
                      </div>
                    </MenuItem>
                  </MenuItems>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "1rem",
                      border: "1px solid white",
                      borderRadius: "50%",
                      cursor: "pointer",
                      animation: isLoading ? "spin 1s infinite linear" : "none",
                    }}
                    onClick={() => updateData()}
                  >
                    <ArrowPathIcon className="m-1 h-6 w-6 text-white" />
                  </div>
                </Menu>
              </div>
              <div className="w-full my-4">
                <p className="text-xs text-white text-left">
                  Herramientas - buzón de correo
                </p>
              </div>
              <div className="w-full">
                <button
                  onClick={() => router.push("/home")}
                  className="w-full hover:bg-slate-200 bg-white text-easywork-main py-2 rounded-lg cursor-pointer"
                >
                  volver
                </button>
              </div>
              {userData?.labelId && (
                <ul className="w-full mt-2">
                  <li
                    className={`cursor-pointer text-left text-white flex p-4 ${
                      selectedFolder === "ALL"
                        ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                        : ""
                    }`}
                    onClick={() => setSelectedFolder("ALL")}
                  >
                    <BookmarkIcon className="h-6 w-6 text-white" />
                    <div className="flex justify-between w-full">
                      <h3 className="ml-4 text-md">Todos</h3>
                    </div>
                  </li>
                  {userData?.labelId?.map((labelId, index) => (
                    <li
                      key={index}
                      className={`cursor-pointer text-left text-white flex p-4 ${
                        selectedFolder === JSON.parse(labelId).mailboxName
                          ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedFolder(JSON.parse(labelId).mailboxName)
                      }
                    >
                      {folderList.find(
                        (folder) =>
                          folder.selectedFolder ===
                          JSON.parse(labelId).mailboxName
                      ) ? (
                        folderList.find(
                          (folder) =>
                            folder.selectedFolder ===
                            JSON.parse(labelId).mailboxName
                        ).icon
                      ) : (
                        <FolderIcon className="h-6 w-6 text-white" />
                      )}
                      <div className="flex justify-between w-full">
                        <h3 className="ml-4 text-md">
                          {folderList.find(
                            (folder) =>
                              folder.selectedFolder ===
                              JSON.parse(labelId).mailboxName
                          )
                            ? folderList.find(
                                (folder) =>
                                  folder.selectedFolder ===
                                  JSON.parse(labelId).mailboxName
                              ).label
                            : JSON.parse(labelId).mailboxName}
                        </h3>
                        <h3 className="text-md" key={index}>
                          {
                            folderList.find(
                              (folder) =>
                                folder.selectedFolder ===
                                JSON.parse(labelId).mailboxName
                            )?.unread
                          }
                        </h3>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </SliderOverEmail>
        {dmails && (
          <Table
            mails={dmails}
            fetchData={fetchData}
            setDMails={setDMails}
            selectedFolder={selectedFolder}
            getAxiosMails={getAxiosMails}
          />
        )}
        {children}
        <div className="flex justify-center">
          <div className="flex gap-1 items-center">
            <button
              className="relative inline-flex items-center rounded-md bg-primary px-3 py-2 text-md font-semibold text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10"
              onClick={() => getMoreMails()}
            >
              Mostrar más
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
