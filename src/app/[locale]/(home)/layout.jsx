import AppContextProvider from "../../../context/app/provider";
import Sidebar from "../../../components/Sidebar";
import LoggedInProvider from "../../../components/Providers/LoggedInProvider";
import { SessionProvider } from "next-auth/react";
import Footer from "../../../components/Footer";

export default function HomeLayout({ children }) {
  return (
    <SessionProvider>
      <AppContextProvider>
        <LoggedInProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-grow w-full p-0.5 sm:p-0 md:p-4 overflow-y-auto">
              {/* Contenedor principal flexible */}
              <main className="flex-grow">
                {/* Contenido creciente */}
                {children}
              </main>
              <Footer /> {/* Footer fuera del main */}
            </div>
          </div>
        </LoggedInProvider>
      </AppContextProvider>
    </SessionProvider>
  );
}
