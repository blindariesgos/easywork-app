'use client';

import { useCallback, useEffect, useState } from 'react';

// Form step components
import { InvalidLink } from '../../components/InvalidLink';
import { VerifyingLink } from '../../components/VerifyingLink';
import { OnboardingForm } from '../../components/OnboardingForm';

// Services
import { verifyLink } from '@/src/lib/services/users/invitations';
import Image from 'next/image';

function Onboarding({ token, linkId, requestEmail }) {
  const [verifyingLink, setVerifyingLink] = useState(true);
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);

  const verifyLinkStatus = useCallback(async () => {
    try {
      const { result } = await verifyLink(token, linkId);
      if (!result) throw new Error('Invalid link');
    } catch (error) {
      setIsLinkInvalid(true);
    } finally {
      setVerifyingLink(false);
    }
  }, [token, linkId]);

  useEffect(() => {
    verifyLinkStatus();
  }, [verifyLinkStatus]);

  return (
    <div className="bg-[#148bbf] min-h-screen flex flex-wrap items-center justify-center p-4 gap-10">
      <div className="max-w-[480px]">
        <Image width={256.75} height={218.84} src={'/img/logo.svg'} alt="img" className="mb-2" />

        <h1 className="text-5xl text-white font-bold mb-2">Toda tu empresa en un solo lugar</h1>
        <p className="text-gray-300 font-normal text-lg">Regístrate hoy y obtén el plan que se adapte a tus necesidades</p>
      </div>

      {verifyingLink && <VerifyingLink />}
      {isLinkInvalid && <InvalidLink />}

      {!verifyingLink && !isLinkInvalid && <OnboardingForm requestEmail={requestEmail} token={token} linkId={linkId} />}
    </div>
  );
}

export default Onboarding;
