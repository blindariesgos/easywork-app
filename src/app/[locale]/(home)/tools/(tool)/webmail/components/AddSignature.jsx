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
import ReactQuill from "react-quill";
import "./styles.css";

export default function AddSignature({
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
  const [value, setValueText] = useState("");

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
      if (response) {
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
    formData.append("size", "650");

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

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "background",
    "align",
    "size",
    "font",
  ];

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
  }, [params.get("addsignature")]);

  return (
    <Transition.Root show={params.get("addsignature")} as={Fragment}>
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
                      <div className="mb-3 mt-1.5">
                        <div className="flex justify-between">
                          <h1 className="text-lg inline-block align-middle h-full">
                            Agregar Firma
                          </h1>
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
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                              accept="image/jpeg, image/png"
                            />
                          </div>
                        </div>

                        <ReactQuill
                          theme="snow"
                          value={value}
                          onChange={setValueText}
                          formats={formats}
                          modules={modules}
                        />
                        <div className="flex items-center mt-2">
                          <input type="checkbox" name="" id="" />
                          <p className="ml-2">
                            Enlace a remitente {selectOauth?.email}
                          </p>
                        </div>
                      </div>
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
