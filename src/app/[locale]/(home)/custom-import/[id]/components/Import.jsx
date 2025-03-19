import { useTranslation } from "react-i18next";
import useAppContext from "@/src/context/app";
import Button from "@/src/components/form/Button";
import { useRouter } from "next/navigation";
import useCustomImportContext from "@/src/context/custom-import";
import { startBulkImportContacts, startBulkImportLeads } from "@/src/lib/apis";
import { useEffect, useState } from "react";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import { handleFrontError } from "@/src/utils/api/errors";

const urlImports = {
  contacts: (body) => startBulkImportContacts(body),
  leads: (body) => startBulkImportLeads(body),
};

const Import = ({ handleNext, type }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { info } = useCustomImportContext();
  const [isLoading, setIsLoading] = useState(true);

  const startImportation = async () => {
    const { otherData, items, ...rest } = info;
    const body = {
      ...rest,
      items: items?.map((item) => {
        return {
          ...item,
          ...otherData,
          fullName:
            item?.typeContact == "moral"
              ? item?.fullName
              : `${item?.name ?? ""} ${item?.lastname ?? ""}`,
        };
      }),
    };

    const response = await urlImports[type](body);

    if (response.hasError) {
      handleFrontError(response);
      return;
    }
    console.log({ body });
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      startImportation();
    }
  }, []);

  return (
    <div className="px-3 py-4">
      <div className="pr-4 pl-8 grid grid-cols-1 gap-y-4">
        {isLoading ? (
          <LoadingSpinnerSmall />
        ) : (
          <div className="flex gap-2">
            <p className="text-sm">{t(`import:${type}:import:subtitle3`)}</p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4">
        <div className="flex justify-center gap-2 pt-4 xl:col-span-2">
          <Button
            label={t("common:buttons:done")}
            className="px-2 py-1"
            buttonStyle="primary"
            onclick={() => router.back()}
          />
          <Button
            label={t("import:contacts:import:other")}
            className="px-2 py-1"
            buttonStyle="primary"
            onclick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default Import;
