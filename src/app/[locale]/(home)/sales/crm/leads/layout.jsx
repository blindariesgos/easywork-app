import Header from "@/components/header/Header";

export const metadata = {
  title: "Easywork",
  description: "All in one",
};

export const revalidate = 3600

export default async function Layout({ children, params: { locale }  }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl">
      <Header />
      {children}
    </div>
  );
}