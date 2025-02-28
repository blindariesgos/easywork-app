export const InvitationFooter = () => {
  return (
    <div className="w-full text-sm bg-slate-50 mt-3 rounded-md p-2">
      <div className="flex items-center pb-2 border-b-2">
        <h1 className="w-7/12">Número máximo de usuarios permitidos en su plan actual</h1>
        <div className="w-5/12 flex items-center justify-end">
          <p className="text-right text-blue-400">100</p>
        </div>
      </div>
      <div className="flex pt-2 items-center">
        <h1 className="w-7/12">Usuarios registrados actualmente en su Easywork</h1>
        <div className="w-5/12 flex items-center justify-end">
          <p className="text-right text-red-500">11</p>
        </div>
      </div>
    </div>
  );
};
