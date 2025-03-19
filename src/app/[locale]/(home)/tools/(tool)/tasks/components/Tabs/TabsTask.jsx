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
import { getTaskObjections } from "@/src/lib/apis";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TabsTask({ data }) {
  const { comments, isLoading, isError } = useTaskComments(data.id);
  const [objections, setObjections] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const { t } = useTranslation();
  const [categories, setCategories] = useState(null);
  const [totalObjections, setTotalObjections] = useState(0);

  const getObjections = async (page) => {
    const response = await getTaskObjections(data.id, page, limit);
    console.log({ response });

    if (response.hasError) {
      handleFrontError(response);
      return;
    }

    setObjections(page == 1 ? response.items : [...objections, response.items]);

    if (page == 1) {
      setTotalObjections(response?.meta?.totalItems ?? 0);
    }
  };

  useEffect(() => {
    getObjections(1);
  }, []);

  useEffect(() => {
    const timer = calculateElapsedTime(
      data?.totalTimeSpent ? data?.totalTimeSpent * 1000 : 0,
      moment().format()
    );
    setCategories({
      comments: {
        name: t("tools:tasks:edit:comments"),
        qty: comments?.length || 0,
        component: TabComment,
        props: {},
      },
      history: {
        name: t("tools:tasks:edit:history"),
        qty: "1",
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
        props: {},
      },
      time: {
        name: t("tools:tasks:edit:time"),
        qty: `${timer.hours}:${timer.minutes}:${timer.seconds}`,
        component: TabTableTime,
        isLoading: false,
        isError: false,
        props: {},
      },
      objections: {
        name: t("tools:tasks:edit:objections"),
        qty: totalObjections,
        props: {
          total: totalObjections,
          objections,
          getMore: getObjections,
          page,
          setPage,
        },
        component: TabTableObjections,
      },
    });
  }, [data, t, comments, objections]);

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
                <categ.component info={data} {...categ?.props} />
              </TabPanel>
            ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
