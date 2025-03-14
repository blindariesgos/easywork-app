"use client";

import { useTranslation } from "react-i18next";
import SelectInput from "@/src/components/form/SelectInput";
import { Fragment, useState } from "react";
import useAppContext from "@/src/context/app";
import PolicySelectAsync from "@/src/components/form/PolicySelectAsync";
import ContactSelectAsync from "@/src/components/form/ContactSelectAsync";
import { useRouter } from "next/navigation";

const PolicySelectorValues = ({ register, setValue, errors, watch }) => {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const [documentType, setDocumentType] = useState("policy");
  const [contactNotFound, setContactNotFound] = useState(false);
  const router = useRouter();

  const handleChangePolicy = (policy) => {
    policy?.id && setValue("polizaId", policy?.id);
    policy?.type?.id && setValue("polizaTypeId", policy?.type?.id);
    policy?.company?.id && setValue("insuranceId", policy?.company?.id);
    if (policy?.contact?.id) {
      setValue("contactId", policy?.contact?.id);
      setContactNotFound(false);
    } else {
      setContactNotFound(true);
    }
    setDocumentType(policy?.renewal ? "renewal" : "policy");
    policy?.agenteIntermediario?.id &&
      setValue("agenteIntermediarioId", policy?.agenteIntermediario?.id);
    policy?.assignedBy?.id && setValue("assignedById", policy?.assignedBy?.id);
    policy?.subAgente?.id &&
      setValue("agenteRelacionadoId", policy?.subAgente?.id);
    policy?.observers?.length > 0 &&
      setValue("observerId", policy?.observers[0]?.id);
  };

  return (
    <Fragment>
      <PolicySelectAsync
        label={t("operations:managements:add:claim:poliza")}
        name={"policyId"}
        setSelectedOption={handleChangePolicy}
        error={errors?.policyId}
      />
      <SelectInput
        label={t("operations:managements:add:claim:company")}
        options={lists?.policies?.polizaCompanies}
        name="insuranceId"
        setValue={setValue}
        watch={watch}
        register={register}
        disabled
      />
      <SelectInput
        label={t("operations:managements:add:claim:branch")}
        options={lists?.policies?.polizaTypes}
        name="polizaTypeId"
        setValue={setValue}
        watch={watch}
        register={register}
        disabled
      />
      <div>
        <ContactSelectAsync
          label={t("operations:managements:add:schedule:client")}
          watch={watch}
          error={errors?.contactId}
          name="contactId"
          disabled
        />
        {contactNotFound && (
          <div>
            <p className="px-4 py-2 text-gray-700 text-xs">
              {"La póliza no tiene ningún cliente vinculado. "}
              <span
                className="text-primary underline cursor-pointer"
                onClick={() => {
                  const url =
                    documentType == "policy"
                      ? `/operations/policies/policy/${watch("polizaId")}?show=true&vinculate=true`
                      : `/operations/renovations/renovation/${watch("polizaId")}?show=true&vinculate=true`;
                  router.push(url);
                }}
              >
                {"Vincular un cliente"}
              </span>
            </p>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default PolicySelectorValues;
