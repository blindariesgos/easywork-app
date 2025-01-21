import { FiPlusCircle } from 'react-icons/fi';
import { IoText } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { GoVideo } from 'react-icons/go';
import { TbSection } from 'react-icons/tb';

export const EvaluationFloatingMenu = () => {
  return (
    <div className="bg-white px-2 py-4 rounded-lg inline-block absolute right-1">
      <button className="flex items-center justify-start border w-full gap-2 p-2">
        <FiPlusCircle size="18px" /> <span>Agregar pregunta</span>
      </button>
      <button className="flex items-center justify-start border w-full gap-2 p-2">
        <IoText size="18px" /> <span>Agregar título y descripción</span>
      </button>
      <button className="flex items-center justify-start border w-full gap-2 p-2">
        <CiImageOn size="18px" /> <span>Agregar imagen</span>
      </button>
      <button className="flex items-center justify-start border w-full gap-2 p-2">
        <GoVideo size="18px" /> <span>Agregar video</span>
      </button>
      <button className="flex items-center justify-start border w-full gap-2 p-2">
        <TbSection size="18px" /> <span>Agregar sección</span>
      </button>
    </div>
  );
};
