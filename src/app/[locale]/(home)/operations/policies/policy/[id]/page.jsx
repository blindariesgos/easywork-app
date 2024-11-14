"use client";
import React from "react";
import PolicyDetails from "../../components/PolicyDetailsSlider";

export default function PolicyDetailsPage({ params: { id } }) {
  return <PolicyDetails id={id} />;
}
