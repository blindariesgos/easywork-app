"use client";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import SelectInput from "@/src/components/form/SelectInput";

export function Users() {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <h1 className="ml-3 text-lg">Usuarios</h1>
      <h1 className="ml-3 w-full text-sm mb-3">
        Configure el perfil de usuario de acuerdo con los estándares de su
        empresa
      </h1>
      <div className="mr-3 pb-10 w-full h-full overflow-y-auto">
        <div className="bg-white rounded-lg p-5">
          <h1 className="pb-2 border-b-2 w-full">Perfil empleados</h1>
          <div className="mt-3 w-2/3">
            <SelectInput
              label={"Formato del nombre:"}
              options={[
                {
                  name: "Nombre, Apellido",
                  id: 0,
                },
                {
                  name: "Apellido, Nombre",
                  id: 1,
                },
                {
                  name: "Apellido, Nombre Nombre",
                  id: 2,
                },
              ]}
              placeholder="Seleccionar"
            />
          </div>
          <div className="mt-3 flex">
            <div className="w-2/3">
              <SelectInput
                label={"Pais del número de teléfono predeterminado:"}
                options={[
                  {
                    name: "Afganistan",
                    id: 0,
                  },
                  {
                    name: "Alemania",
                    id: 1,
                  },
                  {
                    name: "bahrein",
                    id: 2,
                  },
                ]}
                placeholder="Seleccionar"
              />
            </div>
            <div className="w-1/3 text-xs flex items-center justify-end">
              <div className="relative pl-2 w-36">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                <p>Ejemplo de teléfono:</p>
                <p>+506 8312 3456</p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex">
            <div className="w-2/3">
              <SelectInput
                label={"Región de la dirección predeterminada"}
                options={[
                  {
                    name: "Afganistan",
                    id: 0,
                  },
                  {
                    name: "Alemania",
                    id: 1,
                  },
                  {
                    name: "bahrein",
                    id: 2,
                  },
                ]}
                placeholder="Seleccionar"
              />
            </div>
            <div className="w-1/3 text-xs flex items-center justify-end">
              <div className="relative pl-2 w-36">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                <p>Ejemplo de dirección:</p>
                <p>137 One Nice Way Caprica, CA 92908 USA</p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex">
            <div className="w-2/3 flex items-center">
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className="group relative flex h-5 w-12 cursor-pointer rounded-full bg-zinc-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-indigo-300"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                />
              </Switch>
              <p className="ml-2 text-sm">
                Mostra el año de nacimiento en el perfil de usuario
              </p>
            </div>
            <div className="w-1/3 text-xs flex items-center justify-end">
              <div className="relative pl-2 w-36">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 border-l-2"></div>
                <p>Ejemplo de fecha de nacimiento:</p>
                <p>7 de junio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
