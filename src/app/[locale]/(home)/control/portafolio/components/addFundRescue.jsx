"use client";

import { useTranslation } from "react-i18next";
import SliderOverShord from "@/src/components/SliderOverShort";
import Button from "@/src/components/form/Button";
import Tag from "@/src/components/Tag";
import SelectInput from "@/src/components/form/SelectInput";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";
import { FiFileText } from "react-icons/fi";
import TextInput from "@/src/components/form/TextInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VALIDATE_ALPHANUMERIC_REGEX } from "@/src/utils/regularExp";
import { fundrescueTypes, MAX_FILE_SIZE } from "@/src/utils/constants";
import PolicySelectorValues from "./PolicySelectorValues";
import UserSelectAsync from "@/src/components/form/UserSelectAsync";
import IntermediarySelectAsync from "@/src/components/form/IntermediarySelectAsync";
import AgentSelectAsync from "@/src/components/form/AgentSelectAsync";
import { getFormatFormData } from "@/src/utils/formatters";
import { addFundRescue } from "@/src/lib/apis";
import LoaderSpinner from "@/src/components/LoaderSpinner";

const AddFundRescue = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    polizaId: yup.string().required(t("common:validations:required")),
    ot: yup
      .string()
      .matches(
        VALIDATE_ALPHANUMERIC_REGEX,
        t("common:validations:alphanumeric")
      )
      .required(t("common:validations:required")),
    sigre: yup.string().required(t("common:validations:required")),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    const body = {
      ...data,
      file: file.file,
      status: "captura_documentos",
    };

    const formData = getFormatFormData(body);
    const response = await addFundRescue(formData);

    if (response.hasError) {
      handleFrontError(response);
      setIsLoading(false);
      return;
    }

    toast.success("Rescate de fondo agregado con éxito");
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleReset = () => {
    reset();
    setFile();
  };

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
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
            <div className="bg-gray-100 rounded-md p-2 overflow-y-auto max-h-[calc(100vh_-_4rem)]">
              <h4 className="text-2xl pb-4">
                {t("operations:managements:add:fundrescue:title")}
              </h4>
              <div className="bg-white rounded-md p-4 flex justify-between items-center">
                <p>{t("operations:managements:add:fundrescue:subtitle")}</p>
              </div>
              <div className="px-8 pt-4 grid grid-cols-1 gap-4">
                <PolicySelectorValues
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  watch={watch}
                />
                <SelectInput
                  label={t("operations:managements:add:fundrescue:type")}
                  options={fundrescueTypes}
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
                <UserSelectAsync
                  label={t("operations:programations:general:responsible")}
                  name="assignedById"
                  setValue={setValue}
                  watch={watch}
                  error={errors.assignedById}
                />
                <IntermediarySelectAsync
                  label={t("operations:programations:general:intermediary")}
                  name="agenteIntermediarioId"
                  setValue={setValue}
                  watch={watch}
                  error={errors.agenteIntermediarioId}
                />
                <AgentSelectAsync
                  label={t("operations:programations:general:sub-agent")}
                  name="agenteRelacionadoId"
                  error={errors.agenteRelacionadoId}
                  setValue={setValue}
                  watch={watch}
                />
                <UserSelectAsync
                  label={t("operations:programations:general:observer")}
                  name="observerId"
                  setValue={setValue}
                  watch={watch}
                  error={errors.observerId}
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
    </Fragment>
  );
};

export default AddFundRescue;
