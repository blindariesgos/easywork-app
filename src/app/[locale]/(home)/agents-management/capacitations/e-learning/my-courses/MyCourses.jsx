'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

import LoaderSpinner from '@/src/components/LoaderSpinner';

import { EvaluationAttemptsTable } from '../components/EvaluationAttemptsTable';

import { useUserPermissions } from '../../hooks/useUserPermissions';

import { LMS_PERMISSIONS } from '../../constants';

export default function MyCourses() {
  // Hooks
  const router = useRouter();
  const { hasPermission } = useUserPermissions();

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.myCourses)) router.replace('/');
  }, [hasPermission, router]);

  return (
    <Suspense fallback={<LoaderSpinner />}>
      <EvaluationAttemptsTable />
    </Suspense>
  );
}
