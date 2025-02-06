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
import { addPolicyByPdf, getMetadataOfPdf } from "@/src/lib/apis";
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

const AddPolicy = ({ isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [policy, setPolicy] = useState();
  const MAX_FILE_SIZE = 5000000; //5MB
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
      toast.error("El archivo debe tener un tamaño menor a 5MB.");
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
    const response = await getMetadataOfPdf("nueva", formData).catch((error) =>
      console.log({ error })
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
    if (response?.formaCobro?.name)
      setValue("formaCobroId", response?.formaCobro?.id);
    if (response?.frecuenciaCobro?.name)
      setValue("frecuenciaCobroId", response?.frecuenciaCobro?.id);
    if (response?.agenteIntermediario?.name)
      setValue("agenteIntermediarioId", response?.agenteIntermediario?.id);
    // if (response?.observations) setValue("observations", response?.observations);
    if (response?.currency?.name)
      setValue("currencyId", response?.currency?.id);
    if (response?.plazoPago) setValue("plazoPago", response?.plazoPago);
    // if (response?.assignedBy) setValue("assignedById", response?.assignedBy?.id);
    // if (response?.contact?.address) setValue("address", response?.contact?.address);
    // if (response?.contact?.rfc) setValue("rfc", response?.contact?.rfc);
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
    setValue("fechaEmision", response?.fechaEmision);
    setValue("plan", response?.plan);
    setValue("movementDescription", response?.movementDescription);
    setValue("conductoPagoId", response?.conductoPago?.id);
    setValue("polizaFileId", response?.polizaFileId);
    setValue("status", response?.status);
    setValue("metadata", response?.metadata);
    setValue("categoryId", response?.category?.id);

    if (response?.relatedContacts && response?.relatedContacts.length > 0) {
      setValue("relatedContacts", response?.relatedContacts);
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
      contact,
      specifications,
      ...otherData
    } = data;
    const body = {
      ...otherData,
      operacion: "produccion_nueva",
      version: 0,
      renewal: false,
      iva: iva ? +iva : 0,
      primaNeta: primaNeta ? +primaNeta : 0,
      importePagar: importePagar ? +importePagar : 0,
      derechoPoliza: derechoPoliza ? +derechoPoliza : 0,
      recargoFraccionado: recargoFraccionado ? +recargoFraccionado : 0,
      vigenciaDesde: moment(vigenciaDesde).format("YYYY-MM-DD"),
      vigenciaHasta: moment(vigenciaHasta).format("YYYY-MM-DD"),
      name: `${lists.policies.polizaCompanies.find((x) => x.id == otherData.companyId).name} ${otherData.poliza} ${lists.policies.polizaTypes.find((x) => x.id == otherData.typeId).name}`,
    };
    if (specifications && specifications.length > 0) {
      body.specifications = specifications;
    }
    console.log({ body });

    try {
      const response = await addPolicyByPdf(body);
      console.log({ response });
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
                  <IntermediarySelectAsync
                    label={t("operations:policies:general:intermediary")}
                    name="agenteIntermediarioId"
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
                            name="observerId"
                            error={errors?.observerId}
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
                          {/* <InputDate
                              label={t("contacts:create:born-date")}
                              name="newContact.birthdate"
                              error={errors.birthdate}
                              register={register}
                              disabled
                            /> */}
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

                  {watch("insureds")?.length > 0 && (
                    <Insureds
                      register={register}
                      control={control}
                      watch={watch}
                      setValue={setValue}
                    />
                  )}
                  {watch("beneficiaries")?.length > 0 && (
                    <Beneficiaries register={register} control={control} />
                  )}
                  <TextInput
                    type="text"
                    label={t("operations:policies:general:specifications")}
                    error={errors.specifications}
                    register={register}
                    name="specifications"
                    multiple
                    rows={3}
                  />
                </Fragment>

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

                {/* {response?.type?.name === "GMM" && (
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

                {/* {response?.type?.name === "VIDA" && (
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

export default AddPolicy;
