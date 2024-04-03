import Sidebar from "@/components/Sidebar";
import Header from "@/components/header/Header";

export const metadata = {
  title: "Easywork",
  description: "All in one",
};

export default function HomeLayout({ children }) {
  return (
      <div className="w-full">
        <div className="flex">
          <Sidebar />
          <main className="h-screen overflow-y-auto w-full p-4">
            <div className="bg-gray-100 h-full p-2 rounded-xl">
              <Header />
              <div className="">{children}</div>
            </div>
          </main>
        </div>
      </div>
  );
}
