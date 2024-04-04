"use client";
import useAppContext from "@/context/app";
import {
  PhotoIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import ActivityHeader from "../ActivityHeader";
import CardTask from "../CardTask";
import AddContactTabs from "./AddContactTabs";
import ProfileImageInput from "./ProfileImageInput";
import TextInputLocal from "./TextInputLocal";
import TextArea from "./TextArea";
import { useFormState } from "react-dom";
import { createContact } from "@/lib/api";
import useCrmContext from "@/context/crm";
import { DatePicker } from "@tremor/react";
import { es, enUS } from "date-fns/locale";
import { toast } from "react-toastify";
import { contactTypes } from "@/lib/common";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import Button from "@/components/form/Button";
import TextInput from "@/components/form/TextInput";
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import InputPhone from "@/components/form/InputPhone";
import SelectInput from "@/components/form/SelectInput";

const contactSources = [
  { id: 1, name: "Correo electrónico" },
  { id: 2, name: "Maratón de llamadas" },
  { id: 3, name: "Formulario de CRM" },
  { id: 4, name: "Formulario de devolución de llamada" },
  { id: 5, name: "Gestión del agente" },
  { id: 6, name: "Red social - LinkedIn" },
  { id: 7, name: "Red social - Instagram" },
  { id: 8, name: "Red social - Facebook" },
  { id: 9, name: "Red social - Otra" },
  { id: 10, name: "Otro CRM" },
  { id: 11, name: "Página de ventas" },
  { id: 12, name: "Teléfono" },
  { id: 13, name: "WhatsApp" },
];

const timeline = [
  {
    id: 1,
    child: ActivityHeader,
    content: "Applied to",
    target: "Front End Developer",
    href: "#",
    date: "Sep 20",
    datetime: "2020-09-20",
    icon: UserIcon,
    iconBackground: "bg-gray-400",
  },
  {
    id: 2,
    content: "Advanced to phone screening by",
    child: CardTask,
    target: "Bethany Blake",
    href: "#",
    date: "Sep 22",
    datetime: "2020-09-22",
    icon: VideoCameraIcon,
    iconBackground: "bg-blue-500",
  },
];

const initialState = {
  email: "",
};

const sexoOptions = [
  { id: 1, name: "Masculino" },
  { id: 2, name: "Femenino" },
  { id: 3, name: "Otro" },
];

const filterOptions = (query, options) => {
  return query === ""
    ? options
    : options.filter((option) =>
        option.name.toLowerCase().includes(query.toLowerCase())
      );
};

export default function CreateContact() {
  const { t } = useTranslation();
  const { locale }= useParams()
  const { setOpenModal } = useAppContext();
  const { crmUsers, setLastContactsUpdate } = useCrmContext();

  const [query, setQuery] = useState("");
  const [querySource, setQuerySource] = useState("");
  const [queryResponsible, setQueryResponsible] = useState("");
  const [querySexo, setQuerySexo] = useState("");

  const [contactType, setContactType] = useState(null);
  const [contactSource, setContactSource] = useState(null);
  const [contactResponsible, setContactResponsible] = useState(null);
  const [contactSexo, setContactSexo] = useState(null);

  // const [errors, setErrors] = useState({});

  const [birthday, setBirthday] = useState(null);

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [state, formAction] = useFormState(createContact, initialState);
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    email: Yup
      .string()
      .required(t('common:validations:required'))
      .email(t('common:validations:email'))
      .min(5,  t('common:validations:min', {min: 5})),
    name: Yup.string().required(t('common:validations:required')).min(2, t('common:validations:min', {min: 2})),
    charge: Yup.string().required(t('common:validations:required')),
    phone: Yup.string().required(t('common:validations:required')),
    rfc: Yup.string().required(t('common:validations:required')),
    cua: Yup.string().required(t('common:validations:required')),
    typeContact: Yup.string().required(t('common:validations:required')),
    origin: Yup.string().required(t('common:validations:required')),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isValid, errors },
  } = useForm({
      defaultValues: {
      },
      mode: "onChange",
      resolver: yupResolver(schema),
  });
  
  const handleProfileImageChange = useCallback((event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedProfileImage(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }, []);

  const handleBirthdayChange = useCallback((value) => {
    const date = new Date(value);
    const formattedDate = value ? date?.toISOString().split("T")[0] : "";
    setBirthday(formattedDate);
  }, []);
  
  const handleFormSubmit = async (data) => {
    console.log("data", data)
    // event.preventDefault();
    // // setErrors({});
    // setLoading(true);

    // const formData = new FormData(event.target);

    // try {
    //   const result = await createContact(state, formData);

    //   if (!result?.success) {
    //     if (result?.errors) {
    //       // setErrors(result.errors);
    //     }
    //     return;
    //   }

    //   setLastContactsUpdate(Date.now());
    //   toast.success(t('contacts:create:msg'));
    //   setOpenModal(false);
    // } catch (error) {
    //   toast.error(t('contacts:create:error'));
    // } finally {
    //   setLoading(false);
    // }
  };

  const filteredContactTypes = filterOptions(query, contactTypes);
  const filteredContactSources = filterOptions(querySource, contactSources);
  const filteredContactResponsible = filterOptions(queryResponsible, crmUsers);
  const filteredSexoOptions = filterOptions(querySexo, sexoOptions);

  return (
    <div className="flex flex-col h-screen relative w-full">
      {/* Formulario Principal */}
      {loading && (
        <div className="absolute z-50 inset-0 bg-easy-800/10 w-2/5 h-full">
          {/* Loader spinner */}

          <div className="flex items-center justify-center h-full flex-col gap-2 cursor-progress">
            <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-easy-600" />
            <p className="text-easy-600 animate-pulse select-none">{t('contacts:create:save')}</p>
          </div>
        </div>
      )}
      <div
        className="flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4"
      >
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col flex-1 bg-gray-100 text-black overflow-hidden rounded-t-2xl rounded-bl-2xl relative"
        >
          {/* Encabezado del Formulario */}
          <div className="bg-transparent py-6 mx-4">
            <div className="flex items-start flex-col justify-between space-y-3">
              <div className="inset-0 bg-white/75 w-full h-36 z-50 absolute rounded-t-2xl" />
              <h1 className="text-2xl">{t("contacts:create:client")}</h1>
              <AddContactTabs />
            </div>
          </div>

          {/* Panel Principal */}
          <div className="flex flex-col sm:flex-row h-full pb-[13.5rem] bg-white mx-4 rounded-lg p-4 w-full">
            {/* Menu Izquierda */}
            <div className="sm:w-2/5 bg-gray-100 overflow-y-scroll rounded-lg">
              <h1 className="bg-white py-4 px-4 rounded-md">
                {t('contacts:create:data')}
              </h1>
              <div className="flex justify-center">
                <ProfileImageInput
                  selectedProfileImage={selectedProfileImage}
                  onChange={handleProfileImageChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-xl lg:px-12 mx-auto mb-10 mt-8">
                <TextInput
                  type="text"
                  label={t('contacts:create:name')}
                  placeholder={t('contacts:create:placeholder-name')}
                  error={errors.name}
                  register={register}
                  name="name"
                />
                <TextInput
                  label={t('contacts:create:charge')}
                  placeholder={t('contacts:create:charge')}
                  error={errors.charge}
                  register={register}
                  name="charge"
                />
                <Controller
                    render={({ field: { ref, ...field } }) => {
                        return (
                          <InputPhone
                              name="phone"
                              field={field}
                              error={errors.phone}
                              label={t('contacts:create:phone')}
                              defaultValue={field.value}
                          />
                        );
                    }}
                    name="phone"
                    control={control}
                    defaultValue=""
                />
                <TextInput
                  label={t('contacts:create:email')}
                  placeholder={t('contacts:create:placeholder-lastname')}
                  error={errors.email}
                  register={register}
                  name="email"
                />
                <TextInput
                  label={t('contacts:create:rfc')}
                  placeholder="XEXX010101000"
                  error={errors.rfc}
                  register={register}
                  name="rfc"
                />
                <TextInput
                  label={t('contacts:create:cua')}
                  placeholder={t('contacts:create:placeholder-name')}
                  error={errors.cua}
                  register={register}
                  name="cua"
                />
                <SelectInput
                  label={t('contacts:create:contact-type')}
                  options={filteredContactTypes}
                  selectedOption={contactType}
                  setSelectedOption={setContactType}
                  onChangeInput={setQuery}
                  // query={query}
                  name="typeContact"
                  error={errors.typeContact}
                  register={register}
                />
                <SelectInput
                  label={t('contacts:create:origen')}
                  name="origin"
                  options={filteredContactSources}
                  selectedOption={contactSource}
                  setSelectedOption={setContactSource}
                  onChangeInput={setQuerySource}
                  className="pb-4"
                  error={errors.origin}
                  register={register}
                />
                {/* <TextInputLocal label={t('contacts:create:charge')} id="position" placeholder={t('contacts:create:charge')} />
                <TextInputLocal
                  label={t('contacts:create:curp')}
                  id="curp"
                  placeholder="124125153534"
                  hidden
                  errors={errors}
                />
                <TextInputLocal
                  label={t('contacts:create:phone')}
                  id="telefono"
                  placeholder="+1 (555) 987-6543"
                  type="tel"
                />
                <TextInputLocal
                  label={t('contacts:create:email')}
                  id="email"
                  placeholder="usuario@domain.com"
                  type="email"
                  errors={errors}
                />
                <div className="col-span-full">
                  <label
                    htmlFor="nacimiento"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {t('contacts:create:born-date')}
                  </label>
                  <DatePicker
                    locale={locale === "es" ? es : enUS}
                    enableYearNavigation={true}
                    placeholder={t('contacts:create:select')}
                    displayFormat="dd/MM/yyyy"
                    onValueChange={handleBirthdayChange}
                  />
                  <input
                    type="hidden"
                    name="nacimiento"
                    id="nacimiento"
                    value={birthday}
                  />
                </div>
                <SelectInput
                  label={t('contacts:create:sex')}
                  id="sexo"
                  options={filteredSexoOptions}
                  selectedOption={contactSexo}
                  setSelectedOption={setContactSexo}
                  onChangeInput={setQuerySexo}
                />
                <TextInputLocal
                  label={t('contacts:create:rfc')}
                  id="rfc"
                  placeholder="XEXX010101000"
                />
                <TextInputLocal
                  label={t('contacts:create:zip-code')}
                  id="postal"
                  placeholder="Ej.: 12345"
                  hidden
                  type="text"
                />
                <DocumentSelector />
                <TextArea
                  label={t('contacts:create:address')}
                  id="direccion"
                  placeholder={t('contacts:create:placeholder-address')}
                />
                <SelectInput
                  label={t('contacts:create:contact-type')}
                  id="tipoContacto"
                  options={filteredContactTypes}
                  selectedOption={contactType}
                  setSelectedOption={setContactType}
                  onChangeInput={setQuery}
                />
                <SelectInput
                  label={t('contacts:create:responsible')}
                  id="responsible"
                  options={filteredContactResponsible}
                  selectedOption={contactResponsible}
                  setSelectedOption={setContactResponsible}
                  onChangeInput={setQueryResponsible}
                />
                <TextInputLocal label={t('contacts:create:agent')} id="agente" placeholder={t('contacts:create:agent')} />
                <TextInputLocal
                  label={t('contacts:create:sub-agent')}
                  id="subAgente"
                  placeholder={t('contacts:create:sub-agent')}
                />
                <SelectInput
                  label={t('contacts:create:origen')}
                  id="origen"
                  options={filteredContactSources}
                  selectedOption={contactSource}
                  setSelectedOption={setContactSource}
                  onChangeInput={setQuerySource}
                  className="pb-4"
                /> */}
              </div>
            </div>

            {/* Menu Derecha */}
            <ActivityPanel editing={true} />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center px-4 py-4 gap-4 sticky bottom-0 bg-white">
            <Button 
              type="submit"
              label={loading ? t('common:buttons:saving') : t('common:buttons:save')}
              disabled={loading}
              buttonStyle="primary"
              // onclick={() => handleSubmit(handleFormSubmit)}
            />
            <Button 
              type="button"
              label={t('common:buttons:cancel')}
              disabled={loading}
              buttonStyle="secondary"
              onClick={() => setOpenModal(false)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

function DocumentSelector() {
  const { t } = useTranslation();
  return (
    <div className="col-span-full">
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {t('contacts:create:passport')}
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <PhotoIcon
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-zinc-100 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>{t('contacts:create:upload-file')}</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
              />
            </label>
            <p className="pl-1">{t('contacts:create:drap-drop')}</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            {t('contacts:create:png')}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityPanel({ editing }) {
  return (
    <div className="px-4 py-6 relative bg-gray-100 rounded-tr-lg w-full sm:w-3/5">
      {editing && (
        <div className="inset-0 bg-white/75 w-full h-full z-50 absolute rounded-tr-lg" />
      )}
      <div className="flow-root bg-gray-300 rounded-lg">
        <ul role="list" className="p-3">
          {timeline.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-4">
                {eventIdx !== timeline.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-zinc-400"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={clsx(
                        event.iconBackground,
                        "h-10 w-10 rounded-full flex items-center justify-center"
                      )}
                    >
                      <event.icon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  {<event.child />}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
