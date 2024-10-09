"use client";
import React, { Fragment, useEffect } from "react";
import LeadDetails from "./LeadDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useLead } from "@/src/lib/api/hooks/leads";

export default function PageContactId({ params: { id } }) {
  const { lead, isLoading, isError, mutate } = useLead(id);

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      {lead && <LeadDetails leadInfo={lead} id={id} mutate={mutate} />}
    </Fragment>
  );
}
