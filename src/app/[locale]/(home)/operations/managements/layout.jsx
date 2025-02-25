"use client";
import React, { Suspense } from "react";
import LayoutPage from "./LayoutPage";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ManagementsContextProvider from "@/src/context/managements/provider";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useTranslation } from "react-i18next";
// import Cards from "./components/Cards";

export default function Layout({ children }) {
  return (
    <ManagementsContextProvider>
      <LayoutPage>{children}</LayoutPage>
    </ManagementsContextProvider>
  );
}
