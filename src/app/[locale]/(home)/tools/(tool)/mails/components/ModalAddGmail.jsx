import SliderOverShort from "../../../../../../../components/SliderOverShort";
import MultipleSelect from "../../../../../../../components/form/MultipleSelect";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  getTokenGoogle,
  deleteTokenGoogle,
  deleteFoldersMail,
} from "../../../../../../../lib/apis";
import useAppContext from "../../../../../../../context/app/index";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useRouter } from "next/navigation";

export default function ModalAddGmail({ children, state, from, edit }) {
  const router = useRouter();
  const session = useSession();
  const { setOpenModalFolders, openModalFolders, userGoogle, setUserGoogle } =
    useAppContext();
  const [sendSmtp, setSendSmtp] = useState(false);
  const [editParams, setEditParams] = useState(false);
  const [crmConfig, setCrmConfig] = useState(false);
  const { lists } = useAppContext();

  const schemaInputs = yup.object().shape({
    name: yup.string(),
    responsible: yup.array(),
    createdBy: yup.array(),
    participants: yup.array(),
    observers: yup.array(),
    limitDate: yup.string(),
    startDate: yup.string(),
    duration: yup.string(),
    endDate: yup.string(),
    crm: yup.array(),
    tags: yup.array(),
    listField: yup.array(),
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    control,
    getValues,
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: edit ? edit?.name : "",
      limitDate: edit ? edit.deadline : "",
      startDate: edit ? edit.startTime : "",
      endDate: edit ? edit.deadline : "",
      participants: edit ? edit.participants : [],
      responsible: edit ? edit.responsible : [],
      observers: edit ? edit.observers : [],
      tags: edit ? edit.tags : [],
      createdBy: edit ? [edit.createdBy] : [],
    },
    resolver: yupResolver(schemaInputs),
  });

  async function deleteOauth() {
    try {
      await deleteTokenGoogle(session.data.user.id);
      await deleteFoldersMail(session.data.user.id);
      router.push("/tools/mails");
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
      if (oauthWindow.closed) {
        clearInterval(checkWindowClosed);
        getDataGoogleUser();
      }
    }, 1000);
  }

  async function getDataGoogleUser() {
    try {
      const res = await getTokenGoogle(session.data.user.id);
      const config = {
        headers: { Authorization: `Bearer ${res.access_token}` },
      };
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        config
      );
      setUserGoogle(userInfo.data, ...res.access_token);
    } catch (error) {
      setUserGoogle(null);
    }
  }

  const timeMails = [
    { name: "una semana", onClick: "" },
    { name: "un mes", onClick: "" },
    { name: "2 meses", onClick: "" },
    { name: "3 meses", onClick: "" },
    { name: "todo el tiempo", onClick: "" },
  ];

  useEffect(() => {
    getDataGoogleUser();
  }, []);

  return (
    <>
      <SliderOverShort openModal={state && !openModalFolders}>
        {children}
        <div className="bg-gray-100 rounded-l-2xl max-md:w-screen w-96 overflow-y-auto h-screen">
          <div className="m-3 font-medium text-lg">
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
                <input type="checkbox" />
                <p className="ml-1">
                  Extraer mensajes para{" "}
                  <Menu.Button>
                    <span className="mt-4 underline text-blue-600 cursor-pointer">
                      una semana
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
                              onClick={item.onClick}
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
                {!userGoogle && from == "lobby" ? (
                  editParams ? (
                    <>
                      <p className="ml-2 mb-1">Nombre del buzón</p>
                      <input
                        type="text"
                        className="rounded-md border-1 ml-2 w-full"
                      />
                      <p className="ml-2 mb-1">Nombre del remitente</p>
                      <input
                        type="text"
                        className="rounded-md border-1 ml-2 w-full"
                      />
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
                  <p className="mt-4 underline text-blue-600 cursor-pointer">
                    Configurar carpetas para la sincronización.
                  </p>
                )}
              </div>
              <div className="border-b-2 pb-2">
                <h1 className="mt-4 text-lg">
                  Configuraciones de correo saliente
                </h1>
              </div>
              <div className="flex mt-4">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setSendSmtp(e.target.checked);
                  }}
                />
                <p className="ml-1">Enviar utilizando SMTP externo</p>
              </div>
              {sendSmtp ? (
                <>
                  <div className="mt-3 text-xs my-4 w-full">
                    <p className="bg-red-200 ml-2 text-red-500 p-2 rounded-md">
                      ¡Importante! Asegúrese de qué detalle del servidor SMTP
                      que proporcionó sean correctos. De lo contrario, el correo
                      no será entregado.
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="ml-2 mb-1">Contraseña de la aplicación</p>
                    <input
                      type="text"
                      className="rounded-md border-1 ml-2 w-full"
                    />
                  </div>
                </>
              ) : (
                ""
              )}

              <div className="border-b-2 pb-2">
                <h1 className="mt-4 text-lg">Instegración del CRM</h1>
              </div>
              <div className="mt-4">
                <div className="flex ml-1">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setCrmConfig(e.target.checked);
                    }}
                  />
                  <p className="ml-1">Enlace a CRM</p>
                </div>
                {crmConfig && (
                  <div className="ml-3">
                    <div className="flex mt-4">
                      <input type="checkbox" />
                      <p className="ml-1">Procesar mensajes para una semana</p>
                    </div>
                    <div className="flex mt-4">
                      <input type="checkbox" />
                      <p className="ml-1">
                        Enrutar correos electrónicos de clientes existentes a
                        gerentes de CRM asignados
                      </p>
                    </div>
                    <div className="flex mt-4">
                      <input type="checkbox" />
                      <p className="ml-1">
                        Crear Prospecto para los mensajes entrantes a una nueva
                        dirección de correo electrónico
                      </p>
                    </div>
                    <div className="flex mt-4">
                      <input type="checkbox" />
                      <p className="ml-1">
                        Crear Contacto para mensaje salientes a una nueva
                        direción de correo electrónico
                      </p>
                    </div>
                    <div className="flex mt-4">
                      <input type="checkbox" />
                      <p className="ml-1">
                        Creat contactos usando vCard adjunto
                      </p>
                    </div>
                    <div className="flex mt-4">
                      <p>Origen de contacto y prospecto</p>
                    </div>
                    <div className="flex mt-4">
                      <p>
                        Crear un nuevo prospecto para cada nuevo mensaje
                        entrante de{" "}
                      </p>
                    </div>
                    <div className="flex mt-4">
                      <p>Cola de distribución de contactos y prospectosÑ</p>
                    </div>
                    <div className="flex mt-4">
                      <Controller
                        name="responsible"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                          <MultipleSelect
                            {...field}
                            options={lists?.users || []}
                            getValues={getValues}
                            setValue={setValue}
                            name="responsible"
                            error={errors.responsible}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex mt-4 justify-end">
                {userGoogle && from == "buzon" ? (
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
                      className="hover:bg-green-600 bg-green-500 text-white font-bold py-2 px-4 rounded-md ml-2"
                    >
                      Guardar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md"
                    onClick={() => setOpenModalFolders(true)}
                  >
                    Conecta
                  </button>
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
