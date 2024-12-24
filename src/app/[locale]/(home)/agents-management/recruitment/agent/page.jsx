import React from "react";
import SlideOver from "@/src/components/SlideOver";
import AgentRecruitment from "../../agent/AgentRecruitment";

export default async function page() {
  return (
    <SlideOver colorTag="bg-easywork-main" labelTag="agent">
      <AgentRecruitment />
    </SlideOver>
  );
}
