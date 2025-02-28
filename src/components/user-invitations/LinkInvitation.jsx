import { useState } from 'react';

import { FaCopy } from 'react-icons/fa';
import { LuRefreshCcw } from 'react-icons/lu';
import { IoArrowRedo } from 'react-icons/io5';
import { toast } from 'react-toastify';

export const LinkInvitation = () => {
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [link, setLink] = useState('');
  const [isAdminApprovedRequired, setIsAdminApproveRequired] = useState(false);

  const handleGenerateLink = () => {
    setIsGeneratingLink(true);
    try {
      setTimeout(() => {
        setLink('https://easywork.com/invite/u/n/JASIOD98asdnjaksdnqh7e21');
        setIsGeneratingLink(false);
      }, [3000]);
    } catch (error) {
      toast.error('Error al generar el enlace');
    }
  };

  return (
    <>
      {link || isGeneratingLink ? (
        <div className="flex items-center gap-4">
          <p className="bg-gray-300 p-4 inline-block rounded-xl text-sm max-w-[420px] truncate">{isGeneratingLink ? 'Generando...' : link}</p>

          {!isGeneratingLink && (
            <div className="flex items-center gap-4">
              <button>
                <FaCopy className="h-5 w-5 text-easy-600 hover:text-easy-400" aria-hidden="true" />
              </button>
              <button onClick={handleGenerateLink}>
                <LuRefreshCcw className="h-5 w-5 text-easy-600 hover:text-easy-400" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="text-white bg-easywork-main hover:bg-easywork-mainhover rounded-md py-2 px-4 flex items-center gap-2" onClick={handleGenerateLink}>
          Generar enlace
          <IoArrowRedo className="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      )}

      <div className="flex items-center gap-2 mt-5">
        <input type="checkbox" className="rounded-sm cursor-pointer" checked={isAdminApprovedRequired} onChange={e => setIsAdminApproveRequired(e.target.checked)} />
        <p className="text-sm">Requiere aprobación del administrador para unirse</p>
      </div>
    </>
  );
};
