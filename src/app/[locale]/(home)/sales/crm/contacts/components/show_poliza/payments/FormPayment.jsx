"use client";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "@/src/components/form/TextInput";
import SelectInput from "@/src/components/form/SelectInput";
import ActivityPanel from "@/src/components/activities/ActivityPanel";

export default function FormPayments() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

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
                      "contacts:edit:policies:payments:consult:responsible"
                    )}
                    name="responsible"
                    value={"Otilio Graterol"}
                    disabled
                  />
                  <SelectInput
                    label={t("contacts:edit:policies:payments:consult:status")}
                    options={[]}
                    value={"test"}
                    name="status"
                    disabled
                  />
                  <SelectInput
                    label={t(
                      "contacts:edit:policies:payments:consult:payment-method"
                    )}
                    options={[]}
                    value={"test"}
                    name="payment-method"
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t(
                      "contacts:edit:policies:payments:consult:date-start"
                    )}
                    name="dateStart"
                    value={"10/10/2024"}
                    disabled
                  />
                  <SelectInput
                    label={t(
                      "contacts:edit:policies:payments:consult:expiration"
                    )}
                    options={[]}
                    value={"10/10/2024"}
                    name="expiration"
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t("contacts:edit:policies:payments:consult:amount")}
                    name="amount"
                    value={"10.000,00"}
                    disabled
                  />
                  <SelectInput
                    label={t("contacts:edit:policies:payments:consult:coin")}
                    options={[]}
                    value={"Peso"}
                    name="coin"
                    disabled
                  />
                  <TextInput
                    type="text"
                    label={t(
                      "contacts:edit:policies:payments:consult:comments"
                    )}
                    name="comments"
                    value={"loremlorem pmflrmv"}
                    disabled
                    multiple
                  />
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
