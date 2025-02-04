"use client";
import { FaTrash } from "react-icons/fa";
import TextInput from "@/src/components/form/TextInput";
import clsx from "clsx";
import { useFieldArray } from "react-hook-form";
import Button from "@/src/components/form/Button";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Vehicles = ({ register, control, isAdd, watch }) => {
  const { t } = useTranslation();
  const { fields, remove, append } = useFieldArray({
    control,
    name: "vehicles",
  });

  useEffect(() => {
    if (fields.length == 0 && watch("vehicles").length > 0) {
      watch("vehicles").map((insured) => append(insured));
    }
  }, [watch && watch("vehicles")]);

  const handleAdd = () => {
    append({
      description: "",
      serial: "",
      model: "",
      motor: "",
      plates: "",
      usage: "",
      circulatesIn: "",
      regularDriver: "",
      regularDriverAge: "",
    });
  };

  return (
    <div className="grid gap-y-1">
      <label className="block text-sm font-medium leading-6 text-gray-900 px-3">
        Vehiculos
      </label>
      {fields &&
        fields.map((_, index) => (
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
              label={"Descripción"}
              small
              name={`vehicles[${index}].description`}
              register={register}
            />
            <div className="grid grid-cols-2 gap-1">
              <TextInput
                type="text"
                label={"Serie"}
                name={`vehicles[${index}].serial`}
                register={register}
                small
              />
              <TextInput
                type="text"
                label={"Placa"}
                name={`vehicles[${index}].plates`}
                register={register}
                small
              />
              <TextInput
                type="text"
                label={"Modelo"}
                name={`vehicles[${index}].model`}
                register={register}
                small
              />
              <TextInput
                type="text"
                label={"Motor"}
                name={`vehicles[${index}].motor`}
                register={register}
                small
              />
              <TextInput
                type="text"
                label={"Uso"}
                name={`vehicles[${index}].usage`}
                register={register}
                small
              />
              <TextInput
                type="text"
                label={"Circula en"}
                name={`vehicles[${index}].circulatesIn`}
                register={register}
                small
              />
              <TextInput
                type="text"
                label={"Nombre conductor habitual"}
                name={`vehicles[${index}].regularDriver`}
                register={register}
                small
              />
              <TextInput
                type="text"
                label={"Edad  conductor habitual"}
                name={`vehicles[${index}].regularDriverAge`}
                register={register}
                small
              />
            </div>
          </div>
        ))}
      {isAdd && (
        <div className="flex justify-end">
          <div className="flex justify-end">
            <Button
              label={`${t("common:buttons:add")} +`}
              buttonStyle="text"
              onclick={handleAdd}
              className="p-1 text-primary font-bold"
              type="button"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
