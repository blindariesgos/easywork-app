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
import { Fragment, useEffect, useMemo, useState } from "react";
import useCustomImportContext from "@/src/context/custom-import";
import { contactImportKeys, emailTypes, phoneTypes } from "./contants";
import { useRouter } from "next/navigation";

const Fields = ({ handleNext, handleBack }) => {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const { header, columns } = useCustomImportContext();
  const schema = yup.object().shape({
    fields: yup.object().shape({}),
  });
  const [options, setOptions] = useState();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      fields: contactImportKeys.reduce(
        (acc, key, index) => ({ ...acc, [key]: index }),
        {}
      ),
    },
  });

  useEffect(() => {
    if (!header) return;
    setOptions(
      header.map((key, index) => ({
        id: index,
        name: key,
      }))
    );
  }, [header]);

  const columnsRender = useMemo(() => {
    return (
      columns &&
      columns.map((fields, index) => {
        const indexValues = getValues("fields");
        return (
          <tr key={`tr-${index}`}>
            {indexValues &&
              contactImportKeys.map((key) => (
                <td
                  key={key}
                  className="min-w-[150px] border border-gray-60 p-2"
                >
                  <p className="text-sm whitespace-nowrap">
                    {fields[indexValues[key]] ?? ""}
                  </p>
                </td>
              ))}
          </tr>
        );
      })
    );
  }, [watch()]);

  const handleSubmitNext = (data) => {
    console.log({ data });

    const object = columns.map((fields) => {
      const emails_dto = Object.keys(emailTypes)
        .filter((key) => fields[data.fields[key]])
        .map((key) => ({
          email: fields[data.fields[key]],
          relation: emailTypes[key],
        }));

      const phones_dto = Object.keys(phoneTypes)
        .filter((key) => fields[data.fields[key]])
        .map((key) => ({
          number: fields[data.fields[key]],
          relation: phoneTypes[key],
        }));

      return {
        address: fields[data.fields.address],
        birthday: fields[data.fields.birthday],
        cargo: fields[data.fields.cargo],
        codigo: fields[data.fields.codigo],
        cua: fields[data.fields.cua],
        curp: fields[data.fields.curp],
        disabled: fields[data.fields.disabled],
        fullName: fields[data.fields.fullName],
        gender: fields[data.fields.gender],
        lastname: fields[data.fields.lastname],
        name: fields[data.fields.name],
        rfc: fields[data.fields.rfc],
        typePerson: fields[data.fields.typePerson],
        emails_dto,
        phones_dto,
      };
    });
    console.log({ object });
    handleNext();
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitNext)} className="px-3 py-4">
      <p className="text-sm font-bold pb-4 ">
        {t("import:contacts:fields:title")}
      </p>

      <div className="grid grid-cols-1 gap-2">
        {options &&
          contactImportKeys.map((key, index) => (
            <div key={key} className="grid grid-cols-4 gap-2">
              <div className="text-sm flex items-center justify-end text-right">
                {t(`import:contacts:fields:${key}`)}
              </div>
              <div className="col-span-3">
                <div className="grid grid-cols-3">
                  <div className="col-span-3 md:col-span-2 xl:col-span-1">
                    <SelectInput
                      options={options}
                      selectedOption={{
                        id: index,
                        name: header[index],
                      }}
                      name={`fields.${key}`}
                      setValue={setValue}
                      border
                      watch={watch}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="py-4">
        <p className="text-sm font-bold py-4 rounded-[10px] bg-[#EFEFEF] px-2">
          {t("import:contacts:fields:preview")}
        </p>
      </div>
      <div className="overflow-auto max-h-[400px] relative">
        <table className="table-auto  border-spacing-0">
          <tr className="sticky -top-0.5  border-spacing-0 p-0 m-0 z-10 bg-white ">
            {contactImportKeys.map((key) => (
              <td key={key} className="border border-gray-60 bg-primary ">
                <p className="text-sm font-bold whitespace-nowrap min-w-[150px] p-2 text-white">
                  {t(`import:contacts:fields:${key}`)}
                </p>
              </td>
            ))}
          </tr>
          {columnsRender}
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
            type="submit"
            buttonStyle="primary"
          />
          <Button
            label={t("common:buttons:cancel")}
            className="px-2 py-1"
            buttonStyle="secondary"
            onclick={() => router.back()}
          />
        </div>
      </div>
    </form>
  );
};

export default Fields;