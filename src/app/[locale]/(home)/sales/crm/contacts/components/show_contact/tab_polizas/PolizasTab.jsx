"use client";
import { Suspense, useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import useCrmContext from "../../../../../../../../../context/crm";
import ContactPolizaTable from "./ContactPolizaTable";
import { useTranslation } from "react-i18next";
import { usePolicies } from "../../../../../../../../../hooks/useCommon";
import { useParams, usePathname, useSearchParams } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function PolizasTab({ base = 0, contactID }) {
  const { t } = useTranslation();
  const { currentContact } = useCrmContext();
  const { branches: options } = usePolicies(contactID);

  if (!currentContact) return <></>;

  return (
    <div className="w-full h-full px-4 lg:px-8">
      <TabGroup defaultIndex={0}>
        {/* <TabList className="flex space-x-1 rounded-md w-full p-2 bg-white sm:flex-row flex-col">
          {branches.slice(base, branches.length).map((category, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-0 focus:outline-none focus:ring-0",
                  category.route == pathname
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
        </TabList> */}
        <TabPanels className="pt-2">
          {/* {Object.values(categories).map((category, idx) => ( */}

          <TabPanel
            className={classNames(
              "rounded-xl",
              "ring-white/60 ring-offset-2  focus:outline-none"
            )}
          >
            {/* <ContactPolizaTable polizas={polizas ? polizas[category] : []} /> */}
            <ContactPolizaTable base={base} contactId={contactID} />
          </TabPanel>
          {/* ))} */}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
