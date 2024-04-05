import UserProvider from "@/components/UserProvider";
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
      <div className="p-2 rounded-xl h-full relative">
        {children}
      </div>
    </UserProvider>
  );
}
