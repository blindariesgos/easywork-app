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
import ContactSelectAsync from "@/src/components/form/ContactSelectAsync";
import CategorySelectAsync from "@/src/components/form/CategorySelectAsync";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  addManualPolicy,
  addManualPolicyToLead,
  uploadLeadTemporalFile,
  uploadTemporalFile,
} from "@/src/lib/apis";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import InputCurrency from "@/src/components/form/InputCurrency";
import InputDate from "@/src/components/form/InputDate";
import TextInput from "@/src/components/form/TextInput";
import moment from "moment";
import Beneficiaries from "@/src/components/policyAdds/Beneficiaries";
import Insureds from "@/src/components/policyAdds/Insureds";
import Vehicles from "@/src/components/policyAdds/Vehicles";
import IntermediarySelectAsync from "@/src/components/form/IntermediarySelectAsync";
import { handleFrontError } from "@/src/utils/api/errors";
import PolicySelectAsync from "@/src/components/form/PolicySelectAsync";
import AgentSelectAsync from "./form/AgentSelectAsync";
import UserSelectAsync from "./form/UserSelectAsync";
import { MAX_FILE_SIZE } from "../utils/constants";

const endpointsByModule = {
  gestion: (body, documentType, id) => addManualPolicy(body, documentType),
  lead: (body, documentType, id) => addManualPolicyToLead(body, id),
};

const endpointsTemporalFileByModule = {
  gestion: (body) => uploadTemporalFile(body),
  lead: (body) => uploadLeadTemporalFile(body),
};

