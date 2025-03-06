import Link from 'next/link';
import { FaHouse } from 'react-icons/fa6';

const InvalidLink = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-[480px] p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-800">Enlace inválido o expirado</h2>
          <p className="text-gray-400">Es posible que el enlace que utilizó haya expirado o esté dañado</p>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <FaHouse className="w-4 h-4 mr-2" />
              Ir a inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvalidLink;
