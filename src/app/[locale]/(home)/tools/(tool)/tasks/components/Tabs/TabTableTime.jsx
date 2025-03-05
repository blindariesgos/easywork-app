"use client";
import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputDate from "../../../../../../../../components/form/InputDate";
import { FaCalendarDays } from "react-icons/fa6";
import {
  addManualTracking,
  deleteTrackingEntry,
  getTaskTrackings,
  updateTrackingEntry,
} from "@/src/lib/apis";
import { handleFrontError } from "@/src/utils/api/errors";
import moment from "moment";
import Image from "next/image";
import { calculateElapsedTime } from "@/src/components/Timer";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import DeleteModal from "@/src/components/modals/DeleteItem";
import { useSWRConfig } from "swr";
import { PiWarningOctagonFill } from "react-icons/pi";

export default function TabTableTime({ info }) {
  const [showIcon, setShowIcon] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const { mutate } = useSWRConfig();
  const { t } = useTranslation();
  const schema = yup.object().shape({
    queues: yup.array().of(yup.object().shape({})),
  });

  const { register, control, setValue, watch } = useForm({
    defaultValues: {
      queues: [],
    },
    resolver: yupResolver(schema),
  });

  const getTrackings = async () => {
    setIsLoading(true);
    const response = await getTaskTrackings(info.id);
    if (response.hasError) {
      handleFrontError(response);
      setIsLoading(false);
      return;
    }
    const elements = response.map((x) => {
      const duration = calculateElapsedTime(
        x?.duration * 1000,
        moment().format()
      );
      return {
        ...x,
        ...duration,
      };
    });
    setValue("queues", elements);
    setIsLoading(false);
  };

  useEffect(() => {
    getTrackings();
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "queues",
  });

  const handleAdd = async (time) => {
    setIsLoading(true);
    if (time.isNew) {
      const body = {
        ...time,
        duration: +time.hours * 60 * 60 + +time.minutes * 60 + +time.seconds,
      };

      const response = await addManualTracking(info.id, body);
      if (response.hasError) {
        handleFrontError(response);
        setIsLoading(false);
        return;
      }
      getTrackings();
      mutate(`/tools/tasks/${info?.id}`);

      setIsLoading(false);
    } else {
      const body = {
        ...time,
        duration: +time.hours * 60 * 60 + +time.minutes * 60 + +time.seconds,
      };
      const response = await updateTrackingEntry(info.id, time.id, body);
      if (response.hasError) {
        handleFrontError(response);
        setIsLoading(false);
        return;
      }
      getTrackings();
      mutate(`/tools/tasks/${info?.id}`);
    }
  };

  const handleDeleteEntry = async () => {
    setIsLoading(true);
    const response = await deleteTrackingEntry(info.id, deleteId);
    if (response.hasError) {
      handleFrontError(response);
      setIsOpenDelete(false);
      setIsLoading(false);
      return;
    }
    mutate(`/tools/tasks/${info?.id}`);
    getTrackings();
    setIsLoading(false);
    setIsOpenDelete(false);
  };

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      <div className="relative sm:rounded-lg p-2">
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
              <th
                scope="col"
                className={`py-3.5 text-xs font-normal text-black cursor-pointer`}
              >
                {t("tools:tasks:edit:table:time")}
              </th>
              <th
                scope="col"
                className={`min-w-[12rem] py-3.5 text-xs font-normal text-black cursor-pointer rounded-e-xl`}
              >
                {t("tools:tasks:edit:table:comments")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {watch("queues") &&
              watch("queues").length > 0 &&
              watch("queues").map((time, index) => (
                <tr
                  key={index}
                  onMouseEnter={() =>
                    setShowIcon({ [index]: !showIcon[index] })
                  }
                >
                  <td className="text-xs py-2 text-center">
                    <div>
                      {time?.edit ? (
                        <Controller
                          render={({ field: { value } }) => {
                            return (
                              <InputDate
                                value={value}
                                onChange={(e) => {
                                  e &&
                                    setValue(
                                      `queues.${index}.startTime`,
                                      moment(e.target.value)
                                        .utc()
                                        //   .subtract(utcOffset, "minutes")
                                        .format()
                                    );
                                }}
                                icon={
                                  <FaCalendarDays className="h-3 w-3 text-primary pr-4" />
                                }
                                time
                              />
                            );
                          }}
                          name={`queues.${index}.startTime`}
                          control={control}
                          defaultValue=""
                        />
                      ) : (
                        <div>
                          {moment(time?.startTime).format("DD/MM/YYYY hh:mm a")}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-xs py-2 text-center">
                    {time?.user ? (
                      <div className="flex gap-x-2 items-center justify-left">
                        <Image
                          className="h-6 w-6 rounded-full bg-zinc-200"
                          width={30}
                          height={30}
                          src={time?.user?.avatar || "/img/avatar.svg"}
                          alt="avatar"
                        />
                        <div className="font-medium text-black">
                          {time?.user?.name ??
                            `${time?.user?.profile?.firstName} ${time?.user?.profile?.lastName}`}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="text-xs py-2 flex justify-center">
                    {time?.edit ? (
                      <div className="flex gap-1 items-center justify-center">
                        <input
                          {...register(`queues.${index}.hours`)}
                          className="h-full w-10 rounded-md focus:ring-0 focus:outline-none ring-0 text-[10px] outline-none"
                          type="number"
                        />
                        <p className="text-xs">h</p>
                        <input
                          {...register(`queues.${index}.minutes`)}
                          className="h-full w-10 rounded-md focus:ring-0 focus:outline-none ring-0 text-[10px] outline-none"
                          type="number"
                        />
                        <p className="text-xs">m</p>
                        <input
                          {...register(`queues.${index}.seconds`)}
                          className="h-full w-10 rounded-md focus:ring-0 focus:outline-none ring-0 text-[10px] outline-none"
                          type="number"
                        />
                        <p className="text-xs">s</p>
                      </div>
                    ) : (
                      <div className="relative">
                        {`${time.hours}:${time.minutes}:${time.seconds}`}
                        {time?.recordType == "manual" && (
                          <PiWarningOctagonFill
                            className="text-yellow-600 w-4 h-4 -right-5 top-0 absolute"
                            title="Este registro se ha introducido manualmente"
                          />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="text-xs py-2 text-center">
                    <div
                      className={`flex ${
                        time?.comment ? "justify-between" : "justify-end"
                      } items-center w-full gap-2`}
                    >
                      {time?.edit ? (
                        <div className="w-full">
                          <input
                            {...register(`queues.${index}.comment`)}
                            className="h-full w-full rounded-md focus:ring-0 focus:outline-none ring-0 text-[10px] outline-none"
                            type="text"
                            name={`queues.${index}.comment`}
                          />
                        </div>
                      ) : (
                        time?.comment
                      )}
                      {showIcon[index] && (
                        <div className="flex gap-2 items-center justify-end">
                          {time?.edit ? (
                            <CheckIcon
                              className="h-3 cursor-pointer text-gray-400"
                              onClick={() => {
                                handleAdd(time);
                              }}
                            />
                          ) : (
                            <PencilIcon
                              className="h-3 cursor-pointer text-gray-400"
                              onClick={() => {
                                watch("queues").length > 0 &&
                                  watch("queues").map((_, index) => {
                                    setValue(`queues.${index}.edit`, false);
                                  });
                                setValue(`queues.${index}.edit`, true);
                              }}
                            />
                          )}
                          <XMarkIcon
                            className="h-3 cursor-pointer text-gray-400"
                            onClick={() => {
                              if (time?.edit) {
                                getTrackings();
                              } else {
                                setDeleteId(time.id);
                                setIsOpenDelete(true);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            {!watch("queues")[watch("queues").length - 1]?.edit && (
              <tr className="">
                <td
                  colSpan={4}
                  className="flex gap-2 cursor-pointer text-xs items-center text-black font-medium py-2"
                  onClick={() => {
                    watch("queues").length > 0 &&
                      watch("queues").map((_, index) => {
                        setValue(`queues.${index}.edit`, false);
                      });
                    append({ edit: true, isNew: true });
                  }}
                >
                  <PlusIcon className="h-3 text-gray-400" />
                  <p>{t("tools:tasks:edit:table:add")}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <DeleteModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        handleClick={handleDeleteEntry}
        loading={isLoading}
        title="¿Está seguro de que desea eliminar esta entrada?"
      />
    </Fragment>
  );
}
