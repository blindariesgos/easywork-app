import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import SliderOverShord from "@/src/components/SliderOverShort";
import Button from "@/src/components/form/Button";
import Tag from "@/src/components/Tag";
import SelectInput from "@/src/components/form/SelectInput";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAppContext from "@/src/context/app";
import ContactSelectAsync from "@/src/components/form/ContactSelectAsync";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { convertLeadToClient } from "@/src/lib/apis";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import InputCurrency from "@/src/components/form/InputCurrency";
import InputDate from "@/src/components/form/InputDate";
import TextInput from "@/src/components/form/TextInput";
import moment from "moment";
import clsx from "clsx";
import useLeadContext from "@/src/context/leads";
import { useSWRConfig } from "swr";

const ValidatePolizaData = ({ policy, isOpen, setIsOpen, leadId }) => {
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { mutate: mutateLeads } = useLeadContext();
  const { mutate } = useSWRConfig();
  const utcOffset = moment().utcOffset();

  const schema = yup.object().shape({
    clientData: yup
      .object()
      .shape({})
      .when("isNewContact", {
        is: (value) => value,
        then: (schema) => schema.required(t("common:formValidator:required")),
        otherwise: (schema) => schema,
      }),
    typeId: yup.string().required(t("common:validations:required")),
    responsibleId: yup.string().required(t("common:validations:required")),
    observerId: yup.string().required(t("common:validations:required")),
    subAgente: yup.object().shape({}),
    isNewContact: yup.bool().default(false),
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

  useEffect(() => {
    if (policy?.contact?.id) {
      setValue("contact", policy?.contact?.id);
      setValue("contactId", policy?.contact?.id);
    } else {
      setValue("isNewContact", true);
      setValue("clientData", {
        ...policy?.clientData,
        name: policy?.clientData?.fullName,
      });
    }
    if (policy?.poliza) setValue("poliza", policy?.poliza);
    if (policy?.clientData?.typePerson)
      setValue("typePerson", policy?.clientData?.typePerson);

    if (policy?.vigenciaDesde)
      setValue(
        "vigenciaDesde",
        policy?.vigenciaDesde
          ? moment(policy?.vigenciaDesde)
              .subtract(utcOffset, "minutes")
              .format()
          : ""
      );
    if (policy?.vigenciaHasta)
      setValue(
        "vigenciaHasta",
        policy?.vigenciaHasta
          ? moment(policy?.vigenciaHasta)
              .subtract(utcOffset, "minutes")
              .format()
          : ""
      );
    if (policy?.formaCobro?.name)
      setValue("formaCobroId", policy?.formaCobro?.id);
    if (policy?.frecuenciaCobro?.name)
      setValue("frecuenciaCobroId", policy?.frecuenciaCobro?.id);
    if (policy?.agenteIntermediario?.name)
      setValue("agenteIntermediarioId", policy?.agenteIntermediario?.id);
    if (policy?.currency?.name) setValue("currencyId", policy?.currency?.id);
    if (policy?.plazoPago) setValue("plazoPago", policy?.plazoPago);
    if (policy?.type?.id) setValue("typeId", policy?.type?.id);

    setValue(
      "importePagar",
      policy?.importePagar?.toFixed(2) ?? (0).toFixed(2)
    );
    setValue("primaNeta", policy?.primaNeta?.toFixed(2) ?? (0).toFixed(2));

    setValue(
      "derechoPoliza",
      policy?.derechoPoliza?.toFixed(2) ?? (0).toFixed(2)
    );
    setValue("iva", policy?.iva?.toFixed(2) ?? (0).toFixed(2));

    setValue(
      "recargoFraccionado",
      policy?.recargoFraccionado?.toFixed(2) ?? (0).toFixed(2)
    );
    if (policy?.company?.id) setValue("companyId", policy?.company?.id);
    if (policy?.beneficiaries) setValue("beneficiaries", policy?.beneficiaries);
    if (policy?.insureds) setValue("insureds", policy?.insureds);
    setValue("fechaEmision", policy?.fechaEmision);
    setValue("plan", policy?.plan);
    setValue("movementDescription", policy?.movementDescription);
    setValue("conductoPagoId", policy?.conductoPagoId);
    setValue("polizaFileId", policy?.file?.id);
    setValue("status", policy?.status);
    setValue("metadata", policy?.metadata);
    setValue("categoryId", policy?.category?.id);
  }, [policy]);

  const handleReset = () => {
    reset();
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
      ...otherData
    } = data;
    const body = {
      ...otherData,
      categoryId: otherData?.category?.id,
      version: 0,
      renewal: false,
      iva: iva ? +iva : 0,
      primaNeta: primaNeta ? +primaNeta : 0,
      importePagar: importePagar ? +importePagar : 0,
      derechoPoliza: derechoPoliza ? +derechoPoliza : 0,
      recargoFraccionado: recargoFraccionado ? +recargoFraccionado : 0,
      vigenciaDesde: moment(vigenciaDesde).format("YYYY-MM-DD"),
      vigenciaHasta: moment(vigenciaHasta).format("YYYY-MM-DD"),
      name: `${lists?.policies?.polizaCompanies?.find((x) => x.id == otherData?.companyId)?.name} ${otherData?.poliza} ${lists?.policies?.polizaTypes?.find((x) => x.id == otherData?.typeId)?.name}`,
    };
    console.log({ body });

    try {
      const response = await convertLeadToClient(leadId, body);
      console.log({ response });
      if (response?.hasError) {
        if (Array.isArray(response?.error?.message)) {
          response?.error?.message.forEach((message) => {
            toast.error(message);
          });
        } else {
          toast.error(
            response?.error?.message ??
              "Se ha producido un error cargar la póliza, inténtelo de nuevo mas tarde."
          );
        }
        setLoading(false);

        return;
      }
      toast.success("Prospecto convertido con éxito");
      setIsOpen(false);
      handleReset();
      mutateLeads();
      mutate(`/sales/crm/leads/${leadId}/activities`);
      mutate(`/sales/crm/leads/${leadId}`);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.message ??
          "Se ha producido un error cargar la póliza, inténtelo de nuevo mas tarde."
      );
    }
    setLoading(false);
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
              <p>Validar Información</p>
            </div>
            <div className="px-8 pt-4 grid grid-cols-1 gap-4">
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
                  No encontramos el cliente de la póliza en nuestros registros.
                  ¿Ya está registrado? Si es así, selecciónalo. Si no, crearemos
                  uno nuevo con la información de la póliza y el prospecto.
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
                        name="clientData.fullName"
                        register={register}
                        disabled
                      />
                      <TextInput
                        type="text"
                        label={"Código"}
                        name="clientData.codigo"
                        register={register}
                        disabled
                      />
                      <TextInput
                        type="text"
                        label={t("operations:policies:general:rfc")}
                        name="clientData.rfc"
                        register={register}
                        disabled
                      />
                      <TextInput
                        type="text"
                        label={t("operations:policies:general:address")}
                        name="clientData.address"
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

              {beneficiaries && beneficiaries.length > 0 && (
                <div className="grid gap-y-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 px-3">
                    Beneficiarios
                  </label>
                  {beneficiaries.map((beneficiary, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "grid gap-1 border rounded-md py-2 pl-2",
                        {
                          "pr-6": beneficiaries.length > 1,
                          "pr-2": beneficiaries.length == 1,
                        }
                      )}
                    >
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
              {insureds && insureds.length > 0 && (
                <div className="grid gap-y-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900 px-3">
                    Asegurados
                  </label>
                  {insureds.map((beneficiary, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "grid gap-1 border rounded-md py-2 pl-2",
                        {
                          "pr-6": insureds.length > 1,
                          "pr-2": insureds.length == 1,
                        }
                      )}
                    >
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
                  type="submit"
                  disabled={!policy}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </SliderOverShord>
  );
};

export default ValidatePolizaData;
