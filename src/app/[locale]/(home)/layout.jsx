import AppContextProvider from "../../../context/app/provider";
import Sidebar from "../../../components/Sidebar";
import LoggedInProvider from "../../../components/Providers/LoggedInProvider";
import SocketProvider from "../../../components/Providers/SocketProvider";
import { SessionProvider } from "next-auth/react";
import PageBody from "../../../components/PageBody";
import HelpChat from "../../../components/chatIntranet/HelpChat";
import FirebaseMessaging from "@/src/components/FirebaseMessaging";
import { NotifyContextProvider } from "@/src/context/notify";
import NotifyDrawer from "@/src/components/notifier/drawer/NotifyDrawer";
import OtherNotifications from "../../../components/OtherNotifications";
import OtherSettings from "../../../components/OtherSettings";
import ChangePassword from "../../../components/ChangePassword";
import InviteUser from "../../../components/InviteUser";
import CrmDetailsModals from "./details/CrmDetailsModals";

export default function HomeLayout({ children }) {
  return (
    <SessionProvider>
      <LoggedInProvider>
        <AppContextProvider>
          <SocketProvider>
            <NotifyContextProvider>
              <FirebaseMessaging />
              <NotifyDrawer />
              <div className="flex h-screen">
                <Sidebar />
                <PageBody>{children}</PageBody>
                <HelpChat />
                <OtherNotifications colorTag="bg-easywork-main" />
                <ChangePassword colorTag="bg-easywork-main" />
                <InviteUser colorTag="bg-easywork-main" />
                <OtherSettings colorTag="bg-easywork-main" />
                <CrmDetailsModals />
              </div>
            </NotifyContextProvider>
          </SocketProvider>
        </AppContextProvider>
      </LoggedInProvider>
    </SessionProvider>
  );
}
