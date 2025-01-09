"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import ScheduleDetails from "../../components/ScheduleDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useScheduling } from "@/src/lib/api/hooks/schedules";

export default function Page({ params: { id } }) {
  // const { data, isLoading, isError } = useUser(id);
  const { data, isLoading, isError, mutate } = useScheduling(id);
  console.log({ data });

  if (isError) {
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="schedules"
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
      labelTag="schedules"
    >
      <Suspense fallback={<LoaderSpinner />}>
        <ScheduleDetails data={data} id={id} mutate={mutate} />
      </Suspense>
    </SlideOver>
  );
}
