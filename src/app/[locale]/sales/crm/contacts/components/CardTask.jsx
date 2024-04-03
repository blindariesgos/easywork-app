import React from "react";

export default function CardTask() {
  return (
    <div className="bg-white px-4 py-3 rounded-md w-full flex gap-2 flex-col">
      <div className="flex gap-3">
        <p className="text-sm">Video llamada</p>
        <p className="text-sm">Fecha: 02/02/2024 13:33 pm</p>
      </div>
      <div>
         <p>Hacer video llamada</p>
      </div>
    </div>
  );
}
