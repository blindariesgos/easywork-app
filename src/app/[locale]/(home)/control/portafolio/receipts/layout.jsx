"use client";
import React, { Suspense, useState } from "react";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ReceiptsContextProvider from "../../../../../../context/receipts/provider";
import ReceiptHeader from "./components/ReceiptHeader";
import Header from "@/src/components/header/Header";
import TabPages from "@/src/components/TabPages";

export default function ReceiptLayout({ children, table, kanban }) {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const tabs = [
    {
      name: "Kanban",
      component: kanban,
      // disabled: true,
    },
    {
      name: "Lista",
      component: table,
    },
  ];
  return (
    <ReceiptsContextProvider>
      <ReceiptHeader hiddeConfig={selectedIndex == 0} />
      <Suspense fallback={<LoaderSpinner />}>
        <TabPages tabs={tabs} />
        {children}
      </Suspense>
    </ReceiptsContextProvider>
  );
}
