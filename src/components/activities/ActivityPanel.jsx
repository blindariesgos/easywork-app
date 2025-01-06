"use client";
import React, { useEffect, useState } from "react";
import ActivityHeader from "./ActivityHeader";
import { TiInfoLarge } from "react-icons/ti";
import clsx from "clsx";
import CardTask from "./CardTask";
import CardEvent from "./CardEvent";

import { useTranslation } from "react-i18next";
import CardComment from "./CardComment";
import { useEntityActivities } from "../../lib/api/hooks/contacts";
import { MdModeComment } from "react-icons/md";
import Image from "next/image";
import { LoadingSpinnerSmall } from "../LoaderSpinner";

export default function ActivityPanel({
  entityId,
  crmType = "contact",
  className,
  contactType,
  disabled,
}) {
  const [bulkActivity, setBulkActivity] = useState([]);
  const { activities, isError, isLoading, mutate } = useEntityActivities(
    entityId,
    crmType
  );

  useEffect(() => {
    if (activities) {
      if (!Array.isArray(activities)) return;

      console.log("Bulk activities", activities);
      setBulkActivity(activities);
    }
  }, [activities]);

  const { t } = useTranslation();

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <LoadingSpinnerSmall />;
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "comment":
        return (
          <MdModeComment className="h-5 w-5  text-white" aria-hidden="true" />
        );
      case "system":
        return (
          <TiInfoLarge className="h-5 w-5  text-white" aria-hidden="true" />
        );
      case "event":
        return (
          <Image
            className="h-5 w-5 text-white"
            width={10}
            height={10}
            alt="task icon"
            src="/img/activities/event-1.svg"
          />
        );
      default:
        return (
          <Image
            className="h-5 w-5 text-white"
            width={10}
            height={10}
            alt="task icon"
            src="/img/activities/task-icon.svg"
          />
        );
    }
  };
  return (
    <div
      className={clsx(
        "px-2 lg:px-4 relative bg-gray-100 rounded-tr-lg w-full h-full overflow-y-auto",
        className
      )}
    >
      <div className="w-full flex ">
        <div className="flow-root rounded-lg w-full">
          <ul role="list" className="lg:p-3 py-3">
            <li className="w-full">
              <div className="relative">
                <span
                  className="absolute left-5 top-4 -ml-px h-full w-0.5 bg-zinc-400"
                  aria-hidden="true"
                />
                <div className="relative flex w-full">
                  <div className="lg:w-[7%] w-[10%] mt-4">
                    <span
                      className={clsx(
                        "bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center"
                      )}
                    >
                      <Image
                        src="/img/activities/easy-icon.svg"
                        className="h-5 w-5"
                        width={10}
                        height={10}
                        alt="easy icon"
                      />
                    </span>
                  </div>

                  <div
                    className={`bg-gray-200 lg:w-[93%] w-[90%] ml-4 pb-4 px-4 rounded-t-lg sticky top-0`}
                  >
                    <ActivityHeader
                      entityId={entityId}
                      crmType={crmType}
                      update={mutate}
                      className="w-full"
                      contactType={contactType}
                      disabled={disabled}
                    />
                  </div>
                </div>
              </div>
            </li>
            {bulkActivity?.length > 0 &&
              bulkActivity?.map((activity, activityIdx) => (
                <li key={activity.id} className="w-full">
                  <div className="relative">
                    {activityIdx !== bulkActivity.length - 1 && (
                      <span
                        className="absolute left-5 top-4 -ml-px h-full w-0.5 bg-zinc-400"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex w-full">
                      <div className="lg:w-[7%] w-[10%] mt-4">
                        <span
                          className={clsx(
                            "h-10 w-10 rounded-full flex items-center justify-center ",
                            {
                              "bg-primary": activity.type == "task",
                              "bg-[#0f8bbf]":
                                (activity.type == "comment" &&
                                  activity?.metadata?.commentType !=
                                    "system") ||
                                activity.type == "event",
                              "bg-gray-200":
                                activity.type == "comment" &&
                                activity?.metadata?.commentType == "system",
                            }
                          )}
                        >
                          {getActivityIcon(
                            activity.type == "comment"
                              ? (activity?.metadata?.commentType ?? "comment")
                              : activity.type
                          )}
                        </span>
                      </div>
                      <div
                        className={`bg-gray-200 lg:w-[93%] w-[90%] ml-4 pb-4 px-4 ${activityIdx === bulkActivity.length - 1 && "rounded-b-lg"}`}
                      >
                        <ActivityCard activity={activity} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity }) {
  switch (activity.type) {
    case "task":
      return <CardTask data={activity} />;
    case "event":
      return <CardEvent data={activity} />;
    case "comment":
      return <CardComment data={activity} />;

    default:
      <>Ok</>;
      break;
  }
}
