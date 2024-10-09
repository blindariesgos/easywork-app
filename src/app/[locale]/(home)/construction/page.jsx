import React from "react";
const BACKGROUND_IMAGE_URL = "/img/fondo-home.png";
import Header from "../../../../components/header/Header";

const ConstructionModule = () => {
  return (
    <div
      className="bg-center bg-cover rounded-2xl h-full"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
    >
      <div className="w-full p-4 grid grid-cols-1 gap-4">
        <Header />
        <div className="bg-gray-100 p-4 rounded-md shadow h-4/5 flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold mb-2">Módulo en Construcción</h2>
          <p className="text-gray-700">
            Este módulo aún está en desarrollo. Por favor, vuelva más tarde para
            ver las actualizaciones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConstructionModule;
