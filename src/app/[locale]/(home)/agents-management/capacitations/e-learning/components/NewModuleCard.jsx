import Link from 'next/link';

export default function NewModuleCard({ onClick }) {
  return (
    <button onClick={onClick} className="bg-gray-200 rounded-xl hover:shadow-lg transition-shadow cursor-pointer w-80 h-96 flex items-center justify-center">
      <p className="font-bold text-gray-400">+ Nuevo curso</p>
    </button>
  );
}
