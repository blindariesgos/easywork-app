import Button from "../../../../../../../../components/form/Button";
import React, { useEffect, useState } from "react";
import MultipleSelect from "../../../../../../../../components/form/MultipleSelect";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useCommon } from "../../../../../../../../hooks/useCommon";
import SelectInput from "../../../../../../../../components/form/SelectInput";
import InputDate from "../../../../../../../../components/form/InputDate";
import TextInput from "../../../../../../../../components/form/TextInput";
import { PlusIcon } from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddFields from "./AddFields";
import SelectDropdown from "../../../../../../../../components/form/SelectDropdown";
import useAppContext from "../../../../../../../../context/app";
import useUserContext from "@/src/context/users";
import { formatDate } from "@/src/utils/getFormatDate";

const FormFilters = () => {
  const { lists, setFilter } = useAppContext();
  const { t } = useTranslation();
  const { setFilters, filters, filterFields, setDisplayFilters } =
    useUserContext();
  const schema = yup.object().shape({
    fields: yup.array().of(yup.object().shape({})),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      fields: [
        {
          id: 1,
          name: t("contacts:filters:responsible"),
          type: "dropdown",
          check: true,
          code: "responsible",
          options: lists?.users,
        },
        {
          id: 2,
          name: t("contacts:filters:created"),
          type: "date",
          check: true,
          code: "createdAt",
        },
        {
          id: 3,
          name: t("contacts:filters:origin"),
          type: "select",
          options: lists?.listContact?.contactSources || [],
          check: true,
          code: "origin",
        },
        {
          id: 4,
          name: t("contacts:filters:created-by"),
          type: "dropdown",
          check: true,
          code: "createdby",
          options: lists?.users,
        },
      ],
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleFormFilters = (data) => {
    if (data.fields.length == 0) return;
    const newFilters = data.fields
      .filter((field) => field.value)
      .reduce((acc, field) => {
        let value = field.value;

        if (field.type == "date") {
          value = formatDate(field.value, "yyyy-MM-dd");
        }

        return {
          ...acc,
          [field.code]: value,
        };
      }, {});
    setDisplayFilters(data.fields.filter((field) => field.value));
    setFilters(newFilters);
  };

  useEffect(() => {
    reset();
  }, [reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  useEffect(() => {
    Object.keys(filters).length > 0 &&
      Object.keys(filters)
        .filter((key) => filters[key] !== "")
        .forEach((key) => {
          const index = fields.findIndex((x) => x.code == key);
          const filterField = filterFields.find((field) => field.code == key);
          if (index == -1) {
            append({
              ...filterField,
              value: filters[key],
            });
          } else {
            setValue(`fields[${index}].value`, filters[key]);
          }
        });
  }, [filters]);

  return (
    <form
      onSubmit={handleSubmit(handleFormFilters)}
      className="grid grid-cols-1 gap-2 sm:w-96 w-72 px-2"
    >
      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            {field.type === "input" && (
              <TextInput
                label={field.name}
                type="text"
                name={`fields[${index}].value`}
                register={register}
              />
            )}
            {field.type === "select" && (
              <SelectInput
                label={field.name}
                name={`fields[${index}].value`}
                options={field.options}
                setValue={setValue}
                watch={watch}
              />
            )}
            {field.type === "dropdown" && (
              <SelectDropdown
                label={field.name}
                name={`fields[${index}].value`}
                options={field.options}
                setValue={setValue}
                watch={watch}
              />
            )}
            {field.type === "date" && (
              <Controller
                render={({ field: { value, onChange, ref, onBlur } }) => {
                  return (
                    <InputDate
                      label={field.name}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  );
                }}
                name={`fields[${index}].value`}
                control={control}
                defaultValue=""
              />
            )}
          </div>
        );
      })}
      <div className="my-2 flex gap-2 items-center">
        <AddFields append={append} remove={remove} fields={fields} />
        <Button
          type="button"
          label={t("contacts:filters:restore")}
          buttonStyle="text"
          iconLeft={<PlusIcon className="h-4 w-4 text-gray-60" />}
          onclick={() => {
            setValue("fields", []);
            reset();
          }}
        />
      </div>
      <div className="flex gap-2 justify-center mt-4">
        <Button
          type="submit"
          label={t("contacts:filters:search")}
          buttonStyle="primary"
          className="py-1 px-3"
          iconLeft={<FaMagnifyingGlass className="h-4 w-4 text-white" />}
        />
        <Button
          type="button"
          label={t("contacts:filters:restart")}
          buttonStyle="secondary"
          className="py-1 px-3"
          onclick={() => {
            setValue("fields", []);
            reset();
            setFilters({});
            setDisplayFilters({});
          }}
        />
      </div>
    </form>
  );
};

export default FormFilters;
