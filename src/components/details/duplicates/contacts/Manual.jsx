"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ManualProccess from "./components/ManualProccess";
export default function Manual({ onclose }) {
  return (
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      maxWidthClass={"max-w-[1400px]"}
      remove
      onclose={onclose}
    >
      <Suspense fallback={<LoaderSpinner />}>
        <ManualProccess onClose={onclose} />
      </Suspense>
    </SlideOver>
  );
}
