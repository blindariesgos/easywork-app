import SliderOverShort from "../../../../../../../components/SliderOverShort";
import Image from "next/image";
import axios from "axios";
import { Dropdown, Ripple, initTWE } from "tw-elements";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getTokenGoogle } from "../../../../../../../lib/apis";
import useAppContext from "../../../../../../../context/app/index";
import { setCookie } from 'cookies-next'

export default function ModalAddGmail({ children, state }) {
  const session = useSession();
  const {
    setOpenModalFolders,
    openModalFolders,
    userGoogle,
    setUserGoogle
  } = useAppContext();
  const [sendSmtp, setSendSmtp] = useState(false);
  const [editParams, setEditParams] = useState(false);
  const [user, setUser] = useState(null);

  initTWE({ Dropdown, Ripple });
  async function openWindowOauth() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google?idUser=${session.data.user.user.id}`
    );
    const oauthWindow = window.open(
      response.data.url,
      "_blank",
      "width=500, height=500"
    );

    const checkWindowClosed = setInterval(async function () {
      if (oauthWindow.closed) {
        clearInterval(checkWindowClosed);
        console.log("La ventana se ha cerrado");
        getTokenGoogle(session.data.user.user.id).then((res) => {
          setCookie('tokenGoogle', res.access_token)
          const config = {
            headers: { Authorization: `Bearer ${res.access_token}` },
          };
          axios
            .get(
              "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
              config
            )
            .then((userInfo) => {
              setUserGoogle(userInfo.data, ...res.access_token)
              console.log(userGoogle)
              setUser(userInfo.data);
            });
        });
      }
    }, 1000);

    console.log(response);
  }

  let estatus = !openModalFolders && state

  return (
    <SliderOverShort openModal={estatus}>
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
              <h1 className="text-gray-400 font-medium text-lg ml-1">Gmail</h1>
              {user ? (
                <div className="flex ml-2 items-center">
                  <Image
                    src={user.picture}
                    alt=""
                    width={27}
                    height={27}
                    className="rounded-xl"
                  />
                  <p className="ml-2">{user.email}</p>
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
            <div className="flex mt-4">
              <input type="checkbox" />
              <p className="ml-1" data-twe-dropdown-ref>
                Extraer mensajes para{" "}
                <span
                  className="underline text-blue-600 cursor-pointer"
                  id="dropdownMenuButton1"
                  data-twe-dropdown-toggle-ref
                >
                  una semana
                </span>
                <ul
                  class="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
                  aria-labelledby="dropdownMenuButton1"
                  data-twe-dropdown-menu-ref
                >
                  <li>
                    <a
                      class="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 active:no-underline dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                      href="#"
                      data-twe-dropdown-item-ref
                    >
                      una semana
                    </a>
                  </li>
                  <li>
                    <a
                      class="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 active:no-underline dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                      href="#"
                      data-twe-dropdown-item-ref
                    >
                      un mes
                    </a>
                  </li>
                  <li>
                    <a
                      class="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 active:no-underline dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                      href="#"
                      data-twe-dropdown-item-ref
                    >
                      2 meses
                    </a>
                  </li>
                  <li>
                    <a
                      class="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 active:no-underline dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                      href="#"
                      data-twe-dropdown-item-ref
                    >
                      3 meses
                    </a>
                  </li>
                </ul>
              </p>
            </div>
            <div className="mt-2">
              {editParams ? (
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
                    ¡Importante! Asegúrese de qué detalle del servidor SMTP que
                    proporcionó sean correctos. De lo contrario, el correo no
                    será entregado.
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
            <div className="flex mt-4">
              <input type="checkbox" checked="" />
              <p className="ml-1">Enlace a CRM</p>
            </div>
            <div className="flex mt-4 justify-around">
              <button
                type="button"
                className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md"
                onClick={() => setOpenModalFolders(true)}
              >
                Conecta
              </button>
              <button
                type="button"
                className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                // onClick={() => setModalG(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </SliderOverShort>
  );
}
