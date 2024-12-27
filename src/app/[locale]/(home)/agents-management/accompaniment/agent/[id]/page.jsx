"use client";
import React from "react";
import AgentDetails from "./AgentDetails";

export default function PageContactId({ params: { id } }) {
  return <AgentDetails id={id} />;
}
