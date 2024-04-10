"use client";
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import useCrmContext from "@/context/crm";
import ContactPolizaTable from "./ContactPolizaTable";
import { useTranslation } from "react-i18next";
import { usePolicies } from "@/hooks/useCommon";
import { useParams, usePathname, useSearchParams } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function PolizasTab({ base = 0, contactID }) {
  const { t } = useTranslation();
  const { currentContact } = useCrmContext();
  const { branches: options } = usePolicies(contactID);
  const pathname = usePathname();

  // let [categories] = useState({
  //   Todos_los_ramos: "ALL",
  //   Vida: "VIDA",
  //   Autos: "AUTO",
  //   Gastos_Médicos: "GMM",
  //   Daños: "DAÑO",
  //   Diversos: "DIVERSOS",
  // });

  const [branches, setBranches] = useState(options);

  
  // let [polizas, setPolizas] = useState([]);

  // useEffect(() => {
  //   if (currentContact) {
  //     let categorizedPolizas = mapContactPolizasToCategories(
  //       currentContact.polizas
  //     );
  //     setPolizas(categorizedPolizas);
  //   }
  // }, [currentContact]);

  // const mapContactPolizasToCategories = (polizas) => {
  //   return polizas?.reduce((acc, poliza) => {
  //     const category = poliza.tipoPoliza;
  //     if (!acc[category]) {
  //       acc[category] = [];
  //     }
  //     if (!acc["ALL"]){
  //       acc["ALL"] = []
  //     }
  //     // add all polizas to the "ALL" category
  //     acc["ALL"].push(poliza);

  //     acc[category].push(poliza);
  //     return acc;
  //   }, {});
  // };

  if (!currentContact) return <></>;

  return (
    <div className="w-full py-2">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-md w-full p-2 bg-white">
          {/* {Object.keys(categories).map((category) => (
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
              {category.replace(/_/g, " ")}
            </Tab>
          ))} */}
          {branches.slice(base, branches.length).map((category, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-0 focus:outline-none focus:ring-0",
                  (category.route == pathname)
                    ? "bg-blue-100 text-white shadow py-2"
                    : ` ${!category.inactive ? "hover:text-white hover:bg-blue-100 text-gray-400" : "hover-off text-gray-200"}`
                )
              }
              onClick={!category.inactive && category.onclick}
              disabled={category.inactive}
            >
              {category.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {/* {Object.values(categories).map((category, idx) => ( */}
            <Tab.Panel
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white/60 ring-offset-2  focus:outline-none"
              )}
            >
              {/* <ContactPolizaTable polizas={polizas ? polizas[category] : []} /> */}
              <ContactPolizaTable polizas={[]} />
            </Tab.Panel>
          {/* ))} */}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
