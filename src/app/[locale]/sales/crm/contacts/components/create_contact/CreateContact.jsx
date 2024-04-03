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
import SelectInput from "./SelectInput";
import { useFormState } from "react-dom";
import { createContact } from "@/lib/api";
import useCrmContext from "@/context/crm";
import { DatePicker } from "@tremor/react";
import { es } from "date-fns/locale";
import { toast } from "react-toastify";
import { contactTypes } from "@/lib/common";

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

  const [errors, setErrors] = useState({});

  const [birthday, setBirthday] = useState(null);

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [state, formAction] = useFormState(createContact, initialState);
  const [loading, setLoading] = useState(false);

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
    // format date from "Mon Feb 05 2024 00:00:00 GMT-0400 (hora de Venezuela)" to mysql format "2024-02-05"
    const date = new Date(value);
    const formattedDate = date.toISOString().split("T")[0];
    setBirthday(formattedDate);
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(event.target);

    try {
      const result = await createContact(state, formData);

      if (!result?.success) {
        if (result?.errors) {
          setErrors(result.errors);
        }
        return;
      }

      setLastContactsUpdate(Date.now());
      toast.success("¡Contacto creado!");
      setOpenModal(false);
    } catch (error) {
      toast.error("Error al crear el contacto!");
    } finally {
      setLoading(false);
    }
  };

  const filteredContactTypes = filterOptions(query, contactTypes);
  const filteredContactSources = filterOptions(querySource, contactSources);
  const filteredContactResponsible = filterOptions(queryResponsible, crmUsers);
  const filteredSexoOptions = filterOptions(querySexo, sexoOptions);

  return (
    <div className="flex flex-col h-screen relative">
      {/* Formulario Principal */}
      {loading && (
        <div className="absolute z-50 inset-0 bg-easy-800/10 w-1/2 h-full">
          {/* Loader spinner */}

          <div className="flex items-center justify-center h-full flex-col gap-2 cursor-progress">
            <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-easy-600" />
            <p className="text-easy-600 animate-pulse select-none">Guardando...</p>
          </div>
        </div>
      )}
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col flex-1 bg-zinc-200 opacity-100 shadow-xl text-zinc-800 overflow-hidden"
      >
        {/* Encabezado del Formulario */}
        <div className="bg-transparent py-6 mx-4">
          <div className="flex items-start flex-col justify-between space-y-3">
            <h1 className="text-2xl">Nuevo Cliente</h1>
            <AddContactTabs />
          </div>
        </div>

        {/* Panel Principal */}
        <div className="flex flex-col sm:flex-row h-full pb-[13.5rem] bg-zinc-100 mx-4 rounded-lg">
          {/* Menu Izquierda */}
          <div className="sm:w-1/2 bg-transparent p-4 overflow-y-scroll">
            <h1 className="bg-zinc-200 py-4 px-4 rounded-md">
              Datos del Contratante
            </h1>
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-xl sm:grid-cols-6 h-full px-1 lg:px-12 mx-auto">
              <ProfileImageInput
                selectedProfileImage={selectedProfileImage}
                onChange={handleProfileImageChange}
              />
              <TextInputLocal
                label="Nombres"
                id="nombre"
                placeholder="Ej.: Luis"
                required
                errors={errors}
              />
              <TextInputLocal
                label="Apellidos"
                id="apellidos"
                placeholder="Ej.: Herrera"
                errors={errors}
              />
              <TextInputLocal label="Cargo" id="position" placeholder="Cargo" />
              <TextInputLocal
                label="CURP"
                id="curp"
                placeholder="124125153534"
                hidden
                errors={errors}
              />
              <TextInputLocal
                label="Teléfono"
                id="telefono"
                placeholder="+1 (555) 987-6543"
                type="tel"
              />
              <TextInputLocal
                label="Email"
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
                  Fecha de nacimiento
                </label>
                <DatePicker
                  locale={es}
                  enableYearNavigation={true}
                  placeholder="Seleccionar"
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
                label="Sexo"
                id="sexo"
                options={filteredSexoOptions}
                selectedOption={contactSexo}
                setSelectedOption={setContactSexo}
                onChangeInput={setQuerySexo}
              />
              <TextInputLocal
                label="RFC"
                id="rfc"
                placeholder="XEXX010101000"
              />
              <TextInputLocal
                label="Código Postal"
                id="postal"
                placeholder="Ej.: 12345"
                hidden
                type="text"
              />
              <DocumentSelector />
              <TextArea
                label="Dirección"
                id="direccion"
                placeholder="Escriba la dirección del cliente."
              />
              <SelectInput
                label="Tipo de contacto"
                id="tipoContacto"
                options={filteredContactTypes}
                selectedOption={contactType}
                setSelectedOption={setContactType}
                onChangeInput={setQuery}
              />
              <SelectInput
                label="Responsable"
                id="responsible"
                options={filteredContactResponsible}
                selectedOption={contactResponsible}
                setSelectedOption={setContactResponsible}
                onChangeInput={setQueryResponsible}
              />
              <TextInputLocal label="Agente" id="agente" placeholder="Agente" />
              <TextInputLocal
                label="Sub-Agente"
                id="subAgente"
                placeholder="Sub Agente"
              />
              <SelectInput
                label="Origen"
                id="origen"
                options={filteredContactSources}
                selectedOption={contactSource}
                setSelectedOption={setContactSource}
                onChangeInput={setQuerySource}
                className="pb-4"
              />
            </div>
          </div>

          {/* Menu Derecha */}
          <ActivityPanel editing={true} />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-start px-4 py-4 sticky bottom-0 bg-zinc-200">
          <button
            type="submit"
            aria-disabled={loading}
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            className="ml-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
            onClick={() => setOpenModal(false)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

function DocumentSelector() {
  return (
    <div className="col-span-full">
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Identificaciones INE, RFC o Pasaporte
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
              <span>Subir un archivo</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
              />
            </label>
            <p className="pl-1">o arrastrar y soltar</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG, JPG, PDF hasta 5MB
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityPanel({ editing }) {
  return (
    <div className="px-4 py-6 sm:w-1/2 relative">
      {editing && (
        <div className="inset-0 bg-white/75 w-full h-full z-50 absolute rounded-tr-lg" />
      )}
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {timeline.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
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
                        "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-zinc-100"
                      )}
                    >
                      <event.icon
                        className="h-5 w-5 text-white "
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
