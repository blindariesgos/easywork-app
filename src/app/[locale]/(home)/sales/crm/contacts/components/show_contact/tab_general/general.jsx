"use client";
import useAppContext from "@/src/context/app";
import { PencilIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import TextInput from "@/src/components/form/TextInput";
import MultipleEmailsInput from "@/src/components/form/MultipleEmailsInput";
import MultiplePhonesInput from "@/src/components/form/MultiplePhonesInput";
import MultipleClientCodeByInsuranceInput from "@/src/components/form/MultipleClientCodeByInsuranceInput";
import SelectInput from "@/src/components/form/SelectInput";
import IntermediarySelectAsync from "@/src/components/form/IntermediarySelectAsync";
import AgentSelectAsync from "@/src/components/form/AgentSelectAsync";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import InputDate from "@/src/components/form/InputDate";
import ContactSelectAsync from "@/src/components/form/ContactSelectAsync";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FaCalendarDays } from "react-icons/fa6";
import ActivityPanel from "@/src/components/activities/ActivityPanel";
import { handleApiError, handleFrontError } from "@/src/utils/api/errors";
import { createContact, getContactId, updateContact } from "@/src/lib/apis";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import Image from "next/image";
import { clsx } from "clsx";
import { VALIDATE_EMAIL_REGEX } from "@/src/utils/regularExp";
import { activitySectors } from "@/src/utils/constants";
import RelatedCustomer from "./RelatedCustomer";
import UserSelectAsync from "@/src/components/form/UserSelectAsync";
import AddressInput from "@/src/components/form/AddressInput";
import useContactContext from "@/src/context/contacts";

