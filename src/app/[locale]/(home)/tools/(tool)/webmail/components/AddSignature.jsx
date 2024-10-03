"use client";
import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Range, getTrackBackground } from "react-range";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Tag from "../../../../../../../components/Tag";
import { useRouter, useSearchParams } from "next/navigation";
import { getTokenGoogle, getAllOauth } from "../../../../../../../lib/apis";
import { getCookie } from "cookies-next";
import useAppContext from "../../../../../../../context/app";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";

import axios from "axios";
import "./styles.css";

export default function AddSignature({
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
  const [values, setValues] = useState([400]);
  const [archive, setArchive] = useState({ blob: null, file: null });
  const [value, setValueText] = useState("");
  const [allOauth, setAllOauth] = useState(null);
  const [isEdit, setIsEdit] = useState(null);

  const STEP = 0.1;
  const MIN = 100;
  const MAX = 900;
  const rtl = false;

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  function allOauthPromise() {
    getAllOauth(session.data.user.id).then((res) => {
      let newArray = [];
      res.forEach((element) => {
        newArray.push({ email: element.email, state: false });
      });
      setAllOauth(newArray);
    });
  }

  useEffect(() => {
    if (params.get("addsignature") == "true") allOauthPromise();
  }, [params.get("addsignature")]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const blob = new Blob([file], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    setArchive({ blob: url, file });
  };

  const uploadSignature = async () => {
    const metadata = {
      senders: allOauth,
      name: archive.file.name,
      size: values[0],
    };
    const formData = new FormData();
    formData.append("file", archive.file);
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("size", values);

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
      if (response) {
        back();
      }
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
      setSignatures(response.data[0]);
    } catch (error) {}
  };

  const getSignature = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_DRIVE_HOST}/files/signatures/${params.get("isEdit")}`,
        {
          headers: {
            Authorization: `Bearer ${session.data.user.accessToken}`,
          },
        }
      );
      if (response) {
        console.log(response.data);
        setIsEdit(response.data);
        setValues([response.data.metadata.size]);
      }
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
    if (params.get("isEdit")) getSignature();
  }, [params.get("addsignature")]);

  const back = () => {
    router.back();
    setArchive({ blob: null, file: null });
    setIsEdit(null);
  };

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
                        onclick={() => back()}
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
                    <div className="bg-gray-300 max-md:w-screen rounded-l-2xl overflow-y-auto h-screen p-7 md:w-3/4 lg:w-4/6">
                      <h1 className="text-lg inline-block align-middle ml-5">
                        Agregar Firma
                      </h1>
                      <div className="mb-3 mt-3">
                        {archive?.blob || isEdit ? (
                          <>
                            <Range
                              values={values}
                              step={STEP}
                              min={MIN}
                              max={MAX}
                              rtl={rtl}
                              onChange={(values) => setValues(values)}
                              renderTrack={({ props, children }) => (
                                <div
                                  onMouseDown={props.onMouseDown}
                                  onTouchStart={props.onTouchStart}
                                  style={{
                                    ...props.style,
                                    height: "36px",
                                    display: "flex",
                                    width: "100%",
                                  }}
                                >
                                  <div
                                    ref={props.ref}
                                    style={{
                                      height: "5px",
                                      width: "100%",
                                      borderRadius: "4px",
                                      background: getTrackBackground({
                                        values,
                                        colors: ["#262261", "#ccc"],
                                        min: MIN,
                                        max: MAX,
                                        rtl,
                                      }),
                                      alignSelf: "center",
                                    }}
                                  >
                                    {children}
                                  </div>
                                </div>
                              )}
                              renderThumb={({ props, isDragged }) => (
                                <div
                                  {...props}
                                  key={props.key}
                                  style={{
                                    ...props.style,
                                    height: "42px",
                                    width: "42px",
                                    borderRadius: "4px",
                                    backgroundColor: "#FFF",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    boxShadow: "0px 2px 6px #AAA",
                                  }}
                                >
                                  <div
                                    style={{
                                      height: "16px",
                                      width: "5px",
                                      backgroundColor: isDragged
                                        ? "#262261"
                                        : "#CCC",
                                    }}
                                  />
                                </div>
                              )}
                            />
                            <p className="w-full text-center">{values} px</p>
                            <div className="relative">
                              <img
                                className={`max-w-full my-3 relative`}
                                style={{ width: Number(values) }}
                                src={isEdit ? isEdit.url : archive?.blob}
                                alt="add image"
                              />
                              {!isEdit && (
                                <button
                                  className="bg-easywork-main text-white p-1 rounded-full cursor-pointer absolute -top-2 -left-2"
                                  onClick={() =>
                                    setArchive({ blob: null, file: null })
                                  }
                                >
                                  <XMarkIcon className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between mb-3">
                            <div className="w-full pr-10">
                              <div
                                className="bg-gray-50 opacity-50 hover:bg-gray-60 rounded-md ml-3 w-full h-64 flex justify-center items-center cursor-pointer"
                                onClick={handleFileClick}
                              >
                                <div>
                                  <CameraIcon className="w-15 h-15" />
                                  <p className="ml-1 text-center font-semibold">
                                    Subir archivo
                                  </p>
                                </div>
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
                        )}
                        {allOauth?.map((item, index) => (
                          <div key={index} className="flex items-center mt-2">
                            <input
                              type="checkbox"
                              checked={item.state} // Asigna el valor actual del estado
                              onChange={(e) => {
                                const updatedAllOauth = allOauth.map(
                                  (existingItem, i) => {
                                    if (i === index) {
                                      return {
                                        ...existingItem,
                                        state: e.target.checked,
                                      };
                                    }
                                    return existingItem;
                                  }
                                );
                                setAllOauth(updatedAllOauth);
                              }}
                            />
                            <p className="ml-2">
                              Enlace a remitente {item.email}
                            </p>
                          </div>
                        ))}
                        <button
                          className={`${archive?.blob ? "bg-easywork-main hover:bg-easywork-mainhover" : "bg-gray-50"} text-white px-3 mt-2 py-1 rounded-md ml-3 w-44 cursor-pointer`}
                          onClick={() => {
                            archive?.blob ? uploadSignature() : "";
                          }}
                        >
                          <p className="ml-1 text-center">Guardar</p>
                        </button>
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
