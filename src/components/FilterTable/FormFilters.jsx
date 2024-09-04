import Button from "../../components/form/Button";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SelectInput from "../../components/form/SelectInput";
import MultipleSelect from "../../components/form/MultipleSelect";
import InputDate from "../../components/form/InputDate";
import TextInput from "../../components/form/TextInput";
import { PlusIcon } from "@heroicons/react/20/solid";
import "react-datepicker/dist/react-datepicker.css";
import AddFields from "./AddFields";
import SelectDropdown from "../../components/form/SelectDropdown";
import { formatDate } from "@/src/utils/getFormatDate";
import useFilterTableContext from "../../context/filters-table";

const FormFilters = () => {
  const { t } = useTranslation();
  const {
    setFilters,
    filters,
    filterFields,
    defaultFilterFields,
    setDisplayFilters,
  } = useFilterTableContext();
  const schema = yup.object().shape({
    fields: yup.array().of(yup.object().shape({})),
  });

  const { register, handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      fields: defaultFilterFields,
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
    let newItems = [];
    Object.keys(filters)?.length > 0 &&
      Object.keys(filters)
        .filter((key) => filters[key] !== "")
        .forEach((key) => {
          const index = fields.findIndex((x) => x.code == key);
          const filterField = filterFields.find((field) => field.code == key);
          if (index == -1) {
            newItems = [
              ...newItems,
              {
                ...filterField,
                value: filters[key],
              },
            ];
          } else {
            setValue(`fields[${index}].value`, filters[key]);
          }
        });
    if (newItems.length > 0) {
      append(newItems);
    }
  }, [filters]);

  return (
    <form
      onSubmit={handleSubmit(handleFormFilters)}
      className="grid grid-cols-1 gap-2 sm:w-96 w-72 px-2"
    >
      {fields.map((dataField, index) => {
        return (
          <div key={dataField.id}>
            {dataField.type === "input" && (
              <TextInput
                label={dataField.name}
                type="text"
                name={`fields[${index}].value`}
                register={register}
              />
            )}
            {dataField.type === "select" && (
              <SelectInput
                label={dataField.name}
                name={`fields[${index}].value`}
                options={dataField.options}
                setValue={setValue}
                watch={watch}
              />
            )}
            {dataField.type === "dropdown" && (
              <SelectDropdown
                label={dataField.name}
                name={`fields[${index}].value`}
                options={dataField.options}
                setValue={setValue}
                watch={watch}
              />
            )}
            {dataField.type === "date" && (
              <Controller
                render={({ field: { value, onChange, ref, onBlur } }) => {
                  return (
                    <InputDate
                      label={dataField.name}
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
            {dataField.type === "multipleSelect" && (
              <Controller
                name={`fields[${index}].value`}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <MultipleSelect
                    {...field}
                    options={field.options}
                    getValues={getValues}
                    setValue={setValue}
                    name={`fields[${index}].value`}
                    label={field.name}
                  />
                )}
              />
            )}
            {/* TODO: Corregir `MultiSelectTags` no esta importado. */}
            {/* {dataField.type === "tags" && (
              <Controller
                name={`fields[${index}].value`}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <MultiSelectTags
                    {...field}
                    getValues={getValues}
                    setValue={setValue}
                    name={`fields[${index}].value`}
                    label={dataField.name}
                  />
                )}
              />
            )} */}
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
