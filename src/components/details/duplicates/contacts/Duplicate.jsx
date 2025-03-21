"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import Page from "./components/DuplicatePage";
export default function Duplicate({ onclose, handleOpenManual }) {
  return (
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      maxWidthClass={"max-w-[1000px]"}
      remove
      onclose={onclose}
    >
      <Suspense fallback={<LoaderSpinner />}>
        <Page onClose={onclose} handleOpenManual={handleOpenManual} />
      </Suspense>
    </SlideOver>
  );
}
