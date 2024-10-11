"use client";
import { Fragment, useRef, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  MenuButton,
  MenuItem,
  MenuItems,
  Menu,
} from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Tag from "../../../../../../../components/Tag";
import { useRouter, useSearchParams } from "next/navigation";
import { getTokenGoogle } from "../../../../../../../lib/apis";
import { setCookie, getCookie } from "cookies-next";
import useAppContext from "../../../../../../../context/app";
import { XCircleIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { toast } from "react-toastify";
import * as yup from "yup";
import { getUserSignatures, deleteUserSignatures } from "@/src/lib/api/drive";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Signature({
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

  const [label, setLabel] = useState("");
  const [subLabel, setSubLabel] = useState("");
  const [user, setUser] = useState("");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { selectOauth } = useAppContext();
  const fileInputRef = useRef(null);
  const [signatures, setSignatures] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);

  const handleCheckboxChange = (id) => {
    setSelectedCheckbox(id);
    setCookie("myCheckbox", id);
  };

  const getSignatures = async () => {
    console.log("test");
    try {
      const response = await getUserSignatures();
      setSignatures(response);
    } catch (error) {}
  };

  const deleteSignature = async (id) => {
    try {
      const response = await deleteUserSignatures(id);
      if (response) getSignatures();
    } catch (error) {}
  };

  useEffect(() => {
    getTokenGoogle(session.data.user.id).then((res) => {
      setUser(res);
    });
    getSignatures();
    console.log(getCookie("myCheckbox"));
    setSelectedCheckbox(getCookie("myCheckbox"));
  }, [params.get("signature"), params.get("addsignature")]);

  return (
    <Transition.Root show={params.get("signature")} as={Fragment}>
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
                        className="bg-easywork-main"
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
                    <div className="bg-gray-300 max-md:w-screen rounded-l-2xl overflow-y-auto h-screen p-7 md:w-3/4 lg:w-3/4">
                      <div className="flex mb-3 items-center mt-1.5">
                        <div className="flex items-center ml-6">
                          <h1 className="text-lg inline-block align-middle h-full">
                            Firmas
                          </h1>
                        </div>

                        <div className="flex items-center w-full rounded-md bg-white ml-2 pl-2">
                          <FaMagnifyingGlass className="h-4 w-4 text-primary" />
                          <input
                            type="search"
                            name="search"
                            id="search-cal"
                            className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 rounded-r-md"
                            placeholder={t("contacts:header:search")}
                            // onChange={(e) => setSearchInput(e.target.value)}
                            // onClick={() => setSearchInput("")}
                          />
                        </div>
                        <div>
                          <div
                            className="bg-easywork-main text-white px-3 py-1 rounded-md ml-3 w-44 cursor-pointer"
                            onClick={() =>
                              router.push(
                                `${window.location.href}&addsignature=true`
                              )
                            }
                          >
                            <p className="ml-1 text-center">Agregar Firma</p>
                          </div>
                        </div>
                      </div>
                      <table className="text-easywork-main w-full">
                        <thead>
                          <tr className="bg-white text-left">
                            <th className="p-1 rounded-l-lg"></th>
                            <th className="pl-6 py-5">Remitente</th>
                            <th className="py-5 pr-5">Firma</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(signatures) &&
                            signatures.map((signature, index) => (
                              <tr key={index}>
                                <td className="pb-2">
                                  <Menu
                                    as="div"
                                    className="w-10 md:w-auto rounded-lg font-normal"
                                  >
                                    <MenuButton className="flex items-center">
                                      <Bars3Icon
                                        className="h-4 w-4 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </MenuButton>
                                    <MenuItems
                                      transition
                                      anchor="bottom start"
                                      className={
                                        "z-50 mt-2.5 w-64 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                                      }
                                    >
                                      {[
                                        {
                                          name: "Editar",
                                          click: () => {
                                            router.push(
                                              `${window.location.href}&addsignature=true&isEdit=${signature.id}`
                                            );
                                          },
                                        },
                                        {
                                          name: "Eliminar",
                                          click: () =>
                                            deleteSignature(signature.id),
                                        },
                                      ].map((item, index) => (
                                        <MenuItem key={index}>
                                          {({ active }) => (
                                            <div
                                              onClick={item.click}
                                              className={classNames(
                                                active ? "bg-gray-50" : "",
                                                "block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                              )}
                                            >
                                              <p>{item.name}</p>
                                            </div>
                                          )}
                                        </MenuItem>
                                      ))}
                                    </MenuItems>
                                  </Menu>
                                </td>
                                <td className="py-2">
                                  <div className="flex w-96 overflow-x-auto">
                                    <p className="whitespace-nowrap">
                                      {signature?.metadata?.senders?.map(
                                        (element, index) => (
                                          <span key={index} className="mr-2">
                                            {element.state ? element.email : ""}{" "}
                                          </span>
                                        )
                                      )}
                                    </p>
                                  </div>
                                </td>
                                <td className="py-2">
                                  {signature?.metadata?.name}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
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
