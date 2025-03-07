import { useTranslation } from "react-i18next";
import useAppContext from "@/src/context/app";
import Button from "@/src/components/form/Button";
import { useRouter } from "next/navigation";
import useCustomImportContext from "@/src/context/custom-import";
import { startBulkImportContacts } from "@/src/lib/apis";
import { useEffect } from "react";

const urlImports = {
  contacts: (body) => startBulkImportContacts(body),
};

const Import = ({ handleNext, type }) => {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const router = useRouter();
  const { info } = useCustomImportContext();

  const startImportation = async () => {
    console.log({ info });
    // const response = await urlImports[type]();
  };

  useEffect(() => {
    startImportation();
  }, []);

  return (
    <div className="px-3 py-4">
      <p className="text-sm font-bold pb-4 ">
        {t("import:contacts:import:title")}
      </p>
      <div className="pr-4 pl-8 grid grid-cols-1 gap-y-4">
        <div className="flex gap-2">
          <p className="text-sm">{t(`import:${type}:import:subtitle1`)}</p>
          <p className="text-sm font-bold">{info?.items?.length ?? 0}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-sm">{t("import:contacts:import:subtitle2")}</p>
          <p className="text-sm font-bold">0</p>
        </div>
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
