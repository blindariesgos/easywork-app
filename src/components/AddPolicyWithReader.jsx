"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
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
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  addPolicyByPdf,
  addPolicyVersionByContact,
  getMetadataOfPdf,
  getMetadataOfPdfVersion,
} from "@/src/lib/apis";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import InputCurrency from "@/src/components/form/InputCurrency";
import InputDate from "@/src/components/form/InputDate";
import TextInput from "@/src/components/form/TextInput";
import moment from "moment";
import clsx from "clsx";
import Beneficiaries from "@/src/components/policyAdds/Beneficiaries";
import Insureds from "@/src/components/policyAdds/Insureds";
import IntermediarySelectAsync from "@/src/components/form/IntermediarySelectAsync";
import { handleFrontError } from "../utils/api/errors";
import AgentSelectAsync from "./form/AgentSelectAsync";
import UserSelectAsync from "./form/UserSelectAsync";
import { MAX_FILE_SIZE } from "../utils/constants";

const getMetadataUrl = {
  policy: (data, contactId) => getMetadataOfPdf("nueva", data),
  renewal: (data, contactId) => getMetadataOfPdf("renovacion", data),
  endoso: (data, contactId) => getMetadataOfPdfVersion(data, contactId),
};

const addPolicyUrl = {
  policy: (data, contactId) => addPolicyByPdf(data),
  renewal: (data, contactId) => addPolicyByPdf(data, "renovacion"),
  endoso: (data, contactId) => addPolicyVersionByContact(contactId, data),
};

