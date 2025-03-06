import { useState } from 'react';

import { FaCopy } from 'react-icons/fa';
import { LuRefreshCcw } from 'react-icons/lu';
import { toast } from 'react-toastify';

// Services
import { generateLink } from '@/src/lib/services/users/invitations';
import { EnableFastRegistration } from './EnableFastRegistration';

export const LinkInvitation = ({}) => {
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [link, setLink] = useState('');
  const [isAdminApprovedRequired, setIsAdminApproveRequired] = useState(false);
  const [enableQuickRegistration, setEnableQuickRegistration] = useState(false);

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);

    try {
      const linkGenerated = await generateLink({ requestAdminApprove: isAdminApprovedRequired, quickRegistration: enableQuickRegistration });
      setLink(linkGenerated);
    } catch (error) {
      console.log(error);
      toast.error('Error al generar el enlace');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <>
      {link || isGeneratingLink ? (
        <div className="flex items-center gap-4">
          <p className="bg-gray-300 p-4 inline-block rounded-xl text-xs truncate">{isGeneratingLink ? 'Generando...' : link}</p>

          {!isGeneratingLink && (
            <div className="flex items-center gap-4">
              <button onClick={() => navigator.clipboard.writeText(link)}>
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
        </button>
      )}

      <div className="flex items-center justify-between flex-wrap mt-8">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-sm cursor-pointer"
            checked={isAdminApprovedRequired}
            onChange={e => {
              setLink('');
              setIsAdminApproveRequired(e.target.checked);
            }}
          />
          <p className="text-sm">Requiere aprobación del administrador para unirse</p>
        </div>
        <div>
          <EnableFastRegistration
            enabled={enableQuickRegistration}
            setEnabled={value => {
              setLink('');
              setEnableQuickRegistration(value);
            }}
          />
        </div>
      </div>
    </>
  );
};
