"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import FundRecoveryDetails from "../../components/FundRecoveryDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useFundRecovery } from "@/src/lib/api/hooks/fundRecoveries";

export default function Page({ params: { id } }) {
  const { data, isLoading, isError, mutate } = useFundRecovery(id);

  if (isError) {
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="fundrecovery"
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
      labelTag="fundrecovery"
    >
      <Suspense fallback={<LoaderSpinner />}>
        <FundRecoveryDetails data={data} id={id} mutate={mutate} />
      </Suspense>
    </SlideOver>
  );
}
