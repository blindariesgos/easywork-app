import SelectInput from "@/src/components/form/SelectInput";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import { useTranslation } from "react-i18next";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "@/src/components/form/TextInput";
import CheckboxInput from "@/src/components/form/CheckboxInput";
import FileInput from "@/src/components/form/FileInput";
import useAppContext from "@/src/context/app";
import Button from "@/src/components/form/Button";
import { Fragment } from "react";
import { useRouter } from "next/navigation";

const Import = ({ handleNext, handleBack }) => {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const router = useRouter();
  const schema = yup.object().shape({
    fields: yup.array().of(yup.object().shape({})),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  return (
    <div className="px-3 py-4">
      <p className="text-sm font-bold pb-4 ">
        {t("import:contacts:import:title")}
      </p>
      <div className="pr-4 pl-8 grid grid-cols-1 gap-y-4">
        <div className="flex gap-2">
          <p className="text-sm">{t("import:contacts:import:subtitle1")}</p>
          <p className="text-sm font-bold">5</p>
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
