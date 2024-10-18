"use client";
import React, { useEffect, useState } from "react";
import ActivityHeader from "./ActivityHeader";
import {
  CameraIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import CardVideo from "./CardVideo";
import CardTask from "./CardTask";
import {
  ChatBubbleBottomCenterIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import CardWhatsapp from "./CardWhatsapp";
import CardEmail from "./CardEmail";
import CardComment from "./CardComment";
import { useEntityActivities } from "../../lib/api/hooks/contacts";
import { MdModeComment } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";

export default function ActivityPanel({
  entityId,
  crmType = "contact",
  className,
  contactType,
}) {
  const [bulkActivity, setBulkActivity] = useState([]);
  const { activities, isError, isLoading, mutate } = useEntityActivities(
    entityId,
    crmType
  );

  useEffect(() => {
    if (activities) {
      //   const sortedItems = parseAndSortByDate(activities);

      console.log({ activities });
      setBulkActivity(activities);
    }
  }, [activities]);

  const { t } = useTranslation();

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "comment":
        return (
          <MdModeComment className="h-5 w-5  text-white" aria-hidden="true" />
        );
      default:
        return (
          <IoMdCheckboxOutline
            className="h-5 w-5 text-white"
            aria-hidden="true"
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
                      <UserIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>

                  <div
                    className={`bg-gray-200 lg:w-[93%] w-[90%] ml-4 pb-4 px-4 rounded-t-lg`}
                  >
                    <ActivityHeader
                      entityId={entityId}
                      crmType={crmType}
                      update={mutate}
                      className="w-full"
                      contactType={contactType}
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
                              "bg-gray-200": activity.type == "comment",
                            }
                          )}
                        >
                          {getActivityIcon(activity.type)}
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
    case "comment":
      return <CardComment data={activity} />;

    default:
      <>Ok</>;
      break;
  }
}
