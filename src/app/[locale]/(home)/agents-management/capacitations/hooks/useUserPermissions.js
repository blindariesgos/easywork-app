import { useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';

export const useUserPermissions = () => {
  const { data } = useSession();

  const userMenuPermissions = useMemo(() => {
    return data?.user?.menuPermissions ?? data?.user?.roles?.flatMap(role => role.menuPermissions) ?? [];
  }, [data]);

  const hasPermission = useCallback(
    permission => {
      return true;

      return userMenuPermissions.includes(permission);
    },
    [userMenuPermissions]
  );

  return { permissions: userMenuPermissions, hasPermission };
};
