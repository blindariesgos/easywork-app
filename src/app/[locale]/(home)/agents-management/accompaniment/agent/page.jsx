import React from "react";
import SlideOver from "@/src/components/SlideOver";
import AgentEditor from "../../agent/components/AgentEditor";

export default async function page() {
  return (
    <SlideOver
      colorTag="bg-easywork-main"
      labelTag="agent"
      maxWidthClass={"max-w-[46rem]"}
    >
      <AgentEditor />
    </SlideOver>
  );
}
