"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { createImap, getAllOauth } from "../../../../../../lib/apis";
import { handleApiError } from "../../../../../../utils/api/errors";
import axios from "axios";
import ModalConfigGmail from "./components/ModalConfigGmail";
import ModalAddFolders from "./components/ModalAddFolders";
import Tag from "../../../../../../components/Tag";
import useAppContext from "../../../../../../context/app/index";
import { toast } from "react-toastify";

export default function IngresarEmail() {
  const session = useSession();
  const router = useRouter();
  const [modalG, setModalG] = useState(false);
  const [modalC, setModalC] = useState(false);
  const [gmailState, setGmailState] = useState(false);
  const { setOpenModalFolders, openModalFolders } = useAppContext();
  const searchParams = useSearchParams();
  const userdeleted = searchParams.get("userdeleted");

  // getAllOauth(session.data.user.id).then((response) => {
  //   if (response.length > 0) {
  //     router.push("/tools/webmail?page=1");
  //   }
  // })

  useEffect(() => {
    if (userdeleted == "true") toast.success("Correo eliminado");
  }, [userdeleted]);

  const [ImapData, setImapData] = useState({
    host: null,
    port: null,
    tls: false,
    user: null,
    password: null,
    senderName: null,
    mailName: null,
    userId: session.data.user.id,
  });

  async function saveIMAP() {
    try {
      const response = await createImap(ImapData);
      if (response) {
        setFolderId(response);
        getFolders();
      }
    } catch (error) {
      handleApiError(error.message);
    }
  }

  async function getFolders() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/gmail/folders/${session.data.user.id}`,
        {
          headers: {
            Authorization: `${session.data.user.accessToken}`,
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
      handleApiError(error.message);
    }
  }

  const emails = [
    {
      name: "Gmail",
      src: "/icons/emails/gmail.svg",
      click: () => router.push(`${window.location.pathname}?configemail=true`),
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
        <h1
          className="ml-3 w-full py-5 text-center font-medium text-xl"
          onClick={() => {
            router.push("/tools/webmail?page=1");
          }}
        >
          Use y gestione su buzón
        </h1>
      </div>
      <div className="w-full bg-white rounded-xl drop-shadow-md sm:p-3 px-20 py-10 flex items-center flex-col gap-4">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-4 my-3">
          {emails.map((item, index) => (
            <div
              className="flex flex-col justify-center bg-gray-100 hover:bg-gray-300 px-10 py-7 rounded-lg cursor-pointer"
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
      <ModalConfigGmail isEdit={false} />
      <ModalAddFolders isConfig={false} />
    </div>
  );
}
