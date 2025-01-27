"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import ReceiptEditor from "./ReceiptEditor";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useReceipt } from "@/src/lib/api/hooks/receipts";
export default function ReceiptDetails({ id }) {
  const { data, isLoading, isError } = useReceipt(id);

  if (isError) {
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="payments">
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) <LoaderSpinner />;

  return (
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="payments">
      <Suspense fallback={<LoaderSpinner />}>
        <ReceiptEditor data={data} id={id} />
      </Suspense>
    </SlideOver>
  );
}
