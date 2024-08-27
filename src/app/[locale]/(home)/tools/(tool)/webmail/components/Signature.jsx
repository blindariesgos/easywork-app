"use client";
import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Tag from "../../../../../../../components/Tag";
import { useRouter, useSearchParams } from "next/navigation";
import { getTokenGoogle } from "../../../../../../../lib/apis";
import { setCookie, getCookie } from "cookies-next";
import useAppContext from "../../../../../../../context/app";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { toast } from "react-toastify";
import * as yup from "yup";
import axios from "axios";

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

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const archive = event.target.files[0];
    try {
      const response = await uploadSignature(archive, { name: archive.name });
      if (response){
        toast.success("Firma cargada");
      }
    } catch (error) {
      toast.success(error);
    }
  };

  const uploadSignature = async (archive, metadata) => {
    const formData = new FormData();
    formData.append("file", archive);
    formData.append("metadata", JSON.stringify(metadata));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_DRIVE_HOST}/files/signatures`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.data.user.accessToken}`,
          },
        }
      );
      getSignatures();
      return response;
    } catch (error) {
      console.error("Error uploading signature:", error);
    }
  };

  const getSignatures = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_DRIVE_HOST}/files/signatures`,
        {
          headers: {
            Authorization: `Bearer ${session.data.user.accessToken}`,
          },
        }
      );
      console.log(response);
      setSignatures(response.data);
    } catch (error) {}
  };

  const deleteSignature = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_DRIVE_HOST}/files/signatures/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.data.user.accessToken}`,
          },
        }
      );
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
  }, [params.get("signature")]);

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
                    <div className="bg-gray-300 max-md:w-screen rounded-l-2xl overflow-y-auto h-screen p-7 md:w-3/4 lg:w-3/4">
                      <div className="flex mb-3 items-center">
                        <div className="flex items-center">
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
                            onClick={handleFileClick}
                          >
                            <p className="ml-1 text-center">Agregar Firma</p>
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      <table className="text-easywork-main w-full">
                        <thead>
                          <tr className="bg-white text-left">
                            <th className="pl-6 py-5 rounded-l-lg">
                              Remitente
                            </th>
                            <th className="py-5 pr-5">Firma</th>
                            <th className="p-1 rounded-r-lg"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {signatures.map((signature, index) => (
                            <tr key={index}>
                              <td className="py-2">
                                <div className="flex">
                                  <input
                                    type="checkbox"
                                    checked={selectedCheckbox === signature.id}
                                    onChange={() =>
                                      handleCheckboxChange(signature.id)
                                    }
                                  />
                                  <p className="ml-2">
                                    {session.data.user.email}
                                  </p>
                                </div>
                              </td>
                              <td className="py-2">{signature?.metadata?.name}</td>
                              <td className="py-2">
                                <XCircleIcon
                                  className="w-5 h-5 cursor-pointer"
                                  onClick={() => {
                                    deleteSignature(signature.id);
                                  }}
                                />
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
