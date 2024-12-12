"use client";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";

const TabPages = ({ tabs, children, defaultIndex }) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(
    typeof defaultIndex != "undefined" ? defaultIndex : 1
  );

  useEffect(() => {
    if (Number(params.get("page")) === 0 || !params.get("page")) {
      params.set("page", 1);
      replace(`${pathname}?${params.toString()}`);
    }

    if (params.get("gtab")) {
      setSelectedIndex(Number(params.get("gtab")));
    }
  }, [searchParams, replace, pathname]);

  const handleChangeTab = (index) => {
    params.set("gtab", index);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TabGroup
      className="w-full flex flex-col items-start gap-4"
      selectedIndex={selectedIndex}
      onChange={handleChangeTab}
    >
      <div
        className={clsx({
          "flex gap-2": children,
        })}
      >
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
        {children}
      </div>
      <TabPanels className="w-full">
        {tabs.map((tab) => (
          <TabPanel key={tab.name} className="w-full">
            {tab.component}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};

export default TabPages;
