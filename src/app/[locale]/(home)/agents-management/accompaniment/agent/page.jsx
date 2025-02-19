import React from "react";
import SlideOver from "@/src/components/SlideOver";
import AgentAccompaniment from "../../agent/AgentAccompaniment";

export default async function page() {
  return (
    <SlideOver
      colorTag="bg-easywork-main"
      labelTag="agent"
      maxWidthClass={"max-w-[46rem]"}
    >
      <AgentAccompaniment />
    </SlideOver>
  );
}
