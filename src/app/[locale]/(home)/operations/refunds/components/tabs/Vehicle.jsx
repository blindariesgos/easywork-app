import TextInput from "@/src/components/form/TextInput";
import { Fragment } from "react";

const Vehicle = ({ vehicles }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      {vehicles.map((vehicle) => (
        <Fragment key={vehicle.id}>
          <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
            {"Datos del vehiculo asegurado"}
          </div>
          <div className="grid grid-cols-2 pt-4 rounded-lg w-full gap-y-3 px-5 pb-9 gap-x-3">
            <div className="col-span-2">
              <TextInput
                type="text"
                label={"Descripción"}
                value={vehicle?.description ?? "S/N"}
                disabled
              />
            </div>
            <TextInput
              type="text"
              label={"Serie"}
              value={vehicle?.serial ?? "S/N"}
              disabled
            />
            <TextInput
              type="text"
              label={"Placa"}
              value={vehicle?.plates ?? "S/N"}
              disabled
            />
            <TextInput
              type="text"
              label={"Modelo"}
              value={vehicle?.model ?? "S/N"}
              disabled
            />
            <TextInput
              type="text"
              label={"Motor"}
              value={vehicle?.motor ?? "S/N"}
              disabled
            />
            <TextInput
              type="text"
              label={"Uso"}
              value={vehicle?.usage ?? "S/N"}
              disabled
            />
            <TextInput
              type="text"
              label={"Circula en"}
              value={vehicle?.circulatesIn ?? "S/N"}
              disabled
            />
          </div>
          <div className="flex justify-between py-4 px-3 rounded-lg bg-white">
            {"Datos del conductor habitual"}
          </div>
          <div className="grid grid-cols-2 pt-4 rounded-lg w-full gap-y-3 px-5 pb-9 gap-x-3">
            <TextInput
              type="text"
              label={"Nombre"}
              value={vehicle?.regularDriver ?? "No disponible"}
              disabled
            />
            <TextInput
              type="text"
              label={"Edad"}
              value={vehicle?.regularDriverAge ?? "No disponible"}
              disabled
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default Vehicle;
