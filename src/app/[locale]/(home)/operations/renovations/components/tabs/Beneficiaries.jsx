import TextInput from "@/src/components/form/TextInput";
import { Fragment } from "react";

const Beneficiaries = ({ items }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      {items.map((beneficiary, index) => (
        <Fragment key={beneficiary.id}>
          <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
            {`Datos del beneficiario #${index + 1}`}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 pt-4 rounded-lg w-full gap-y-3 px-5 pb-9 gap-x-3">
            <div className="col-span-2">
              <TextInput
                type="text"
                label={"Nombre"}
                value={beneficiary?.nombre ?? "S/N"}
                disabled
              />
            </div>
            <TextInput
              type="text"
              label={"Fecha de Nacimiento"}
              value={beneficiary?.fechaNacimiento ?? "S/N"}
              disabled
            />
            <TextInput
              type="text"
              label={"Parentesco"}
              value={beneficiary?.parentesco ?? "S/N"}
              disabled
            />
            <TextInput
              type="text"
              label={"Porcentaje"}
              value={beneficiary?.porcentaje ?? "S/N"}
              disabled
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default Beneficiaries;
