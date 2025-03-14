export const InvalidLink = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-[500px] p-6">
      <div className="space-y-4">
        <h2 className="text-easy-800 font-bold text-3xl text-center">Registro Easywork</h2>

        <div className="bg-amber-100 rounded-lg px-5 py-2 mt-20">
          <h2 className="text-lg font-semibold text-gray-800">Este link ha expirado</h2>
          <p className="text-gray-400">Por favor, póngase en contacto con su administrador</p>
        </div>
      </div>
    </div>
  );
};
