"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import PolicyDetails from "./PolicyDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { usePolicy } from "@/src/lib/api/hooks/policies";

export default function PolicyDetailsPage({ id, remove, edit }) {
  const { data, isLoading, isError, mutate } = usePolicy(id);

  if (isError) {
    <SlideOver
      remove={remove}
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="policy"
    >
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) <LoaderSpinner />;

  return (
    <SlideOver
      remove={remove}
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="policy"
    >
      <Suspense fallback={<LoaderSpinner />}>
        <PolicyDetails data={data} id={id} mutate={mutate} edit={edit} />
      </Suspense>
    </SlideOver>
  );
}
