import Button from "../../components/form/Button";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SelectInput from "../../components/form/SelectInput";
import ContactSelectAsync from "../../components/form/ContactSelectAsync";
import MultipleSelect from "../../components/form/MultipleSelect";
import InputDate from "../../components/form/InputDate";
import TextInput from "../../components/form/TextInput";
import { PlusIcon } from "@heroicons/react/20/solid";
import "react-datepicker/dist/react-datepicker.css";
import AddFields from "./AddFields";
import SelectDropdown from "../../components/form/SelectDropdown";
import { formatDate } from "@/src/utils/getFormatDate";
import useFilterTableContext from "../../context/filters-table";
import moment from "moment";

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

  const { register, handleSubmit, control, reset, setValue, getValues, watch } =
    useForm({
      defaultValues: {
        fields: defaultFilterFields,
      },
      mode: "onChange",
      resolver: yupResolver(schema),
    });

  const handleFormFilters = (data) => {
    console.log("folters", data);
    if (data.fields.length == 0) return;
    const displayAux = data.fields.filter((field) =>
      field.type == "multipleSelect"
        ? field.value.length > 0
        : typeof field.value !== "undefined" && field.value !== ""
    );
    console.log({ displayAux });
    setDisplayFilters(displayAux);

    const newFilters = data.fields
      .filter((field) =>
        field.type == "multipleSelect"
          ? field.value.length > 0
          : typeof field.value !== "undefined" && field.value !== ""
      )
      .reduce((acc, field) => {
        let value = field.value;

        if (field.type == "date") {
          value = moment(field.value).utc().format("yyyy-MM-DD");
        }

        if (field.type == "select-contact") {
          value = field.value.id;
        }

        return {
          ...acc,
          [field.code]: value,
        };
      }, {});
    console.log({ newFilters });
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
    const getDate = (date) => {
      return moment(date.replace(/-/g, "")).format();
    };
    Object.keys(filters)?.length > 0 &&
      Object.keys(filters)
        .filter((key) => filters[key] !== "")
        .forEach((key) => {
          const index = fields.findIndex((x) => x.code == key);
          const filterField = filterFields.find((field) => field.code == key);
          if (!filterField) return;
          const fieldValue =
            filterField.type == "date" ? getDate(filters[key]) : filters[key];
          if (index == -1) {
            newItems = [
              ...newItems,
              {
                ...filterField,
                value: fieldValue,
              },
            ];
          } else {
            setValue(`fields[${index}].value`, fieldValue);
          }
        });
    if (newItems.length > 0) {
      append(newItems);
    }
  }, []);

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
            {dataField.type === "select-contact" && (
              <ContactSelectAsync
                label={dataField.name}
                name={`fields[${index}].value`}
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
            {dataField.type === "boolean" && (
              <SelectInput
                label={dataField.name}
                name={`fields[${index}].value`}
                options={[
                  {
                    name: "Si",
                    id: "true",
                  },
                  {
                    name: "No",
                    id: "false",
                  },
                ]}
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
                    options={dataField.options}
                    getValues={getValues}
                    setValue={setValue}
                    label={dataField.name}
                  />
                )}
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
