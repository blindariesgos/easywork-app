import { LuLoaderCircle } from 'react-icons/lu';

export const VerifyingLink = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-[480px] p-10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mx-auto">
            <LuLoaderCircle className="text-indigo-600 animate-spin w-10 h-10" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">Validando enlace...</h2>
          <p className="text-gray-400">Por favor, espere mientras verificamos la validez de su enlace</p>
        </div>
      </div>
    </div>
  );
};
