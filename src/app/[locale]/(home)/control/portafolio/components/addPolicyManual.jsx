"use client";

import { useTranslation } from "react-i18next";
import SliderOverShord from "@/src/components/SliderOverShort";
import Button from "@/src/components/form/Button";
import Tag from "@/src/components/Tag";
import SelectInput from "@/src/components/form/SelectInput";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";
import { FiFileText } from "react-icons/fi";
import useAppContext from "@/src/context/app";
import ContactSelectAsync from "@/src/components/form/ContactSelectAsync";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { addPolicyByPdf } from "@/src/lib/apis";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import InputCurrency from "@/src/components/form/InputCurrency";
import InputDate from "@/src/components/form/InputDate";
import TextInput from "@/src/components/form/TextInput";
import moment from "moment";
import Beneficiaries from "./Beneficiaries";
import Insureds from "./Insureds";
import Vehicles from "./Vehicles";

const AddPolicyManual = ({ isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [policy, setPolicy] = useState();
  const MAX_FILE_SIZE = 5000000; //5MB
  const { lists } = useAppContext();
  const [helpers, setHelpers] = useState({});
  const utcOffset = moment().utcOffset();

  const schema = yup.object().shape({});

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
      // operacion: "produccion_nueva",
      // version: 0,
      // renewal: false,
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
    if (contact) {
      body.contactId = contact.id;
    }
    console.log({ body });

    // try {
    //   const response = await addPolicyByPdf(body);
    //   console.log({ response });
    //   if (response?.hasError) {
    //     if (Array.isArray(response?.error?.message)) {
    //       response?.error?.message.forEach((message) => {
    //         toast.error(message);
    //       });
    //     } else {
    //       toast.error(
    //         response?.error?.message ??
    //           "Se ha producido un error cargar la poliza, inténtelo de nuevo mas tarde."
    //       );
    //     }
    //     setLoading(false);

    //     return;
    //   }
    //   toast.success("Poliza cargada con exito");
    //   setIsOpen(false);
    //   handleReset();
    // } catch (error) {
    //   console.log(error);
    //   toast.error(
    //     error?.message ??
    //       "Se ha producido un error cargar la poliza, inténtelo de nuevo mas tarde."
    //   );
    // }
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
              </div>
              <div className="px-8 pt-4 grid grid-cols-1 gap-4">
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
                />
                {watch && !watch("isNewContact") ? (
                  <ContactSelectAsync
                    name={"contact"}
                    label="Cliente"
                    setValue={setValue}
                    watch={watch}
                    error={errors?.contact}
                    helperText={helpers?.contact}
                  />
                ) : (
                  <Fragment>
                    <TextInput
                      type="text"
                      label={"Nombre completo cliente"}
                      name="newContact.fullName"
                      register={register}
                    />
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
                  label={t("operations:policies:general:payment-frequency")}
                  name="frecuenciaCobroId"
                  options={lists?.policies?.polizaFrecuenciasPago ?? []}
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
                <SelectInput
                  label={t("operations:policies:general:payment-frequency")}
                  name="frecuenciaCobroId"
                  options={lists?.policies?.polizaFrecuenciasPago ?? []}
                  register={register}
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
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
                <SelectInput
                  label={t("control:portafolio:receipt:details:product")}
                  name="categoryId"
                  options={lists?.policies?.polizaCategories ?? []}
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
                <TextInput
                  type="text"
                  label={t("operations:policies:general:specifications")}
                  error={errors.specifications}
                  register={register}
                  name="specifications"
                  multiple
                  rows={3}
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

                    <Beneficiaries
                      register={register}
                      control={control}
                      isAdd
                    />
                  </Fragment>
                )}
                {[
                  "e4e2f26f-8199-4e82-97f0-bdf1a6b6701c", //AUTOS
                ].includes(watch("typeId")) && (
                  <Fragment>
                    <Vehicles register={register} control={control} isAdd />
                  </Fragment>
                )}

                <div className="w-full">
                  <label
                    htmlFor="policy-file"
                    className="bg-primary rounded-md group cursor-pointer w-full p-2 mt-1 text-white block text-center hover:bg-easy-500 shadow-sm text-sm"
                  >
                    <p>Subir documento</p>
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
                    // disabled={!policy}
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
