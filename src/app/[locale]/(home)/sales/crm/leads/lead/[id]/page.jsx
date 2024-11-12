"use client";
import React, { Fragment, useEffect, useState } from "react";
import LeadDetails from "./LeadDetails";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useLead } from "@/src/lib/api/hooks/leads";
import { getLeadById } from "@/src/lib/apis";

export default function PageContactId({ params: { id } }) {
  const [lead, setLead] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getLead = async () => {
    const response = await getLeadById(id);
    setLead(response);
    setIsLoading(false);
  };

  useEffect(() => {
    getLead();
  }, []);
  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      {lead && <LeadDetails leadInfo={lead} id={id} update={getLead} />}
    </Fragment>
  );
}
