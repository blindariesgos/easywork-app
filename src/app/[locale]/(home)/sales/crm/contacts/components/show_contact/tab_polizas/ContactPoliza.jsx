import React from "react";
import PolizasHeader from "./PolizasHeader";
import PolizasTab from "./PolizasTab";

export default function ContactPoliza({contactID}) {
  return (
    <div className="w-full px-5">
      <PolizasHeader contactID={contactID} />
      <PolizasTab />
    </div>
  );
}
