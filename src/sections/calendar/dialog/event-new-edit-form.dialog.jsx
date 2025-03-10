import { XCircleIcon } from "@heroicons/react/20/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { format, formatISO } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import * as yup from "yup";
import clsx from "clsx";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  Transition,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

import ComboBoxMultiSelect from "@/src/components/form/ComboBoxMultiSelect";
import CRMMultipleSelectV2 from "@/src/components/form/CRMMultipleSelectV2";
import { SelectMenu } from "@/src/components/news/forms/select-menu";
import { ComboBox } from "@/src/components/news/combo-box";
import { fetcherPost } from "@/src/lib/api/fetcher";
import { endpoints } from "@/src/utils/endpoints";
import { EVENT_LOCATION } from "@/src/constants";
import { timezones } from "@/src/lib/timezones";
import useAppContext from "@/src/context/app";
import { useBoolean } from "@/src/hooks";

const eventSchema = yup.object().shape({
  name: yup.string().required(),
  startTime: yup.date().required(),
  endTime: yup
    .date()
    .required()
    .min(
      yup.ref("startTime"),
      "La fecha de fin debe ser mayor que la fecha de inicio"
    ),
  participants: yup.array().of(yup.object().shape({})),
  crm: yup.array().of(
    yup.object().shape({
      type: yup.string(),
      id: yup.string(),
    })
  ),
});

const defaultStartTime = new Date();
const defaultEndTime = new Date(defaultStartTime);
defaultEndTime.setHours(defaultStartTime.getHours() + 1);

