import { useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();
};
