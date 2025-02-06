import { FiPlusCircle } from 'react-icons/fi';
import { IoText } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { GoVideo } from 'react-icons/go';
import { TbSection } from 'react-icons/tb';

export const EvaluationFloatingMenu = ({ onAddQuestion }) => {
  return (
    <div>
      <button
        onClick={() => onAddQuestion({ title: 'Pregunta', description: '', type: 'multiple-choice' })}
        type="button"
        className="hover:bg-[#f5f5f5] bg-white flex items-center justify-start border-l-[1px] border-t-[1px] border-r-[1px] w-full gap-2 p-2 rounded-tl-lg rounded-tr-lg"
      >
        <FiPlusCircle size="18px" /> <span>Nueva pregunta</span>
      </button>
      <button
        onClick={() => onAddQuestion({ type: 'text' })}
        type="button"
        className="hover:bg-[#f5f5f5] bg-white flex items-center justify-start border-l-[1px] border-t-[1px] border-r-[1px] w-full gap-2 p-2"
      >
        <IoText size="18px" /> <span>Agregar texto</span>
      </button>
      <button
        onClick={() => onAddQuestion({ title: 'Imagen', type: 'image-section' })}
        type="button"
        className="hover:bg-[#f5f5f5] bg-white flex items-center justify-start border-l-[1px] border-t-[1px] border-r-[1px] w-full gap-2 p-2"
      >
        <CiImageOn size="18px" /> <span>Agregar imagen</span>
      </button>
      <button
        onClick={() => onAddQuestion({ title: 'Video', type: 'video-section' })}
        type="button"
        className="hover:bg-[#f5f5f5] bg-white flex items-center justify-start border-l-[1px] border-t-[1px] border-r-[1px] w-full gap-2 p-2"
      >
        <GoVideo size="18px" /> <span>Agregar video</span>
      </button>
      <button
        onClick={() => onAddQuestion({ title: 'Sección', type: 'section' })}
        type="button"
        className="hover:bg-[#f5f5f5] bg-white flex items-center justify-start border w-full gap-2 p-2 rounded-bl-lg rounded-br-lg"
      >
        <TbSection size="18px" /> <span>Nueva sección</span>
      </button>
    </div>
  );
};
