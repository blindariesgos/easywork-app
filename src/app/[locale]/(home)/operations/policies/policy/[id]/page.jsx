"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import PolicyDetails from "../../components/PolicyDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { policies } from "../../../../../../../context/policies/mockups";

export default function PolicyDetailsPage({ params: { id } }) {
  // const { data, isLoading, isError } = useUser(id);
  const { data, isLoading, isError } = {
    isLoading: false,
    isError: false,
    data: policies.items[0],
  };

  if (isError) {
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="user">
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) <LoaderSpinner />;

  return (
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="user">
      <Suspense fallback={<LoaderSpinner />}>
        <PolicyDetails data={data} id={id} />
      </Suspense>
    </SlideOver>
  );
}
