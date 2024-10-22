"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MenuButton, MenuItem, MenuItems, Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import axios from "axios";
import SliderOverShort from "../../../../../../../components/SliderOverShort";
import useAppContext from "../../../../../../../context/app/index";
import {
  updateLabelId,
  getAllOauth,
  deleteTokenGoogle,
  updateLabelIdRules,
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
  const [selectFirst, setSelectFirst] = useState({
    label: "not specified",
    value: null,
  });
  const [selectSecond, setSelectSecond] = useState({
    label: "not specified",
    value: null,
  });
  const [selectThree, setSelectThree] = useState({
    label: "not specified",
    value: null,
  });

  const [folderData, setFolderData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (params.get("configlabelid") && selectOauth) {
      axios
        .get(
          `https://www.googleapis.com/gmail/v1/users/${userGoogle?.usergoogle_id}/labels`,
          {
            headers: {
              Authorization: `Bearer ${selectOauth?.access_token}`,
            },
          }
        )
        .then((labels) => {
          let updatedLabels = labels.data.labels;
          if (!params.get("isEdit")) {
            updatedLabels = labels.data.labels.map((label) => ({
              ...label,
              state: label.type === "system" ? true : false,
            }));
          } else {
            updatedLabels = labels.data.labels.map((label) => ({
              ...label,
              state: selectOauth.labelId.some(
                (folder) => JSON.parse(folder).mailboxName === label.name
              ),
            }));
          }
          setFolderData(updatedLabels);
        });
    }
    setSelectFirst(
      params.get("isEdit")
        ? {
            label: folderList.find(
              (folder) =>
                folder.value === selectOauth?.labelIdRules?.saveSentFolder
            )?.label,
            value: folderList.find(
              (folder) =>
                folder.value === selectOauth?.labelIdRules?.saveSentFolder
            )?.value,
          }
        : selectFirst
    );
    setSelectSecond(
      params.get("isEdit")
        ? {
            label: folderList.find(
              (folder) =>
                folder.value === selectOauth?.labelIdRules?.moveDeletedFolder
            )?.label,
            value: folderList.find(
              (folder) =>
                folder.value === selectOauth?.labelIdRules?.moveDeletedFolder
            )?.value,
          }
        : selectSecond
    );
    setSelectThree(
      params.get("isEdit")
        ? {
            label: folderList.find(
              (folder) =>
                folder.value === selectOauth?.labelIdRules?.moveSpamFolder
            )?.label,
            value: folderList.find(
              (folder) =>
                folder.value === selectOauth?.labelIdRules?.moveSpamFolder
            )?.value,
          }
        : selectThree
    );
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
    folderData?.forEach((element) => {
      if (element.state) {
        folders.push({
          imapFolderId: element.id,
          mailboxName: element.name,
          type: element.type,
        });
      }
    });
    const labelIdRules = {
      saveSentFolder: selectFirst.value,
      moveDeletedFolder: selectSecond.value,
      moveSpamFolder: selectThree.value,
    };
    await updateLabelId(userGoogle.usergoogle_id, folders);
    await updateLabelIdRules(userGoogle.usergoogle_id, labelIdRules);
    if (!params.get("isEdit")) {
      await saveMails();
      toast.success("Conexión con éxito");
      router.push("/tools/webmail");
    } else {
      toast.success("Carpetas actualizadas");
    }
  }

  function checkAll() {
    const newFolderData = folderData.map((folder) => ({
      ...folder,
      state: true,
    }));
    setFolderData(newFolderData);
  }

  const folderList = [
    {
      value: "INBOX",
      label: "Recibidos",
    },
    {
      value: "CHAT",
      label: "Chats",
    },
    {
      value: "ALL",
      label: "Todos",
    },
    {
      value: "SENT",
      label: "Enviados",
    },
    {
      value: "SAVED",
      label: "Guardados",
    },
    {
      value: "SPAM",
      label: "Spam",
    },
    {
      value: "TRASH",
      label: "Papelera",
    },
    {
      value: "DRAFT",
      label: "Borradores",
    },
    {
      value: "CATEGORY_FORUMS",
      label: "Foros",
    },
    {
      value: "CATEGORY_UPDATES",
      label: "Actualizaciones",
    },
    {
      value: "CATEGORY_PERSONAL",
      label: "Personal",
    },
    {
      value: "CATEGORY_PROMOTIONS",
      label: "Promociones",
    },
    {
      value: "CATEGORY_SOCIAL",
      label: "Social",
    },
    {
      value: "STARRED",
      label: "Destacados",
    },
    {
      value: "IMPORTANT",
      label: "Importantes",
    },
    {
      value: "UNREAD",
      label: "No leído",
    },
  ];

  const folderListShort = [
    {
      value: "INBOX",
      label: "Recibidos",
    },
    {
      value: "ALL",
      label: "Todos",
    },
    {
      value: "SENT",
      label: "Enviados",
    },
    {
      value: "TRASH",
      label: "Papelera",
    },
    {
      value: "SPAM",
      label: "Spam",
    },
    {
      value: "IMPORTANT",
      label: "Importantes",
    },
  ];

  const closeModal = () => {
    router.back();
  };

  return (
    <SliderOverShort openModal={params.get("configlabelid")}>
      <Tag onclick={() => closeModal()} className="bg-easywork-main" />
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
              <div className="ml-2">
                {folderData?.map((item, index) => {
                  return (
                    <div className="flex mt-4 ml-2" key={index}>
                      <input
                        type="checkbox"
                        disabled={item.mailboxName === "INBOX"}
                        checked={item.state}
                        style={
                          item.state
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
                      <p className="ml-1">
                        {item.name &&
                        folderList.find((folder) => folder.value === item.name)
                          ?.label
                          ? folderList.find(
                              (folder) => folder.value === item.name
                            )?.label
                          : item.name}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="m-3 text-xs my-4 w-80">
                <h1 className="font-medium text-lg border-b-4 border-black pb-1">
                  Reglas de carpeta
                </h1>
                <Menu as="div" className="flex items-center relative">
                  <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <p className="p-2">
                      Save sent emails to folder{" "}
                      <span className="text-cyan-500">{selectFirst.label}</span>
                    </p>
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="z-50 w-64 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                  >
                    {folderListShort?.map((item, index) => {
                      return (
                        <MenuItem key={index}>
                          {({ active }) => (
                            <div
                              onClick={() => setSelectFirst(item)}
                              className={classNames(
                                active ? "bg-gray-50" : "",
                                "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                              )}
                            >
                              {item.label}
                            </div>
                          )}
                        </MenuItem>
                      );
                    })}
                  </MenuItems>
                </Menu>
                <Menu as="div" className="flex items-center relative">
                  <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <p className="p-2">
                      Move deleted emails to folder{" "}
                      <span className="text-cyan-500">
                        {selectSecond.label}
                      </span>
                    </p>
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="z-50 w-64 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                  >
                    {folderListShort?.map((item, index) => {
                      return (
                        <MenuItem key={index}>
                          {({ active }) => (
                            <div
                              onClick={() => setSelectSecond(item)}
                              className={classNames(
                                active ? "bg-gray-50" : "",
                                "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                              )}
                            >
                              {item.label}
                            </div>
                          )}
                        </MenuItem>
                      );
                    })}
                  </MenuItems>
                </Menu>
                <Menu as="div" className="flex items-center relative">
                  <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <p className="p-2">
                      Move spam to folder{" "}
                      <span className="text-cyan-500">{selectThree.label}</span>
                    </p>
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="z-50 w-64 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                  >
                    {folderListShort?.map((item, index) => {
                      return (
                        <MenuItem key={index}>
                          {({ active }) => (
                            <div
                              onClick={() => setSelectThree(item)}
                              className={classNames(
                                active ? "bg-gray-50" : "",
                                "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                              )}
                            >
                              {item.label}
                            </div>
                          )}
                        </MenuItem>
                      );
                    })}
                  </MenuItems>
                </Menu>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => closeModal()}
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
