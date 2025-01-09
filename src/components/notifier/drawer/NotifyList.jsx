"use client";
import { useNotifyContext } from "@/src/context/notify";
import { formatDate } from "@/src/utils/getFormatDate";
import clsx from "clsx";
import parse from "html-react-parser";
import moment from "moment";
import { useEffect, useRef } from "react";

export default function NotifyList() {
  const { notifications, markAsRead, loadMore, hasMore, isLoading } =
    useNotifyContext();
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!observerRef) return;
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const notificationId = entry.target.getAttribute("data-id");
          const readAt = entry.target.getAttribute("data-read-at");

          if (!readAt) {
            markAsRead(notificationId);
          }
        }
      });
    });

    const elements = document?.querySelectorAll(".notification-item");
    if (elements)
      elements?.forEach((element) => observerRef.current.observe(element));

    return () => {
      observerRef.current.disconnect();
    };
  }, [notifications, markAsRead]);

  useEffect(() => {
    const loadMoreObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    });

    if (loadMoreRef.current) {
      loadMoreObserver.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        loadMoreObserver.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  return (
    <ul className="w-full grid grid-cols-1 gap-1 pt-2">
      {notifications?.map((notification) => (
        <li
          key={notification.id}
          className={clsx(
            "py-2 px-4 flex flex-col notification-item bg-gray-100 rounded-xl relative"
          )}
          data-id={notification.id}
          data-read-at={notification.readAt}
        >
          {!notification.readAt && (
            <div className="w-3 h-3 rounded-full bg-red-600 absolute -top-[3px] -right-[3px]" />
          )}
          <div className="self-end text-sm text-slate-500 italic data-[read-at]:bg-slate-600">
            {moment(notification.createdAt).calendar({
              sameDay: function () {
                return (
                  "[hoy a la" + (this.hours() !== 1 ? "s" : "") + "] hh:mm A"
                );
              },
              lastDay: function () {
                return (
                  "[ayer a la" + (this.hours() !== 1 ? "s" : "") + "] hh:mm A"
                );
              },
              lastWeek: function () {
                return (
                  "[el] dddd [a la" +
                  (this.hours() !== 1 ? "s" : "") +
                  "] hh:mm A"
                );
              },
              sameElse: "d MMM YYYY hh:mm A",
            })}
          </div>

          <p className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-slate-700">
              <svg
                className="h-full w-full text-slate-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            <span className="text-sm">{parse(notification.content)}</span>
          </p>
        </li>
      ))}
      <li ref={loadMoreRef} className="py-2 flex justify-center">
        {isLoading && hasMore && <span>Cargando más notificaciones...</span>}
      </li>
    </ul>
  );
}
