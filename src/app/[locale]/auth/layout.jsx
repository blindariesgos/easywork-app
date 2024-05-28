"use client";
import Page from "./page.jsx";
import { DataContextProvider } from "./context";
import { SessionProvider } from "next-auth/react";

export default function LoginLayout({ children, contextData }) {
  const background = {
    backgroundImage: "url('/img/atom.png')",
    backgroundRepeat: "repeat",
    backgroundColor: "#262261",
  };
  return (
    <SessionProvider>
      <DataContextProvider>
        <div className="h-screen overflow-auto">
          <main
            style={background}
            className="min-h-screen flex items-center justify-center"
          >
            <Page contextData={contextData}>{children}</Page>
          </main>
        </div>
      </DataContextProvider>
    </SessionProvider>
  );
}
