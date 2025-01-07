"use client";
import React, { useState, Fragment } from "react";
import { Transition, Switch } from "@headlessui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function ModalManage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const [activeCategory, setActiveCategory] = useState(null); // Define which category is active

  const handleCategoryToggle = (category) => {
    setActiveCategory(activeCategory === category ? null : category); // Toggle category
  };

  return (
    <div className="flex items-center">
      <Transition show={params.get("manage-cookies") === "true"} as={Fragment}>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50 -z-1"
            onClick={() =>
              router.push(`${window.location.pathname}?manage-cookies=false`)
            }
          ></div>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative w-2/4 max-md:w-4/5 flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <h1 className="text-easywork-main text-left text-xl font-bold w-full mb-2">
                Administrar cookies
              </h1>
              <p>
                Este sitio web usa cookies. Las usamos para mejorar tu
                experiencia en nuestros sitios web y también con fines de
                análisis y de marketing. Respetamos tu privacidad, por lo que te
                damos la opción de rechazar ciertos tipos de cookies. Haz clic
                en cada categoría para obtener más información y cambiar tus
                preferencias. Al bloquear ciertos tipos de cookies, es posible
                que esto afecte tu experiencia en el sitio web y limite los
                servicios que te podemos prestar.
              </p>
              <div className="w-full">
                {/* Essential Cookies */}
                <div className="bg-white rounded-lg mt-4">
                  <div
                    onClick={() => handleCategoryToggle("essential")}
                    className="cursor-pointer mb-2"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <ChevronDownIcon
                          className={`h-5 w-5 text-easywork-main transform transition-transform duration-300 ${
                            activeCategory === "essential"
                              ? "rotate-0"
                              : "-rotate-90"
                          }`}
                        />
                        <h1 className="ml-1">Cookies esenciales</h1>
                      </div>
                      <p>Siempre activas</p>
                    </div>
                  </div>
                  {activeCategory === "essential" && (
                    <p className="text-sm">
                      Este sitio web usa cookies. Las usamos para mejorar tu
                      experiencia en nuestros sitios web y también con fines de
                      análisis y de marketing. Respetamos tu privacidad, por lo
                      que te damos la opción de rechazar ciertos tipos de
                      cookies. Haz clic en cada categoría para obtener más
                      información y cambiar tus preferencias. Al bloquear
                      ciertos tipos de cookies, es posible que esto afecte tu
                      experiencia en el sitio web y limite los servicios que te
                      podemos prestar.
                    </p>
                  )}
                </div>
                {/* Analytics Cookies */}
                <div className="bg-white rounded-lg mt-4">
                  <div
                    onClick={() => handleCategoryToggle("analytics")}
                    className="cursor-pointer mb-2"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <ChevronDownIcon
                          className={`h-5 w-5 text-easywork-main transform transition-transform duration-300 ${
                            activeCategory === "analytics"
                              ? "rotate-0"
                              : "-rotate-90"
                          }`}
                        />
                        <h1 className="ml-1">Cookies para analíticas web</h1>
                      </div>
                      <Switch
                        checked={activeCategory === "analytics"}
                        onChange={() =>
                          setActiveCategory(
                            activeCategory === "analytics" ? null : "analytics"
                          )
                        }
                        className="group relative flex h-6 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-indigo-600 transition duration-200 ease-in-out translate-x-0"
                          style={{
                            transform:
                              activeCategory === "analytics"
                                ? "translateX(1.50rem)"
                                : "translateX(0)",
                          }}
                        />
                      </Switch>
                    </div>
                  </div>
                  {activeCategory === "analytics" && (
                    <p className="text-sm">
                      Estas cookies nos permiten conocer la manera en que los
                      visitantes interactúan con el sitio. Es posible que las
                      utilicemos para recopilar información y elaborar informes
                      sobre las estadísticas de uso del sitio web. Además de
                      estos informes, los datos recopilados, junto con otros
                      derivados a partir de las cookies de publicidad, también
                      se pueden utilizar para mostrar publicidad más pertinente
                      y medir la interacción con tales anuncios. Más información
                      sobre las cookies para analíticas web.
                    </p>
                  )}
                </div>
                {/* Advertising Cookies */}
                <div className="bg-white rounded-lg mt-4">
                  <div
                    onClick={() => handleCategoryToggle("advertising")}
                    className="cursor-pointer mb-2"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <ChevronDownIcon
                          className={`h-5 w-5 text-easywork-main transform transition-transform duration-300 ${
                            activeCategory === "advertising"
                              ? "rotate-0"
                              : "-rotate-90"
                          }`}
                        />
                        <h1 className="ml-1">Cookies para publicidad</h1>
                      </div>
                      <Switch
                        checked={activeCategory === "advertising"}
                        onChange={() =>
                          setActiveCategory(
                            activeCategory === "advertising"
                              ? null
                              : "advertising"
                          )
                        }
                        className="group relative flex h-6 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-indigo-600 transition duration-200 ease-in-out translate-x-0"
                          style={{
                            transform:
                              activeCategory === "advertising"
                                ? "translateX(1.50rem)"
                                : "translateX(0)",
                          }}
                        />
                      </Switch>
                    </div>
                  </div>
                  {activeCategory === "advertising" && (
                    <p className="text-sm">
                      Usamos cookies para que los anuncios que mostramos sean de
                      interés y utilidad para los visitantes de nuestro sitio
                      web. Con el fin de mejorar las estadísticas de rendimiento
                      de las campañas publicitarias y evitar mostrar anuncios
                      que un usuario determinado ya ha visto antes, algunas
                      aplicaciones para cookies comunes seleccionan los anuncios
                      con base en lo que es más pertinente para cada visitante.
                      Más información sobre las cookies para publicidad.
                    </p>
                  )}
                </div>
                {/* Functional Cookies */}
                <div className="bg-white rounded-lg mt-4">
                  <div
                    onClick={() => handleCategoryToggle("functional")}
                    className="cursor-pointer mb-2"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <ChevronDownIcon
                          className={`h-5 w-5 text-easywork-main transform transition-transform duration-300 ${
                            activeCategory === "functional"
                              ? "rotate-0"
                              : "-rotate-90"
                          }`}
                        />
                        <h1 className="ml-1">Cookies de funcionalidad</h1>
                      </div>
                      <Switch
                        checked={activeCategory === "functional"}
                        onChange={() =>
                          setActiveCategory(
                            activeCategory === "functional"
                              ? null
                              : "functional"
                          )
                        }
                        className="group relative flex h-6 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-indigo-600 transition duration-200 ease-in-out translate-x-0"
                          style={{
                            transform:
                              activeCategory === "functional"
                                ? "translateX(1.50rem)"
                                : "translateX(0)",
                          }}
                        />
                      </Switch>
                    </div>
                  </div>
                  {activeCategory === "functional" && (
                    <p className="text-sm">
                      Usamos cookies opcionales para mejorar la funcionalidad
                      del sitio web. Con frecuencia, se envían solo como
                      respuesta a cierta información que el usuario proporciona
                      al sitio web, con el fin de personalizar y optimizar su
                      experiencia, y también registrar el historial de chat. Más
                      información sobre las cookies de funcionalidad.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}
