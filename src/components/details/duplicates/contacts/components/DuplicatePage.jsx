import clsx from "clsx";
import { Fragment, useState } from "react";
import InitialSearch from "./steps/InitialSearch";
import Actions from "./steps/Actions";
import Finished from "./steps/Finished";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const DuplicatePage = ({ onClose, handleOpenManual }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleNext = () => {
    setSelectedIndex(selectedIndex + 1);
  };
  const handleBack = () => {
    setSelectedIndex(selectedIndex - 1);
  };

  return (
    <div
      className={clsx(
        "max-h-screen h-full p-4 bg-gray-600 max-w-[1000px] w-full relative opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px]  overflow-y-auto lg:overflow-y-hidden"
      )}
    >
      <h1 className="text-2xl pb-4">
        Encontrar y fusionar contactos duplicados
      </h1>
      <TabGroup
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
        as={Fragment}
      >
        <TabList className="hidden">
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
          <Tab>Tab 4</Tab>
        </TabList>
        <TabPanels as={Fragment}>
          <TabPanel as={Fragment}>
            <InitialSearch handleNext={handleNext} handleBack={handleBack} />
          </TabPanel>
          <TabPanel as={Fragment}>
            <Actions
              handleNext={handleNext}
              handleBack={handleBack}
              handleEnd={() => setSelectedIndex(3)}
              handleOpenManual={handleOpenManual}
              onClose={onClose}
            />
          </TabPanel>
          <TabPanel as={Fragment}>Content 3</TabPanel>
          <TabPanel as={Fragment}>
            <Finished onClose={onClose} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default DuplicatePage;
