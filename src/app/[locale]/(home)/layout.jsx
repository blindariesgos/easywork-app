import AppContextProvider from '../../../context/app/provider';
import Sidebar from '../../../components/Sidebar';
import LoggedInProvider from '../../../components/Providers/LoggedInProvider';
import { SessionProvider } from 'next-auth/react';
import Footer from "../../../components/Footer";

export default function HomeLayout({ children }) {
  return (
    <SessionProvider>
      <AppContextProvider>
        <LoggedInProvider>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-grow overflow-auto w-full p-0.5 sm:p-0 md:p-4">
              <div className="h-full">{children}</div>
            </main>
          </div>
          <Footer />
        </LoggedInProvider>
      </AppContextProvider>
    </SessionProvider>
  );
}