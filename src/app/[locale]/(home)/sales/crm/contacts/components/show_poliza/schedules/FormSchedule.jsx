"use client";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "@/src/components/form/TextInput";
import SelectInput from "@/src/components/form/SelectInput";
import { DocumentTextIcon } from "@heroicons/react/20/solid";
import ActivityPanel from "@/src/components/activities/ActivityPanel";

export default function FormSchedule() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const files = [
    {
      id: 1,
      title: "Cotización generada",
      name: "148511.doc",
    },
    {
      id: 2,
      title: "Cotización aprobada",
      name: "148511.doc",
    },
    {
      id: 3,
      title: "Propuesta comercial presentada",
      name: "148511.doc",
    },
  ];

  return (
    <div className="bg-gray-100 rounded-lg mt-4">
      {loading && <LoaderSpinner />}
      <div className="flex w-full">
        <form className="w-full flex p-4">
          <div className="flex flex-col sm:flex-row w-full rounded-lg">
            <div className="w-full md:w-2/5 h-[72vh] overflow-y-scroll">
              <div className=" h-full w-full mb-10">
                <div className="flex flex-col gap-y-3 pl-2 pr-4 w-full">
                  <TextInput
                    type="text"
                    label={t(
                      "contacts:edit:policies:schedules:consult:responsible"
                    )}
                    name="responsible"
                    value={"Otilio Graterol"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t(
                      "contacts:edit:policies:schedules:consult:date-start"
                    )}
                    name="dateStart"
                    value={"10/10/2024"}
                    disabled
                  />
                  <SelectInput
                    label={t(
                      "contacts:edit:policies:schedules:consult:schedule"
                    )}
                    options={[]}
                    value={"schedule"}
                    name="schedule"
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:schedules:consult:number")}
                    name="number"
                    value={"2018HI000691916"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t(
                      "contacts:edit:policies:schedules:consult:number-claim"
                    )}
                    name="number-claim"
                    value={"0118180256"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:schedules:consult:claim")}
                    name="claim"
                    value={"001122"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t(
                      "contacts:edit:policies:schedules:consult:folio-number"
                    )}
                    name="number-folio"
                    value={"SIGREE20218250056229"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t(
                      "contacts:edit:policies:schedules:consult:diagnosis"
                    )}
                    name="diagnosis"
                    value={"Diabetis tipo II"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t(
                      "contacts:edit:policies:schedules:consult:comments"
                    )}
                    name="comments"
                    value={"loremlorem pmflrmv"}
                    disabled
                    multiple
                  />
                  <div>
                    <div className="grid sm:grid-cols-3 grid-cols-2 items-center gap-4 mt-4 bg-white rounded-lg px-4 sm:py-10 py-4 justify-center">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-2 items-center"
                        >
                          <p className="font-medium text-sm">{file.title}</p>
                          <div>
                            <DocumentTextIcon className="h-10 w-10 text-primary" />
                          </div>
                          <p className="font-regular text-xs text-gray-200">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <TextInput
                    type="text"
                    label={t(
                      "contacts:edit:policies:schedules:consult:folio-number1"
                    )}
                    name="number-folio1"
                    value={"12311"}
                    disabled
                  />
                  <div className="grid sm:grid-cols-3 grid-cols-2 items-center gap-4 mt-4 bg-white rounded-lg px-4 sm:py-10 py-4 justify-center">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 items-center"
                      >
                        <p className="font-medium text-sm">{file.title}</p>
                        <div>
                          <DocumentTextIcon className="h-10 w-10 text-primary" />
                        </div>
                        <p className="font-regular text-xs text-gray-200">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <ActivityPanel editing={false} />
          </div>
        </form>
      </div>
    </div>
  );
}
