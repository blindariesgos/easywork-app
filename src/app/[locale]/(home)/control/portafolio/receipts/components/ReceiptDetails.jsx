"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import ReceiptEditor from "./ReceiptEditor";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { receipts } from "../../../../../../../context/receipts/mockups";
export default function ReceiptDetails({ id }) {
  // const { data, isLoading, isError } = useUser(id);
  const { data, isLoading, isError } = {
    isLoading: false,
    isError: false,
    data: receipts.items[0],
  };

  if (isError) {
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="user"
      samePage={`/settings/permissions/users?page=1`}
    >
      <div>
        <p>Error</p>
        qlq
      </div>
    </SlideOver>;
  }

  if (isLoading) <LoaderSpinner />;

  console.log("User", data);

  return (
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="user"
      samePage={`/settings/permissions/users?page=1`}
    >
      <Suspense fallback={<LoaderSpinner />}>
        <ReceiptEditor user={data} id={id} />
      </Suspense>
    </SlideOver>
  );
}
