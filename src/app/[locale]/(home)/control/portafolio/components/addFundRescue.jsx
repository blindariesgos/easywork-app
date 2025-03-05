"use client";

import { useTranslation } from "react-i18next";
import SliderOverShord from "@/src/components/SliderOverShort";
import Button from "@/src/components/form/Button";
import Tag from "@/src/components/Tag";
import SelectInput from "@/src/components/form/SelectInput";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiFileText } from "react-icons/fi";
import useAppContext from "@/src/context/app";
import SelectSubAgent from "@/src/components/form/SelectSubAgent/SelectSubAgent";
import PolicySelectAsync from "@/src/components/form/PolicySelectAsync";
import TextInput from "@/src/components/form/TextInput";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VALIDATE_ALPHANUMERIC_REGEX } from "@/src/utils/regularExp";
import { MAX_FILE_SIZE } from "@/src/utils/constants";

const AddFundRescue = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState();
  const { lists } = useAppContext();

  const schema = yup.object().shape({
    policyId: yup.string().required(t("common:validations:required")),
    ot: yup
      .string()
      .matches(
        VALIDATE_ALPHANUMERIC_REGEX,
        t("common:validations:alphanumeric")
      )
      .required(t("common:validations:required")),
    sigre: yup.string().required(t("common:validations:required")),
    procedure: yup.string().required(t("common:validations:required")),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleChangeFile = async (e) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const file = Array.from(files)[0];

    if (file.size > MAX_FILE_SIZE) {
      toast.error("El archivo debe tener un tamaño menor a 10MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = {
        file: reader.result,
        size: file.size,
        name: file.name,
      };

      setFile(result);
    };
    reader.readAsDataURL(file);
  };

  const handleChangePolicy = (policy) => {
    policy?.company?.id && setValue("company", policy?.company?.id);
    policy?.type?.id && setValue("branch", policy?.type?.id);
  };

  const onSubmit = (data) => {
    setIsOpen(false);
  };

  const handleReset = () => {
    reset({
      ot: "",
      policyId: "",
      sigre: "",
      type: "",
      company: "",
      branch: "",
    });
  };

  return (
    <SliderOverShord openModal={isOpen}>
      <Tag
        onclick={() => {
          handleReset();
          setIsOpen(false);
        }}
        className="bg-easywork-main"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" bg-gray-600 px-6 py-8 h-screen rounded-l-[35px] w-[567px] shadow-[-3px_1px_15px_4px_#0000003d]">
          <div className="bg-gray-100 rounded-md p-2">
            <h4 className="text-2xl pb-4">
              {t("operations:managements:add:fundrescue:title")}
            </h4>
            <div className="bg-white rounded-md p-4 flex justify-between items-center">
              <p>{t("operations:managements:add:fundrescue:subtitle")}</p>
            </div>
            <div className="px-8 pt-4 grid grid-cols-1 gap-4">
              <PolicySelectAsync
                label={t("operations:managements:add:fundrescue:poliza")}
                name={"policyId"}
                setValue={setValue}
                watch={watch}
                setSelectedOption={handleChangePolicy}
                error={errors?.policyId}
                register={register}
              />
              <SelectInput
                label={t("operations:managements:add:fundrescue:type")}
                options={[
                  {
                    id: "Liquidación plan de inversión",
                    name: "Liquidación plan de inversión",
                  },
                  {
                    id: "Cancelación total",
                    name: "Cancelación total",
                  },
                  {
                    id: "Muerte o fallecimiento",
                    name: "Muerte o fallecimiento",
                  },
                ]}
                name="type"
                error={errors?.type}
                register={register}
              />
              <TextInput
                label={t("operations:managements:add:fundrescue:ot")}
                name="ot"
                error={errors?.ot}
                register={register}
              />
              <TextInput
                label={t("operations:managements:add:fundrescue:folio-sigre")}
                name="sigre"
                register={register}
                error={errors?.sigre}
              />

              <div className="w-full">
                <label
                  htmlFor="policy-file"
                  className="bg-primary rounded-md cursor-pointer w-full p-2 mt-1 text-white block text-center hover:bg-easy-500 shadow-sm text-sm"
                >
                  <p>{t("operations:managements:add:fundrescue:button")}</p>
                  {file && (
                    <div className="flex flex-col gap-2 justify-center items-center pt-2">
                      <div className="p-10 bg-easy-500 rounded-md">
                        <FiFileText className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-center text-white">{file.name}</p>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  name="policy-file"
                  id="policy-file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleChangeFile}
                />
              </div>
              <div className="w-full flex justify-center gap-4 py-4">
                <Button
                  className="px-4 py-2"
                  buttonStyle="primary"
                  label="Guardar"
                  type="submit"
                />
                <Button
                  className="px-4 py-2"
                  buttonStyle="secondary"
                  label="Cancelar"
                  onclick={() => {
                    handleReset();
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </SliderOverShord>
  );
};

export default AddFundRescue;
