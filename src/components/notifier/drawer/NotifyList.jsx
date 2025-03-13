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

export default function NotifyList() {
  const { notifications, markAsRead, loadMore, hasMore, isLoading, unread } =
    useNotifyContext();
  const { lists } = useAppContext();
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // useEffect(() => {
  //   if (!observerRef) return;
  //   observerRef.current = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         const notificationId = entry.target.getAttribute("data-id");
  //         const readAt = entry.target.getAttribute("data-read-at");

  //         if (!readAt) {
  //           markAsRead(notificationId);
  //         }
  //       }
  //     });
  //   });

  //   const elements = document?.querySelectorAll(".notification-item");
  //   if (elements)
  //     elements?.forEach((element) => observerRef.current.observe(element));

  //   return () => {
  //     observerRef.current.disconnect();
  //   };
  // }, [notifications, markAsRead]);

  const handleReadNotification = async (notification, event) => {
    if (!notification.readAt) {
      await markAsRead(notification.id);
    }
  };

  // useEffect(() => {
  //   const loadMoreObserver = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting && hasMore && !isLoading) {
  //       loadMore();
  //     }
  //   });

  //   if (loadMoreRef.current) {
  //     loadMoreObserver.observe(loadMoreRef.current);
  //   }

  //   return () => {
  //     if (loadMoreRef.current) {
  //       loadMoreObserver.unobserve(loadMoreRef.current);
  //     }
  //   };
  // }, [hasMore, isLoading, loadMore]);

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
              "py-2 px-4 flex flex-col group notification-item  rounded-xl relative",
              {
                "bg-easy-100": !notification.readAt,
                "bg-gray-100": notification.readAt,
              }
            )}
            data-id={notification.id}
            data-read-at={notification.readAt}
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
              <div
                className="text-sm w-10/12"
                onClickCapture={(event) =>
                  handleReadNotification(notification, event)
                }
              >
                {parse(notification.content)}
              </div>
            </div>
            <div className="flex justify-end">
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
            </div>
          </li>
        ))}
      </ul>
    </InfiniteScroll>
  );
}
