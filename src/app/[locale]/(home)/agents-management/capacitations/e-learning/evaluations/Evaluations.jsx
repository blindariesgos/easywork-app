'use client';

import { useRouter } from 'next/navigation';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useEffect } from 'react';
import { LMS_PERMISSIONS } from '../../constants';

export default function Evaluations() {
  const router = useRouter();
  const { hasPermission } = useUserPermissions();

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.evaluations)) router.replace('/');
  }, [hasPermission, router]);

  return <p>Evaluations</p>;
}