const AddPolicyManual = ({
  isOpen,
  setIsOpen,
  module,
  id,
  onClosed,
  defaultValues,
}) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [policy, setPolicy] = useState();
  const { lists } = useAppContext();
  const [helpers, setHelpers] = useState({});

  const schema = yup.object().shape({
    poliza: yup.string().required(t("common:validations:required")),
    version: yup.string().required(t("common:validations:required")),
    // contact: yup.object().required(t("common:validations:required")),
    companyId: yup.string().required(t("common:validations:required")),
    typeId: yup.string().required(t("common:validations:required")),
    frecuenciaCobroId: yup.string().required(t("common:validations:required")),
    currencyId: yup.string().required(t("common:validations:required")),
    fechaEmision: yup.string().required(t("common:validations:required")),
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

  useEffect(() => {
    if (!defaultValues) return;

    if (defaultValues.assignedBy)
      setValue("assignedById", defaultValues.assignedBy.id);
    if (defaultValues.subAgente)
      setValue("subAgentId", defaultValues.subAgente.id);
    if (defaultValues.polizaType)
      setValue("typeId", defaultValues.polizaType.id);
    if (defaultValues.quoteCurrency)
      setValue("currencyId", defaultValues.quoteCurrency.id);
    if (defaultValues?.agenteIntermediario)
      setValue("agenteIntermediarioId", defaultValues?.agenteIntermediario?.id);
    if (defaultValues?.observer)
      setValue("observerId", defaultValues?.observer?.id);
  }, [defaultValues]);

  const getFormData = (body) => {
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
    return formData;
  };

  const handleChangeFile = async (e) => {
    setLoading(true);
    const files = e.target.files;

    if (!files) {
      setLoading(false);
      return;
    }

    const file = Array.from(files)[0];

    if (!file) {
      setLoading(false);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("El archivo debe tener un tamaño menor a 10MB.");
      setLoading(false);
      return;
    }

    const body = getFormData({ file });

    if (Object.keys(endpointsTemporalFileByModule).includes(module)) {
      const response = await endpointsTemporalFileByModule[module](body);
      console.log({ response });
      if (response.hasError) {
        handleFrontError(response);
        setLoading(false);
        return;
      }
      setPolicy(response);
    }

    setLoading(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const {
      version,
      iva,
      primaNeta,
      importePagar,
      derechoPoliza,
      vigenciaDesde,
      vigenciaHasta,
      recargoFraccionado,
      relatedContacts,
      contact,
      documentType,
      specifications,
      oldPoliza,
      fechaEmision,
      insureds,
      beneficiaries,
      ...otherData
    } = data;
    const body = {
      ...otherData,
      polizaFileId: policy.id,
      version: version ? +version : 0,
      renewal: documentType === "renovacion",
      iva: iva ? +iva : 0,
      primaNeta: primaNeta ? +primaNeta : 0,
      importePagar: importePagar ? +importePagar : 0,
      derechoPoliza: derechoPoliza ? +derechoPoliza : 0,
      recargoFraccionado: recargoFraccionado ? +recargoFraccionado : 0,
      vigenciaDesde: moment(vigenciaDesde).format("YYYY-MM-DD"),
      vigenciaHasta: moment(vigenciaHasta).format("YYYY-MM-DD"),
      fechaEmision: moment(fechaEmision).format("YYYY-MM-DD"),
      status: "activa",
      name: `${lists.policies.polizaCompanies.find((x) => x.id == otherData.companyId).name} ${otherData.poliza} ${lists.policies.polizaTypes.find((x) => x.id == otherData.typeId).name}`,
    };
    if (specifications && specifications?.length > 0) {
      body.specifications = specifications;
    }
    if (contact) {
      body.contactId = contact.id;
    }
    if (oldPoliza) {
      body.polizaId = oldPoliza.id;
    }
    if (insureds && insureds.length > 0 && insureds[0]?.fullName?.length > 0) {
      body.insureds = insureds;
    }

    if (
      beneficiaries &&
      beneficiaries.length > 0 &&
      beneficiaries[0]?.nombre?.length > 0
    ) {
      body.beneficiaries = beneficiaries;
    }
    console.log({ body });

    try {
      if (Object.keys(endpointsByModule).includes(module)) {
        const response = await endpointsByModule[module](
          body,
          documentType,
          id
        );
        console.log({ response });
        if (response?.hasError) {
          handleFrontError(response);
          setLoading(false);
          return;
        }
        toast.success("Póliza cargada con éxito");
        onClosed && onClosed();
      }
      setIsOpen(false);
      handleReset();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.message ??
          "Se ha producido un error cargar la póliza, inténtelo de nuevo más tarde."
      );
    }
    setLoading(false);
  };

  const handleReset = () => {
    setPolicy();
    setHelpers({});
    reset();
  };

  const clearFile = () => {
    const inputFile = document.getElementById("policy-file-manual-charge");

    if (inputFile) {
      const nuevoInputFile = document.createElement("input");
      nuevoInputFile.type = "file";
      nuevoInputFile.id = inputFile.id;
      nuevoInputFile.name = inputFile.name; // Mantener el nombre original
      nuevoInputFile.classList = inputFile.classList; // Mantener las clases
      nuevoInputFile.accept = inputFile.accept; // Mantener los tipos de archivo aceptados
      nuevoInputFile.multiple = inputFile.multiple; // Mantener la opción de múltiples archivos
      inputFile.parentNode.replaceChild(nuevoInputFile, inputFile);
    }

    setPolicy();
  };

  const handleChangeOldPolicy = (policy) => {
    console.log({ policy });
    policy.agenteIntermediario &&
      setValue("agenteIntermediarioId", policy.agenteIntermediario.id);
    policy.assignedBy && setValue("assignedById", policy.assignedBy.id);
    policy.subAgente && setValue("subAgentId", policy.subAgente.id);
    policy.beneficiaries && setValue("beneficiaries", policy.beneficiaries);
    policy.insured && setValue("insureds", policy.insured);
    policy.category && setValue("categoryId", policy.category.id);
    policy.company && setValue("companyId", policy.company.id);
    if (policy.contact) {
      setValue("contact", policy.contact.id);
      setValue("isNewContact", false);
      setValue("type", policy.contact.typePerson);
    }
    policy.currency && setValue("currencyId", policy.currency.id);
    policy.frecuenciaCobro &&
      setValue("frecuenciaCobroId", policy.frecuenciaCobro.id);
    policy.formaCobro && setValue("formaCobroId", policy.formaCobro.id);
    policy.plazoPago && setValue("plazoPago", policy.plazoPago);
    policy.poliza && setValue("poliza", policy.poliza);
    policy.type && setValue("typeId", policy.type.id);
    policy?.conductoPago && setValue("conductoPagoId", data?.conductoPago?.id);
    policy.specifications && setValue("specifications", policy.specifications);
  };

  const handleChangeConducto = (conducto) => {
    if (!conducto?.id) return;

    if (
      [
        "ce1a967c-ccac-4d52-b255-5446ca4c0dff",
        "60783a4f-d79d-4372-a891-eaf2c9f84350",
      ].includes(conducto?.id)
    ) {
      setValue("formaCobroId", "2cead91b-8134-4763-b841-c9f0f217d32a");
    } else {
      setValue("formaCobroId", "17c73ac6-c880-4106-ad92-2da33f2ce2bc");
    }
  };

  const handleChangeType = (policyType) => {
    console.log({ policyType });
    if (!policyType?.id) return;
    console.log("paosssss");
    if (
      [
        "01072927-e48a-4fd0-9b06-5288ff7bc23d", //GMM
        "e1794ba3-892d-4c51-ad62-32dcf836873b", //VIDA
      ].includes(policyType?.id)
    ) {
      console.log("paosssssvid");

      setValue("beneficiaries", [
        {
          nombre: "",
          parentesco: "",
          porcentaje: "",
          type: "Principal",
        },
      ]);

      setValue("insureds", [
        {
          metadata: {
            edadContratacion: "",
            fechaNacimiento: "",
            tipoRiesgo: "",
            fumador: false,
          },
          insured: { codigo: "", fullName: "" },
        },
      ]);
    }
    if (policyType?.id == "e4e2f26f-8199-4e82-97f0-bdf1a6b6701c") {
      console.log("paosssssveh");

      setValue("vehicles", [
        {
          description: "",
          serial: "",
          model: "",
          motor: "",
          plates: "",
          usage: "",
          circulatesIn: "",
          regularDriver: "",
          regularDriverAge: "",
        },
      ]);
    }
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
        <form onSubmit={(e) => e.preventDefault()}>
          <div className=" bg-gray-600 px-6 py-8 h-screen rounded-l-[35px] w-[567px] shadow-[-3px_1px_15px_4px_#0000003d] overflow-y-auto">
            <div className="bg-gray-100 rounded-md p-2">
              <div className="bg-white rounded-md p-4 flex justify-between items-center">
                <p>Información general de la póliza</p>
              </div>
              <div className="px-8 pt-4 grid grid-cols-1 gap-4">
                <SelectInput
                  label={"Tipo de documento"}
                  options={[
                    {
                      name: "Póliza nueva",
                      id: "nueva",
                    },
                    {
                      name: "Renovación",
                      id: "renovacion",
                    },
                    {
                      name: "Versión",
                      id: "version",
                    },
                  ]}
                  name="documentType"
                  error={errors?.observerId}
                  setValue={setValue}
                  isRequired
                />
                {watch &&
                  ["renovacion", "version"].includes(watch("documentType")) && (
                    <PolicySelectAsync
                      label={"Póliza original"}
                      name={"oldPoliza"}
                      setValue={setValue}
                      watch={watch}
                      error={errors?.oldPoliza}
                      register={register}
                      setSelectedOption={handleChangeOldPolicy}
                    />
                  )}
                <SelectInput
                  label={"Aseguradora"}
                  options={lists?.policies?.polizaCompanies}
                  name="companyId"
                  setValue={setValue}
                  watch={watch}
                  register={register}
                  error={errors.companyId}
                  isRequired
                />
                <SelectInput
                  label={t("operations:policies:general:type")}
                  name="typeId"
                  options={lists?.policies?.polizaTypes ?? []}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  isRequired
                  setSelectedOption={handleChangeType}
                />
                <SelectInput
                  label={"Tipo de cliente"}
                  name="isNewContact"
                  options={[
                    {
                      name: "Existente",
                      id: false,
                    },
                    {
                      name: "Nuevo",
                      id: true,
                    },
                  ]}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  helperText={
                    watch("isNewContact") && module == "lead"
                      ? "Se creará un nuevo cliente a partir de la información cargada en el prospecto."
                      : null
                  }
                />
                {watch && !watch("isNewContact") && (
                  <ContactSelectAsync
                    name={"contact"}
                    label="Cliente"
                    setValue={setValue}
                    watch={watch}
                    error={errors?.contact}
                    helperText={helpers?.contact}
                    isRequired
                  />
                )}

                {watch && watch("isNewContact") && module !== "lead" && (
                  <Fragment>
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
                      name="type"
                      setValue={setValue}
                      watch={watch}
                    />
                    <TextInput
                      type="text"
                      label={
                        watch("type") != "moral"
                          ? "Nombres"
                          : "Nombre de la compañía"
                      }
                      name="newContact.name"
                      register={register}
                    />
                    {watch("type") == "fisica" && (
                      <TextInput
                        type="text"
                        label={"Apellidos"}
                        name="newContact.lastName"
                        register={register}
                      />
                    )}

                    <TextInput
                      type="text"
                      label={"Código"}
                      name="newContact.codigo"
                      register={register}
                    />
                    <TextInput
                      type="text"
                      label={t("operations:policies:general:rfc")}
                      name="newContact.rfc"
                      register={register}
                    />
                    <TextInput
                      type="text"
                      label={t("operations:policies:general:address")}
                      name="newContact.address"
                      register={register}
                      multiple
                      rows={2}
                    />
                  </Fragment>
                )}

                <TextInput
                  type="text"
                  label={t("contacts:edit:policies:consult:code")}
                  name="clientCode"
                  register={register}
                  isRequired
                />
                <TextInput
                  type="text"
                  label={"Número de póliza"}
                  name="poliza"
                  register={register}
                  isRequired
                />
                {watch && ["renovacion"].includes(watch("documentType")) && (
                  <TextInput
                    type="number"
                    label={"Renovación"}
                    name="renovacion"
                    register={register}
                    value={1}
                    isRequired
                  />
                )}
                <TextInput
                  type="number"
                  label={"Versión"}
                  name="version"
                  register={register}
                  isRequired
                />
                <Controller
                  render={({ field: { value, onChange, ref, onBlur } }) => {
                    return (
                      <InputDate
                        label={t("operations:policies:general:fechaEmision")}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={errors.fechaEmision}
                      />
                    );
                  }}
                  name="fechaEmision"
                  control={control}
                  defaultValue=""
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
                  watch={watch}
                />
                <SelectInput
                  label={t("operations:policies:general:payment-frequency")}
                  name="frecuenciaCobroId"
                  options={lists?.policies?.polizaFrecuenciasPago ?? []}
                  setValue={setValue}
                  watch={watch}
                  isRequired
                />
                <SelectInput
                  label={t(
                    "control:portafolio:receipt:details:form:conducto-pago"
                  )}
                  name="conductoPagoId"
                  options={lists?.policies?.polizaConductoPago}
                  setValue={setValue}
                  watch={watch}
                  setSelectedOption={handleChangeConducto}
                />
                <SelectInput
                  label={t("operations:policies:general:payment-method")}
                  name="formaCobroId"
                  options={lists?.policies?.polizaFormasCobro ?? []}
                  setValue={setValue}
                  watch={watch}
                />

                <SelectInput
                  label={t("operations:policies:general:payment-term")}
                  options={[
                    {
                      id: "15",
                      name: "15 días",
                    },
                    {
                      id: "30",
                      name: "30 días",
                    },
                  ]}
                  name="plazoPago"
                  setValue={setValue}
                  watch={watch}
                />
                {/* <SelectInput
                  label={t("control:portafolio:receipt:details:product")}
                  name="categoryId"
                  options={lists?.policies?.polizaCategories ?? []}
                  setValue={setValue}
                  watch={watch}
                /> */}
                <CategorySelectAsync
                  name={"categoryId"}
                  label={t("control:portafolio:receipt:details:product")}
                  setValue={setValue}
                  watch={watch}
                  error={errors?.contact}
                />
                <SelectInput
                  label={"Moneda"}
                  options={lists?.policies?.currencies ?? []}
                  name="currencyId"
                  setValue={setValue}
                  watch={watch}
                  isRequired
                />
                <InputCurrency
                  type="text"
                  label={t("operations:policies:general:primaNeta")}
                  setValue={setValue}
                  name="primaNeta"
                  watch={watch}
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
                  watch={watch}
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
                  watch={watch}
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
                  watch={watch}
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
                  watch={watch}
                  prefix={
                    lists?.policies?.currencies?.find(
                      (x) => x.id == watch("currencyId")
                    )?.symbol ?? ""
                  }
                  defaultValue={
                    defaultValues?.quoteAmount &&
                    defaultValues?.quoteAmount?.length
                      ? (+defaultValues?.quoteAmount)?.toFixed(2)
                      : null
                  }
                />

                <IntermediarySelectAsync
                  label={t("operations:policies:general:intermediary")}
                  name="agenteIntermediarioId"
                  setValue={setValue}
                  watch={watch}
                />
                <AgentSelectAsync
                  label={t("operations:programations:general:sub-agent")}
                  name="subAgentId"
                  error={errors.subAgentId}
                  setValue={setValue}
                  watch={watch}
                />
                <UserSelectAsync
                  label={t("operations:policies:general:responsible")}
                  name="assignedById"
                  error={errors.assignedById}
                  setValue={setValue}
                  watch={watch}
                />
                <UserSelectAsync
                  label={"Observador"}
                  name="observerId"
                  error={errors?.observerId}
                  setValue={setValue}
                  watch={watch}
                />

                {[
                  "01072927-e48a-4fd0-9b06-5288ff7bc23d", //GMM
                  "e1794ba3-892d-4c51-ad62-32dcf836873b", //VIDA
                ].includes(watch("typeId")) && (
                  <Fragment>
                    <Insureds
                      register={register}
                      control={control}
                      watch={watch}
                      setValue={setValue}
                      isAdd
                    />
                    {watch("typeId") ==
                      "e1794ba3-892d-4c51-ad62-32dcf836873b" && (
                      <Fragment>
                        <Beneficiaries
                          register={register}
                          control={control}
                          watch={watch}
                          isAdd
                        />
                        <TextInput
                          type="text"
                          label={t(
                            "operations:policies:general:specifications"
                          )}
                          error={errors.specifications}
                          register={register}
                          name="specifications"
                          multiple
                          rows={3}
                        />
                      </Fragment>
                    )}
                  </Fragment>
                )}
                {[
                  "e4e2f26f-8199-4e82-97f0-bdf1a6b6701c", //AUTOS
                ].includes(watch("typeId")) && (
                  <Fragment>
                    <Vehicles
                      register={register}
                      watch={watch}
                      control={control}
                      isAdd
                    />
                  </Fragment>
                )}

                <div className="w-full">
                  <label
                    htmlFor="policy-file-manual-charge"
                    className="bg-primary rounded-md group cursor-pointer w-full p-2 mt-1 text-white block text-center hover:bg-easy-500 shadow-sm text-sm"
                  >
                    <p>Subir documento</p>
                  </label>
                  <input
                    type="file"
                    name="policy-file-manual-charge"
                    id="policy-file-manual-charge"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleChangeFile}
                  />
                  {errors?.polizaFileId && errors?.polizaFileId?.message && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors?.polizaFileId?.message}
                    </p>
                  )}
                  {policy && (
                    <div className="flex flex-col gap-2 justify-center items-center pt-2 relative group">
                      <IoMdCloseCircleOutline
                        className="w-6 h-6 hidden absolute top-0 left-[calc(50%_+_20px)] group-hover:block cursor-pointer"
                        onClick={clearFile}
                      />
                      <div
                        className="p-2 group-hover:bg-primary bg-easy-500 rounded-md cursor-zoom-in"
                        onClick={() =>
                          policy?.url &&
                          window.open(
                            policy?.url,
                            "self",
                            "status=yes,scrollbars=yes,toolbar=yes,resizable=yes,width=850,height=500"
                          )
                        }
                      >
                        <FiFileText className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-center text-xs ">{policy.name}</p>
                    </div>
                  )}
                </div>
                <p className="text-sm relative font-semibold px-3">
                  Campos obligatorios
                  <span className="text-sm text-red-600 absolute top-0 left-0">
                    *
                  </span>
                </p>

                <div className="w-full flex justify-center gap-4 py-4">
                  <Button
                    className="px-4 py-2"
                    buttonStyle="secondary"
                    label="Cancelar"
                    type="button"
                    onclick={() => {
                      handleReset();
                      setIsOpen(false);
                    }}
                  />
                  <Button
                    className="px-4 py-2"
                    buttonStyle="primary"
                    label="Guardar"
                    type="button"
                    onclick={handleSubmit(onSubmit)}
                    disabled={!policy}
                    // disabled
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

export default AddPolicyManual;
