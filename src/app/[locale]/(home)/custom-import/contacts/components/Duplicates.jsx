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

const Duplicates = ({ handleNext, handleBack }) => {
  const { t } = useTranslation();
  const { lists } = useAppContext();
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
        {t("import:contacts:duplicates:title")}
      </p>
      <div className=" px-4">
        <p className="text-sm  pb-4 ">
          {t("import:contacts:duplicates:subtitle-2")}
        </p>
        <div className="flex items-center justify-start gap-4 pb-4">
          <CheckboxInput
            name="columns-emply4"
            label={t("import:contacts:duplicates:permit")}
            setValue={setValue}
          />
          <CheckboxInput
            name="columns-emply5"
            label={t("import:contacts:duplicates:replace")}
            setValue={setValue}
          />
          <CheckboxInput
            name="columns-emply6"
            label={t("import:contacts:duplicates:join")}
            setValue={setValue}
          />
          <CheckboxInput
            name="columns-emply7"
            label={t("import:contacts:duplicates:omit")}
            setValue={setValue}
          />
        </div>
        <p className="px-2 py-3 bg-[#FCF8DF] border border-[#D9BB00] rounded-[5px] inline-block">
          {t("import:contacts:duplicates:warning")}
        </p>
      </div>
      <div className="py-4">
        <p className="text-sm font-bold py-4 rounded-[10px] bg-[#EFEFEF] px-2">
          {t("import:contacts:duplicates:subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-sm flex items-center justify-end text-right">
          {t(`import:contacts:duplicates:fullName`)}:
        </div>
        <div className="col-span-3">
          <CheckboxInput name="columns-emply1" setValue={setValue} />
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t(`import:contacts:duplicates:phone`)}:
        </div>
        <div className="col-span-3">
          <CheckboxInput name="columns-emply2" setValue={setValue} />
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t(`import:contacts:duplicates:email`)}:
        </div>
        <div className="col-span-3">
          <CheckboxInput name="columns-emply3" setValue={setValue} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4">
        <div className="flex justify-center gap-2 pt-4 xl:col-span-2">
          <Button
            label={t("common:buttons:back")}
            className="px-2 py-1"
            buttonStyle="primary"
            onclick={handleBack}
          />
          <Button
            label={t("common:buttons:next")}
            className="px-2 py-1"
            buttonStyle="primary"
            onclick={handleNext}
          />
          <Button
            label={t("common:buttons:cancel")}
            className="px-2 py-1"
            buttonStyle="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default Duplicates;
