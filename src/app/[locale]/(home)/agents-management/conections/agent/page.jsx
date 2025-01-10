import React from "react";
import SlideOver from "@/src/components/SlideOver";
import AgentConection from "../../agent/AgentConection";

export default async function page() {
  return (
    <SlideOver
      colorTag="bg-easywork-main"
      labelTag="agent"
      maxWidthClass={"max-w-[46rem]"}
    >
      <AgentConection />
    </SlideOver>
  );
}
