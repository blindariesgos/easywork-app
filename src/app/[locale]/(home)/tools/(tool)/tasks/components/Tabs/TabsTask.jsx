"use client";
import { useEffect, useState } from "react";
import { Tab, TabList, TabGroup, TabPanels, TabPanel } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import TabComment from "@/src/components/comments/Comments";
import TabTableHistory from "./TabTableHistory";
import TabTableTime from "./TabTableTime";
import TabTableObjections from "./TabTableObjections";
import { useTaskComments } from "@/src/lib/api/hooks/tasks";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { calculateElapsedTime } from "@/src/components/Timer";
import moment from "moment";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TabsTask({ data }) {
  const { comments, isLoading, isError } = useTaskComments(data.id);

  const { t } = useTranslation();
  let [categories, setCategories] = useState(null);

  useEffect(() => {
    const timer = calculateElapsedTime(
      data?.totalTimeSpent ? data?.totalTimeSpent * 1000 : 0,
      moment().format()
    );
    setCategories({
      comments: {
        name: t("tools:tasks:edit:comments"),
        qty: comments?.length || 0,
        pings: 9,
        component: TabComment,
      },
      history: {
        name: t("tools:tasks:edit:history"),
        qty: "1",
        pings: 9,
        component: TabTableHistory,
        data: [
          {
            id: 1,
            date: "12/12/2023 15:08:40",
            created: "Nathaly Gomez",
            update: "Comentario creado",
            link: "#8965412",
            updating: "12/12/2023 15:00 - 19/12/2023 15:00",
          },
          {
            id: 2,
            date: "12/12/2023 0:00:00",
            created: "Nathaly Gomez",
            update: "Comentario creado",
            link: "#8965412",
            updating: "12/12/2023 15:00 - 19/12/2023 15:00",
          },
          {
            id: 3,
            date: "12/12/2023 15:08:40",
            created: "Nathaly Gomez",
            update: "Comentario creado",
            link: "#8965412",
            updating: "12/12/2023 15:00 - 19/12/2023 15:00",
          },
          {
            id: 4,
            date: "12/12/2023 15:08:40",
            created: "Nathaly Gomez",
            update: "Comentario creado",
            link: "#8965412",
            updating: "12/12/2023 15:00 - 19/12/2023 15:00",
          },
        ],
        isLoading: false,
        isError: false,
      },
      time: {
        name: t("tools:tasks:edit:time"),
        qty: `${timer.hours}:${timer.minutes}:${timer.seconds}`,
        pings: 9,
        component: TabTableTime,
        data: [
          {
            id: 1,
            date: "12/12/2023 15:08:40",
            created: "Yamile Rayme",
            time: "09:00:00",
            comment: "hola",
          },
          {
            id: 2,
            date: "5/29/2024 19:41:00",
            created: "Yamile Rayme",
            time: "09:00:00",
            comment: "",
          },
        ],
        isLoading: false,
        isError: false,
      },
      objections: {
        name: t("tools:tasks:edit:objections"),
        qty: "1",
        pings: 9,
        component: TabTableObjections,
        data: [
          {
            id: 1,
            date: "12/12/2023 15:08:40",
            created: "Yamile Rayme",
          },
          {
            id: 2,
            date: "5/29/2024 19:41:00",
            created: "Yamile Rayme",
          },
        ],
        isLoading: false,
        isError: false,
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
                <categ.component info={data} />
              </TabPanel>
            ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
