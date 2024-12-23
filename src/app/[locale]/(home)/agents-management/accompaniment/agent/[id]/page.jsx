"use client";
import React from "react";
import AgentAccompaniment from "../../../agent/AgentAccompaniment";

export default function PageContactId({ params: { id } }) {
  return <AgentAccompaniment id={id} />;
}
