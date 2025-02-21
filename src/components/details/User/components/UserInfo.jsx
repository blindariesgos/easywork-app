"use client";

import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import Image from "next/image";

const { useCurrentUserInfo } = require("@/src/lib/api/hooks/users");

const UserInfo = () => {
  const { user, isLoading } = useCurrentUserInfo();

  if (isLoading) return <LoadingSpinnerSmall />;

  return (
    <div className="flex items-center">
      <Image
        className="h-12 w-12 rounded-full object-cover"
        width={200}
        height={200}
        src={user?.avatar || "/img/avatar.svg"}
        alt=""
      />
      <div className="ml-2 flex flex-col justify-center">
        <p className="text-sm">{`${user?.profile?.firstName} ${user?.profile?.lastName}`}</p>
        <p className="text-xs">{user?.bio}</p>
      </div>
    </div>
  );
};

export default UserInfo;
