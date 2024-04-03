import Sidebar from "@/components/Sidebar";
import UserProvider from "@/components/UserProvider";
import Header from "@/components/header/Header";
import { getUsers } from "@/lib/api";

export const metadata = {
  title: "Easywork",
  description: "All in one",
};

export const revalidate = 3600

export default async function HomeLayout({ children }) {
  const crmUsers = await getUsers();

  return (
    <UserProvider users={crmUsers}>
    <div className="h-screen overflow-auto">
      <Sidebar />
      <Header />
      <main className="lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
    </UserProvider>
  );
}
