import Button from "../../../../../../../../components/form/Button";
import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

import { FaMagnifyingGlass } from "react-icons/fa6";
import SelectInput from "../../../../../../../../components/form/SelectInput";
import TextInput from "../../../../../../../../components/form/TextInput";
import { PlusIcon } from "@heroicons/react/20/solid";
import "react-datepicker/dist/react-datepicker.css";
import AddFields from "./AddFields";
import InputDate from "@/src/components/form/InputDate";
import useDriveContext from "@/src/context/drive";
import { formatDate, isTaskOverdue } from "@/src/utils/getFormatDate";

const FormFilters = () => {
  const { t } = useTranslation();
  const { setFilters, filters, setDisplayFilters, filterFields, setFilterFields } = useDriveContext()

  const schema = yup.object().shape({
    date: yup.object(),
    origin: yup.string(),
    createdBy: yup.string(),
    ndays: yup.number(),
    month: yup.string(),
    quarter: yup.string(),
    year: yup.string(),
    exactDate: yup.string(),
    fields: yup.array().of(yup.object().shape({})),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      fields: [
        {
          id: 1,
          name: t('contacts:filters:item-name'),
          type: 'input',
          check: true,
          code: "name"
        },
      ],
    },
  });

  const handleFormFilters = (data) => {
    if (data.fields.length == 0) return

    const newFilters = data.fields.reduce((acc, field) => {
      const value = field.type == "date" ? formatDate(field.value, "MM/dd/yyyy") : field.value
      return {
        ...acc,
        [field.code]: value
      }
    }, {})
    setDisplayFilters(data.fields)
    setFilters(newFilters)
  };

  useEffect(() => {
    reset();
  }, [reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  useEffect(() => {
    Object.keys(filters).forEach(key => {
      const index = fields.findIndex(x => x.code == key);
      if (index == -1) {
        const filterField = filterFields.find(field => field.code == key)
        append({
          ...filterField,
          value: filters[key]
        })
      } else {
        setValue(`fields[${index}].value`, filters[key])
      }
    })
  }, [filters])

  const handleReset = () => {
    reset()
    setFilters({})
    setDisplayFilters([])
    setFilterFields(filterFields.map(field => ({ ...field, check: false })))
  }

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
                {...field}
                label={field.name}
                name={`fields[${index}].value`}
                options={field.options}
                register={register}
                setValue={setValue}
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
          onclick={handleReset}
        />
      </div>
    </form>
  );
};

export default FormFilters;
