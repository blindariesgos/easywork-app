"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const CustomImport = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="p-8">
      <h3 className="font-bold">{t("import:contacts:title")}</h3>
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Content 1</TabPanel>
          <TabPanel>Content 2</TabPanel>
          <TabPanel>Content 3</TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default CustomImport;
