"use client";
import { Fragment, useState, useEffect } from "react";
import SelectInput from "@/src/components/form/SelectInput";

export function Hours() {
  const [enabled, setEnabled] = useState(false);
  const [activeTabIndexName, setActiveTabIndexName] = useState(0);
  return (
    <>
      <div className="mr-3 pb-10 w-full h-full overflow-y-auto">
        <h1 className="pb-2 w-full">Detalles de la empresa</h1>
        <p className="p-2 text-white text-xs w-full bg-easywork-main mb-3">
          Especifique los dias y horas hábiles de su empresa. De este modo, la
          administración de las horas laborales y la planificación de las fechas
          límite de las tareas serán más precisas.
        </p>
        <div className="bg-white rounded-lg p-5">
          <div className="flex space-x-3 border-b">
            {["Empresa", "Departamentos"].map((tab, idx) => {
              return (
                <button
                  key={idx}
                  className={`py-1 border-b-4 transition-colors duration-300 ${
                    idx === activeTabIndexName
                      ? "border-easywork-main"
                      : "border-transparent hover:border-gray-200"
                  }`}
                  onClick={() => setActiveTabIndexName(idx)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          <div className="py-2">
            {activeTabIndexName == 0 && (
              <>
                <div className="flex">
                  <div className="w-1/2">
                    <SelectInput
                      label={"El día laboral empieza a las:"}
                      options={[
                        {
                          name: "00:00",
                          id: 0,
                        },
                        {
                          name: "00:30",
                          id: 1,
                        },
                        {
                          name: "01:00",
                          id: 2,
                        },
                        {
                          name: "01:30",
                          id: 3,
                        },
                        {
                          name: "02:00",
                          id: 4,
                        },
                      ]}
                      placeholder="Seleccionar"
                    />
                  </div>
                  <div className="w-1/2">
                    <SelectInput
                      label={"El día laboral termina a las:"}
                      options={[
                        {
                          name: "00:00",
                          id: 0,
                        },
                        {
                          name: "00:30",
                          id: 1,
                        },
                        {
                          name: "01:00",
                          id: 2,
                        },
                        {
                          name: "01:30",
                          id: 3,
                        },
                        {
                          name: "02:00",
                          id: 4,
                        },
                      ]}
                      placeholder="Seleccionar"
                    />
                  </div>
                </div>
                <div className="text-xs mt-3 p-3">
                  <p>Días del fin de semana:</p>
                  <div className="flex">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                      (item, index) => (
                        <div
                          className="p-1 mr-2 rounded-md border border-black"
                          key={index}
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="text-xs mt-3 bg-gray-300 w-full p-3 rounded-md">
                  <p>Primer día de la semana:</p>
                  <div className="flex">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                      (item, index) => (
                        <div
                          className="p-1 mr-2 rounded-md border border-black"
                          key={index}
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
            {activeTabIndexName == 1 && (
              <>
                <p className="text-xs">
                  Si hay departamentos en su empresa que tienen horarios de
                  trabajo especificos o trabajan por turnos, puede crear
                  horarios de trabajo individuales para ellos.
                </p>
                <p className="text-xs mt-1 underline">
                  Crear horarios de trabajo
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
