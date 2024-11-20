"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import UserEditor from "../../components/create/UserEditor";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useUser } from "@/src/lib/api/hooks/users";

export default function UserDetails({ id }) {
  const { data, isLoading, isError } = useUser(id);

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

  console.log("User", data);

  return (
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="user"
      samePage={`/settings/permissions/users?page=1`}
    >
      <Suspense fallback={<LoaderSpinner />}>
        {data && <UserEditor user={data} id={id} />}
      </Suspense>
    </SlideOver>
  );
}
