"use client";
import React, { Fragment, useEffect, useState } from "react";
import LeadDetails from "./LeadDetails";
import { getLeadById } from "../../../../../../../../lib/apis";
import LoaderSpinner from "@/src/components/LoaderSpinner";

export default function PageContactId({ params: { id } }) {
  const [lead, setLead] = useState();

  useEffect(() => {
    const getLeadId = async (id) => {
      try {
        const lead = await getLeadById(id);
        setLead(lead);
      } catch (error) {
        throw new Error(error);
      }
    };
    if (!id || lead) return;
    getLeadId(id);
  }, []);

  return (
    <Fragment>
      {!lead && <LoaderSpinner />}
      {lead && <LeadDetails leadInfo={lead} id={id} />}
    </Fragment>
  );
}
