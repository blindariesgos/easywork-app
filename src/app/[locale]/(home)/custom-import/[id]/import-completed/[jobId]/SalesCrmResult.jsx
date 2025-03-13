"use client";
import Button from "@/src/components/form/Button";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import {
  getBulkImportContactsStatus,
  getBulkImportLeadsStatus,
} from "@/src/lib/apis";
import { handleFrontError } from "@/src/utils/api/errors";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegCircleCheck } from "react-icons/fa6";

const importStatusUrl = {
  leads: (jobId) => getBulkImportLeadsStatus(jobId),
  contacts: (jobId) => getBulkImportContactsStatus(jobId),
};

const SalesCrmResult = ({ crmType, jobId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState();
  const router = useRouter();

  const getStatus = async () => {
    setIsLoading(true);
    const response = await importStatusUrl[crmType](jobId);

    if (response.hasError) {
      handleFrontError(response);
      setIsLoading(false);
      return;
    }
    setResult(response);
    setIsLoading(false);
  };

  useEffect(() => {
    getStatus();
  }, []);
  return (
    <div className="p-4 rounded-md shadow-md bg-white">
      {isLoading && <LoaderSpinner />}
      <h2 className="font-semibold text-lg">{t(`import:${crmType}:result`)}</h2>
      {result && (
        <div className="p-4 grid grid-cols-1 gap-2">
          <p>
            {t("import:processed")}: {result.processed}
          </p>
          <p>
            {t("import:created")}: {result.created}
          </p>
          <p>
            {t("import:errors")}: {result.errors}
          </p>
          <p>
            {t("import:skipped")}: {result.skipped}
          </p>
          <p>
            {t("import:updated")}: {result.updated}
          </p>
          {result?.status == "COMPLETED" && (
            <div className="flex justify-center">
              <FaRegCircleCheck className="w-32 h-32 text-green-500" />
            </div>
          )}

          <div className="flex justify-center gap-3 items-center py-4">
            <Button
              buttonStyle="primary"
              className="px-2 py-1"
              label={"Ir a home"}
              onclick={() => router.push(`/home`)}
            />
            <Button
              buttonStyle="primary"
              className="px-2 py-1"
              label={"Importar otro documento"}
              onclick={() => router.push(`/custom-import/${crmType}`)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesCrmResult;
