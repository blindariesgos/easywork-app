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
import { FaTrash } from "react-icons/fa";
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
import moment from "moment";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

const AddVersion = ({ isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [policy, setPolicy] = useState();
  const MAX_FILE_SIZE = 5000000; //5MB
  const { lists } = useAppContext();
  const [helpers, setHelpers] = useState({});

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
    responsibleId: yup.string().required(t("common:validations:required")),
    observerId: yup.string().required(t("common:validations:required")),
    isNewContact: yup.bool().default(false),
    poliza: yup.string().required(t("common:validations:required")),
    typePerson: yup.string().required(t("common:validations:required")),
    vigenciaDesde: yup.string().required(t("common:validations:required")),
    vigenciaHasta: yup.string().required(t("common:validations:required")),
    companyId: yup.string().required(t("common:validations:required")),
    currencyId: yup.string().required(t("common:validations:required")),
    primaNeta: yup.string().required(t("common:validations:required")),
    version: yup.string().required(t("common:validations:required")),
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

    const formData = new FormData();
    formData.append("poliza", file);
    const response = await getMetadataOfPdf("version", formData);
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

    if (response?.client?.id) {
      setValue("client", response?.client?.id);
      setValue("contactId", response?.client?.id);
    } else {
      setValue("isNewContact", true);
      setValue("newContact", {
        ...response?.client,
        name: response?.client?.fullName,
      });
    }
    if (response?.poliza) setValue("poliza", response?.poliza);
    if (response?.client?.typePerson)
      setValue("typePerson", response?.client?.typePerson);

    if (response?.vigenciaDesde)
      setValue("vigenciaDesde", response?.vigenciaDesde ?? "");
    if (response?.vigenciaHasta)
      setValue("vigenciaHasta", response?.vigenciaHasta ?? "");
    // if (response?.cobertura) setValue("cobertura", response?.cobertura);
    // if (response?.paymentMethod)
    //   setValue("paymentMethod", response?.paymentMethod);
    // if (response?.paymentFrequency)
    //   setValue("paymentFrequency", response?.paymentFrequency);
    // if (response?.paymentTerm) setValue("paymentTerm", response?.paymentTerm);
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
    if (response?.version) setValue("version", response?.version);
    if (response?.importePagar)
      setValue("importePagar", response?.importePagar?.toFixed(2));
    if (response?.primaNeta)
      setValue("primaNeta", response?.primaNeta?.toFixed(2));
    if (response?.primaNeta)
      setValue("derechoPoliza", response?.derechoPoliza?.toFixed(2));
    if (response?.iva) setValue("iva", response?.iva?.toFixed(2));
    if (response?.recargoFraccionado)
      setValue("recargoFraccionado", response?.recargoFraccionado?.toFixed(2));
    if (response?.company?.id) setValue("companyId", response?.company?.id);
    if (response?.beneficiaries)
      setValue("beneficiaries", response?.beneficiaries);
    if (response?.insureds) setValue("insureds", response?.insureds);
    setValue("fechaEmision", response?.fechaEmision);
    setValue("plan", response?.plan);
    setValue("movementDescription", response?.movementDescription);
    setValue("conductoPagoId", response?.conductoPagoId);
    setValue("polizaFileId", response?.polizaFileId);
    setValue("status", response?.status);
    setValue("metadata", response?.metadata);

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
      version,
      contact,
      ...otherData
    } = data;
    let body = {
      ...otherData,
      operacion: "renovacion",
      renewal: true,
      iva: iva ? +iva : 0,
      primaNeta: primaNeta ? +primaNeta : 0,
      importePagar: importePagar ? +importePagar : 0,
      derechoPoliza: derechoPoliza ? +derechoPoliza : 0,
      recargoFraccionado: recargoFraccionado ? +recargoFraccionado : 0,
      vigenciaDesde: moment(vigenciaDesde).format("YYYY-MM-DD"),
      vigenciaHasta: moment(vigenciaHasta).format("YYYY-MM-DD"),
      version: version ? +version : 0,
      name: `${lists.policies.polizaCompanies.find((x) => x.id == otherData.companyId).name} ${otherData.poliza} ${lists.policies.polizaTypes.find((x) => x.id == otherData.typeId).name}`,
    };

    console.log({ body });

    try {
      const response = await addPolicyByPdf(body, "renovacion");
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
    reset({
      client: "",
      responsibleId: "",
      typeId: "",
    });
    setPolicy();
    setHelpers({});
    reset();
  };

  const getNewContactContent = () => {
    const client = watch("newContact");
    return (
      <div className="shadow-inner p-2 border rounded-md">
        <p className="text-xs pb-2">
          No encontramos el cliente de la póliza en nuestros registros. ¿Ya está
          registrado? Si es así, selecciónalo. Si no, crearemos uno nuevo con la
          información de la póliza.
        </p>
        <Disclosure>
          <DisclosureButton className="group flex items-center bg-primary justify-between w-full p-1 border rounded-md">
            <p className="text-sm text-white">
              Ver datos del cliente en la póliza
            </p>
            <ChevronDownIcon className="size-5  text-white  group-data-[open]:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel>
            <div className="p-2">
              <TextInput
                type="text"
                label={"Nombre completo"}
                name="name"
                value={client.fullName}
                disabled
              />
              <TextInput
                type="text"
                label={"Código"}
                name="codigo"
                value={client.codigo}
                disabled
              />
              <TextInput
                type="text"
                label={t("operations:policies:general:rfc")}
                name="rfc"
                value={client.rfc}
                disabled
              />
              <TextInput
                type="text"
                label={t("operations:policies:general:address")}
                name="address"
                value={client.address}
                disabled
                multiple
                rows={2}
              />
              <InputDate
                label={t("contacts:create:born-date")}
                value={client.birthdate}
                error={errors.birthdate}
                disabled
              />
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    );
  };

  const {
    fields: beneficiaries,
    append: appendBeneficiaries,
    remove: removeBeneficiaries,
  } = useFieldArray({
    control,
    name: "beneficiaries",
  });
  const {
    fields: insureds,
    append: appendInsureds,
    remove: removeInsureds,
  } = useFieldArray({
    control,
    name: "insureds",
  });

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
                <p>Información general de la Versión</p>
                {/* <RiPencilFill className="w-4 h-4 text-primary" /> */}
              </div>
              <div className="px-8 pt-4 grid grid-cols-1 gap-4">
                <div className="w-full">
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900`}
                  >
                    Cargar Versión pagada
                  </label>
                  <label
                    htmlFor="policy-file"
                    className="bg-primary rounded-md group cursor-pointer w-full p-2 mt-1 text-white block text-center hover:bg-easy-500 shadow-sm text-sm"
                  >
                    <p>Leer datos de la Versión</p>
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
                    name="responsibleId"
                    options={lists?.users}
                    register={register}
                    error={!watch("responsibleId") && errors.responsibleId}
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
                  {watch("isNewContact") && getNewContactContent()}
                  <TextInput
                    type="text"
                    label={"Número de póliza"}
                    name="poliza"
                    register={register}
                  />
                  <TextInput
                    type="text"
                    label={"Versión"}
                    name="version"
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
                  {insureds && insureds.length > 0 && (
                    <div className="grid gap-y-1">
                      <label className="block text-sm font-medium leading-6 text-gray-900 px-3">
                        Asegurados
                      </label>
                      {insureds.map((beneficiary, index) => (
                        <div
                          key={index}
                          className={clsx(
                            "grid gap-1 border rounded-md py-2 pl-2 relative",
                            {
                              "pr-8": insureds.length > 1,
                              "pr-2": insureds.length == 1,
                            }
                          )}
                        >
                          <FaTrash
                            className={clsx(
                              "text-red-800 w-4 h-4 absolute right-2 cursor-pointer top-2",
                              {
                                hidden: insureds.length == 1,
                              }
                            )}
                            onClick={() => removeInsureds(index)}
                          />
                          <p className="text-xs">Nombre completo</p>
                          <p className="text-xs bg-white py-1 px-2 rounded-md">
                            {beneficiary?.insured?.fullName ?? "No disponible"}
                          </p>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="grid gap-1">
                              <p className="text-xs">Edad de Contratación</p>
                              <p className="text-xs bg-white py-1 px-2 rounded-md">
                                {beneficiary?.metadata?.edadContratacion}
                              </p>
                            </div>
                            <div className="grid gap-1">
                              <p className="text-xs">Tipo de riesgo</p>
                              <p className="text-xs bg-white py-1 px-2 rounded-md">
                                {beneficiary?.metadata?.tipoRiesgo}
                              </p>
                            </div>
                            <div className="grid gap-1">
                              <p className="text-xs">Es fumador</p>
                              <p className="text-xs bg-white py-1 px-2 rounded-md">
                                {beneficiary?.metadata?.fumador ? "Si" : "No"}
                              </p>
                            </div>
                            <div className="grid gap-1">
                              <p className="text-xs">Código</p>
                              <p className="text-xs bg-white py-1 px-2 rounded-md">
                                {beneficiary?.insured?.codigo ? "Si" : "No"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {beneficiaries && beneficiaries.length > 0 && (
                    <div className="grid gap-y-1">
                      <label className="block text-sm font-medium leading-6 text-gray-900 px-3">
                        Beneficiarios
                      </label>
                      {beneficiaries.map((beneficiary, index) => (
                        <div
                          key={index}
                          className={clsx(
                            "grid gap-1 border rounded-md py-2 pl-2 relative",
                            {
                              "pr-8": beneficiaries.length > 1,
                              "pr-2": beneficiaries.length == 1,
                            }
                          )}
                        >
                          <FaTrash
                            className={clsx(
                              "text-red-800 w-4 h-4 absolute right-2 cursor-pointer top-2",
                              {
                                hidden: beneficiaries.length == 1,
                              }
                            )}
                            onClick={() => removeBeneficiaries(index)}
                          />
                          <p className="text-xs">Nombre completo</p>
                          <p className="text-xs bg-white py-1 px-2 rounded-md">
                            {beneficiary.nombre}
                          </p>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="grid gap-1">
                              <p className="text-xs">Parentesco</p>
                              <p className="text-xs bg-white py-1 px-2 rounded-md">
                                {beneficiary.parentesco}
                              </p>
                            </div>
                            <div className="grid gap-1">
                              <p className="text-xs">Porcentaje</p>
                              <p className="text-xs bg-white py-1 px-2 rounded-md">
                                {beneficiary.porcentaje}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    buttonStyle="primary"
                    label="Guardar"
                    type="submit"
                    disabled={!policy}
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

export default AddVersion;