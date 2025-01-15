import Button from "../../components/form/Button";
import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SelectInput from "../../components/form/SelectInput";
import ContactSelectAsync from "../../components/form/ContactSelectAsync";
import PolicySelectAsync from "../../components/form/PolicySelectAsync";
import LeadSelectAsync from "../../components/form/LeadSelectAsync";
import MultipleSelect from "../../components/form/MultipleSelect";
import InputDate from "../../components/form/InputDate";
import MultiSelectTags from "../../components/form/MultiSelectTags";
import TextInput from "../../components/form/TextInput";
import InputDateRange from "../../components/form/InputDateRange";
import { PlusIcon } from "@heroicons/react/20/solid";
import "react-datepicker/dist/react-datepicker.css";
import AddFields from "./AddFields";
import SelectDropdown from "../../components/form/SelectDropdown";
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
    customFilterSelected,
    setCustomFilterSelected,
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

  const getRangeValue = (field) => {
    const fixedDates = {
      yesterday: moment()
        .utc()
        .subtract(1, "day")
        .format("YYYY-MM-DDTHH:mm:ss"),
      today: moment().utc().format("YYYY-MM-DDTHH:mm:ss"),
      tomorrow: moment().utc().add(1, "day").format("YYYY-MM-DDTHH:mm:ss"),
      thisWeek: [
        moment()
          .utc()
          .startOf("week")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment().utc().endOf("week").endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      ],
      thisMonth: [
        moment()
          .utc()
          .startOf("month")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment()
          .utc()
          .endOf("month")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
      currentQuarter: [
        moment()
          .utc()
          .startOf("quarter")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment()
          .utc()
          .endOf("quarter")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
      last7Days: [
        moment()
          .utc()
          .subtract(7, "day")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment().utc().endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      ],
      last30Days: [
        moment()
          .utc()
          .subtract(30, "day")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment().utc().endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      ],
      last60Days: [
        moment()
          .utc()
          .subtract(60, "day")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment().utc().endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      ],
      last90Days: [
        moment()
          .utc()
          .subtract(90, "day")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment().utc().endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      ],
      lastWeek: [
        moment()
          .utc()
          .subtract(1, "week")
          .startOf("week")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment()
          .utc()
          .subtract(1, "week")
          .endOf("week")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
      lastMonth: [
        moment()
          .utc()
          .subtract(1, "month")
          .startOf("month")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment()
          .utc()
          .subtract(1, "month")
          .endOf("month")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
      nextWeek: [
        moment()
          .utc()
          .add(1, "week")
          .startOf("week")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment()
          .utc()
          .add(1, "week")
          .endOf("week")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
      nextMonth: [
        moment()
          .utc()
          .add(1, "month")
          .startOf("month")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment()
          .utc()
          .add(1, "month")
          .endOf("month")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
    };
    const fixed = fixedDates[field.value.id];

    if (fixed) return fixed;

    const dependDates = {
      lastNDays: (date) => [
        moment()
          .utc()
          .subtract(date, "day")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment().utc().endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      ],
      nextNDays: (date) => [
        moment().utc().startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        moment()
          .utc()
          .add(date, "day")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
      month: (date) => [
        moment(date)
          .utc()
          .startOf("month")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment(date)
          .utc()
          .endOf("month")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
      quarter: (date) => [
        moment(date)
          .utc()
          .startOf("quarter")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment(date)
          .utc()
          .endOf("quarter")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
      year: (date) => [
        moment(date)
          .utc()
          .startOf("year")
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        moment(date)
          .utc()
          .endOf("year")
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
      ],
      exactDate: (date) => moment(date).utc().format("YYYY-MM-DDTHH:mm:ss"),
      dateRange: (range) => [
        moment(range[0]).utc().startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        moment(range[1]).utc().endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      ],
    };

    const calculateDateFunc = dependDates[field.value.id];

    if (calculateDateFunc) return calculateDateFunc(+field.range);

    return "";
  };

  const handleFormFilters = (data) => {
    if (data.fields.length == 0) return;
    console.log(data.fields);
    const displayAux = data.fields.filter((field) =>
      field.type == "multipleSelect"
        ? field.value.length > 0
        : typeof field.value !== "undefined" && field.value !== ""
    );
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
          value = moment(field.value).utc().format("YYYY-MM-DDTHH:mm:ss");
        }

        if (field.type == "select-contact") {
          value = field.value.id;
        }

        if (field.type == "daterange") {
          value = getRangeValue(field);
        }

        return {
          ...acc,
          [field.code]: value,
        };
      }, {});
    setFilters(newFilters);
  };

  useEffect(() => {
    reset();
  }, [reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const validateFilters = () => {
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
  };

  useEffect(() => {
    validateFilters();
  }, []);

  useEffect(() => {
    validateFilters();
  }, [customFilterSelected]);

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

            {dataField.type === "select-policy" && (
              <PolicySelectAsync
                label={dataField.name}
                name={`fields[${index}].value`}
                setValue={setValue}
                watch={watch}
              />
            )}
            {dataField.type === "select-lead" && (
              <LeadSelectAsync
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
            {dataField.type === "tags" && (
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
            )}
            {dataField.type === "daterange" && (
              <Controller
                render={({ field }) => {
                  return (
                    <InputDateRange
                      {...field}
                      watch={watch}
                      setValue={setValue}
                      nameDate={`fields[${index}].range`}
                      label={dataField.name}
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
            setCustomFilterSelected && setCustomFilterSelected();
          }}
        />
      </div>
    </form>
  );
};

export default FormFilters;
