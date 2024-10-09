import SelectInput from "@/src/components/form/SelectInput";
import InputPhone from "@/src/components/form/InputPhone";
import { Controller, useFieldArray } from "react-hook-form";
import Button from "./Button";
import { useTranslation } from "react-i18next";
import { IoCloseCircle } from "react-icons/io5";
import clsx from "clsx";

const MultiplePhonesInput = ({
  name,
  control,
  disabled,
  watch,
  setValue,
  register,
  label,
  errors,
}) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="flex flex-col gap-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-900 px-3">
          {label}
        </label>
      )}
      {fields.map((field, index) => {
        return (
          <div
            key={index}
            className={clsx(
              "grid grid-cols-3 gap-2 content-start relative group",
              {
                "pr-4": !disabled && fields.length > 1,
              }
            )}
          >
            <div className="col-span-2">
              <Controller
                render={({ field: { ref, ...field } }) => {
                  return (
                    <InputPhone
                      field={field}
                      error={
                        errors && (errors[index] ? errors[index]?.email : null)
                      }
                      defaultValue={field.value}
                      disabled={disabled}
                    />
                  );
                }}
                name={`${name}[${index}].number`}
                control={control}
              />
            </div>
            <SelectInput
              options={[
                {
                  name: "Teléfono Trabajo",
                  id: "Teléfono Trabajo",
                },
                {
                  name: "Móvil",
                  id: "Móvil",
                },
                {
                  name: "Fax",
                  id: "Fax",
                },
                {
                  name: "Casa",
                  id: "Casa",
                },
                {
                  name: "Localizador",
                  id: "Localizador",
                },
                {
                  name: "Sms Marketing",
                  id: "Sms Marketing",
                },
                {
                  name: "Otros",
                  id: "Otros",
                },
              ]}
              watch={watch}
              name={`${name}[${index}].relation`}
              disabled={disabled}
              setValue={setValue}
              error={errors && (errors[index] ? errors[index]?.relation : null)}
            />
            <IoCloseCircle
              className={clsx(
                "text-primary w-4 h-4  absolute -right-1 top-[50%] translate-y-[-50%] cursor-pointer",
                {
                  hidden: disabled || fields.length == 1,
                }
              )}
              onClick={() => remove(index)}
            />
          </div>
        );
      })}
      {!disabled && (
        <div className="flex justify-start">
          <Button
            label={t("common:buttons:add")}
            buttonStyle="text"
            onclick={() => append({ number: "", relation: "" })}
            className="p-1"
            type="button"
          />
        </div>
      )}
    </div>
  );
};

export default MultiplePhonesInput;
