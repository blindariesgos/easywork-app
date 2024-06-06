"use client";
import React from "react";
import SelectRamo from "./SelectRamo";
import { PlusIcon, Cog8ToothIcon } from "@heroicons/react/20/solid";
//import { subirPolizaPDF } from '../../../../../../../../../lib/api';
import { useFormState } from "react-dom";
import useCrmContext from "../../../../../../../../../context/crm";
import { useTranslation } from "react-i18next";
import {
  useCommon,
  usePolicies,
} from "../../../../../../../../../hooks/useCommon";
import Button from "../../../../../../../../../components/form/Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import DialogUploadFile from "./DialogUploadFile";
import IconDropdown from "../../../../../../../../../components/SettingsButton";

const initialState = {
  filePdf: "",
  aseguradora: "",
  tipo: "",
};

export default function PolizasHeader({ contactID, selected }) {
  const { settingsPolicies: settings, trash } = useCommon();
  const { branches: ramo } = usePolicies(contactID);
  const { t } = useTranslation();
  const { push } = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const buttonStyle = (type) => {
    switch (type) {
      case "general":
        return "bg-blue-100 text-white hover:bg-blue-100 ring-offset-blue-100";

      default:
        break;
    }
  };

  return (
    <div className="bg-white w-full p-2 rounded-md">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center flex-wrap">
          <button
            type="button"
            className={`rounded-md px-3 py-2 text-gray-400 text-sm font-medium focus:outline-none focus:ring-0 ${
              selected && buttonStyle(selected)
            }`}
            onClick={() =>
              push(
                `/sales/crm/contacts/contact/policies/${contactID}?show=true`
              )
            }
          >
            {t("contacts:edit:policies:general")}
          </button>
          <SelectRamo options={ramo} selected={selected} />
          <Button
            type="button"
            label={t("contacts:edit:policies:documents")}
            buttonStyle="text"
            fontSize="text-sm "
            className="px-3"
          />

          <Button
            type="button"
            label={t("contacts:create:add")}
            buttonStyle="primary"
            icon={<PlusIcon className="h-4 w-4 text-white" />}
            className="py-2 px-3"
            onclick={() => setIsOpen(true)}
          />
        </div>
        <div className="flex gap-3">
          <IconDropdown
            icon={
              <TrashIcon className="h-8 w-8 text-primary" aria-hidden="true" />
            }
            options={trash}
            width="w-72"
          />
          <IconDropdown
            icon={
              <Cog8ToothIcon
                className="h-8 w-8 text-primary"
                aria-hidden="true"
              />
            }
            options={settings}
            width="w-[340px]"
            colorIcon="text-green-100"
            excel={t("leads:header:excel:export")}
          />
        </div>
        <DialogUploadFile
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          contactID={contactID}
        />
      </div>
    </div>
  );
}
