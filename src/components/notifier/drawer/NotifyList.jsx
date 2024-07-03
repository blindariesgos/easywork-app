"use client";
import { useNotifyContext } from "@/src/context/notify";
import { formatDate } from "@/src/utils/getFormatDate";
import parse from "html-react-parser";
import { useEffect, useRef } from "react";

export default function NotifyList() {
    const { notifications, markAsRead, loadMore, hasMore, isLoading } = useNotifyContext();
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const notificationId = entry.target.getAttribute('data-id');
                    const readAt = entry.target.getAttribute('data-read-at');

                    if (!readAt) {
                        markAsRead(notificationId);
                    }
                }
            });
        });

        const elements = document.querySelectorAll('.notification-item');
        elements.forEach(element => observerRef.current.observe(element));

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
        <ul className="w-full divide-y divide-slate-400/70">
            {notifications?.map((notification) => (
                <li
                    key={notification.id}
                    className="py-2 flex flex-col notification-item"
                    data-id={notification.id}
                    data-read-at={notification.readAt}
                >
                    <div className="self-end text-sm text-slate-500 italic data-[read-at]:bg-slate-600">{formatDate(notification.createdAt, "d MMM yyyy h:mm a")}</div>

                    <p className="flex items-center gap-2">
                        <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-slate-700">
                            <svg className="h-full w-full text-slate-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                        <span>
                            {parse(notification.content)}
                        </span>
                    </p>
                </li>
            ))}
            <li ref={loadMoreRef} className="py-2 flex justify-center">
                {isLoading && hasMore && <span>Cargando más notificaciones...</span>}
            </li>
        </ul>
    );
}
