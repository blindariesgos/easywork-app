"use client";
import Tag from "../../../../../../components/Tag";
import React, { useState } from "react";
import Image from "next/image";
import SliderOverShort from "../../../../../../components/SliderOverShort";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createImap, saveFolders } from "../../../../../../lib/apis";
import { getApiError } from "../../../../../../utils/getApiErrors";
import axios from "axios";

export default function IngresarEmail() {
  const session = useSession();
  const router = useRouter();
  const [modalG, setModalG] = useState(false);
  const [modalC, setModalC] = useState(false);

  const [ImapData, setImapData] = useState({
    host: null,
    port: null,
    tls: false,
    user: null,
    password: null,
    senderName: null,
    userId: session.data.user.user.id,
  });
  const [folderData, setFolderData] = useState([]);
  const [folderId, setFolderId] = useState(null);

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
      const response = await axios.post(`http://localhost:4000/v1/gmail/folders`, { id: session.data.user.user.id });
      if (response) {
        const newData = response.data.map(folder => ({
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

  async function saveFoldersData(){
    const folders = [];
    folderData.forEach(element => {
      if(element.state){
        folders.push({ imapFolderId: folderId.imapConfigId , mailboxName: element.folder });
      }
    });
    try {
      const response = await saveFolders(folders);
      if(response){
        router.push('/tools/webmail');
      }
    } catch (error) {
      getApiError(error.message, errorsDuplicated);
    }
  }

  const emails = [
    {
      name: "Gmail",
      src: "/icons/emails/gmail.svg",
      click: () => setModalG(true),
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
        <h1 className="ml-3 w-full py-5 text-center font-medium text-xl">
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
      <SliderOverShort openModal={modalG}>
        <Tag onclick={() => setModalG(false)} className="bg-green-500" />
        <div className="bg-gray-300 rounded-l-2xl max-md:w-screen w-96 overflow-y-auto h-screen">
          <div className="m-3 font-medium text-lg">
            <h1>Gestionar buzón</h1>
          </div>
          <div className="m-3 p-5 pr-8 bg-gray-100 rounded-2xl">
            <div>
              <h1 className="font-medium">IMAP</h1>
              <h2 className="font-semibold">E-mail</h2>
              <h3>Armandoalbb@gmail.com</h3>
              <p className="text-xs">Último revisado Hace 10 minutos Éxito</p>
            </div>
            <div className="text-xs">
              <div className="mt-2">
                <p className="ml-2">Dirección del servidor IMAP</p>
                <input
                  type="text"
                  className="rounded-md border-0 w-full"
                  onChange={(e) =>
                    setImapData((prevState) => ({
                      ...prevState,
                      host: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex mt-3">
                <div className="w-20">
                  <p className="ml-2">Puerto</p>
                  <input
                    type="number"
                    className="w-full rounded-md border-0"
                    onChange={(e) =>
                      setImapData((prevState) => ({
                        ...prevState,
                        port: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex mt-4 ml-2">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setImapData((prevState) => ({
                        ...prevState,
                        tls: e.target.checked,
                      }))
                    }
                  />
                  <p className="ml-1">Usar SSL</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="ml-2">Iniciar Sesión</p>
                <input
                  type="text"
                  onChange={(e) =>
                    setImapData((prevState) => ({
                      ...prevState,
                      user: e.target.value,
                    }))
                  }
                  className="rounded-md border-0 w-full"
                />
              </div>
              <div className="mt-2">
                <p className="ml-2">Contraseña</p>
                <input
                  type="password"
                  onChange={(e) =>
                    setImapData((prevState) => ({
                      ...prevState,
                      password: e.target.value,
                    }))
                  }
                  className="rounded-md border-0 w-full"
                />
              </div>
              <p className="mt-2 underline text-violet-800">
                Configurar carpetas para la sincronización
              </p>
              <div className="mt-2">
                <p className="ml-2">Nombre del buzón</p>
                <input type="text" />
              </div>
              <div className="mt-2">
                <p className="ml-2">Nombre del remitente</p>
                <input
                  type="text"
                  onChange={(e) =>
                    setImapData((prevState) => ({
                      ...prevState,
                      senderName: e.target.value,
                    }))
                  }
                  className="rounded-md border-0 w-full"
                />
              </div>
              <div className="mt-2">
                <p className="ml-2">
                  URL de la interfaz web del servidor de correo electrónico
                </p>
                <input
                  type="text"
                  value="www.gmail.com"
                  className="rounded-md border-0 w-full"
                  disabled
                />
              </div>
              <div className="m-3 text-xs my-4 w-full">
                <h1 className="font-bold text-lg">Acceso al buzón</h1>
                <p className="bg-gray-300 p-2">
                  Dé a los empleados permiso de acceso a este buzón para que
                  puedan recibir y responder mensajes de correo electrónico. Es
                  una forma sencilla de crear un entorno de colaboración para su
                  departamento de ventas o servicio de asistencia.
                </p>
              </div>
              <div className="flex justify-around">
                <button
                  type="button"
                  className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => saveIMAP()}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Inhabilitar
                </button>
                <button
                  type="button"
                  className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => setModalG(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </SliderOverShort>
      <SliderOverShort openModal={modalC}>
        <Tag onclick={() => setModalC(false)} className="bg-green-500" />
        <div className="bg-gray-300 max-md:w-screen w-96 rounded-l-2xl overflow-y-auto h-screen">
          <div className="m-3 font-medium text-lg">
            <h1>Configurar Folders</h1>
          </div>
          <div className="m-3 py-5 bg-gray-100 rounded-2xl">
            <div className="bg-white px-2">
              <div className="p-3">
                <h1 className="font-medium text-lg">Synchronize folders</h1>
              </div>
              <div className="text-xs">
                <div className="flex ml-2">
                  <input type="checkbox" />
                  <p className="ml-1">Select all</p>
                </div>
                <div className="mt-4 ml-4">
                {folderData.map((data, index) => (
                  <div className="flex mt-4 ml-2" key={index}>
                    <input 
                      type="checkbox" 
                      checked={data.state}
                      onChange={(e) => {
                        const newFolderData = [...folderData];
                        newFolderData[index] = {
                          ...newFolderData[index],
                          state: e.target.checked
                        };
                        setFolderData(newFolderData);
                      }}
                    />
                    <p className="ml-1">{data.folder}</p>
                  </div>
                ))}
                </div>
                <div className="m-3 text-xs my-4 w-80">
                  <h1 className="font-medium text-lg border-b-4 border-black pb-1">
                    Folder rules
                  </h1>
                  <p className="p-2">
                    Save sent emails to folder{" "}
                    <span className="text-cyan-500">INBOX / Sent</span>
                  </p>
                  <p className="p-2">
                    Move deleted emails to folder{" "}
                    <span className="text-cyan-500">INBOX / Sent</span>
                  </p>
                  <p className="p-2">
                    Move spam to folder{" "}
                    <span className="text-cyan-500">INBOX / Sent</span>
                  </p>
                </div>
                <div className="flex justify-around">
                  <button
                    type="button"
                    className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md"
                    onClick={() => saveFoldersData()}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                    onClick={() => setModalC(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SliderOverShort>
    </div>
  );
}
