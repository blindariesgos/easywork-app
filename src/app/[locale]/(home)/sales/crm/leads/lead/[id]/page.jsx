"use client";
import React, { Fragment, useEffect, useState } from "react";
import LeadDetails from "./LeadDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useLead } from "@/src/lib/api/hooks/leads";
import { getLeadById } from "@/src/lib/apis";
import SlideOver from "@/src/components/SlideOver";

export default function PageLeadId({ params: { id } }) {
  const { lead, isLoading, isError } = useLead(id);

  if (isError) {
    <SlideOver
      openModal={true}
      colorTag="bg-easywork-main"
      labelTag="lead"
      samePage={`/sales/crm/leads?page=1`}
    >
      <div>
        <p>Error</p>
      </div>
    </SlideOver>;
  }

  if (isLoading) return <LoaderSpinner />;

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      {lead && <LeadDetails leadInfo={lead} id={id} />}
    </Fragment>
  );
}
