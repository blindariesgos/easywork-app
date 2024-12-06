"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import AgentEditor from "../../components/AgentEditor";
import { useAgent } from "@/src/lib/api/hooks/agents";
import LoaderSpinner from "@/src/components/LoaderSpinner";

export default function AgentDetails({ id }) {
  const { data, isLoading, isError } = useAgent(id);

  if (isError) {
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="agent">
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) return <LoaderSpinner />;

  return (
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="agent">
      <Suspense fallback={<LoaderSpinner />}>
        <AgentEditor agent={data} id={id} />
      </Suspense>
    </SlideOver>
  );
}
