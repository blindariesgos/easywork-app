"use client";
import LoaderSpinner from "../../../../../../../../components/LoaderSpinner";
import React, { useState } from "react";
import ActivityPanel from "../../../../../../../../components/contactActivities/ActivityPanel";
import { useTranslation } from "react-i18next";
import TextInput from "../../../../../../../../components/form/TextInput";
import SelectInput from "../../../../../../../../components/form/SelectInput";
import { DocumentTextIcon } from "@heroicons/react/20/solid";

export default function FormPolicy() {
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
    <div className="bg-gray-100 rounded-lg">
      {loading && <LoaderSpinner />}
      <div className="flex w-full">
        <form className="w-full flex p-4">
          <div className="flex flex-col sm:flex-row w-full rounded-lg">
            <div className="w-full md:w-2/5 h-[72vh] overflow-y-scroll">
              <div className=" h-full w-full">
                <div className="flex flex-col gap-y-3 pl-2 pr-4 w-full">
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:consult:form:responsible")}
                    name="responsible"
                    value={"Otilio Graterol"}
                    disabled
                  />
                  <SelectInput
                    label={t("contacts:edit:policies:consult:form:status")}
                    options={[]}
                    value={"test"}
                    name="status"
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:consult:form:prima")}
                    name="prima"
                    value={"$20.000"}
                    disabled
                  />
                  <SelectInput
                    label={t("contacts:edit:policies:consult:form:subBranch")}
                    options={[]}
                    value={"test"}
                    name="subBranch"
                    disabled
                  />
                  <SelectInput
                    label={t("contacts:edit:policies:consult:form:payment")}
                    options={[]}
                    value={"CXC"}
                    name="payment"
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:consult:form:frecuency")}
                    name="frecuency"
                    value={"Anual"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:consult:form:date")}
                    name="date"
                    value={"10/10/10"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:consult:form:number")}
                    name="number"
                    value={"2"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:consult:form:year")}
                    name="year"
                    value={"2024"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:consult:form:ot")}
                    name="ot"
                    value={"24111"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:consult:form:beneficiary")}
                    name="beneficiary"
                    value={"Yamile Rayme"}
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:consult:form:observations")}
                    name="observations"
                    value={"test"}
                    disabled
                    multiple
                  />
                  <div className="bg-white rounded-lg p-4 mb-20">
                    <div className="grid grid-cols-2 gap-4 mt-4">
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
                    <div className="mt-4">
                      <h1 className="text-xl font-medium">
                        {t("contacts:edit:policies:consult:form:annotations")}
                      </h1>
                      <p className="mt-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Iste quos ut officiis consectetur labore doloremque
                        dolorum similique magni sit? Ut ex dignissimos
                        repudiandae ratione eligendi cupiditate excepturi quia
                        praesentium vero?
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
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
              </div>
            </div>
            <ActivityPanel editing={false} />
          </div>
        </form>
      </div>
    </div>
  );
}
