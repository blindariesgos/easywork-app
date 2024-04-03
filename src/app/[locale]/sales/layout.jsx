import Sidebar from "@/components/Sidebar";
import UserProvider from "@/components/UserProvider";
import Header from "@/components/header/Header";
import { getUsers } from "@/lib/api";

export const metadata = {
  title: "Easywork",
  description: "All in one",
};

export const revalidate = 3600

export default async function HomeLayout({ children, params: { locale }  }) {
  const crmUsers = await getUsers();

  return (
    <UserProvider users={crmUsers}>
      <div className="w-full h-screen">
        <div className="flex">
          <Sidebar />
          <main className="h-screen overflow-auto w-full p-4">
            <div className="bg-gray-100 h-full p-2 rounded-xl">
              <Header />
              <div className="">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
