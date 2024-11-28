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
import PolicySelectAsync from "@/src/components/form/PolicySelectAsync";
import TextInput from "@/src/components/form/TextInput";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VALIDATE_ALPHANUMERIC_REGEX } from "@/src/utils/regularExp";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import {
  addPolicyByPdf,
  addRenovationByPdf,
  getMetadataOfPdf,
} from "@/src/lib/apis";

const AddRenovations = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState();
  const [policy, setPolicy] = useState();
  const MAX_FILE_SIZE = 5000000; //5MB
  const { lists } = useAppContext();
  const [helpers, setHelpers] = useState({});

  const schema = yup.object().shape({
    policyId: yup.object().shape({}).required(t("common:validations:required")),
    rfc: yup
      .string()
      .matches(
        VALIDATE_ALPHANUMERIC_REGEX,
        t("common:validations:alphanumeric")
      )
      .required(t("common:validations:required")),
    version: yup.string().required(t("common:validations:required")),
    insuranceId: yup.string().required(t("common:validations:required")),
    typeId: yup.string().required(t("common:validations:required")),
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
    setLoading(true);
    reset({
      policyId: "",
      rfc: "",
      version: "",
      insuranceId: "",
      typeId: "",
    });

    const files = e.target.files;

    if (!files) {
      return;
    }

    const file = Array.from(files)[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("El archivo debe tener un tamaño menor a 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = {
        file: file,
        size: file.size,
        name: file.name,
        result: reader.result,
      };

      setPolicy(result);
    };

    const formData = new FormData();
    formData.append("poliza", file);
    const response = await getMetadataOfPdf("renovacion", formData);
    console.log("paso por aqui", { response });

    if (response?.hasError) {
      if (Array.isArray(response?.error?.message)) {
        response?.error?.message.forEach((message) => {
          toast.error(message);
        });
      } else {
        toast.error(
          response?.error?.message ??
            "Se ha producido un error cargar la poliza, inténtelo de nuevo mas tarde."
        );
      }
      setLoading(false);
      return;
    }

    if (response?.polizaOriginal) {
      setValue("policyId", response?.polizaOriginal?.id);
    } else {
      toast.error(
        "No tenemos la póliza original registrada en el sistema, por favor regístrela."
      );
      setLoading(false);
      return;
    }

    reader.readAsDataURL(file);

    const insurance = lists?.policies?.polizaCompanies.find(
      (x) => x.name == response.insurance
    );
    if (insurance) {
      setValue("insuranceId", insurance.id);
    }

    const type = lists?.policies?.polizaTypes.find(
      (x) => x.name == response.type
    );
    if (type) {
      setValue("typeId", type.id);
    }

    if (response.version) {
      setValue("version", response.version);
    }

    if (response?.client?.rfc) {
      setValue("rfc", response?.client?.rfc);
    }

    setLoading(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const { policyId, ...otherData } = data;
    const body = {
      ...otherData,
      polizaId: policyId.id,
      poliza: policy.file,
    };
    const formData = new FormData();
    for (const key in body) {
      if (body[key] === null || body[key] === undefined || body[key] === "") {
        continue;
      }
      if (body[key] instanceof File || body[key] instanceof Blob) {
        formData.append(key, body[key]);
      } else if (Array.isArray(body[key])) {
        formData.append(key, JSON.stringify(body[key]));
      } else {
        formData.append(key, body[key]?.toString() || "");
      }
    }

    try {
      const response = await addRenovationByPdf(formData);
      if (response?.hasError) {
        if (Array.isArray(response?.error?.message)) {
          response?.error?.message.forEach((message) => {
            toast.error(message);
          });
        } else {
          toast.error(
            response?.error?.message ??
              "Se ha producido un error cargar la Renovación, inténtelo de nuevo mas tarde."
          );
        }
        setLoading(false);

        return;
      }
      toast.success("Renovación cargada con exito");
      setIsOpen(false);
      handleReset();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.message ??
          "Se ha producido un error cargar la Renovación, inténtelo de nuevo mas tarde."
      );
    }
    setLoading(false);
  };
  const handleReset = () => {
    reset({
      policyId: "",
      rfc: "",
      version: "",
      insuranceId: "",
      typeId: "",
    });
    setPolicy();
  };

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <SliderOverShord openModal={isOpen}>
        <Tag
          onclick={() => {
            setIsOpen(false);
            handleReset();
          }}
          className="bg-easywork-main"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" bg-gray-600  px-6 py-8 h-screen rounded-l-[35px] w-[567px] shadow-[-3px_1px_15px_4px_#0000003d]">
            <div className="bg-gray-100 rounded-md p-2 max-h-[calc(100vh_-_4rem)] overflow-y-auto">
              <h4 className="text-2xl pb-4">
                {t("operations:managements:add:renovation:title")}
              </h4>
              <div className="bg-white rounded-md p-4 flex justify-between items-center">
                <p>{t("operations:managements:add:renovation:subtitle")}</p>
              </div>
              <div className="px-8 pt-4 grid grid-cols-1 gap-4">
                {policy && (
                  <Fragment>
                    <PolicySelectAsync
                      label={t("operations:managements:add:renovation:poliza")}
                      name={"policyId"}
                      setValue={setValue}
                      watch={watch}
                      // setSelectedOption={handleChangePolicy}
                      error={errors?.policyId}
                      register={register}
                    />
                    <TextInput
                      label={t("operations:managements:add:renovation:rfc")}
                      name="rfc"
                      error={errors?.rfc}
                      register={register}
                    />
                    <TextInput
                      label={t("operations:managements:add:renovation:version")}
                      name="version"
                      error={errors?.version}
                      register={register}
                    />

                    <SelectInput
                      label={t("operations:managements:add:renovation:company")}
                      options={lists?.policies?.polizaCompanies}
                      name="insuranceId"
                      setValue={setValue}
                      watch={watch}
                      register={register}
                      error={errors.insuranceId}
                    />
                    <SelectInput
                      label={t("operations:managements:add:renovation:branch")}
                      options={lists?.policies?.polizaTypes}
                      name="typeId"
                      setValue={setValue}
                      watch={watch}
                      register={register}
                      error={errors.typeId}
                    />
                  </Fragment>
                )}
                <div className="w-full">
                  <label
                    htmlFor="policy-file"
                    className="bg-primary rounded-md group cursor-pointer w-full p-2 mt-1 text-white block text-center hover:bg-easy-500 shadow-sm text-sm"
                  >
                    <p>Selecciona un PDF: GNP</p>
                    {policy && (
                      <div className="flex flex-col gap-2 justify-center items-center pt-2">
                        <div className="p-2 group-hover:bg-primary bg-easy-500 rounded-md">
                          <FiFileText className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-center text-xs text-white">
                          {policy.name}
                        </p>
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
                  <p className="text-xs italic text-center pt-2 text-gray-700">
                    próximamente:{" "}
                    <span className="font-bold">
                      Beta solo Chubb/Quálitas/AXA - Autos
                    </span>
                  </p>
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

export default AddRenovations;
