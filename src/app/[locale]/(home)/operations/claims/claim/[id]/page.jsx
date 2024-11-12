"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import ClaimDetails from "../../components/ClaimDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { usePolicy } from "@/src/lib/api/hooks/policies";

export default function Page({ params: { id } }) {
  // const { data, isLoading, isError } = useUser(id);
  const { data, isLoading, isError, mutate } = usePolicy(id);
  console.log({ data });

  if (isError) {
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="renovations"
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
      labelTag="renovations"
    >
      <Suspense fallback={<LoaderSpinner />}>
        <ClaimDetails data={data} id={id} mutate={mutate} />
      </Suspense>
    </SlideOver>
  );
}