export function EventNewEditFormDialog({
  isOpen,
  onClose,
  startTime,
  endTime,
}) {
  const [formLocalization, setFormLocalization] = useState(EVENT_LOCATION[0]);
  const [timezone, setTimezone] = useState(null);

  const { lists } = useAppContext();

  const { t } = useTranslation();

  const session = useSession();

  const isLoading = useBoolean();
  const allDay = useBoolean();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(eventSchema),
    defaultValues: {
      name: "",
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      participants: [],
      crm: [],
    },
  });

  const values = watch();

  useEffect(() => {
    if (isOpen) {
      setValue("startTime", format(startTime, "yyyy-MM-dd'T'HH:mm"));
      setValue("endTime", format(endTime, "yyyy-MM-dd'T'HH:mm"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime, isOpen, startTime]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        isLoading.onTrue();
        const payloadEvent = {
          name: data.name,
          startTime: formatISO(data.startTime),
          endTime: formatISO(data.endTime),
          participantsIds: data.participants.map((part) => part.id ?? ""),
          localization: formLocalization?.name ?? "",
          crm: data.crm.map((crm) => ({
            id: crm.id,
            type: crm.type,
          })),
          //
          important: false,
          private: false,
          color: "#141052",
          description: "<p></p>",
          availability: "Ocupado",
        };
        await fetcherPost(endpoints.calendar.create, payloadEvent);
        toast.success("Evento creado con éxito.");
        handleClose();
      } catch (error) {
        toast.error("Se ha producido un error, inténtelo de nuevo más tarde.");
      } finally {
        isLoading.onFalse();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formLocalization.name, timezone, onClose]
  );

  const renderForm = (
    <>
      {/* Input name */}
      <div className="px-3 pb-2 flex flex-row items-center w-full bg-transparent">
        <input
          type="text"
          name="name"
          id="event-name"
          placeholder={t("tools:calendar:new-event:name")}
          className={clsx(
            "block w-full px-3 border-0 px-1 text-gray-900 rounded-xl focus:ring-0 placeholder:text-gray-400 text-base",
            {
              "placeholder:text-red-600": errors?.name && errors?.name?.message,
            }
          )}
          {...register("name")}
          autoComplete="false"
        />
        <XCircleIcon
          className="w-8 h-8 ml-2 text-red-500 hover:text-red-700 cursor-pointer"
          onClick={handleClose}
        />
      </div>

      {/* Input dates */}
      <div className="gap-y-2 gap-x-0 px-4 sm:grid sm:grid-cols-3 sm:gap-y-0 sm:px-6 sm:py-5 transition-all duration-500">
        <div className="my-auto">
          <label
            htmlFor="project-description"
            className="block text-sm font-medium leading-6 text-gray-900 my-auto"
          >
            {t("tools:calendar:new-event:hour")}
          </label>
        </div>
        <div className="sm:col-span-2 flex flex-col">
          <div className="grid sm:grid-cols-1  md:grid-cols-3 gap-2">
            <div className="w-full">
              <label
                htmlFor="startTime"
                className="block text-xs font-light leading-6 text-gray-900"
              >
                Fecha y hora inicio del evento
              </label>
              <input
                type={allDay.value ? "date" : "datetime-local"}
                name="startTime"
                id="startTime"
                className={clsx(
                  "block rounded-md border py-1.5 text-gray-900 w-full shadow-sm border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                  { "border-red-600": errors && errors.startTime }
                )}
                {...register("startTime")}
              />
              {errors && errors?.startTime && (
                <p className="mt-1 text-xs text-red-600">
                  {errors?.startTime?.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="endTime"
                className="block text-xs font-light leading-6 text-gray-900"
              >
                Fecha y hora fin del evento
              </label>
              <input
                type={allDay.value ? "date" : "datetime-local"}
                name="endTime"
                id="endTime"
                className={clsx(
                  "block rounded-md border py-1.5 text-gray-900 w-full shadow-sm border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                  { "border-red-600": errors && errors.endTime }
                )}
                {...register("endTime")}
              />
              {errors && errors?.endTime && (
                <p className="mt-1 text-xs text-red-600">
                  {errors?.endTime?.message}
                </p>
              )}
            </div>
            <div className="relative flex items-start items-center w-full">
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="all-day"
                  aria-describedby="all-day-description"
                  name="all-day"
                  type="checkbox"
                  checked={allDay.value}
                  onChange={allDay.onToggle}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="all-day"
                  className="font-light text-gray-900 text-sm leading-6"
                >
                  {t("tools:calendar:new-event:all-day")}
                </label>
              </div>
            </div>
          </div>
          <div>
            <Disclosure>
              <DisclosureButton className="py-2 text-primary underline decoration-dashed underline-offset-4 text-xs hover:decoration-solid">
                {t("tools:calendar:new-event:time-zone")}
              </DisclosureButton>
              <Transition
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <DisclosurePanel className="text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ComboBox
                    data={timezones}
                    selected={timezone}
                    setSelected={setTimezone}
                  />
                </DisclosurePanel>
              </Transition>
            </Disclosure>
          </div>
        </div>
      </div>

      {/* Input participants */}
      <div className="space-y-1 pt-3 px-4 grid sm:grid-cols-3 flex items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
        <div>
          <h3 className="text-sm font-medium leading-6 text-gray-900">
            {t("tools:calendar:new-event:wizards")}
          </h3>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col gap-x-2">
            <Controller
              name="participants"
              control={control}
              render={({ field }) => (
                <ComboBoxMultiSelect
                  {...field}
                  options={lists?.users || []}
                  getValues={getValues}
                  setValue={setValue}
                  name="participants"
                  error={errors.participants}
                  showAvatar
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Input CRM */}
      <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 flex items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
        <p className="text-sm text-left w-full md:w-36">
          {t("tools:tasks:new:crm")}
        </p>
        <div className="w-full col-span-2">
          <CRMMultipleSelectV2
            watch={watch}
            setValue={setValue}
            name="crm"
            error={errors.crm}
          />
        </div>
      </div>

      {/* input location */}
      <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 flex items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
        <div>
          <h3 className="text-sm font-medium leading-6 text-gray-900">
            {t("tools:calendar:new-event:ubication")}
          </h3>
        </div>
        <div className="sm:col-span-2">
          <div className="flex">
            <SelectMenu
              data={EVENT_LOCATION}
              value={formLocalization}
              setValue={setFormLocalization}
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderAction = (
    <div className="flex justify-center">
      <button
        type="button"
        className="mr-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
        onClick={handleClose}
      >
        {t("common:buttons:cancel")}
      </button>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        {t("common:buttons:save")}
      </button>
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      as="div"
      className="relative z-50 focus:outline-none"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel
          transition
          className="w-4/5 md:w-3/5 rounded-[15px] bg-zinc-100 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col py-5 px-3 relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {renderForm}

            {renderAction}
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
