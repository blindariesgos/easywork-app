'use client';

import { useRouter } from 'next/navigation';
import { CoursesGrid } from '../components/CoursesGrid';
import { useUserPermissions } from '../../hooks/useUserPermissions';
import { useEffect } from 'react';
import { LMS_PERMISSIONS } from '../../constants';

export default function CoursesView() {
  const router = useRouter();
  const { hasPermission } = useUserPermissions();

  useEffect(() => {
    if (!hasPermission(LMS_PERMISSIONS.courses) && !hasPermission(LMS_PERMISSIONS.config)) {
      router.replace('/');
    } else if (!hasPermission(LMS_PERMISSIONS.courses)) {
      router.replace('/agents-management/capacitations/e-learning/config');
    }
  }, [hasPermission, router]);

  return <CoursesGrid />;
}
