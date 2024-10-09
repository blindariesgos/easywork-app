"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MenuButton, MenuItem, MenuItems, Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import axios from "axios";
import SliderOverShort from "../../../../../../../components/SliderOverShort";
import useAppContext from "../../../../../../../context/app/index";
import {
  updateLabelId,
  getAllOauth,
  deleteTokenGoogle,
} from "../../../../../../../lib/apis";
import Tag from "../../../../../../../components/Tag";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ModalAddFolders() {
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { userGoogle, selectOauth, userData } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectFirst, setSelectFirst] = useState("not specified");
  const [selectSecond, setSelectSecond] = useState("not specified");
  const [selectThree, setSelectThree] = useState("not specified");
  const [folderData, setFolderData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (params.get("configlabelid")) {
      getAllOauth(session.data.user.id).then((res) => {
        const config = {
          headers: {
            Authorization: `Bearer ${res.slice(-1).pop().access_token}`,
          },
        };
        axios
          .get(
            `https://www.googleapis.com/gmail/v1/users/${userGoogle?.usergoogle_id}/labels`,
            config
          )
          .then((labels) => {
            const updatedLabels = labels.data.labels.map((label) => ({
              ...label,
              state: label.type === "system" ? true : false,
            }));
            setFolderData(updatedLabels);
          });
      });
    }
  }, [params.get("configlabelid")]);

  async function deleteOauth() {
    try {
      await deleteTokenGoogle(session.data.user.id, selectOauth.id, null);
      router.push("/tools/mails?userdeleted=true");
    } catch (error) {}
  }

  async function saveMails() {
    axios.get(
      `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/savemails/${session.data.user.id}/${userGoogle?.id}`
    );
  }

  async function saveFoldersData() {
    const folders = [];
    folderData.forEach((element) => {
      if (element.state) {
        folders.push({
          imapFolderId: element.id,
          mailboxName: element.name,
          type: element.type,
        });
      }
    });
    await updateLabelId(userGoogle.usergoogle_id, folders);
    await saveMails();
    toast.success("Conexión con éxito");
    router.push("/tools/webmail?page=1");
  }

  function checkAll() {
    const newFolderData = folderData.map((folder) => ({
      ...folder,
      state: true,
    }));
    setFolderData(newFolderData);
  }

  return (
    <SliderOverShort openModal={params.get("configlabelid")}>
      <Tag onclick={() => router.back()} className="bg-easywork-main" />
      <div className="bg-gray-300 max-md:w-screen w-96 rounded-l-2xl overflow-y-auto h-screen">
        <div className="m-3 pl-5 font-medium text-lg">
          <h1>Configurar Carpetas</h1>
        </div>
        <div className="m-3 py-5 bg-gray-100 rounded-2xl">
          <div className="bg-white px-2">
            <div className="p-3">
              <h1 className="font-medium text-lg">Sincronizar</h1>
            </div>
            <div className="text-xs">
              {/* <div className="flex ml-2">
                <input
                  type="checkbox"
                  onClick={() => {
                    checkAll();
                  }}
                />
                <p className="ml-1">Select all</p>
              </div> */}
              <div className="ml-2">
                {folderData?.map((data, index) => (
                  <div className="flex mt-4 ml-2" key={index}>
                    <input
                      type="checkbox"
                      disabled={data.name === "INBOX"}
                      checked={data.state}
                      style={
                        data.state
                          ? {
                              backgroundColor:
                                "rgb(38 34 97 / var(--tw-bg-opacity))",
                            }
                          : { backgroundColor: "white" }
                      }
                      onChange={(e) => {
                        const newFolderData = [...folderData];
                        newFolderData[index] = {
                          ...newFolderData[index],
                          state: e.target.checked,
                        };
                        setFolderData(newFolderData);
                      }}
                    />

                    <p className="ml-1">{data.name}</p>
                  </div>
                ))}
              </div>
              <div className="m-3 text-xs my-4 w-80">
                <h1 className="font-medium text-lg border-b-4 border-black pb-1">
                  Reglas de carpeta
                </h1>
                <Menu as="div" className="flex items-center relative">
                  <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <p className="p-2">
                      Save sent emails to folder{" "}
                      <span className="text-cyan-500">{selectFirst}</span>
                    </p>
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="z-50 w-64 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                  >
                    {folderData?.map((item, index) => (
                      <MenuItem key={index}>
                        {({ active }) => (
                          <div
                            onClick={() => setSelectFirst(item.name)}
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
                <Menu as="div" className="flex items-center relative">
                  <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <p className="p-2">
                      Move deleted emails to folder{" "}
                      <span className="text-cyan-500">{selectSecond}</span>
                    </p>
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="z-50 w-64 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                  >
                    {folderData?.map((item, index) => (
                      <MenuItem key={index}>
                        {({ active }) => (
                          <div
                            onClick={() => setSelectSecond(item.name)}
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
                <Menu as="div" className="flex items-center relative">
                  <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <p className="p-2">
                      Move spam to folder{" "}
                      <span className="text-cyan-500">{selectThree}</span>
                    </p>
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="z-50 w-64 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                  >
                    {folderData?.map((item, index) => (
                      <MenuItem key={index}>
                        {({ active }) => (
                          <div
                            onClick={() => setSelectThree(item.name)}
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
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => router.back()}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md mx-2"
                  onClick={() => saveFoldersData()}
                >
                  Guardar
                </button>
                <Dialog
                  open={isOpen}
                  onClose={() => setIsOpen(false)}
                  className="relative z-50"
                >
                  <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg space-y-4 rounded-md flex flex-col items-center bg-white p-8 w-full">
                      <DialogTitle className="font-bold">
                        ¿Desea deshabilitar email de su cuenta Easywork?
                      </DialogTitle>
                      <div className="w-full flex justify-center">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteOauth(true)}
                          className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md ml-2"
                        >
                          Inhabilitar
                        </button>
                      </div>
                    </DialogPanel>
                  </div>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SliderOverShort>
  );
}
