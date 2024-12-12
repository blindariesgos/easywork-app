import React from "react";
import SlideOver from "@/src/components/SlideOver";
import AgentEditor from "../components/AgentEditor";

export default async function page() {
  return (
    <SlideOver colorTag="bg-easywork-main" labelTag="agent">
      <AgentEditor />
    </SlideOver>
  );
}
