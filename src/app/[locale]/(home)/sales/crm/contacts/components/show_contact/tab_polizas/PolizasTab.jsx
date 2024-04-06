"use client";
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import useCrmContext from "@/context/crm";
import ContactPolizaTable from "./ContactPolizaTable";
import { useTranslation } from "react-i18next";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function PolizasTab() {
  const { t } = useTranslation();
  const { currentContact } = useCrmContext();

  let [categories] = useState({
    Todos_los_ramos: "ALL",
    Vida: "VIDA",
    Autos: "AUTO",
    Gastos_Médicos: "GMM",
    Daños: "DAÑO",
    Diversos: "DIVERSOS",
  });

  let [polizas, setPolizas] = useState([]);

  useEffect(() => {
    if (currentContact) {
      let categorizedPolizas = mapContactPolizasToCategories(
        currentContact.polizas
      );
      setPolizas(categorizedPolizas);
    }
  }, [currentContact]);

  const mapContactPolizasToCategories = (polizas) => {
    return polizas?.reduce((acc, poliza) => {
      const category = poliza.tipoPoliza;
      if (!acc[category]) {
        acc[category] = [];
      }
      if (!acc["ALL"]){
        acc["ALL"] = []
      }
      // add all polizas to the "ALL" category
      acc["ALL"].push(poliza);

      acc[category].push(poliza);
      return acc;
    }, {});
  };

  if (!currentContact) return <></>;

  return (
    <div className="w-full px-2 py-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl w-full p-1 bg-white">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-easy-500 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-easy-500 text-white shadow"
                    : "text-easy-700 hover:bg-easy-600/[0.3] hover:text-easy-700"
                )
              }
            >
              {/* Replace all occurrences of _ with a space */}
              {category.replace(/_/g, " ")}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((category, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white/60 ring-offset-2  focus:outline-none"
              )}
            >
              {console.log(polizas, "Polizas")}
              <ContactPolizaTable polizas={polizas ? polizas[category] : []} />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
