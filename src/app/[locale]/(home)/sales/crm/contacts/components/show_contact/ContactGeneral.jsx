import {
  PencilSquareIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/20/solid";
import React, { useState } from "react";
import ProfileImageInput from "../create_contact/ProfileImageInput";
import TextInputLocal from "../create_contact/TextInputLocal";
import SelectInput from "../create_contact/SelectInput";
import TextareaLabel from "../TextareaLabel";
import ContactActivityPanel from "../ContactActivityPanel";
import ActivityHeader from "../ActivityHeader";
import CardTask from "../CardTask";
import clsx from "clsx";
import { contactTypes, filterOptions, getURLContactPhoto } from "@/lib/common";
import useCrmContext from "@/context/crm";
import { createContact, updateContact } from "@/lib/api";
import useAppContext from "@/context/app";
import { useTranslation } from "react-i18next";

export const revalidate = 3600;

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

const sexoOptions = [
  { id: 1, name: "Masculino" },
  { id: 2, name: "Femenino" },
  { id: 3, name: "Otro" },
];

export default function ContactGeneral() {
  const {
    currentContact,
    contactEditMode,
    crmUsers,
    setContactEditMode,
    setLastContactsUpdate,
  } = useCrmContext();
  const editMode = false;
  const [contactGender, setContactGender] = useState(null);
  const [contactName, setContactName] = useState(null);
  const { t } = useTranslation();

  // if (!currentContact?) {
  //   return <div>{t("contacts:edit:not-contact")}</div>;
  // }

  const contactNameValue = () => {
    if (contactName) return contactName;
    return currentContact?.nombre;
  };

  const contactGenderValue = () => {
    if (contactGender) return contactGender;
    return sexoOptions.find((option) => option.id === currentContact?.sexo);
  };


  return (
    <div
      className={clsx(
        "flex flex-col sm:flex-row h-full bg-zinc-100 mx-4 rounded-lg",
        editMode && "pb-[13.5rem]"
      )}
    >
      {/* Menu Izquierda */}
      <div className="sm:w-1/2 bg-transparent p-4 overflow-y-scroll">
        <h1 className="bg-zinc-200 py-4 px-4 rounded-md flex justify-between">
          {t('contacts:create:data')}
          <button
            type="button"
            onClick={() => {
              setContactEditMode(!contactEditMode);
            }}
          >
            <span className="sr-only">{t("contacts:edit:edit")}</span>
            <PencilSquareIcon className="h-6 w-6 text-gray-500 hover:text-indigo-400" />
          </button>
        </h1>
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-xl sm:grid-cols-6 h-full px-1 lg:px-12 mx-auto">
          <ProfileImageInput
            selectedProfileImage={getURLContactPhoto(currentContact)}
          />
          <TextInputLocal
            label={t('contacts:create:name')}
            id="nombre"
            value={contactNameValue()}
            disabled={!contactEditMode}
            onChange={(e) => setContactName(e.target.value)}
          />
          <TextInputLocal
            label={t('contacts:create:lastName')}
            id="apellidos"
            disabled={!contactEditMode}
            value={currentContact?.apellidos}
          />
          <TextInputLocal
            label={t('contacts:create:charge')}
            id="cargo"
            disabled={!contactEditMode}
            value={currentContact?.cargo}
          />
          <TextInputLocal
            label={t('contacts:create:curp')}
            id="curp"
            disabled={!contactEditMode}
            value={currentContact?.cargo}
            hidden
          />
          <TextInputLocal
            label={t('contacts:create:phone')}
            id="telefono"
            disabled={!contactEditMode}
            value={currentContact?.telefono}
          />
          <TextInputLocal
            label={t('contacts:create:email')}
            id="email"
            type="email"
            disabled={!contactEditMode}
            value={currentContact?.email}
          />
          <TextInputLocal
            label={t('contacts:create:born-date')}
            id="nacimiento"
            type="date"
            disabled={!contactEditMode}
            value={currentContact?.nacimiento}
          />
          <SelectInput
            label={t('contacts:create:sex')}
            id="sexo"
            options={sexoOptions}
            disabled={!contactEditMode}
            selectedOption={contactGenderValue()}
            setSelectedOption={setContactGender}
          />
          <TextInputLocal label={t('contacts:create:rfc')} id="rfc" value={currentContact?.rfc} />
          <TextInputLocal
            label={t('contacts:create:zip-code')}
            id="postal"
            value={currentContact?.postal}
          />
          <TextareaLabel
            label={t('contacts:create:address')}
            id="direccion"
            value={currentContact?.direccion}
          />
          <SelectInput
            label={t('contacts:create:contact-type')}
            id="contactType"
            options={contactTypes}
            selectedOption={contactTypes.find(
              (option) => option.id === currentContact?.contactType
            )}
            setSelectedOption={contactTypes.find(
              (option) => option.id === currentContact?.contactType
            )}
          />
          <SelectInput label={t('contacts:create:responsible')} id="responsible" />
          <TextInputLocal
            label={t('contacts:create:agent')} 
            id="agente"
            value={currentContact?.agente}
          />
          <TextInputLocal
            label={t('contacts:create:sub-agent')}
            id="subAgente"
            value={currentContact?.subAgente}
          />
          <SelectInput
            label={t('contacts:create:origen')}
            id="contactSource"
            options={sexoOptions}
          />
        </div>
      </div>

      <ContactActivityPanel editing={false} timeline={timeline} />
    </div>
  );
}
