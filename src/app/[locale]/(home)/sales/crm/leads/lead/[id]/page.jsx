import React from "react";
import LeadDetails from "./LeadDetails";
import { getLeadById } from "../../../../../../../../lib/apis";

async function getLeadId(id) {
	try {
		const lead = await getLeadById(id);
		return lead;
	} catch (error) {		
		throw new Error(error);
	}
}

export default async function PageContactId({ params: { id } }) {
  const data = await getLeadId(id);

  return <LeadDetails leadInfo={data} id={id}/>
}
