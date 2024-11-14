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

const AddRefunds = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState();
  const MAX_FILE_SIZE = 5000000; //5MB
  const { lists } = useAppContext();

  const schema = yup.object().shape({
    policyId: yup.object().shape({}).required(t("common:validations:required")),
    ot: yup
      .string()
      .matches(
        VALIDATE_ALPHANUMERIC_REGEX,
        t("common:validations:alphanumeric")
      )
      .required(t("common:validations:required")),
    sigre: yup.string().required(t("common:validations:required")),
    type: yup.string().required(t("common:validations:required")),
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
      toast.error("El archivo debe tener un tamaño menor a 5MB.");
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
    console.log({ data });
    setIsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SliderOverShord openModal={isOpen}>
        <Tag
          onclick={() => {
            setIsOpen(false);
            reset({
              ot: "",
              policyId: "",
              sigre: "",
              type: "",
              affeccion: "",
              company: "",
              branch: "",
            });
          }}
          className="bg-easywork-main"
        />
        <div className=" bg-gray-600  px-6 py-8 h-screen rounded-l-[35px] w-[567px] shadow-[-3px_1px_15px_4px_#0000003d]">
          <div className="bg-gray-100 rounded-md p-2 max-h-[calc(100vh_-_4rem)] overflow-y-auto">
            <h4 className="text-2xl pb-4">
              {t("operations:managements:add:refund:title")}
            </h4>
            <div className="bg-white rounded-md p-4 flex justify-between items-center">
              <p>{t("operations:managements:add:refund:subtitle")}</p>
            </div>
            <div className="px-8 pt-4 grid grid-cols-1 gap-4">
              <PolicySelectAsync
                label={t("operations:managements:add:refund:poliza")}
                name={"policyId"}
                setValue={setValue}
                watch={watch}
                setSelectedOption={handleChangePolicy}
                error={errors?.policyId}
                register={register}
              />
              <SelectInput
                label={t("operations:managements:add:refund:type")}
                options={[
                  {
                    id: "inicial",
                    name: "Inicial",
                  },
                  {
                    id: "subsecuente",
                    name: "Subsecuente",
                  },
                ]}
                name="type"
                error={errors?.procedure}
                register={register}
              />
              <TextInput
                label={t("operations:managements:add:refund:ot")}
                name="ot"
                error={errors?.ot}
                register={register}
              />
              <TextInput
                label={t("operations:managements:add:refund:folio-sigre")}
                name="sigre"
                register={register}
                error={errors?.sigre}
              />
              <TextInput
                label={t("operations:managements:add:refund:affeccion")}
                name="affeccion"
                error={errors?.affeccion}
                register={register}
                multiple
                rows={3}
              />

              <SelectInput
                label={t("operations:managements:add:refund:company")}
                options={lists?.policies?.polizaCompanies}
                name="company"
                setValue={setValue}
                watch={watch}
                register={register}
              />
              <SelectInput
                label={t("operations:managements:add:refund:branch")}
                options={lists?.policies?.polizaTypes}
                name="branch"
                setValue={setValue}
                watch={watch}
                register={register}
              />
              {/* <SelectSubAgent
              label={t("control:portafolio:control:form:subAgente")}
              name="subAgenteId"
              register={register}
              setValue={setValue}
              watch={watch}
            />
            <SelectInput
              label={t("control:portafolio:control:form:responsible")}
              options={lists?.users ?? []}
            /> */}
              {/* <SelectInput
              label={t("control:portafolio:control:form:category")}
              options={[
                {
                  name: "AHORRO",
                  id: "physical",
                },
                {
                  name: "ALPHA MEDICAL INTEGRO",
                  id: "moral7",
                },
                {
                  name: "ALTA ASEGURADORA",
                  id: "moral6",
                },
                {
                  name: "ALTA RECIEN NACIDO",
                  id: "moral5",
                },
                {
                  name: "AMPLIA",
                  id: "moral4",
                },
                {
                  name: "C.F.P",
                  id: "moral3",
                },
                {
                  name: "C.F.P A MENSUAL",
                  id: "mora2l",
                },
                {
                  name: "C.F.P A SEMESTRAL",
                  id: "moral1",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            
            <SelectInput
              label={t("control:portafolio:control:form:health-branch")}
              options={[
                {
                  name: "Otros",
                  id: "physical",
                },
                {
                  name: "ACCIDENTES",
                  id: "moral",
                },
                {
                  name: "DENTAL",
                  id: "morale",
                },
                {
                  name: "EJECUTIVOS",
                  id: "moralw",
                },
              ]}
              placeholder="- Seleccionar -"
            /> */}
              <div className="w-full">
                <label
                  htmlFor="policy-file"
                  className="bg-primary rounded-md cursor-pointer w-full p-2 mt-1 text-white block text-center hover:bg-easy-500 shadow-sm text-sm"
                >
                  <p>{t("operations:managements:add:refund:button")}</p>
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
                    reset({
                      ot: "",
                      policyId: "",
                      sigre: "",
                      type: "",
                      affeccion: "",
                      company: "",
                      branch: "",
                    });
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </SliderOverShord>
    </form>
  );
};

export default AddRefunds;
