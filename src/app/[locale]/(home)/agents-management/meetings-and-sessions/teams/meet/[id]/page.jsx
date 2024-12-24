import React from "react";
import MeetPage from "./MeetPage";

export default function page({ params: { id } }) {
  return <MeetPage id={id} />;
}
