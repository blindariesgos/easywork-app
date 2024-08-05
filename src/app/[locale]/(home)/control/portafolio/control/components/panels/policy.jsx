import TextInput from "../../../../../../../../components/form/TextInput";
import SelectInput from "../../../../../../../../components/form/SelectInput";
import InputDate from "../../../../../../../../components/form/InputDate";
import InputCheckBox from "../../../../../../../../components/form/InputCheckBox";
import Button from "../../../../../../../../components/form/Button";
import * as yup from "yup";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaCalendarDays } from "react-icons/fa6";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";

const Policy = () => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    limitDate: yup.string(),
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
      range: [null, null],
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  return (
    <form>
      <div className="py-4 grid grid-cols-1 gap-4">
        <div className="p-4 grid grid-cols-2 bg-gray-100 gap-4">
          <div className=" col-span-2 flex">
            <div className="bg-white p-4 flex items-center gap-4 w-auto">
              <InputCheckBox
                label={t("tools:portafolio:control:form:contact")}
              />
              <InputCheckBox
                label={t("tools:portafolio:control:form:company")}
              />
            </div>
          </div>
          <TextInput label={t("tools:portafolio:control:form:customer-rfc")} />
          <SelectInput
            label={t("tools:portafolio:control:form:insurance")}
            options={[
              {
                name: "AHORRO",
                id: "physical",
              },
              {
                name: "ALFA AMERICANS",
                id: "moral",
              },
              {
                name: "PRO SALUD",
                id: "moral",
              },
            ]}
            placeholder="- Seleccionar -"
          />
          <TextInput label={t("tools:portafolio:control:form:customer-code")} />
          <TextInput label={t("tools:portafolio:control:form:policy-number")} />
          <TextInput label={t("tools:portafolio:control:form:version")} />
          <SelectInput
            label={t("tools:portafolio:control:form:insurance-type")}
            options={[
              {
                name: "Autos",
                id: "physical",
              },
              {
                name: "Danos",
                id: "moral",
              },
              {
                name: "Diversos",
                id: "moral",
              },
              {
                name: "GMM",
                id: "moral",
              },
              {
                name: "Salud",
                id: "moral",
              },
              {
                name: "Vida",
                id: "moral",
              },
            ]}
            placeholder="- Seleccionar -"
          />
          <SelectInput
            label={t("tools:portafolio:control:form:agent")}
            options={[
              {
                name: "Sporte Principal",
                id: "physical",
              },
              {
                name: "Soporte secundario",
                id: "moral",
              },
            ]}
            placeholder="- Seleccionar -"
          />
          <SelectInput
            label={t("tools:portafolio:control:form:coverage")}
            options={[
              {
                name: "Nacionalo",
                id: "physical",
              },
              {
                name: "Internacional",
                id: "moral",
              },
            ]}
            placeholder="- Seleccionar -"
          />
        </div>
        <div className="p-4 grid grid-cols-2 bg-gray-100 gap-4">
          <Controller
            render={({ field: { value, onChange, ref, onBlur } }) => {
              return (
                <InputDate
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  icon={
                    <FaCalendarDays className="h-3 w-3 text-primary pr-4" />
                  }
                  label={t("tools:portafolio:control:form:issue-date")}
                />
              );
            }}
            name="limitDate"
            control={control}
            defaultValue=""
          />
          <Controller
            render={({ field: { value, onChange, ref, onBlur } }) => {
              return (
                <InputDate
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  icon={
                    <FaCalendarDays className="h-3 w-3 text-primary pr-4" />
                  }
                  label={t("tools:portafolio:control:form:effective-date")}
                />
              );
            }}
            name="limitDate"
            control={control}
            defaultValue=""
          />
          <Controller
            render={({ field: { value, onChange, ref, onBlur } }) => {
              return (
                <InputDate
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  icon={
                    <FaCalendarDays className="h-3 w-3 text-primary pr-4" />
                  }
                  label={t("tools:portafolio:control:form:expiration-date")}
                />
              );
            }}
            name="limitDate"
            control={control}
            defaultValue=""
          />
          <SelectInput
            label={t("tools:portafolio:control:form:payment-methods")}
            options={[
              {
                name: "Anual",
                id: "physical",
              },
              {
                name: "Semestral",
                id: "moral",
              },
              {
                name: "Trimestral",
                id: "moral",
              },
              {
                name: "Mensual",
                id: "moral",
              },
              {
                name: "Contado",
                id: "moral",
              },
            ]}
            placeholder="- Seleccionar -"
          />
          <div className="grid grid-cols-2 gap-4 place-items-end">
            <SelectInput
              label={t("tools:portafolio:control:form:net-premium")}
              options={[
                {
                  name: "Peso",
                  id: "physical",
                },
                {
                  name: "Dolar US",
                  id: "moral",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <TextInput />
          </div>
          <div className="grid grid-cols-2 gap-4 place-items-end">
            <SelectInput
              label={t(
                "tools:portafolio:control:form:surcharge-installment-payment"
              )}
              options={[
                {
                  name: "Peso",
                  id: "physical",
                },
                {
                  name: "Dolar US",
                  id: "moral",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <TextInput />
          </div>
          <div className="grid grid-cols-2 gap-4 place-items-end">
            <SelectInput
              label={t("tools:portafolio:control:form:iva")}
              options={[
                {
                  name: "Peso",
                  id: "physical",
                },
                {
                  name: "Dolar US",
                  id: "moral",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <TextInput />
          </div>
          <div className="grid grid-cols-2 gap-4 place-items-end">
            <SelectInput
              label={t("tools:portafolio:control:form:policy-low")}
              options={[
                {
                  name: "Peso",
                  id: "physical",
                },
                {
                  name: "Dolar US",
                  id: "moral",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <TextInput />
          </div>
          <div className="grid grid-cols-2 gap-4 place-items-end">
            <SelectInput
              label={t("tools:portafolio:control:form:amount-to-pay")}
              options={[
                {
                  name: "Peso",
                  id: "physical",
                },
                {
                  name: "Dolar US",
                  id: "moral",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <TextInput />
          </div>
          <SelectInput
            label={t("tools:portafolio:control:form:forms-of-payment")}
            options={[
              {
                name: "CAT",
                id: "physical",
              },
              {
                name: "CXC",
                id: "moral",
              },
              {
                name: "CUT",
                id: "moral",
              },
            ]}
            placeholder="- Seleccionar -"
          />
          <SelectInput
            label={t("tools:portafolio:control:form:related-agent")}
            options={[
              {
                name: "Agente 1",
                id: "physical",
              },
              {
                name: "Agente 2",
                id: "moral",
              },
            ]}
            placeholder="- Seleccionar -"
          />
        </div>
        <div>
          <Button label="Buscar" buttonStyle="primary" className="px-4 py-2" />
        </div>
      </div>
    </form>
  );
};

export default Policy;
