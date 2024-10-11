"use client";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  deleteTokenGoogle,
  getAllOauth,
  createEmailConfig,
  getEmailConfig,
  updateEmailConfig,
} from "../../../../../../../lib/apis";
import useAppContext from "../../../../../../../context/app/index";
import SliderOverShort from "../../../../../../../components/SliderOverShort";
import MultipleSelect from "../../../../../../../components/form/MultipleSelect";
import Tag from "../../../../../../../components/Tag";

export default function ModalConfigGmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const session = useSession();
  const { lists, selectOauth, userGoogle, setUserGoogle } = useAppContext();
  const [editParams, setEditParams] = useState(false);
  const [crmConfig, setCrmConfig] = useState(false);
  const [countProcessMessagesDays, setCountProcessMessagesDays] =
    useState(false);
  const [createIncomingMessages, setCreateIncomingMessages] = useState(false);
  const [countExtractMessagesDays, setCountExtractMessagesDays] =
    useState(false);
  const [createForOutgoingMessages, setCreateForOutgoingMessages] =
    useState(false);

  const [configData, setConfigData] = useState({
    countExtractMessagesDays: { name: "una semana", value: 7 },
    mailboxName: null,
    senderName: null,
    countProcessMessagesDays: { name: "una semana", value: 7 },
    routeExistingClientEmailsToCrmManagers: false,
    createIncomingMessages: { name: "prospecto", value: "Lead" },
    createForOutgoingMessages: { name: "prospecto", value: "Lead" },
    createUsingAttachedVCard: false,
    contactLeadDistribution: null,
    mailboxAccess: null,
    email: null,
  });

  const connectGmail = async () => {
    if (!userGoogle) {
      toast.error("Por favor autentique su Gmail");
      return;
    }
    let data = configData;

    if (!countProcessMessagesDays) data.countProcessMessagesDays = null;
    else
      data.countProcessMessagesDays = configData.countProcessMessagesDays.value;

    if (!createIncomingMessages) data.createIncomingMessages = null;
    else data.createIncomingMessages = configData.createIncomingMessages.value;

    if (!createForOutgoingMessages) data.createForOutgoingMessages = null;
    else
      data.createForOutgoingMessages =
        configData.createForOutgoingMessages.value;

    if (
      data.contactLeadDistribution === null ||
      data.contactLeadDistribution?.length === 0
    )
      data.contactLeadDistribution = null;
    if (data.mailboxAccess === null || data.mailboxAccess?.length === 0)
      data.mailboxAccess = null;

    if (!watch("responsibleCrm") || watch("responsibleCrm").length === 0)
      data.contactLeadDistribution = null;
    else data.contactLeadDistribution = watch("responsibleCrm");

    if (!watch("responsibleAccess") || watch("responsibleAccess").length === 0)
      data.mailboxAccess = null;
    else data.mailboxAccess = watch("responsibleAccess");

    data.countExtractMessagesDays = configData.countExtractMessagesDays.value;
    data.email = userGoogle.email;

    const emailConfig = await createEmailConfig(data);
    if (emailConfig)
      router.push(`${window.location.pathname}?configlabelid=true`);
  };

  const updateConfig = async () => {
    console.log(configData);
    let data = {
      contactLeadDistribution: configData.contactLeadDistribution,
      countExtractMessagesDays: configData.countExtractMessagesDays
        ? configData.countExtractMessagesDays.value
        : null,
      countProcessMessagesDays: configData.countProcessMessagesDays
        ? configData.countExtractMessagesDays.value
        : null,
      createForOutgoingMessages: configData.createForOutgoingMessages
        ? configData.countExtractMessagesDays.value
        : null,
      createIncomingMessages: configData.createIncomingMessages
        ? configData.countExtractMessagesDays.value
        : null,
      createUsingAttachedVCard: configData.createUsingAttachedVCard,
      mailboxAccess: configData.mailboxAccess,
      mailboxName: configData.mailboxName,
      routeExistingClientEmailsToCrmManagers:
        configData.routeExistingClientEmailsToCrmManagers,
      senderName: configData.senderName,
      email: selectOauth.email,
    };
    const response = await updateEmailConfig(data);
    console.log(response);
  };

  useEffect(() => {
    if (params.get("isEdit") === "true") {
      getEmailConfig(selectOauth?.email).then((res) => {
        console.log(res);
        let data = res;
        if (data.countExtractMessagesDays) {
          setCountExtractMessagesDays(true);
          data.countExtractMessagesDays = timeMails.find(
            (item) => item.value == data.countExtractMessagesDays
          );
        }
        if (data.countProcessMessagesDays) {
          setCountProcessMessagesDays(true);
          data.countProcessMessagesDays = timeMails.find(
            (item) => item.value == data.countProcessMessagesDays
          );
        }
        if (data.createIncomingMessages) {
          setCreateIncomingMessages(true);
          data.createIncomingMessages = contacts.find(
            (item) => item.value == data.createIncomingMessages
          );
        }
        if (data.createForOutgoingMessages) {
          setCreateForOutgoingMessages(true);
          data.createForOutgoingMessages = contacts.find(
            (item) => item.value == data.createForOutgoingMessages
          );
        }
        if (data.contactLeadDistribution) {
          const responsibleCrmArray = [];
          data.contactLeadDistribution.forEach((element) => {
            responsibleCrmArray.push(JSON.parse(element));
          });
          setValue("responsibleCrm", responsibleCrmArray);
          data.contactLeadDistribution = responsibleCrmArray;
        }
        if (data.mailboxAccess) {
          const responsibleAccessArray = [];
          data.mailboxAccess.forEach((element) => {
            responsibleAccessArray.push(JSON.parse(element));
          });
          setValue("responsibleAccess", responsibleAccessArray);
          data.mailboxAccess = responsibleAccessArray;
        }

        if (
          setCountProcessMessagesDays ||
          configData?.routeExistingClientEmailsToCrmManagers ||
          setCreateIncomingMessages ||
          setCreateForOutgoingMessages ||
          configData?.createUsingAttachedVCard
        )
          setCrmConfig(true);

        setConfigData(data);
      });
    }
  }, [params.get("isEdit")]);

  const schemaInputs = yup.object().shape({
    responsibleAccess: yup.string(),
    responsibleCrm: yup.array(),
  });

  const {
    formState: { isValid, errors },
    control,
    getValues,
    watch,
    setValue,
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(schemaInputs),
  });

  async function deleteOauth() {
    try {
      await deleteTokenGoogle(session.data.user.id, selectOauth.id, null);
      router.push("/tools/mails?userdeleted=true");
    } catch (error) {}
  }

  async function openWindowOauth() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google?idUser=${session.data.user.id}`
    );
    const oauthWindow = window.open(
      response.data.url,
      "_blank",
      "width=500, height=500"
    );

    const checkWindowClosed = setInterval(async function () {
      if (oauthWindow.closed && params.get("configemail")) {
        clearInterval(checkWindowClosed);
        if (localStorage.getItem("connectBuzon")) {
          toast.error("Este email ya está conectado");
          localStorage.removeItem("connectBuzon");
        } else {
          getDataNewGoogleUser();
        }
      }
    }, 1000);
  }

  useEffect(() => {
    if (params.get("configemail")) getDataGoogleUser();
  }, [params.get("configemail")]);

  async function getDataNewGoogleUser() {
    setUserGoogle(null);
    try {
      const res = await getAllOauth(session.data.user.id);
      setUserGoogle(res.slice(-1).pop());
    } catch (error) {
      console.log(error);
    }
  }

  async function getDataGoogleUser() {
    setUserGoogle(null);
    if (params.get("isEdit") === "false") return;
    setUserGoogle(selectOauth);
  }

  const timeMails = [
    { name: "una semana", value: 7 },
    { name: "un mes", value: 30 },
    { name: "2 meses", value: 60 },
    { name: "3 meses", value: 90 },
    { name: "todo el tiempo", value: 1000 },
  ];

  const contacts = [
    { name: "prospecto", value: "Lead" },
    { name: "contacto", value: "Contact" },
  ];

  return (
    <>
      <SliderOverShort openModal={params.get("configemail")}>
        <Tag onclick={() => router.back()} className="bg-easywork-main" />
        <div className="bg-gray-100 rounded-l-2xl max-md:w-screen w-auto overflow-y-auto h-screen">
          <div className="m-3 pl-5 font-medium text-lg">
            <h1>Integración del buzón</h1>
          </div>
          <div className="m-3 p-5 pr-8 bg-white rounded-2xl">
            <div className="text-xs">
              <div className="mt-2 flex p-3 border border-gray-50 rounded-md">
                <Image
                  src="/icons/emails/gmail-color.png"
                  alt=""
                  width={27}
                  height={27}
                />
                <h1 className="text-gray-400 font-medium text-lg ml-1">
                  Gmail
                </h1>
                {userGoogle ? (
                  <div className="flex ml-2 items-center">
                    <Image
                      src={userGoogle.picture}
                      alt=""
                      width={27}
                      height={27}
                      className="rounded-xl"
                    />
                    <p className="ml-2">{userGoogle.email}</p>
                  </div>
                ) : (
                  <button
                    className="bg-cyan-400 text-white py-2 px-4 rounded-sm text-xs ml-2"
                    onClick={() => openWindowOauth()}
                  >
                    AUTENTICACIÓN
                  </button>
                )}
              </div>
              <Menu as="div" className="flex mt-4">
                <input
                  type="checkbox"
                  checked={countExtractMessagesDays}
                  onChange={(e) =>
                    setCountExtractMessagesDays(e.target.checked)
                  }
                />
                <p className="ml-1">
                  Extraer mensajes para{" "}
                  <Menu.Button>
                    <span className="mt-4 underline text-blue-600 cursor-pointer">
                      {configData.countExtractMessagesDays?.name ||
                        "selecciona una opción"}
                    </span>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute z-50 mt-1 w-32 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                        {timeMails.map((item) => (
                          <Menu.Item key={item.name}>
                            <div
                              onClick={() =>
                                setConfigData({
                                  ...configData,
                                  countExtractMessagesDays: {
                                    name: item.name,
                                    value: item.value,
                                  },
                                })
                              }
                              className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                            >
                              {item.name}
                            </div>
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu.Button>
                </p>
              </Menu>
              <div className="mt-2">
                {params.get("isEdit") === "false" ? (
                  editParams ? (
                    <>
                      <p className="ml-5 mb-1">Nombre del buzón</p>
                      <input
                        type="text"
                        className="rounded-md border-1 w-full"
                        value={configData.mailboxName || ""}
                        onChange={(e) =>
                          setConfigData({
                            ...configData,
                            mailboxName: e.target.value,
                          })
                        }
                      />
                      <p className="ml-5 mb-1 mt-2">Nombre del remitente</p>
                      <input
                        type="text"
                        className="rounded-md border-1 w-full"
                        value={configData.senderName || ""}
                        onChange={(e) =>
                          setConfigData({
                            ...configData,
                            senderName: e.target.value,
                          })
                        }
                      />
                      <p
                        className="mt-2 pl-5 underline text-blue-600 cursor-pointer"
                        onClick={() => {
                          setEditParams(false);
                        }}
                      >
                        Editar menos parámetros
                      </p>
                    </>
                  ) : (
                    <p
                      className="mt-4 underline text-blue-600 cursor-pointer"
                      onClick={() => {
                        setEditParams(true);
                      }}
                    >
                      Editar más parámetros
                    </p>
                  )
                ) : (
                  <p
                    className="mt-4 underline text-blue-600 cursor-pointer"
                    onClick={() =>
                      router.push(
                        `${window.location.pathname}?page=${params.get("page")}&configlabelid=true&isEdit=true`
                      )
                    }
                  >
                    Configurar carpetas para la sincronización.
                  </p>
                )}
              </div>
              <div className="border-b-2 pb-1">
                <h1 className="mt-4 text-base">Integración del CRM</h1>
              </div>
              <div className="mt-4">
                <div className="flex ml-1">
                  <input
                    type="checkbox"
                    checked={crmConfig}
                    onChange={(e) => {
                      setCrmConfig(e.target.checked);
                    }}
                  />
                  <p className="ml-1">Enlace a CRM</p>
                </div>
                {crmConfig && (
                  <div className="ml-1 w-96 max-w-full">
                    <div className="flex mt-4">
                      <Menu as="div" className="flex mt-1">
                        <input
                          type="checkbox"
                          checked={countProcessMessagesDays}
                          onChange={(e) =>
                            setCountProcessMessagesDays(e.target.checked)
                          }
                        />
                        <p className="ml-1">
                          Procesar mensajes para{" "}
                          <Menu.Button>
                            <span className="mt-4 underline text-blue-600 cursor-pointer">
                              {configData.countProcessMessagesDays?.name ||
                                "selecciona una opción"}
                            </span>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute z-50 mt-1 w-32 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                {timeMails.map((item) => (
                                  <Menu.Item key={item.name}>
                                    <div
                                      onClick={() =>
                                        setConfigData({
                                          ...configData,
                                          countProcessMessagesDays: {
                                            name: item.name,
                                            value: item.value,
                                          },
                                        })
                                      }
                                      className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                    >
                                      {item.name}
                                    </div>
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu.Button>
                        </p>
                      </Menu>
                    </div>
                    <div className="flex mt-4">
                      <input
                        type="checkbox"
                        checked={
                          configData.routeExistingClientEmailsToCrmManagers
                        }
                        onChange={(e) =>
                          setConfigData({
                            ...configData,
                            routeExistingClientEmailsToCrmManagers:
                              e.target.checked,
                          })
                        }
                      />
                      <p className="ml-1">
                        Enrutar correos electrónicos de clientes existentes a
                        gerentes de CRM asignados
                      </p>
                    </div>
                    <div className="flex mt-4">
                      <Menu as="div" className="flex mt-1">
                        <input
                          type="checkbox"
                          checked={createIncomingMessages}
                          onChange={(e) =>
                            setCreateIncomingMessages(e.target.checked)
                          }
                        />
                        <p className="ml-1">
                          Crear{" "}
                          <Menu.Button>
                            <span className="mt-4 underline text-blue-600 cursor-pointer">
                              {configData.createIncomingMessages?.name ||
                                "selecciona una opción"}
                            </span>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute z-50 mt-1 w-32 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                {contacts.map((item) => (
                                  <Menu.Item key={item.name}>
                                    <div
                                      onClick={() =>
                                        setConfigData({
                                          ...configData,
                                          createIncomingMessages: {
                                            name: item.name,
                                            value: item.value,
                                          },
                                        })
                                      }
                                      className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                    >
                                      {item.name}
                                    </div>
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu.Button>{" "}
                          para los mensajes entrantes a una nueva dirección de
                          correo electrónico
                        </p>
                      </Menu>
                    </div>
                    <div className="flex mt-4">
                      <Menu as="div" className="flex mt-1">
                        <input
                          type="checkbox"
                          checked={createForOutgoingMessages}
                          onChange={(e) =>
                            setCreateForOutgoingMessages(e.target.checked)
                          }
                        />
                        <p className="ml-1">
                          Crear{" "}
                          <Menu.Button>
                            <span className="mt-4 underline text-blue-600 cursor-pointer">
                              {configData.createForOutgoingMessages?.name ||
                                "selecciona una opción"}
                            </span>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute z-50 mt-1 w-32 rounded-md bg-white py-2 shadow-lg focus:outline-none">
                                {contacts.map((item) => (
                                  <Menu.Item key={item.name}>
                                    <div
                                      onClick={() =>
                                        setConfigData({
                                          ...configData,
                                          createForOutgoingMessages: {
                                            name: item.name,
                                            value: item.value,
                                          },
                                        })
                                      }
                                      className="block px-3 py-1 text-sm leading-6 text-black cursor-pointer"
                                    >
                                      {item.name}
                                    </div>
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu.Button>{" "}
                          para mensaje salientes a una nueva direción de correo
                          electrónico
                        </p>
                      </Menu>
                    </div>
                    <div className="flex mt-4">
                      <input
                        type="checkbox"
                        checked={configData.createUsingAttachedVCard}
                        onChange={(e) =>
                          setConfigData({
                            ...configData,
                            createUsingAttachedVCard: e.target.checked,
                          })
                        }
                      />
                      <p className="ml-1">
                        Crear contactos usando vCard adjunto
                      </p>
                    </div>
                    <div className="flex mt-4">
                      <Controller
                        name="responsibleCrm"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                          <MultipleSelect
                            {...field}
                            options={lists?.users || []}
                            getValues={getValues}
                            setValue={setValue}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="border-b-2 pb-1">
                <h1 className="mt-4 text-base">Acceso al buzón</h1>
              </div>
              <p className="p-2 rounded-md bg-gray-100 mt-2 w-96">
                Dé a los empleados permiso de acceso a este buzón para que
                puedan recibir y responder mensajes de correo electrónico. Es
                una forma sencilla de crear un entorno de colaboración para su
                departamento de ventas o servicio de asistencia.
              </p>
              <div className="flex mt-4">
                <Controller
                  name="responsibleAccess"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <MultipleSelect
                      {...field}
                      options={lists?.users || []}
                      getValues={getValues}
                      setValue={setValue}
                    />
                  )}
                />
              </div>
              <div className="flex mt-4 justify-end">
                {params.get("isEdit") === "true" ? (
                  <>
                    <button
                      type="button"
                      className="hover:bg-gray-60 bg-gray-50 text-white font-bold py-2 px-4 rounded-md"
                      onClick={() => deleteOauth()}
                    >
                      Inhabilitar
                    </button>
                    <button
                      type="button"
                      className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md ml-2"
                      onClick={() => updateConfig()}
                    >
                      Guardar
                    </button>
                  </>
                ) : (
                  <div className="flex justify-end w-full">
                    <button
                      type="button"
                      className="hover:bg-gray-60 bg-gray-50 text-white font-bold py-2 px-4 rounded-md"
                      onClick={() => router.back()}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md ml-2"
                      onClick={() => connectGmail()}
                    >
                      Conectar
                    </button>
                  </div>
                )}

                {/* <button
                  type="button"
                  className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => setModalState(false)}
                >
                  Cancelar
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </SliderOverShort>
    </>
  );
}
