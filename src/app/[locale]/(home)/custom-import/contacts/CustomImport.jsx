"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Configurations from "./components/Configurations";
const CustomImport = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="p-8">
      <h3 className="font-bold pb-6">{t("import:contacts:title")}</h3>
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabList>
          <Tab className="px-3 py-4 bg-[#EDEDED] data-[selected]:opacity-100 opacity-50 rounded-t-[10px] outline-none focus:outline-none">
            <p className="text-sm font-bold">
              {t("import:contacts:tabs:config")}
            </p>
          </Tab>
          <Tab className="px-3 py-4 bg-[#EDEDED] data-[selected]:opacity-100 opacity-50 rounded-t-[10px] outline-none focus:outline-none">
            <p className="text-sm font-bold">
              {t("import:contacts:tabs:fields")}
            </p>
          </Tab>
          <Tab className="px-3 py-4 bg-[#EDEDED] data-[selected]:opacity-100 opacity-50 rounded-t-[10px] outline-none focus:outline-none">
            <p className="text-sm font-bold">
              {t("import:contacts:tabs:duplicate")}
            </p>
          </Tab>
          <Tab className="px-3 py-4 bg-[#EDEDED] data-[selected]:opacity-100 opacity-50 rounded-t-[10px] outline-none focus:outline-none">
            <p className="text-sm font-bold">
              {t("import:contacts:tabs:import")}
            </p>
          </Tab>
        </TabList>
        <TabPanels className="bg-white">
          <TabPanel>
            <Configurations />
          </TabPanel>
          <TabPanel>Content 2</TabPanel>
          <TabPanel>Content 3</TabPanel>
          <TabPanel>Content 3</TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default CustomImport;
