import Sidebar from "@/components/Sidebar";
import Header from "@/components/header/Header";

export const metadata = {
  title: "Easywork",
  description: "All in one",
};

export default function HomeLayout({ children }) {
  return (
    <div className="h-screen overflow-auto">
      <Sidebar />
      <Header />
      <main className="lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
