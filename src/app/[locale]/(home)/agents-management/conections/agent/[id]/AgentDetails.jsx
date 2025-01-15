"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Suspense } from "react";
import { useAgent } from "@/src/lib/api/hooks/agents";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import AgentConection from "../../../agent/AgentConection";

export default function AgentDetails({ id }) {
  const { data, isLoading, isError } = useAgent(id);

  if (isError) {
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="conexion">
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) return <LoaderSpinner />;

  return (
    <SlideOver openModal={true} colorTag="bg-easywork-main" labelTag="conexion">
      <Suspense fallback={<LoaderSpinner />}>
        <AgentConection agent={data} id={id} />
      </Suspense>
    </SlideOver>
  );
}
