import AppContextProvider from "../../../context/app/provider";
import Sidebar from "../../../components/Sidebar";
import LoggedInProvider from "../../../components/Providers/LoggedInProvider";
import SocketProvider from "../../../components/Providers/SocketProvider";
import { SessionProvider } from "next-auth/react";
import Footer from "../../../components/Footer";
import HelpChat from "../../../components/HelpChat";
import FirebaseMessaging from "@/src/components/FirebaseMessaging";
import { NotifyContextProvider } from "@/src/context/notify";
import NotifyDrawer from "@/src/components/notifier/drawer/NotifyDrawer";

export default function HomeLayout({ children }) {
  return (
    <SessionProvider>
      <AppContextProvider>
        <LoggedInProvider>
          <SocketProvider>
            <NotifyContextProvider>
              <FirebaseMessaging />
              <NotifyDrawer />

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
                <HelpChat />
              </div>
            </NotifyContextProvider>
          </SocketProvider>
        </LoggedInProvider>
      </AppContextProvider>
    </SessionProvider>
  );
}
