import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import FundRecoveriesContextProvider from "@/src/context/fundrecoveries/provider";
import TabPages from "@/src/components/TabPages";

export default async function Layout({ children, table, kanban }) {
  const tabs = [
    {
      name: "Kanban",
      // component: kanban,
      disabled: true,
    },
    {
      name: "Lista",
      component: table,
    },
  ];
  return (
    <FundRecoveriesContextProvider>
      <LayoutPage>
        <Suspense fallback={<LoaderSpinner />}>
          <TabPages tabs={tabs} />
          {children}
        </Suspense>
      </LayoutPage>
    </FundRecoveriesContextProvider>
  );
}
