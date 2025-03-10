"use client";
import SelectInput from "@/src/components/form/SelectInput";
import { useFieldArray } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import TextInput from "@/src/components/form/TextInput";
import clsx from "clsx";
import { Fragment, useEffect } from "react";
import Button from "@/src/components/form/Button";
import { useTranslation } from "react-i18next";

const Insureds = ({ register, control, watch, setValue, isAdd, name }) => {
  const { t } = useTranslation();
  const { fields, remove, append } = useFieldArray({
    control,
    name: name ?? "insureds",
  });

  const handleAdd = () => {
    append({
      metadata: {
        edadContratacion: "",
        fechaNacimiento: "",
        tipoRiesgo: "",
        fumador: false,
      },
      codigo: "",
      fullName: "",
    });
  };

  return (
    <div className="grid gap-y-1">
      <label className="block text-sm font-medium leading-6 text-gray-900 px-3">
        Asegurados
      </label>
      {fields &&
        fields.map((insured, index) => (
          <div
            key={index}
            className={clsx("grid gap-1 border rounded-md py-2 pl-2 relative", {
              "pr-8": fields.length > 1,
              "pr-2": fields.length == 1,
            })}
          >
            <FaTrash
              className={clsx(
                "text-red-800 w-4 h-4 absolute right-2 cursor-pointer top-2",
                {
                  hidden: fields.length == 1 && !isAdd,
                }
              )}
              onClick={() => remove(index)}
            />
            <TextInput
              type="text"
              label={"Nombre completo"}
              small
              name={`insureds[${index}].fullName`}
              register={register}
            />
            <div className="grid grid-cols-2 gap-1">
              <TextInput
                type="text"
                label={"Código"}
                small
                name={`insureds[${index}].codigo`}
                register={register}
              />
              {watch &&
                watch("typeId") == "e1794ba3-892d-4c51-ad62-32dcf836873b" && (
                  <Fragment>
                    <TextInput
                      type="text"
                      label={"Edad de Contratación"}
                      small
                      name={`insureds[${index}].metadata.edadContratacion`}
                      register={register}
                    />
                    <TextInput
                      type="text"
                      label={"Fecha de nacimiento"}
                      small
                      name={`insureds[${index}].metadata.fechaNacimiento`}
                      register={register}
                    />
                    <TextInput
                      type="text"
                      label={"Tipo de riesgo"}
                      small
                      name={`insureds[${index}].metadata.tipoRiesgo`}
                      register={register}
                    />
                    <SelectInput
                      label={"Es fumador"}
                      options={[
                        { id: false, name: "No" },
                        { id: true, name: "Si" },
                      ]}
                      name={`insureds[${index}].metadata.fumador`}
                      selectedOption={{
                        id: insured?.metadata?.fumador,
                        name: insured?.metadata?.fumador ? "Si" : "No",
                      }}
                      setValue={setValue}
                      watch={watch}
                      small
                    />
                  </Fragment>
                )}
              {watch &&
                watch("typeId") == "01072927-e48a-4fd0-9b06-5288ff7bc23d" && (
                  <Fragment>
                    <TextInput
                      type="text"
                      label={"Fecha de Antiguedad"}
                      small
                      name={`insureds[${index}].metadata.fechaAntiguedad`}
                      register={register}
                    />
                  </Fragment>
                )}
            </div>
          </div>
        ))}
      {isAdd && (
        <div className="flex justify-end">
          <Button
            label={`${t("common:buttons:add")} asegurado +`}
            buttonStyle="text"
            onclick={handleAdd}
            className="p-1 text-primary font-bold"
            fontSize="text-sm"
            type="button"
          />
        </div>
      )}
    </div>
  );
};

export default Insureds;
