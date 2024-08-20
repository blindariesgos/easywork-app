"use client";

import { Fragment, useState } from "react";
import Control from "./components/panels/control";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/form/Button";
import { FaChevronDown } from "react-icons/fa";

import FiltersControl from "./components/filters/FiltersControl";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import useControlContext from "@/src/context/control";
import ButtonAdd from "../components/ButtonAdd";

const Page = () => {
  const { t } = useTranslation();
  const { filters, displayFilters, removeFilter } = useControlContext();
  // const tabs = [
  //   {
  //     name: t("control:portafolio:control:tabs:contact"),
  //     component: () => <Contact />,
  //   },
  //   {
  //     name: t("control:portafolio:control:tabs:company"),
  //     component: () => <MoralContactForm />,
  //   },
  //   {
  //     name: t("control:portafolio:control:tabs:policy"),
  //     component: () => <Policy />,
  //   },
  //   {
  //     name: t("control:portafolio:control:tabs:control"),
  //     component: () => <Control />,
  //   },
  // ];
  return (
    <Fragment>
      <div className="bg-white rounded-md shadow-sm py-4 px-4 grid grid-cols-1 gap-2">
        <div className="flex gap-3 items-center">
          <h2 className="text-primary text-2xl">
            {t("control:portafolio:control:title")}
          </h2>
          <ButtonAdd />
          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <FiltersControl />
            </div>
          </div>
        </div>
        <ActiveFiltersDrawer
          displayFilters={displayFilters}
          removeFilter={removeFilter}
          notRemove
        />
      </div>
      <Control />
      {/* <div className="bg-white rounded-md shadow-sm">
        <div className="flex gap-6 py-4 px-4">
          <div className="flex min-h-screen w-full px-4">
            <div className="w-full ">
              <TabGroup>
                <TabList className="flex gap-4">
                  {tabs.map(({ name }) => (
                    <Tab
                      key={name}
                      className="rounded-xl py-2.5 px-5 text-sm  focus:outline-none data-[selected]:bg-primary  data-[selected]:text-white data-[hover]:bg-gray-300 data-[selected]:data-[hover]:bg-indigo-500 data-[hover]:shadow-sm "
                    >
                      {name}
                    </Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {tabs.map(({ name, component }) => (
                    <TabPanel key={name}>{component()}</TabPanel>
                  ))}
                </TabPanels>
              </TabGroup>
            </div>
          </div>
        </div>
      </div> */}
    </Fragment>
  );
};

export default Page;
