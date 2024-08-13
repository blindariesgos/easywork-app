import SlideOver from "../../../../../../../../components/SlideOver";
import React, { Suspense } from "react";
import CreateLead from "../../components/CreateLead";

export default function LeadDetails({ leadInfo, id }) {
  return (
    <SlideOver colorTag="bg-primary" labelTag="lead">
      <Suspense
        fallback={
          <div className="flex flex-col h-screen">
            <div className="flex flex-col flex-1 bg-zinc-200 opacity-100 shadow-xl text-zinc-800 overflow-hidden rounded-tl-3xl"></div>{" "}
          </div>
        }
      >
        <CreateLead edit={leadInfo} id={id} />
      </Suspense>
    </SlideOver>
  );
}
