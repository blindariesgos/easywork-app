"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import User from "@/src/components/details/User/User";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useCurrentUserInfo, useUser } from "@/src/lib/api/hooks/users";

export default function UserDetails() {
  const { user, isLoading, mutate } = useCurrentUserInfo();

  if (isError) {
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="user"
      samePage={`/settings/permissions/users?page=1`}
    >
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) <LoaderSpinner />;

  return (
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="user"
      samePage={`/settings/permissions/users?page=1`}
    >
      <Suspense fallback={<LoaderSpinner />}>
        {user && <User user={user} id={user.id} mutate={mutate} />}
      </Suspense>
    </SlideOver>
  );
}
