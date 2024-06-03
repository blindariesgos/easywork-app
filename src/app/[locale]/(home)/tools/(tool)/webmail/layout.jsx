"use client";
import useAppContext from "../../../../../../context/app";
import EmailHeader from "./components/EmailHeader";
import React, { useState, useEffect } from "react";
import CreateTaskButton from "./components/CreateTaskButton";
import SendMessage from "./components/SendMessage";
import Tag from "../../../../../../components/Tag";
import Table from "./components/Table";
import axios from "axios";
import {
  Cog8ToothIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  FolderIcon,
} from "@heroicons/react/20/solid";
import {
  ChevronUpIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  PauseCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import TaskSubMenu from "./components/TaskSubMenu";
import { useTranslation } from "react-i18next";
import SliderOverEmail from "./components/SliderOverEmail";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getTokenGoogle, getFoldersSaved } from "../../../../../../lib/apis";
import { useSession } from "next-auth/react";
import ModalAddGmail from "../mails/components/ModalAddGmail";

export default function WebmailLayout({ children, table }) {
  const session = useSession();
  const router = useRouter();
  const { sidebarOpenEmail, setSidebarOpenEmail } = useAppContext();
  const { t } = useTranslation();
  const [userData, setUserData] = useState([]);
  const [mails, setMails] = useState(null);
  const [gmailState, setGmailState] = useState(false);
  const [folders, setFolders] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("INBOX");

  useEffect(() => {
    if (window.innerWidth > 1023) {
      setTimeout(() => {
        setSidebarOpenEmail(true);
      }, 1000);
    } else {
    }
  }, [setSidebarOpenEmail]);

  useEffect(() => {
    // getTokenGoogle(session.data.user.id).then((res) => {
    //   setUserData(res);
    //   const config = {
    //     headers: { Authorization: `Bearer ${res.access_token}` },
    //   };
    //   axios
    //     .get(
    //       `https://www.googleapis.com/gmail/v1/users/${res.usergoogle_id}/messages?includeSpamTrash=true`,
    //       config
    //     )
    //     .then((response) => {
    //       const messages = response.data.messages;
    //       let messagePromises = messages.map((message) => {
    //         return axios.get(
    //           `https://www.googleapis.com/gmail/v1/users/${res.usergoogle_id}/messages/${message.id}?format=full`,
    //           config
    //         );
    //       });

    //       Promise.all(messagePromises).then((messageInfos) => {
    //         const messageHeaders = messageInfos.map((info) => {
    //           return {
    //             ...info.data,
    //             snippet: info.data.snippet,
    //           };
    //         });
    //         setMails(messageHeaders);
    //         console.log(messageHeaders);
    //       });
    //     });
    // });
    getTokenGoogle(session.data.user.id).then((res) => {
      setUserData(res);
      const config = {
        headers: {
          Authorization: `${session.data.user.accessToken}`,
        },
      };

      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/mails/${session.data.user.id}`,
          config
        )
        .then((response) => {
          setMails(response.data);
          console.log(response);
        });
    });
    getFoldersSaved(session.data.user.id).then((res) => {
      setFolders(res);
    });
  }, []);

  function backButton() {
    setSidebarOpenEmail(false);
    router.push("/tools/mails");
  }

  return (
    <>
      <ModalAddGmail state={gmailState} from={"buzon"}>
        <Tag onclick={() => setGmailState(false)} className="bg-green-500" />
      </ModalAddGmail>
      <SendMessage colorTag="bg-green-100" />
      <div className="flex flex-col flex-grow">
        <EmailHeader
          title="Tareas"
          ActionButton={
            <>
              <button
                type="button"
                className="relative inline-flex items-center rounded-md bg-primary px-3 py-2 text-md font-semibold text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10"
                onClick={() => router.push("/tools/webmail/?send=true")}
              >
                Nuevo mensaje
              </button>
            </>
          }
          ToolsButtons={
            <>
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setGmailState(true)}
              >
                <Cog8ToothIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              </button>
            </>
          }
        >
          <div className="flex-none items-center justify-between  border-gray-200 py-4 hidden lg:flex">
            <TaskSubMenu />
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
              {/* image */}
              <div className="flex items-center">
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
                <div className="flex items-center justify-center ml-1.5 border border-white rounded-full">
                  <ArrowPathIcon className="m-1 h-6 w-6 text-white" />
                </div>
              </div>
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
                  selectedFolder === "ARCHIVED"
                    ? "bg-violet-500 transition-colors duration-200 rounded-lg"
                    : ""
                }`}
                onClick={() => setSelectedFolder("ARCHIVED")}
              >
                <BookmarkIcon className="h-6 w-6 text-white" />
                <h3 className="ml-4 text-md">Archivados</h3>
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
                  .map((folder) => (
                    <li
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
        {mails && <Table mails={mails} selectedFolder={selectedFolder} />}
        {children}
      </div>
    </>
  );
}
