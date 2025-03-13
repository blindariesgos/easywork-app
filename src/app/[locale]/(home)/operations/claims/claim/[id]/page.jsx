"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import ClaimDetails from "../../components/ClaimDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useClaim } from "@/src/lib/api/hooks/claims";

export default function Page({ params: { id } }) {
  const { data, isLoading, isError, mutate } = useClaim(id);

  if (isError) {
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="claims">
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) <LoaderSpinner />;

  return (
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="claims">
      <Suspense fallback={<LoaderSpinner />}>
        <ClaimDetails data={data} id={id} mutate={mutate} />
      </Suspense>
    </SlideOver>
  );
}
