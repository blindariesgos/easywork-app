"use client";
import { FaTrash } from "react-icons/fa";
import TextInput from "@/src/components/form/TextInput";
import clsx from "clsx";
import { useFieldArray } from "react-hook-form";

const Beneficiaries = ({ register, control }) => {
  const { fields, remove } = useFieldArray({
    control,
    name: "beneficiaries",
  });

  return (
    <div className="grid gap-y-1">
      <label className="block text-sm font-medium leading-6 text-gray-900 px-3">
        Beneficiarios
      </label>
      {fields.map((_, index) => (
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
                hidden: fields.length == 1,
              }
            )}
            onClick={() => remove(index)}
          />
          <TextInput
            type="text"
            label={"Nombre completo"}
            small
            name={`beneficiaries[${index}].nombre`}
            register={register}
          />
          <div className="grid grid-cols-2 gap-1">
            <TextInput
              type="text"
              label={"Parentesco"}
              name={`beneficiaries[${index}].parentesco`}
              register={register}
              small
            />
            <TextInput
              type="text"
              label={"Porcentaje"}
              name={`beneficiaries[${index}].porcentaje`}
              register={register}
              small
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Beneficiaries;
