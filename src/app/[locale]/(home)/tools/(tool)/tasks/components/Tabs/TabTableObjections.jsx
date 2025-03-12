"use client";
import { getTaskObjections, getTasks } from "@/src/lib/apis";
import { handleFrontError } from "@/src/utils/api/errors";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TabTableObjections({ info, total, objections }) {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden sm:rounded-lg p-2">
      <table className="min-w-full rounded-md bg-gray-100 table-auto">
        <thead className="text-xs bg-white drop-shadow-sm">
          <tr className="">
            <th
              scope="col"
              className={`py-3.5 text-xs font-normal text-black cursor-pointer rounded-s-xl`}
            >
              {t("tools:tasks:edit:table:date")}
            </th>
            <th
              scope="col"
              className={`py-3.5 text-xs font-normal text-black cursor-pointer`}
            >
              {t("tools:tasks:edit:table:created-by")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-100">
          {objections.length > 0 &&
            objections.map((obj, index) => (
              <tr key={index}>
                <td className="text-xs py-2 text-center">
                  {moment(obj.createdAt).format("DD-MM-YYYY hh:mm A")}
                </td>
                <td className="text-xs py-2 text-center">
                  <div className="flex gap-x-2 items-center justify-center">
                    <Image
                      className="h-6 w-6 rounded-full bg-zinc-200"
                      width={30}
                      height={30}
                      src={obj?.user?.avatar || "/img/avatar.svg"}
                      alt="avatar"
                    />
                    <div className="font-medium text-black">
                      {(obj?.user?.name ?? obj?.user?.profile)
                        ? `${obj?.user?.profile?.firstName} ${obj?.user?.profile?.lastName}`
                        : obj?.user?.username}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
