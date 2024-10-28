import SelectInput from "@/src/components/form/SelectInput";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import { useTranslation } from "react-i18next";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "@/src/components/form/TextInput";
import CheckboxInput from "@/src/components/form/CheckboxInput";
import FileInput from "@/src/components/form/FileInput";
import useAppContext from "@/src/context/app";
import Button from "@/src/components/form/Button";
import { Fragment } from "react";

const Fields = ({ handleNext, handleBack }) => {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const schema = yup.object().shape({
    fields: yup.array().of(yup.object().shape({})),
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
  });

  const fieldsKeys = [
    "id",
    "greeting",
    "name",
    "lastname",
    "second-name",
    "fullName",
    "birthday",
    "photo",
    "company",
    "responsible",
    "phone-work",
    "phone-mobile",
    "phone-fax",
    "phone-house",
    "locator-number",
    "phone-marketing",
    "phone-other",
    "url-company",
    "url-personal",
    "url-facebook",
    "url-vk",
    "LiveJournal",
    "url-twitter",
    "url-other",
    "email-work",
    "email-home",
    "email-marketing",
    "email-other",
    "account-facebook",
    "account-telegram",
    "account-vk",
    "account-skype",
    "contact-viver",
    "comment-instagram",
    "contact-network",
    "chat",
    "account-channel-open",
    "number-icq",
    "msn",
    "Jabber",
    "contact-other",
    "vinculed-user",
    "charge",
    "comment",
    "contact-type",
    "origin",
    "origin-information",
    "included",
    "disabled",
  ];

  const exampleValues = {
    name: "Jhon",
    lastname: "Smith",
    "phone-mobile": "+58234567",
    "email-work": "jhonsmit@yopmail.com",
    "contact-type": "Proveedores",
    included: "Si",
    disabled: "Si",
  };

  return (
    <div className="px-3 py-4">
      <p className="text-sm font-bold pb-4 ">
        {t("import:contacts:fields:title")}
      </p>

      <div className="grid grid-cols-4 gap-2">
        {fieldsKeys.map((key) => (
          <Fragment key={key}>
            <div className="text-sm flex items-center justify-end text-right">
              {t(`import:contacts:fields:${key}`)}
            </div>
            <div className="col-span-3">
              <div className="grid grid-cols-3">
                <div className="col-span-3 md:col-span-2 xl:col-span-1">
                  <SelectInput
                    options={fieldsKeys.map((key2) => ({
                      id: key2,
                      name: t(`import:contacts:fields:${key2}`),
                    }))}
                    selectedOption={{
                      id: key,
                      name: t(`import:contacts:fields:${key}`),
                    }}
                    name={key}
                    setValue={setValue}
                    border
                  />
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div className="py-4">
        <p className="text-sm font-bold py-4 rounded-[10px] bg-[#EFEFEF] px-2">
          {t("import:contacts:config:subtitle-details")}
        </p>
      </div>
      <div className="overflow-auto">
        <table className="border border-gray-60 table-auto">
          <tr>
            {fieldsKeys.map((key) => (
              <td key={key} className="min-w-[150px] border border-gray-60 p-2">
                <p className="text-sm font-bold whitespace-nowrap">
                  {t(`import:contacts:fields:${key}`)}
                </p>
              </td>
            ))}
          </tr>
          <tr>
            {fieldsKeys.map((key) => (
              <td key={key} className="min-w-[150px] border border-gray-60 p-2">
                <p className="text-sm whitespace-nowrap">
                  {exampleValues[key] ?? ""}
                </p>
              </td>
            ))}
          </tr>
        </table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4">
        <div className="flex justify-center gap-2 pt-4 xl:col-span-2">
          <Button
            label={t("common:buttons:back")}
            className="px-2 py-1"
            buttonStyle="primary"
            onclick={handleBack}
          />
          <Button
            label={t("common:buttons:next")}
            className="px-2 py-1"
            buttonStyle="primary"
            onclick={handleNext}
          />
          <Button
            label={t("common:buttons:cancel")}
            className="px-2 py-1"
            buttonStyle="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default Fields;
