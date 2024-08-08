import Image from "next/image";
import useAppContext from "../../../../../../../context/app";
import { Fragment, useEffect, useState } from "react";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";

const UserInfoById = ({ id }) => {
  const { lists } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    if (!id) return;
    setUser(lists.users.find((u) => u.id === id));
    setLoading(false);
  }, [id]);

  if (!id) {
    return "N/D";
  }

  return (
    <div className="flex gap-2">
      {loading || !user ? (
        <LoadingSpinnerSmall />
      ) : (
        <Fragment>
          <Image
            className="h-[37px] w-[37px] rounded-full object-cover"
            width={37}
            height={37}
            src={user?.avatar || "/img/avatar.svg"}
            alt="avatar"
          />
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold">{user?.name}</p>
            <p className="text-[8px] text-gray-50 pl-1">{user?.bio}</p>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default UserInfoById;
