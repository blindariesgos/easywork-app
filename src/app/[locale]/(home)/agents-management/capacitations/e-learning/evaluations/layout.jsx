'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { LMS_PERMISSIONS } from '../../constants';
import { useUserPermissions } from '../../hooks/useUserPermissions';

export default function EvaluationLayout({ children }) {
  const router = useRouter();
  const { hasPermission } = useUserPermissions();

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.evaluations)) router.replace('/');
  }, [hasPermission, router]);

  return <>{children}</>;
}
