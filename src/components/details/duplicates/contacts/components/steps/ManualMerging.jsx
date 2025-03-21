import Button from "@/src/components/form/Button";
import InputCheckBox from "@/src/components/form/InputCheckBox";
import moment from "moment";
import { useState } from "react";

const ManualMerging = ({ items, handleNext, index, totals }) => {
  const [item1, item2] = items;
  const [selected, setSelected] = useState();

  return (
    <div className="rounded-lg bg-[#F9F9F9] max-h-[calc(100vh_-_300px)] h-full flex  gap-6 flex-col">
      <div className="grid grid-cols-3 p-2 gap-6 w-full">
        <div className="flex flex-col gap-2">
          <div className="border-black border rounded-lg  w-full p-2 ">
            <p className="text-sm ">Resultado de la fusión</p>
          </div>
          {selected ? (
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-[#DFE3E6] rounded-lg w-full p-2 grid grid-cols-1 gap-2">
                <p className="text-sm ">Sobre contacto</p>
                <hr className="border-black" />
                <div className="bg-white p-2 grid grid-cols-1 gap-2">
                  <p className="text-sm ">Nombre Completo</p>
                  <p className="text-sm ">{selected?.fullName}</p>
                </div>
                <div className="bg-white p-2 grid grid-cols-1 gap-2">
                  <p className="text-sm ">Telefono</p>
                  <p className="text-sm ">
                    {selected?.phone ?? "El campo esta vacio"}
                  </p>
                </div>
                <div className="bg-white p-2 grid grid-cols-1 gap-2">
                  <p className="text-sm ">Email</p>
                  <p className="text-sm ">
                    {selected?.email ?? "El campo esta vacio"}
                  </p>
                </div>
                <div className="bg-white p-2 grid grid-cols-1 gap-2">
                  <p className="text-sm ">RFC</p>
                  <p className="text-sm ">
                    {selected?.rfc ?? "El campo esta vacio"}
                  </p>
                </div>
                <p className="text-sm ">Persona Responsable</p>
                <p className="text-sm font-bold">
                  {selected?.assignedBy?.profile
                    ? `${selected?.assignedBy?.profile?.firstName} ${selected?.assignedBy?.profile?.lastName}`
                    : "El campo esta vacio"}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center">
              <p className="text-sm  text-gray-50 px-2">
                Seleccione la propiedad de los contactos de la lista. Se
                utilizará como base para el perfil del contacto. Puede añadir
                más datos de los demás contactos.
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#EBEBEB] rounded-lg w-full p-2 ">
            <InputCheckBox
              checked={selected?.id == item1?.id}
              setChecked={(checked) =>
                checked ? setSelected(item1) : setSelected()
              }
              label={`Creado el ${moment(item1.createdAt).format("MMMM DD, YYYY")}`}
            />
            {/* <p className="text-sm font-semibold">{}</p> */}
          </div>
          <div className="bg-[#DFE3E6] rounded-lg w-full p-2 grid grid-cols-1 gap-2">
            <p className="text-sm ">Sobre contacto</p>
            <hr className="border-black" />
            <div className="bg-white p-2 grid grid-cols-1 gap-2">
              <p className="text-sm ">Nombre Completo</p>
              <p className="text-sm ">{item1.fullName}</p>
            </div>
            <div className="bg-white p-2 grid grid-cols-1 gap-2">
              <p className="text-sm ">Telefono</p>
              <p className="text-sm ">
                {item1?.phone ?? "El campo esta vacio"}
              </p>
            </div>
            <div className="bg-white p-2 grid grid-cols-1 gap-2">
              <p className="text-sm ">Email</p>
              <p className="text-sm ">
                {item1?.email ?? "El campo esta vacio"}
              </p>
            </div>
            <div className="bg-white p-2 grid grid-cols-1 gap-2">
              <p className="text-sm ">RFC</p>
              <p className="text-sm ">{item1?.rfc ?? "El campo esta vacio"}</p>
            </div>
            <p className="text-sm ">Persona Responsable</p>
            <p className="text-sm font-bold">
              {item1?.assignedBy?.profile
                ? `${item1?.assignedBy?.profile?.firstName} ${item1?.assignedBy?.profile?.lastName}`
                : "El campo esta vacio"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#EBEBEB] rounded-lg w-full p-2 ">
            <InputCheckBox
              checked={selected?.id == item2?.id}
              setChecked={(checked) =>
                checked ? setSelected(item2) : setSelected()
              }
              label={`Creado el ${moment(item2.createdAt).format("MMMM DD, YYYY")}`}
            />
            {/* <p className="text-sm font-semibold">{`Creado el ${moment(item2.createdAt).format("MMMM DD, YYYY")}`}</p> */}
          </div>
          <div className="bg-[#DFE3E6] rounded-lg w-full p-2 grid grid-cols-1 gap-2">
            <p className="text-sm ">Sobre contacto</p>
            <hr className="border-black" />
            <div className="bg-white p-2 grid grid-cols-1 gap-2">
              <p className="text-sm ">Nombre Completo</p>
              <p className="text-sm ">{item2.fullName}</p>
            </div>
            <div className="bg-white p-2 grid grid-cols-1 gap-2">
              <p className="text-sm ">Telefono</p>
              <p className="text-sm ">
                {item2?.phone ?? "El campo esta vacio"}
              </p>
            </div>
            <div className="bg-white p-2 grid grid-cols-1 gap-2">
              <p className="text-sm ">Email</p>
              <p className="text-sm ">
                {item2?.email ?? "El campo esta vacio"}
              </p>
            </div>
            <div className="bg-white p-2 grid grid-cols-1 gap-2">
              <p className="text-sm ">RFC</p>
              <p className="text-sm ">{item2?.rfc ?? "El campo esta vacio"}</p>
            </div>
            <p className="text-sm ">Persona Responsable</p>
            <p className="text-sm font-bold">
              {item2?.assignedBy?.profile
                ? `${item2?.assignedBy?.profile?.firstName} ${item2?.assignedBy?.profile?.lastName}`
                : "El campo esta vacio"}
            </p>
          </div>
        </div>
      </div>
      <div className="px-2 flex gap-6">
        <p className="text-sm text-left">{`FUSIONADO: ${index}`}</p>
        <p className="text-sm text-left">{`SIN PROCESAR:${totals - index}`}</p>
      </div>
      <div className="flex justify-center w-full gap-4 items-center pb-4">
        <Button
          buttonStyle="primary"
          label={"Fusionar"}
          className="px-2 py-1"
          onclick={handleNext}
          disabled={!selected}
        />
        <Button
          buttonStyle="secondary"
          label={"Fusionar y editar"}
          className="px-2 py-1"
          onclick={handleNext}
          disabled={!selected}
        />
        <Button
          buttonStyle="text"
          label={"MÁS TARDE"}
          className="px-2 py-1"
          onclick={handleNext}
        />
      </div>
    </div>
  );
};

export default ManualMerging;
