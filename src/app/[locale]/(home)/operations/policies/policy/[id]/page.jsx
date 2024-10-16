"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import PolicyDetails from "../../components/PolicyDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { usePolicy } from "@/src/lib/api/hooks/policies";

export default function PolicyDetailsPage({ params: { id } }) {
  // const { data, isLoading, isError } = useUser(id);
  const { data, isLoading, isError, mutate } = usePolicy(id);
  console.log({ data });

  if (isError) {
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="policy">
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) <LoaderSpinner />;

  return (
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="policy">
      <Suspense fallback={<LoaderSpinner />}>
        <PolicyDetails data={data} id={id} mutate={mutate} />
      </Suspense>
    </SlideOver>
  );
}
