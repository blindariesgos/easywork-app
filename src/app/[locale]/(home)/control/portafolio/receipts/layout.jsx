import React, { Suspense } from "react";
import LayoutReceipts from "./LayoutReceipts";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ReceiptsContextProvider from "../../../../../../context/receipts/provider";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import SubMenu from "./components/SubMenu";

export default async function ReceiptLayout({ children, table }) {
  const tabs = [
    {
      name: "Kanban",
      component: "",
      disabled: true,
    },
    {
      name: "Lista",
      component: table,
    },
  ];
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <ReceiptsContextProvider>
        <LayoutReceipts>
          <Suspense fallback={<LoaderSpinner />}>
            <TabGroup
              defaultIndex={1}
              className="w-full flex flex-col items-start"
            >
              <div className="flex gap-2 items-center">
                <TabList className="bg-zinc-300/40 rounded-full flex gap-1 items-center p-1 ">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      className="data-[selected]:bg-white py-2 px-3 rounded-full text-xs outline-none focus:outline-none hover:outline-none"
                      disabled={tab.disabled}
                    >
                      {tab.name}
                    </Tab>
                  ))}
                </TabList>
                <SubMenu />
              </div>
              <TabPanels className="w-full">
                {tabs.map((tab) => (
                  <TabPanel key={tab.name} className="w-full">
                    {tab.component}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
            {children}
          </Suspense>
        </LayoutReceipts>
      </ReceiptsContextProvider>
    </div>
  );
}
