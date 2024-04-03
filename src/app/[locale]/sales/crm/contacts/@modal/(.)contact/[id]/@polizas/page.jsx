"use client";
import React from "react";
import PolizasTab from "../../../../components/show_contact/tab_polizas/PolizasTab";
import PolizasHeader from "../../../../components/show_contact/tab_polizas/PolizasHeader";

export default function Page() {
  return <div className="w-full px-5">
    <PolizasHeader/>
    <PolizasTab/>
  </div>;
}
