"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Configurations from "./components/Configurations";
import Fields from "./components/Fields";
import Duplicates from "./components/Duplicates";
import Import from "./components/Import";

const CustomImport = ({ type }) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [stepPassed, setStepPassed] = useState(0);

  const items = [
    t("import:contacts:tabs:config"),
    t("import:contacts:tabs:fields"),
    t("import:contacts:tabs:duplicate"),
    t("import:contacts:tabs:import"),
  ];

  const handleNext = (index) => {
    if (index == stepPassed) setStepPassed(stepPassed + 1);
    setSelectedIndex(selectedIndex + 1);
  };

  const handleBack = (index) => {
    setSelectedIndex(selectedIndex - 1);
  };

  return (
    <div className="p-8">
      <h3 className="font-bold pb-6">{t(`import:${type}:title`)}</h3>
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabList>
          {items.map((item, index) => (
            <Tab
              key={index}
              disabled={index > stepPassed}
              className="px-3 py-4 bg-[#EDEDED] data-[selected]:opacity-100 opacity-50 rounded-t-[10px] outline-none focus:outline-none"
            >
              <p className="text-sm font-bold">{item}</p>
            </Tab>
          ))}
        </TabList>
        <TabPanels className="bg-white">
          <TabPanel>
            <Configurations handleNext={() => handleNext(0)} type={type} />
          </TabPanel>
          <TabPanel>
            <Fields handleNext={() => handleNext(1)} handleBack={handleBack} />
          </TabPanel>
          <TabPanel>
            <Duplicates
              handleNext={() => handleNext(2)}
              handleBack={handleBack}
            />
          </TabPanel>
          <TabPanel>
            <Import
              handleNext={() => handleNext(0)}
              handleBack={handleBack}
              type={type}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default CustomImport;
