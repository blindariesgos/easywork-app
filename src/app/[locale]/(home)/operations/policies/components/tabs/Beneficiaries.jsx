import TextInput from "@/src/components/form/TextInput";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

const Beneficiaries = ({ items, specifications }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-100 rounded-lg p-4 overflow-y-auto max-h-[70vh]">
      {items.map((beneficiary, index) => (
        <Fragment key={beneficiary.id}>
          <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
            {`Datos de beneficiario ${beneficiary?.type ?? index + 1}`}
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
      {specifications.length > 0 && (
        <Fragment>
          <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
            {t("operations:policies:general:specifications")}
          </div>
          <p className="px-7 py-4">{specifications}</p>
        </Fragment>
      )}
    </div>
  );
};

export default Beneficiaries;
