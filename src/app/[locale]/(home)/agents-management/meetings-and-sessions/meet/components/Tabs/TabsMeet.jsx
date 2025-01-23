"use client";
import { useEffect, useState } from "react";
import { Tab, TabList, TabGroup, TabPanels, TabPanel } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import Comments from "@/src/components/comments/Comments";
import { useTaskComments } from "@/src/lib/api/hooks/tasks";
import LoaderSpinner from "@/src/components/LoaderSpinner";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TabsMeet({ data }) {
  const { comments, isLoading, isError } = useTaskComments(data.id);

  const { t } = useTranslation();
  let [categories, setCategories] = useState(null);

  useEffect(() => {
    setCategories({
      comments: {
        name: t("tools:tasks:edit:comments"),
        qty: comments?.length || 0,
        pings: 9,
        component: Comments,
      },
    });
  }, [data, t, comments]);

  if (isLoading) return <LoaderSpinner />;
  if (isError) return <p>Error</p>;

  return (
    <div className="w-full">
      <TabGroup as="div" className="grid grid-cols-1 gap-y-2">
        <TabList className="bg-transparent w-full gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories &&
            Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-1.5 text-xs font-medium leading-5 flex gap-2 justify-center items-center",
                    "ring-0 focus:outline-none focus:ring-0",
                    selected
                      ? `${category === "comments" ? "bg-white" : "bg-gray-100"} text-black shadow`
                      : "text-black hover:bg-white/[0.12] hover:text-white bg-gray-300"
                  )
                }
              >
                {t(`tools:tasks:edit:${category}`)}
                <div className="text-xs p-1 bg-gray-200 rounded-md">
                  {categories[category].qty}
                </div>
              </Tab>
            ))}
        </TabList>
        <TabPanels className="w-full">
          {categories &&
            Object.values(categories).map((categ, idx) => (
              <TabPanel
                key={idx}
                className={classNames(
                  `rounded-lg ${idx === 0 ? "bg-white" : "bg-gray-100"}`,
                  "focus:outline-none focus:ring-0"
                )}
              >
                <categ.component info={data} type="meet" />
              </TabPanel>
            ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
