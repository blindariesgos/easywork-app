"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  createImap,
  saveFolders,
  getImapConfig,
  getFoldersSaved,
} from "../../../../../../lib/apis";
import { getApiError } from "../../../../../../utils/getApiErrors";
import axios from "axios";
import ModalAddGmail from "./components/ModalAddGmail";
import ModalAddFolders from "./components/ModalAddFolders"
import Tag from "../../../../../../components/Tag";
import useAppContext from "../../../../../../context/app/index";

export default function IngresarEmail() {
  const session = useSession();
  const router = useRouter();
  const [modalG, setModalG] = useState(false);
  const [modalC, setModalC] = useState(false);
  const [gmailState, setGmailState] = useState(false);
  const {
    setOpenModalFolders,
    openModalFolders,
  } = useAppContext();

  const [ImapData, setImapData] = useState({
    host: null,
    port: null,
    tls: false,
    user: null,
    password: null,
    senderName: null,
    mailName: null,
    userId: session.data.user.user.id,
  });


  async function saveIMAP() {
    try {
      const response = await createImap(ImapData);
      if (response) {
        setFolderId(response);
        getFolders();
      }
    } catch (error) {
      getApiError(error.message, errorsDuplicated);
    }
  }

  async function getFolders() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/gmail/folders/${session.data.user.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.data.user.accessToken}`,
          },
        }
      );
      if (response) {
        const newData = response.data.map((folder) => ({
          folder: folder,
          state: false,
        }));
        setFolderData(newData);
        setModalG(false);
        setModalC(true);
      }
    } catch (error) {
      getApiError(error.message, errorsDuplicated);
    }
  }


  async function toKnowEmail() {
    try {
      const responseImap = await getImapConfig(session.data.user.user.id);
      if (responseImap) {
        router.push("/tools/tool/webmail");
      } else {
        setModalG(true);
      }
    } catch (error) {
      setModalG(true);
    }
  }

  const emails = [
    {
      name: "Gmail",
      src: "/icons/emails/gmail.svg",
      click: () => setGmailState(true),
      // click: () => toKnowEmail(),
    },
    {
      name: "ICloud",
      src: "/icons/emails/icloud.svg",
      click: "",
    },
    {
      name: "Outlook",
      src: "/icons/emails/outlook.svg",
      click: "",
    },
    {
      name: "Exchange",
      src: "/icons/emails/exchange.svg",
      click: "",
    },
    {
      name: "Yahoo!",
      src: "/icons/emails/yahoo.svg",
      click: "",
    },
    {
      name: "Office 365",
      src: "/icons/emails/office365.svg",
      click: "",
    },
    {
      name: "IMAP",
      src: "/icons/emails/imap.svg",
      click: "",
    },
  ];

  return (
    <div className="rounded-2xl px-2 flex justify-center items-center flex-col">
      <div className="w-full rounded-xl text-easywork-main mb-4">
        <h1 className="ml-3 py-3 font-medium text-xl">Integración del buzón</h1>
      </div>
      <div className="w-full bg-white rounded-xl drop-shadow-md text-easywork-main mb-4">
        <h1 className="ml-3 w-full py-5 text-center font-medium text-xl" onClick={() => {router.push("/tools/tool/webmail");}}>
          Use y gestione su buzón
        </h1>
      </div>
      <div className="w-full bg-white rounded-xl drop-shadow-md sm:p-3 px-20 py-10 flex items-center flex-col gap-4">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-4 my-3">
          {emails.map((item, index) => (
            <div
              className="flex flex-col justify-center bg-gray-100 px-10 py-7 rounded-lg"
              key={index}
              onClick={item.click}
            >
              <div className="flex justify-center items-center bg-white overflow-hidden rounded-full mb-4 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6">
                <Image
                  width={30}
                  height={30}
                  src={item.src}
                  alt={item.name}
                  className="object-cover object-center"
                />
              </div>
              <div className="text-center">
                <h1>{item.name}</h1>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <ModalAddGmail state={gmailState}>
        <Tag onclick={() => setGmailState(false)} className="bg-green-500" />
      </ModalAddGmail>
      { openModalFolders &&
      <ModalAddFolders state={true}>
      <Tag onclick={() => setOpenModalFolders(false)} className="bg-green-500" />
    </ModalAddFolders>
      }

    </div>
  );
}