const AddPolicyWithReader = ({
  isOpen,
  setIsOpen,
  contactId,
  type = "policy",
}) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [policy, setPolicy] = useState();
  const { lists } = useAppContext();
  const [helpers, setHelpers] = useState({});
  const utcOffset = moment().utcOffset();

  const schema = yup.object().shape({
    contact: yup
      .object()
      .shape({})
      .when("isNewContact", {
        is: (value) => !value,
        then: (schema) => schema.required(t("common:formValidator:required")),
        otherwise: (schema) => schema,
      }),
    newContact: yup
      .object()
      .shape({})
      .when("isNewContact", {
        is: (value) => value,
        then: (schema) => schema.required(t("common:formValidator:required")),
        otherwise: (schema) => schema,
      }),
    contactId: yup.string(),
    typeId: yup.string().required(t("common:validations:required")),
    assignedById: yup.string().required(t("common:validations:required")),
    observerId: yup.string().required(t("common:validations:required")),
    subAgente: yup.object().shape({}),
    isNewContact: yup.bool().default(false),
    polizaFileId: yup.string().required(t("common:validations:required")),
    poliza: yup.string().required(t("common:validations:required")),
    typePerson: yup.string().required(t("common:validations:required")),
    vigenciaDesde: yup.string().required(t("common:validations:required")),
    vigenciaHasta: yup.string().required(t("common:validations:required")),
    companyId: yup.string().required(t("common:validations:required")),
    currencyId: yup.string().required(t("common:validations:required")),
    primaNeta: yup.string().required(t("common:validations:required")),
    derechoPoliza: yup.string().default("0"),
    iva: yup.string().default("0"),
    importePagar: yup.string().required(t("common:validations:required")),
    frecuenciaCobroId: yup.string().required(t("common:validations:required")),
    agenteIntermediarioId: yup
      .string()
      .required(t("common:validations:required")),
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
    const response = await getMetadataUrl[type](formData, contactId).catch(
      (error) => console.log({ error })
    );
    console.log(response);

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

    if (response?.contact?.id) {
      setValue("contact", response?.contact?.id);
      setValue("contactId", response?.contact?.id);
    } else {
      setValue("isNewContact", true);
      setValue("newContact", {
        ...response?.contact,
        name: response?.contact?.fullName,
      });
    }
    if (response?.poliza) setValue("poliza", response?.poliza);
    if (response?.contact?.typePerson)
      setValue("typePerson", response?.contact?.typePerson);

    if (response?.vigenciaDesde)
      setValue(
        "vigenciaDesde",
        response?.vigenciaDesde
          ? moment(response?.vigenciaDesde)
              .subtract(utcOffset, "minutes")
              .format()
          : ""
      );
    if (response?.vigenciaHasta)
      setValue(
        "vigenciaHasta",
        response?.vigenciaHasta
          ? moment(response?.vigenciaHasta)
              .subtract(utcOffset, "minutes")
              .format()
          : ""
      );
    if (response?.fechaEmision)
      setValue(
        "fechaEmision",
        response?.fechaEmision
          ? moment(response?.fechaEmision)
              .subtract(utcOffset, "minutes")
              .format()
          : ""
      );
    if (response?.formaCobro?.name)
      setValue("formaCobroId", response?.formaCobro?.id);
    if (response?.frecuenciaCobro?.name)
      setValue("frecuenciaCobroId", response?.frecuenciaCobro?.id);
    if (response?.agenteIntermediario?.name)
      setValue("agenteIntermediarioId", response?.agenteIntermediario?.id);
    if (response?.currency?.name)
      setValue("currencyId", response?.currency?.id);
    if (response?.plazoPago) setValue("plazoPago", response?.plazoPago);
    if (response?.type?.id) setValue("typeId", response?.type?.id);
    setValue(
      "importePagar",
      response?.importePagar?.toFixed(2) ?? (0).toFixed(2)
    );
    setValue("primaNeta", response?.primaNeta?.toFixed(2) ?? (0).toFixed(2));
    setValue(
      "derechoPoliza",
      response?.derechoPoliza?.toFixed(2) ?? (0).toFixed(2)
    );
    setValue("iva", response?.iva?.toFixed(2) ?? (0).toFixed(2));
    setValue(
      "recargoFraccionado",
      response?.recargoFraccionado?.toFixed(2) ?? (0).toFixed(2)
    );
    if (response?.company?.id) setValue("companyId", response?.company?.id);
    if (response?.beneficiaries)
      setValue("beneficiaries", response?.beneficiaries);
    if (response?.insureds) setValue("insureds", response?.insureds);
    setValue("plan", response?.plan);
    setValue("movementDescription", response?.movementDescription);
    setValue("conductoPagoId", response?.conductoPago?.id);
    setValue(
      "polizaFileId",
      type == "endoso" ? response?.polizaFileId?.id : response?.polizaFileId
    );
    setValue("status", "activa");
    setValue("version", response?.version ?? 0);
    setValue("operacion", response?.operacion);
    setValue("renewal", !!response?.renewal);
    setValue("metadata", response?.metadata);
    setValue("categoryId", response?.category?.id);

    if (response?.relatedContacts && response?.relatedContacts.length > 0) {
      setValue(
        "relatedContacts",
        response?.relatedContacts?.map((contact) => {
          return {
            id: contact.id,
            name: contact?.fullName ?? `${contact?.name} ${contact?.lastName}`,
          };
        })
      );
    }

    if (type == "endoso") {
      setValue("regenerateReceipts", "NO");
    }

    reader.readAsDataURL(file);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const {
      iva,
      primaNeta,
      importePagar,
      derechoPoliza,
      vigenciaDesde,
      vigenciaHasta,
      recargoFraccionado,
      relatedContacts,
      version,
      contact,
      specifications,
      regenerateReceipts,
      fechaEmision,
      beneficiaries,
      insureds,
      ...otherData
    } = data;
    const body = {
      ...otherData,
      version: version ? +version : 0,
      iva: iva ? +iva : 0,
      primaNeta: primaNeta ? +primaNeta : 0,
      importePagar: importePagar ? +importePagar : 0,
      derechoPoliza: derechoPoliza ? +derechoPoliza : 0,
      recargoFraccionado: recargoFraccionado ? +recargoFraccionado : 0,
      vigenciaDesde: moment(vigenciaDesde).format("YYYY-MM-DD"),
      vigenciaHasta: moment(vigenciaHasta).format("YYYY-MM-DD"),
      fechaEmision: moment(fechaEmision).format("YYYY-MM-DD"),
      name: `${lists.policies.polizaCompanies.find((x) => x.id == otherData.companyId).name} ${otherData.poliza} ${lists.policies.polizaTypes.find((x) => x.id == otherData.typeId).name}`,
    };

    if (specifications && specifications?.length > 0) {
      body.specifications = specifications;
    }

    if (type == "endoso") {
      body.regenerateReceipts = regenerateReceipts == "YES";
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
      const response = await addPolicyUrl[type](body, contactId);
      console.log({ response });
      if (response?.hasError) {
        handleFrontError(response);
        setLoading(false);

        return;
      }
      toast.success("Poliza cargada con éxito");
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
                <p>{t(`operations:reader:title:${type}`)}</p>
              </div>
              <div className="px-8 pt-4 grid grid-cols-1 gap-4">
                <div className="w-full">
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900`}
                  >
                    {t(`operations:reader:subtitle:${type}`)}
                  </label>
                  <label
                    htmlFor="policy-file"
                    className="bg-primary rounded-md group cursor-pointer w-full p-2 mt-1 text-white block text-center hover:bg-easy-500 shadow-sm text-sm"
                  >
                    <p>{t(`operations:reader:read:${type}`)}</p>
                  </label>
                  <input
                    type="file"
                    name="policy-file"
                    id="policy-file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleChangeFile}
                  />
                  {errors?.polizaFileId && errors?.polizaFileId?.message && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors?.polizaFileId?.message}
                    </p>
                  )}

                  <p className="text-xs italic pt-2 text-gray-700">
                    <span className="font-bold">Selecciona un PDF: </span>
                    (Versión Beta para Chubb/Quálitas/GNP/AXA - en el Ramo
                    Autos)
                  </p>
                  {policy && (
                    <div className="flex flex-col gap-2 justify-center items-center pt-2 relative group">
                      <IoMdCloseCircleOutline
                        className="w-6 h-6 hidden absolute top-0 left-[calc(50%_+_20px)] group-hover:block cursor-pointer"
                        onClick={() => {
                          console.log("aqu");
                          handleReset();
                        }}
                      />
                      <div className="p-2 group-hover:bg-primary bg-easy-500 rounded-md">
                        <FiFileText className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-center text-xs ">{policy.name}</p>
                    </div>
                  )}
                </div>
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
                  <div>
                    <label
                      className={`block text-sm font-medium leading-6 text-gray-900 px-3`}
                    >
                      {t("control:portafolio:control:form:contact")}
                    </label>
                    <p
                      className={clsx("text-xs py-2 px-3", {
                        hidden: !watch("isNewContact"),
                      })}
                    >
                      No encontramos el cliente de la póliza en nuestros
                      registros. ¿Ya está registrado? Si es así, selecciónalo.
                      Si no, crearemos uno nuevo con la información de la
                      póliza.
                    </p>
                    <TabGroup
                      className={clsx(" rounded-md", {
                        "px-3 border": watch("isNewContact"),
                      })}
                    >
                      <TabList
                        className={clsx("flex gap-2 pt-2", {
                          hidden: !watch("isNewContact"),
                        })}
                      >
                        <Tab className="text-xs bg-white rounded-full px-2 py-1 data-[selected]:bg-primary data-[selected]:text-white data-[selected]:font-semibold">
                          Todos
                        </Tab>
                        <Tab
                          className={clsx(
                            "text-xs bg-white rounded-full  data-[selected]:bg-primary data-[selected]:text-white data-[selected]:font-semibold",
                            {
                              hidden:
                                !watch("relatedContacts") ||
                                watch("relatedContacts").length == 0,
                              "px-2 py-1": watch("isNewContact"),
                            }
                          )}
                        >
                          Coincidencias
                        </Tab>
                        <Tab className="text-xs bg-white rounded-full px-2 py-1  data-[selected]:bg-primary data-[selected]:text-white data-[selected]:font-semibold">
                          Por defecto
                        </Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel className="py-2">
                          <ContactSelectAsync
                            name={"contact"}
                            setValue={setValue}
                            watch={watch}
                            error={errors?.contact}
                            helperText={helpers?.contact}
                            setSelectedOption={(contact) =>
                              setValue("contactId", contact.id)
                            }
                          />
                        </TabPanel>
                        <TabPanel
                          className={clsx("py-2", {
                            hidden:
                              !watch("relatedContacts") ||
                              watch("relatedContacts").length == 0,
                          })}
                        >
                          <SelectInput
                            options={watch("relatedContacts") ?? []}
                            name="contactId"
                            error={errors?.contactId}
                            setValue={setValue}
                          />
                        </TabPanel>
                        <TabPanel className="py-2">
                          <TextInput
                            type="text"
                            label={"Nombre completo"}
                            name="newContact.fullName"
                            register={register}
                            disabled
                          />
                          <TextInput
                            type="text"
                            label={"Código"}
                            name="newContact.codigo"
                            register={register}
                            disabled
                          />
                          <TextInput
                            type="text"
                            label={t("operations:policies:general:rfc")}
                            name="newContact.rfc"
                            register={register}
                            disabled
                          />
                          <TextInput
                            type="text"
                            label={t("operations:policies:general:address")}
                            name="newContact.address"
                            register={register}
                            disabled
                            multiple
                            rows={2}
                          />
                        </TabPanel>
                      </TabPanels>
                    </TabGroup>
                  </div>
                  <TextInput
                    type="text"
                    label={"Número de póliza"}
                    name="poliza"
                    register={register}
                  />
                  {watch && ["renovacion"].includes(watch("operacion")) && (
                    <TextInput
                      type="text"
                      label={"Versión"}
                      name="version"
                      register={register}
                    />
                  )}
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
                    label={"Aseguradora"}
                    options={lists?.policies?.polizaCompanies}
                    name="companyId"
                    setValue={setValue}
                    watch={watch}
                    register={register}
                    error={errors.companyId}
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
                  {/* <SelectInput
                  label={t("operations:policies:general:payment-method")}
                  name="formaCobroId"
                  options={lists?.policies?.polizaFormasCobro ?? []}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                /> */}
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
                    register={register}
                    error={!watch("assignedById") && errors.assignedById}
                    setValue={setValue}
                    watch={watch}
                  />
                  <UserSelectAsync
                    label={"Observador"}
                    name="observerId"
                    error={errors?.observerId}
                    setValue={setValue}
                  />
                  {type == "endoso" && (
                    <SelectInput
                      label={"Generar Recibos"}
                      name="regenerateReceipts"
                      options={[
                        {
                          name: "No",
                          id: "NO",
                        },
                        {
                          name: "Si",
                          id: "YES",
                        },
                      ]}
                      register={register}
                      setValue={setValue}
                      watch={watch}
                      helperText={
                        watch("regenerateReceipts") == "NO"
                          ? "El sistema realizará los cálculos para generar nuevos recibos en base a los montos expresados en la póliza (Se sobreescribirá los recibos existentes)"
                          : "El sistema trabajará con los recibos previamentes cargados/generados de la póliza que ya está guardada"
                      }
                    />
                  )}
                </Fragment>

                <div className="w-full flex justify-center gap-4 py-4">
                  <Button
                    className="px-4 py-2"
                    buttonStyle="secondary"
                    label="Cancelar"
                    onclick={() => {
                      handleReset();
                      setIsOpen(false);
                    }}
                  />
                  <Button
                    className="px-4 py-2"
                    buttonStyle="primary"
                    label="Guardar"
                    type="submit"
                    disabled={!policy}
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

export default AddPolicyWithReader;