export default function ContactGeneral({ contact, id, refPrint }) {
  const { lists } = useAppContext();
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [type, setType] = useState("fisica");
  const { mutate: mutateContacts } = useContactContext();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if (contact) {
      setSelectedProfileImage({ base64: contact?.photo || null, file: null });
    }
  }, [contact, lists]);

  useEffect(() => {
    if (params.get("edit") === "true") {
      setIsEdit(true);
    }
  }, [params.get("edit")]);

  useEffect(() => {
    if (!params.get("type")) return;

    setType(params.get("type"));
    setValue("typePerson", params.get("type"));
  }, [params.get("type")]);

  useEffect(() => {
    if (!params.get("copy")) return;
    setLoading(true);
    const getContactCopy = async (contactId) => {
      const response = await getContactId(contactId);
      if (response?.name) {
        setValue("name", response?.name);
      } else {
        setValue("name", response?.fullName);
      }
      if (response?.lastName) setValue("lastName", response?.lastName);
      setLoading(false);
    };
    getContactCopy(params.get("copy"));
  }, [params.get("copy")]);

  const schema = Yup.object().shape({
    fullName: Yup.string(),
    name: Yup.string()
      .required(t("common:validations:required"))
      .min(2, t("common:validations:min", { min: 2 })),
    lastName: Yup.string().when("typePerson", {
      is: (value) => value === "fisica",
      then: (schema) =>
        schema
          .required(t("common:validations:required"))
          .min(2, t("common:validations:min", { min: 2 })),
      otherwise: (schema) => schema,
    }),
    cargo: Yup.string(),
    rfc: Yup.string(),
    typeContact: Yup.string(),
    sourceId: Yup.string(),
    address: Yup.string(),
    assignedById: Yup.string(),
    birthdate: Yup.string(),
    typePerson: Yup.string(),
    observerId: Yup.string(),
    subAgentId: Yup.string(),
    agenteIntermediarioId: Yup.string(),
    typeId: Yup.string(),
    observations: Yup.string(),
    emails_dto: Yup.array().of(
      Yup.object().shape({
        email: Yup.string().matches(
          VALIDATE_EMAIL_REGEX,
          t("common:validations:email")
        ),
        relation: Yup.string(),
      })
    ),
    phones_dto: Yup.array().of(
      Yup.object().shape({
        number: Yup.string(),
        relation: Yup.string(),
      })
    ),
    codigos_dto: Yup.array().of(
      Yup.object().shape({
        codigo: Yup.string(),
        insuranceId: Yup.string(),
      })
    ),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      emails_dto: contact?.emails?.length
        ? contact?.emails?.map((e) => ({
            email: e?.email?.email,
            relation: e?.relation ?? "",
          }))
        : [
            {
              email: "",
              relation: "",
            },
          ],
      phones_dto: contact?.phones?.length
        ? contact?.phones?.map((e) => ({
            number: e?.phone?.number,
            relation: e?.relation ?? "",
          }))
        : [
            {
              number: "",
              relation: "",
            },
          ],
      codigos_dto: contact?.codigos?.length
        ? contact?.codigos?.map((e) => ({
            codigo: e?.codigo ?? "",
            insuranceId: e?.insurance?.id ?? "",
          }))
        : [
            {
              codigo: "",
              insuranceId: "",
            },
          ],
    },
  });

  useEffect(() => {
    if (!id) {
      setIsEdit(true);
      return;
    }
    setLoading(true);

    if (contact?.typePerson) {
      setType(contact?.typePerson);
      setValue("typePerson", contact?.typePerson);
    }
    if (contact?.relatedContact && contact?.typePerson == "moral") {
      setValue("contact", contact?.relatedContact?.id);
    }
    if (contact?.fullName) setValue("fullName", contact?.fullName);
    if (contact?.name) {
      setValue("name", contact?.name);
    } else {
      setValue("name", contact?.fullName);
    }
    if (contact?.lastName) setValue("lastName", contact?.lastName);
    if (contact?.cargo) setValue("cargo", contact?.cargo);
    if (contact?.type?.id) setValue("typeId", contact?.type?.id);
    if (contact?.source?.id) setValue("sourceId", contact?.source?.id);
    if (contact?.birthdate) setValue("birthdate", contact?.birthdate);
    if (contact?.address) setValue("address", contact?.address);
    if (contact?.rfc) setValue("rfc", contact?.rfc);
    if (contact?.assignedBy) setValue("assignedById", contact?.assignedBy?.id);
    if (contact?.agenteIntermediario)
      setValue("agenteIntermediarioId", contact?.agenteIntermediario?.id);
    if (contact?.observer) setValue("observerId", contact?.observer?.id);
    if (contact?.subAgente) setValue("subAgentId", contact?.subAgente?.id);
    if (contact?.observations) setValue("observations", contact?.observations);
    if (contact?.activitySector)
      setValue("activitySector", contact?.activitySector);

    setLoading(false);
  }, [contact, id]);

  useEffect(() => {
    if (!lists?.listContact?.contactTypes) return;
    if ((contact && !contact?.type?.id) || !contact) {
      const contactType = lists?.listContact?.contactTypes.find((x) =>
        /contratante/gi.test(x.name)
      );
      if (contactType) {
        setValue("typeId", contactType?.id);
      }
    }
  }, [lists?.listContact?.contactTypes]);

  const handleProfileImageChange = useCallback((event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedProfileImage({ base64: e.target.result, file: file });
      };

      reader.readAsDataURL(file);
    }
  }, []);

  const handleFormSubmit = async (data) => {
    const { contact: client, subAgent, ...info } = data;
    const body = {
      ...info,
    };

    if (selectedProfileImage?.file) {
      body.photo = selectedProfileImage?.file || "";
    }

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
    formData.append("relatedContactId", client?.id ?? "");

    try {
      setLoading(true);
      if (!contact) {
        const response = await createContact(formData);
        if (response.hasError) {
          handleFrontError(response);
          setLoading(false);
          return;
        }
        toast.success(t("contacts:create:msg"));
        router.back();
      } else {
        const response = await updateContact(formData, id);
        console.log({ response });
        if (response.hasError) {
          handleFrontError(response);
          setLoading(false);
          return;
        }
        toast.success(t("contacts:edit:updated-contact"));
        mutate(`/sales/crm/contacts/${id}`);
        mutateContacts();
        setIsEdit(false);
      }
      setLoading(false);
    } catch (error) {
      handleApiError(error.message);
      setLoading(false);
    }
  };

  // Calculate the user's 18th birthday
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  return (
    <Fragment>
      <div className="px-4 lg:px-8 h-full w-full">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className={clsx(
            "grid grid-cols-1 lg:h-full bg-gray-100 rounded-lg  w-full",
            {
              "lg:grid-cols-12": contact,
            }
          )}
          ref={refPrint}
        >
          {/* Panel Principal */}

          {/* Menu Izquierda */}
          <div className=" bg-gray-100 p-4 lg:overflow-y-scroll rounded-lg lg:col-span-5 ">
            <div className="flex justify-between bg-white py-4 px-3 rounded-md">
              <h1 className="">{t("contacts:create:data")}</h1>
              {contact && (
                <button
                  type="button"
                  disabled={!id}
                  onClick={() => setIsEdit(!isEdit)}
                  title="Editar"
                >
                  <PencilIcon className="h-6 w-6 text-primary" />
                </button>
              )}
            </div>
            <div className="flex justify-center">
              {isEdit ? (
                <ProfileImageInput
                  selectedProfileImage={selectedProfileImage}
                  onChange={handleProfileImageChange}
                  disabled={!isEdit}
                />
              ) : (
                <div className="pb-2 pt-4">
                  <Image
                    width={96}
                    height={96}
                    src={selectedProfileImage?.base64 || "/img/avatar.svg"}
                    alt="Profile picture"
                    className="h-[150px] w-[150px] flex-none rounded-full text-white fill-white bg-zinc-200 object-cover items-center justify-center"
                    objectFit="fill"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 pb-20 pt-4">
              {isEdit && (
                <Fragment>
                  <TextInput
                    type="text"
                    label={
                      type == "fisica"
                        ? t("contacts:create:name")
                        : t("contacts:create:fullname-company")
                    }
                    placeholder={t("contacts:create:placeholder-name")}
                    error={errors.name}
                    register={register}
                    name="name"
                    disabled={!isEdit}
                  />
                  {type == "fisica" && (
                    <TextInput
                      type="text"
                      label={t("contacts:create:lastName")}
                      placeholder={t("contacts:create:placeholder-name")}
                      error={errors.lastName}
                      register={register}
                      name="lastName"
                      disabled={!isEdit}
                    />
                  )}
                </Fragment>
              )}
              {!isEdit && (
                <TextInput
                  type="text"
                  label={
                    type == "fisica"
                      ? t("contacts:create:fullname")
                      : t("contacts:create:fullname-company")
                  }
                  placeholder={t("contacts:create:placeholder-name")}
                  error={errors.fullName}
                  register={register}
                  name="fullName"
                  disabled={!isEdit}
                />
              )}
              <MultiplePhonesInput
                label={t("contacts:create:phone")}
                errors={errors.phones_dto}
                register={register}
                name="phones_dto"
                disabled={!isEdit}
                control={control}
                watch={watch}
                setValue={setValue}
              />
              <MultipleEmailsInput
                label={t("contacts:create:email")}
                errors={errors.emails_dto}
                register={register}
                name="emails_dto"
                disabled={!isEdit}
                control={control}
                watch={watch}
                setValue={setValue}
              />
              <MultipleClientCodeByInsuranceInput
                label={t("contacts:create:codigo")}
                errors={errors.codigos_dto}
                register={register}
                name="codigos_dto"
                disabled={!isEdit}
                control={control}
                watch={watch}
                setValue={setValue}
              />
              <TextInput
                label={t("contacts:create:rfc")}
                placeholder="XEXX010101000"
                error={errors.rfc}
                register={register}
                name="rfc"
                disabled={!isEdit}
              />
              {type == "fisica" && (
                <Controller
                  render={({ field: { value, onChange, ref, onBlur } }) => {
                    return (
                      <InputDate
                        label={t("contacts:create:born-date")}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        icon={
                          <FaCalendarDays className="h-3 w-3 text-primary pr-4 mr-2" />
                        }
                        error={errors.birthdate}
                        disabled={!isEdit}
                        inactiveDate={eighteenYearsAgo}
                      />
                    );
                  }}
                  name="birthdate"
                  control={control}
                  defaultValue=""
                />
              )}
              <SelectInput
                label={t("contacts:create:typePerson")}
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
                placeholder="- Seleccionar -"
                watch={watch}
                name="typePerson"
                disabled={!isEdit}
                setSelectedOption={(option) => option?.id && setType(option.id)}
                setValue={setValue}
                error={!watch("typePerson") && errors.typePerson}
              />
              <SelectInput
                label={
                  type == "fisica"
                    ? t("contacts:create:contact-type")
                    : t("contacts:create:contact-type-company")
                }
                options={lists?.listContact?.contactTypes}
                name="typeId"
                error={errors.typeId}
                register={register}
                setValue={setValue}
                disabled={!isEdit}
                watch={watch}
              />
              {watch("typeId") == "Otro" ? (
                <TextInput
                  label={t("contacts:create:otherType")}
                  placeholder=""
                  error={errors.otherType}
                  register={register}
                  name="otherType"
                  disabled={!isEdit}
                  //value={watch('otherType')}
                />
              ) : null}
              {type == "fisica" && (
                <Fragment>
                  <TextInput
                    label={t("contacts:create:position")}
                    placeholder={t("contacts:create:position")}
                    error={errors.cargo}
                    register={register}
                    name="cargo"
                    disabled={!isEdit}
                  />

                  <SelectInput
                    label={t("contacts:create:origen")}
                    name="sourceId"
                    options={lists?.listContact?.contactSources}
                    error={errors.sourceId}
                    register={register}
                    setValue={setValue}
                    disabled={!isEdit}
                    watch={watch}
                  />
                  <AddressInput
                    label={t("contacts:create:address")}
                    error={errors.address}
                    register={register}
                    name="address"
                    placeholder={t("contacts:create:placeholder-address")}
                    disabled={!isEdit}
                    setValue={setValue}
                  />
                </Fragment>
              )}
              <UserSelectAsync
                label={t("contacts:create:responsible")}
                name="assignedById"
                register={register}
                disabled={!isEdit}
                error={errors.assignedById}
                setValue={setValue}
                watch={watch}
              />
              <UserSelectAsync
                label={t("contacts:create:observer")}
                name="observerId"
                register={register}
                disabled={!isEdit}
                error={errors.observerId}
                setValue={setValue}
                watch={watch}
              />
              <AgentSelectAsync
                label={t("contacts:create:sub-agent")}
                name="subAgentId"
                register={register}
                disabled={!isEdit}
                error={errors.subAgentId}
                setValue={setValue}
                watch={watch}
              />

              <IntermediarySelectAsync
                label={t("contacts:create:intermediario")}
                name="agenteIntermediarioId"
                disabled={!isEdit}
                error={errors.agenteIntermediarioId}
                setValue={setValue}
                watch={watch}
              />
              {type == "moral" && (
                <SelectInput
                  label={t("contacts:create:company-activity")}
                  options={activitySectors.map((activity) => ({
                    name: activity,
                    id: activity,
                  }))}
                  watch={watch}
                  name="activitySector"
                  disabled={!isEdit}
                  setValue={setValue}
                  error={!watch("activitySector") && errors.activitySector}
                />
              )}

              {type == "moral" && isEdit && (
                <ContactSelectAsync
                  label={"Cliente contacto"}
                  name={"contact"}
                  setValue={setValue}
                  watch={watch}
                  error={errors?.contact}
                  notFoundHelperText={() => (
                    <div>
                      <p className="px-4 py-2 text-gray-700 text-xs">
                        {t("common:not-found")}
                        {". "}
                        <span
                          className="text-primary underline cursor-pointer"
                          onClick={() =>
                            router.push(
                              "/sales/crm/contacts/contact?show=true&type=fisica"
                            )
                          }
                        >
                          {"Crear el cliente contacto"}
                        </span>
                      </p>
                    </div>
                  )}
                />
              )}
              <TextInput
                label={t("contacts:create:comments")}
                error={errors.observations}
                register={register}
                name="observations"
                disabled={!isEdit}
                multiple
              />
              {!isEdit &&
                contact?.relations &&
                contact?.relations?.map((relation) => (
                  <RelatedCustomer
                    client={relation}
                    type={type}
                    key={relation.id}
                  />
                ))}
            </div>
          </div>

          {/* Menu Derecha */}
          {id && contact && (
            <ActivityPanel
              entityId={id}
              contactType={type}
              className="lg:col-span-7"
            />
          )}
          {/* Botones de acción */}
          {(isEdit || !contact) && (
            <div
              className={clsx(
                "flex justify-center px-4 w-full py-4 gap-4 bottom-0 lg:rounded-bl-[35px] rounded-none left-0 right-0 fixed lg:absolute bg-white shadow-[0px_-2px_6px_4px_#00000017] "
              )}
            >
              <Button
                type="submit"
                label={
                  loading
                    ? t("common:buttons:saving")
                    : t("common:buttons:save")
                }
                disabled={loading}
                buttonStyle="primary"
                className="px-3 py-2"
                // onclick={() => handleSubmit(handleFormSubmit)}
              />
              <Button
                type="button"
                label={t("common:buttons:cancel")}
                disabled={loading}
                buttonStyle="secondary"
                onclick={() => router.back()}
                className="px-3 py-2"
              />
            </div>
          )}
        </form>
      </div>
    </Fragment>
  );
}
