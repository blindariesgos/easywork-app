'use client';

import { useEffect } from 'react';
import { CapacitationsHeader } from './components/CapacitationsHeader';
import { useUserPermissions } from './hooks/useUserPermissions';
import { useRouter } from 'next/navigation';
import { LMS_PERMISSIONS } from './constants';

export default function CapacitationsPage() {
  const router = useRouter();
  const { hasPermission } = useUserPermissions();

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.capacitations)) router.replace('/');
  }, [hasPermission, router]);

  return (
    <div>
      <CapacitationsHeader />
    </div>
  );
}
