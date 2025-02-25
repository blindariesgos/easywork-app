'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import LoaderSpinner from '@/src/components/LoaderSpinner';

import { EvaluationAttemptsTable } from '../../components/EvaluationAttemptsTable';

import { useUserPermissions } from '../../../hooks/useUserPermissions';

import { LMS_PERMISSIONS } from '../../../constants';

export default function Tests() {
  // Hooks
  const router = useRouter();
  const { hasPermission } = useUserPermissions();

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.tests)) router.replace('/');
  }, [hasPermission, router]);

  return (
    <Suspense fallback={<LoaderSpinner />}>
      <EvaluationAttemptsTable />
    </Suspense>
  );
}
