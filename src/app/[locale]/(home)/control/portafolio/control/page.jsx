"use client";

import { Fragment, useState } from "react";
import { TabGroup, TabList, TabPanels, TabPanel, Tab } from "@headlessui/react";
import Contact from "./components/panels/contact";
import Policy from "./components/panels/policy";
import Control from "./components/panels/control";
import MoralContactForm from "./components/moralContactForm";
import { useTranslation } from "react-i18next";
import SliderOverShord from "../../../../../../components/SliderOverShort";
import Button from "../../../../../../components/form/Button";
import { FaChevronDown } from "react-icons/fa";
import Tag from "@/src/components/Tag";
import { RiPencilFill } from "react-icons/ri";
import SelectInput from "../../../../../../components/form/SelectInput";
import AddPolicy from "./components/addPolicy";

const Page = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  // const tabs = [
  //   {
  //     name: t("tools:portafolio:control:tabs:contact"),
  //     component: () => <Contact />,
  //   },
  //   {
  //     name: t("tools:portafolio:control:tabs:company"),
  //     component: () => <MoralContactForm />,
  //   },
  //   {
  //     name: t("tools:portafolio:control:tabs:policy"),
  //     component: () => <Policy />,
  //   },
  //   {
  //     name: t("tools:portafolio:control:tabs:control"),
  //     component: () => <Control />,
  //   },
  // ];
  return (
    <Fragment>
      <div className="bg-white rounded-md shadow-sm">
        <div className="flex gap-6 py-4 px-4 items-center">
          <h2 className="text-primary text-2xl">
            {t("tools:portafolio:control:title")}
          </h2>
          <Button
            label={"Crear"}
            buttonStyle="primary"
            icon={<FaChevronDown className="w-4 h-4" />}
            className="py-2 px-4"
            onclick={() => setIsOpen(true)}
          />
        </div>
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
      <AddPolicy isOpen={isOpen} setIsOpen={setIsOpen} />
    </Fragment>
  );
};

export default Page;
