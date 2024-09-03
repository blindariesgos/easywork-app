"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import PolicyDetails from "../../components/PolicyDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { usePolicy } from "@/src/lib/api/hooks/policies";

export default function PolicyDetailsPage({ params: { id } }) {
  // const { data, isLoading, isError } = useUser(id);
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaakknknknknknknk");
  const { data, isLoading, isError } = usePolicy(id);
  console.log({ data });

  if (isError) {
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="user">
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) <LoaderSpinner />;

  return (
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="user">
      <Suspense fallback={<LoaderSpinner />}>
        <PolicyDetails data={data} id={id} />
      </Suspense>
    </SlideOver>
  );
}
