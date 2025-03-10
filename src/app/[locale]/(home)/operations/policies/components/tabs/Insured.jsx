import TextInput from "@/src/components/form/TextInput";
import { Fragment } from "react";

const Insures = ({ items, typePoliza }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      {items.map((insured, index) => (
        <Fragment key={insured.id}>
          <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
            {`Datos del asegurado #${index + 1}`}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 pt-4 rounded-lg w-full gap-y-3 px-5 pb-9 gap-x-3">
            <div className="md:col-span-2">
              <TextInput
                type="text"
                label={"Nombre"}
                value={insured?.fullName ?? "S/N"}
                disabled
              />
            </div>
            <TextInput
              type="text"
              label={"Código"}
              value={insured?.codigo ?? "S/N"}
              disabled
            />
            {typePoliza === "VIDA" && (
              <TextInput
                type="text"
                label={"Fecha de Nacimiento"}
                value={insured?.metadata?.fechaNacimiento ?? "S/N"}
                disabled
              />
            )}
            {typePoliza === "VIDA" && (
              <TextInput
                type="text"
                label={"Edad de Contratación"}
                value={insured?.metadata?.edadContratacion ?? "S/N"}
                disabled
              />
            )}
            {typePoliza === "VIDA" && (
              <TextInput
                type="text"
                label={"Es Fumador"}
                value={insured?.metadata?.fumador ? "Si" : "No"}
                disabled
              />
            )}
            {typePoliza === "VIDA" && (
              <TextInput
                type="text"
                label={"Tipo de Riesgo"}
                value={insured?.metadata?.tipoRiesgo ?? "S/N"}
                disabled
              />
            )}
            {typePoliza === "GMM" && (
              <TextInput
                type="text"
                label={"Fecha de Antiguedad"}
                value={insured?.metadata?.fechaAntiguedad ?? "S/N"}
                disabled
              />
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default Insures;
