"use client";
import SlideOver from "../../../../../../../../components/SlideOver";
import React from "react";
import EventDetails from "../../components/EventDetails";
import { useEvent } from "../../../../../../../../lib/api/hooks/calendar";
import LoaderSpinner from "../../../../../../../../components/LoaderSpinner";

export default function Page({ params: { id } }) {
  const { data, isError, isLoading } = useEvent(id);

  if (isError) {
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="user">
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) <LoaderSpinner />;

  return (
    <SlideOver colorTag="bg-easywork-main" samePage={`/tools/calendar`}>
      <EventDetails data={data} />
    </SlideOver>
  );
}
