"use client";
import { useNotifyContext } from "@/src/context/notify";
import { formatDate } from "@/src/utils/getFormatDate";
import parse from "html-react-parser";

export default function NotifyList() {
      const { notifications } = useNotifyContext();

    return (
        <ul className="w-full divide-y">
            {notifications?.map((notification) => (
                <li key={notification.id} className="py-2 flex flex-col">
                    <div className="self-end text-sm text-gray-700">{formatDate(notification.createdAt, "d MMM yyyy h:mm a")}</div>
                    <p>{parse(notification.content)}</p>
                </li>
            ))}
        </ul>
    );
}