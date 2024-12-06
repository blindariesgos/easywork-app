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
import ContactSelectAsync from "@/src/components/form/ContactSelectAsync";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  addLeadDocument,
  addPolicyByPdf,
  getMetadataOfPdf,
} from "@/src/lib/apis";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import InputCurrency from "@/src/components/form/InputCurrency";
import InputDate from "@/src/components/form/InputDate";
import TextInput from "@/src/components/form/TextInput";

const AddPolicy = ({ isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [policy, setPolicy] = useState();
  const MAX_FILE_SIZE = 5000000; //5MB
  const { lists } = useAppContext();
  const [helpers, setHelpers] = useState({});

  const schema = yup.object().shape({
    contact: yup.object().shape({}),
    // .required(t("common:validations:required"))
    // typePerson: yup.string().required(t("common:validations:required")),
    insuranceId: yup.string(),
    // .required(t("common:validations:required"))
    typeId: yup.string(),
    // .required(t("common:validations:required"))
    responsibleId: yup.string(),
    // .required(t("common:validations:required"))
    subAgente: yup.object().shape({}),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleChangeFile = async (e) => {
    setLoading(true);
    const files = e.target.files;

    if (!files) {
      return;
    }

    const file = Array.from(files)[0];

    if (!file) {
      return;
    }

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
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("poliza", file);
    const response = await getMetadataOfPdf("nueva", formData);

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

    setLoading(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const { contact, subAgente, ...otherData } = data;
    const body = {
      ...otherData,
      poliza: policy.file,
      clientId: contact.id,
      subAgentId: subAgente.id,
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
      const response = await addPolicyByPdf(formData);
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
      toast.success("Poliza cargada con exito");
      setIsOpen(false);
      handleReset();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.message ??
          "Se ha producido un error cargar la poliza, inténtelo de nuevo mas tarde."
      );
    }
    setLoading(false);
  };

  const handleReset = () => {
    reset({
      contact: "",
      subAgente: "",
      responsibleId: "",
      insuranceId: "",
      typeId: "",
    });
    setPolicy();
    setHelpers({});
    reset();
  };

  return (
    <Fragment>
      <SliderOverShord openModal={isOpen}>
        {loading && <LoaderSpinner />}
        <Tag
          onclick={() => {
            handleReset();
            setIsOpen(false);
          }}
          className="bg-easywork-main"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" bg-gray-600 px-6 py-8 h-screen rounded-l-[35px] w-[567px] shadow-[-3px_1px_15px_4px_#0000003d] overflow-y-auto">
            <div className="bg-gray-100 rounded-md p-2">
              <div className="bg-white rounded-md p-4 flex justify-between items-center">
                <p>Información general de la póliza</p>
                {/* <RiPencilFill className="w-4 h-4 text-primary" /> */}
              </div>
              <div className="px-8 pt-4 grid grid-cols-1 gap-4">
                <div className="w-full">
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900`}
                  >
                    Cargar póliza pagada
                  </label>
                  <label
                    htmlFor="policy-file"
                    className="bg-primary rounded-md group cursor-pointer w-full p-2 mt-1 text-white block text-center hover:bg-easy-500 shadow-sm text-sm"
                  >
                    <p>Leer datos de la póliza</p>
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
                    <span className="font-bold">Selecciona un PDF: </span>
                    (Versión Beta para Chubb/Quálitas/GNP/AXA - en el Ramo
                    Autos)
                  </p>
                </div>
                <SelectInput
                  label={t("control:portafolio:control:form:typePerson")}
                  options={[
                    {
                      name: "Física",
                      id: "fisica",
                    },
                    {
                      name: "Moral",
                      id: "moral",
                    },
                  ]}
                  name="typePerson"
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={t("operations:policies:general:payment-frequency")}
                  name="frecuenciaCobroId"
                  options={lists?.policies?.polizaFrecuenciasPago ?? []}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={t("operations:policies:general:intermediary")}
                  name="agenteIntermediarioId"
                  options={lists?.policies?.agentesIntermediarios ?? []}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />

                <SelectDropdown
                  label={t("operations:policies:general:responsible")}
                  name="assignedById"
                  options={lists?.users}
                  register={register}
                  error={!watch("assignedById") && errors.assignedById}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={"Observador"}
                  options={lists?.users ?? []}
                  name="observerId"
                  error={errors?.observerId}
                  setValue={setValue}
                />
                <ContactSelectAsync
                  label={t("control:portafolio:control:form:contact")}
                  name={"contact"}
                  setValue={setValue}
                  watch={watch}
                  error={errors?.contact}
                  helperText={helpers?.contact}
                />
                <TextInput
                  type="text"
                  label={"Número de póliza"}
                  name="poliza"
                  register={register}
                />
                <Controller
                  render={({ field: { value, onChange, ref, onBlur } }) => {
                    return (
                      <InputDate
                        label={t("operations:policies:general:init-date")}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={errors.vigenciaDesde}
                      />
                    );
                  }}
                  name="vigenciaDesde"
                  control={control}
                  defaultValue=""
                />
                <Controller
                  render={({ field: { value, onChange, ref, onBlur } }) => {
                    return (
                      <InputDate
                        label={t("operations:policies:general:expiration")}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={errors.vigenciaHasta}
                      />
                    );
                  }}
                  name="vigenciaHasta"
                  control={control}
                  defaultValue=""
                />
                <SelectInput
                  label={"Aseguradora"}
                  options={lists?.policies?.polizaCompanies}
                  name="insuranceId"
                  setValue={setValue}
                  watch={watch}
                  register={register}
                  error={errors.insuranceId}
                />
                <SelectInput
                  label={t("operations:policies:general:type")}
                  name="typeId"
                  options={lists?.policies?.polizaTypes ?? []}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={"Moneda"}
                  options={lists?.policies?.currencies ?? []}
                  name="currencyId"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={t("operations:policies:general:payment-method")}
                  name="formaCobroId"
                  options={lists?.policies?.polizaFormasCobro ?? []}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <InputCurrency
                  type="text"
                  label={t("operations:policies:general:primaNeta")}
                  setValue={setValue}
                  name="primaNeta"
                  // defaultValue={data?.primaNeta?.toFixed(2) ?? null}
                  defaultValue={null}
                  prefix={
                    lists?.policies?.currencies?.find(
                      (x) => x.id == watch("currencyId")
                    )?.symbol ?? ""
                  }
                />
                <InputCurrency
                  type="text"
                  label={t("operations:policies:general:recargoFraccionado")}
                  setValue={setValue}
                  name="recargoFraccionado"
                  // defaultValue={
                  //   data?.recargoFraccionado?.toFixed(2) ?? null
                  // }
                  defaultValue={null}
                  prefix={
                    lists?.policies?.currencies?.find(
                      (x) => x.id == watch("currencyId")
                    )?.symbol ?? ""
                  }
                />
                <InputCurrency
                  type="text"
                  label={t("operations:policies:general:derechoPoliza")}
                  setValue={setValue}
                  name="derechoPoliza"
                  // defaultValue={data?.derechoPoliza?.toFixed(2) ?? null}
                  defaultValue={null}
                  prefix={
                    lists?.policies?.currencies?.find(
                      (x) => x.id == watch("currencyId")
                    )?.symbol ?? ""
                  }
                />
                <InputCurrency
                  type="text"
                  label={t("operations:policies:general:iva")}
                  setValue={setValue}
                  name="iva"
                  // defaultValue={data?.iva?.toFixed(2) ?? null}
                  defaultValue={null}
                  prefix={
                    lists?.policies?.currencies?.find(
                      (x) => x.id == watch("currencyId")
                    )?.symbol ?? ""
                  }
                />
                <InputCurrency
                  type="text"
                  label={t("operations:policies:general:importePagar")}
                  setValue={setValue}
                  name="importePagar"
                  // defaultValue={data?.importePagar?.toFixed(2) ?? null}
                  defaultValue={null}
                  prefix={
                    lists?.policies?.currencies?.find(
                      (x) => x.id == watch("currencyId")
                    )?.symbol ?? ""
                  }
                />
                {/* <SelectSubAgent
                  label={t("control:portafolio:control:form:subAgente")}
                  name="subAgente"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  error={errors?.subAgente}
                  helperText={helpers?.subAgent}
                /> */}

                {/* {policy && ( */}
                {/* <Fragment> */}

                {/* {data?.type?.name === "GMM" && (
                  <SelectInput
                    label={t("operations:policies:general:coverage")}
                    options={[
                      {
                        id: "Nacional",
                        name: "Nacional",
                      },
                      {
                        id: "Internacional",
                        name: "Internacional",
                      },
                    ]}
                    name="cobertura"
                    register={register}
                    setValue={setValue}
                    disabled
                    watch={watch}
                  />
                )} */}

                {/* {data?.type?.name === "VIDA" && (
                      <SelectInput
                        label={t("operations:policies:general:subbranch")}
                        name="subramoId"
                        options={lists?.policies?.polizaSubRamo ?? []}
                        
                        register={register}
                        setValue={setValue}
                        watch={watch}
                      />
                    )} */}

                {/* </Fragment> */}
                {/* )} */}

                <div className="w-full flex justify-center gap-4 py-4">
                  <Button
                    className="px-4 py-2"
                    buttonStyle="primary"
                    label="Guardar"
                    type="submit"
                    disabled={true}
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

export default AddPolicy;
