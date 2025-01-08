"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import RefundDetails from "../../components/RefundDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useReimbursement } from "@/src/lib/api/hooks/refunds";

export default function Page({ params: { id } }) {
  // const { data, isLoading, isError } = useUser(id);
  const { data, isLoading, isError, mutate } = useReimbursement(id);
  console.log({ data });

  if (isError) {
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="refunds">
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) <LoaderSpinner />;

  return (
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="refunds">
      <Suspense fallback={<LoaderSpinner />}>
        <RefundDetails data={data} id={id} mutate={mutate} />
      </Suspense>
    </SlideOver>
  );
}
