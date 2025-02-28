export const EmailInvitation = () => {
  return (
    <div>
      <div className="mt-2 flex pb-3 border-b-2">
        <div>
          <p className="text-xs">E-mail o número de teléfono</p>
          {Array.from({ length: 5 }).map((_, index) => (
            <input key={index} type="text" placeholder="E-mail o número de teléfono" className="w-full h-6 mt-1 text-xs rounded-md" />
          ))}
        </div>
        <div className="ml-1">
          <p className="text-xs">Nombre</p>
          {Array.from({ length: 5 }).map((_, index) => (
            <input key={index} type="text" placeholder="Nombre" className="w-full h-6 mt-1 text-xs rounded-md" />
          ))}
        </div>
        <div className="ml-1">
          <p className="text-xs">Apellido</p>
          {Array.from({ length: 5 }).map((_, index) => (
            <input key={index} type="text" placeholder="Apellido" className="w-full h-6 mt-1 text-xs rounded-md" />
          ))}
        </div>
      </div>
      <div className="flex mt-6 items-center">
        <button className="text-white bg-easywork-main hover:bg-easywork-mainhover rounded-md p-2">+ Agregar más</button>
        <p className="ml-2">
          o <span className="text-blue-600 underline">Invitación masiva</span>
        </p>
      </div>
    </div>
  );
};
