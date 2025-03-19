"use client";
import useAppContext from "@/src/context/app";
import { useNotifyContext } from "@/src/context/notify";
import { formatDate } from "@/src/utils/getFormatDate";
import clsx from "clsx";
import parse from "html-react-parser";
import moment from "moment";
import Image from "next/image";
import { useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Button from "../../form/Button";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function NotifyList() {
  const { notifications, markAsRead, loadMore, hasMore } = useNotifyContext();
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const router = useRouter();

  const actions = {
    "lead-import-completed": {
      label: t("common:see-import-result"),
      onClick: (meta) =>
        router.push(`/custom-import/leads/import-completed/${meta?.jobId}`),
    },
    "contact-import-completed": {
      label: t("common:see-import-result"),
      onClick: (meta) =>
        router.push(`/custom-import/contacts/import-completed/${meta?.jobId}`),
    },
  };

  return (
    <InfiniteScroll
      dataLength={notifications.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4>Cargando más notificaciones...</h4>}
      height="85vh"
    >
      <ul className="w-full grid grid-cols-1 gap-1 pt-2">
        {notifications?.map((notification) => (
          <li
            key={notification.id}
            className={clsx(
              "py-2 px-4 flex flex-col group notification-item  rounded-xl relative group",
              {
                "bg-easy-100": !notification.readAt,
                "bg-gray-100": notification.readAt,
              }
            )}
            onMouseEnter={() =>
              !notification.readAt && markAsRead(notification.id)
            }
          >
            <div className="flex justify-end">
              <div className=" text-sm text-slate-500 italic data-[read-at]:bg-slate-600">
                {moment(notification.createdAt).calendar({
                  sameDay: function () {
                    return (
                      "[hoy a la" +
                      (this.hours() !== 1 ? "s" : "") +
                      "] hh:mm A"
                    );
                  },
                  lastDay: function () {
                    return (
                      "[ayer a la" +
                      (this.hours() !== 1 ? "s" : "") +
                      "] hh:mm A"
                    );
                  },
                  lastWeek: function () {
                    return (
                      "[el] dddd [pasado a la" +
                      (this.hours() !== 1 ? "s" : "") +
                      "] hh:mm A"
                    );
                  },
                  sameElse: "d MMM YYYY hh:mm A",
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {notification?.metadata?.commentOwnerId ? (
                <Image
                  src={
                    lists?.users?.find(
                      (x) => x.id == notification.metadata.commentOwnerId
                    )?.avatar ?? "/img/activities/easy-icon.svg"
                  }
                  className="h-10 w-10 rounded-full object-cover"
                  width={10}
                  height={10}
                  alt="easy icon"
                />
              ) : (
                <div
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
                </div>
              )}
              <div className="text-sm w-10/12">
                {parse(notification.content)}
              </div>
            </div>
            {["lead-import-completed", "contact-import-completed"].includes(
              notification?.subCategory
            ) && (
              <div className="w-full flex justify-end">
                <Button
                  buttonStyle="primary"
                  className="hidden group-hover:block px-2 py-1 text-xs"
                  label={actions[notification?.subCategory].label}
                  onclick={() =>
                    actions[notification?.subCategory].onClick(
                      notification?.metadata
                    )
                  }
                />
              </div>
            )}
            {/* <div className="flex justify-end">
              <div
                className={clsx(
                  "underline text-primary text-xs hidden cursor-pointer",
                  {
                    "group-hover:block ": !notification?.readAt,
                  }
                )}
                onClick={() => markAsRead(notification?.id)}
              >
                Marcar como leido
              </div>
            </div> */}
          </li>
        ))}
      </ul>
    </InfiniteScroll>
  );
}
